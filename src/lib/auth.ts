import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./prisma";
import { rateLimit } from "./audit";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const ip = req?.headers?.get?.("x-forwarded-for")?.split(",")[0]?.trim()
          || req?.headers?.get?.("x-real-ip")
          || "unknown";
        const rl = rateLimit(`login:${ip}`, 10, 60_000);
        if (!rl.ok) return null;

        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        
        if (!user || user.status !== "ACTIVE") {
          await prisma.auditLog.create({
            data: { action: "LOGIN_FAILED", entity: "User", detail: credentials.email, ip, userRole: null },
          }).catch(() => {});
          return null;
        }
        
        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) {
          await prisma.auditLog.create({
            data: { action: "LOGIN_FAILED", entity: "User", detail: credentials.email, ip, userRole: null },
          }).catch(() => {});
          return null;
        }

        await prisma.auditLog.create({
          data: { action: "LOGIN", entity: "User", entityId: user.id, detail: user.email, ip, userRole: user.role },
        }).catch(() => {});
        
        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
