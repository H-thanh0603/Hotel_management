import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/api/auth",
  "/_next",
  "/favicon.ico",
  "/phong",
  "/uu-dai",
  "/dich-vu",
  "/gioi-thieu",
  "/lien-he",
  "/chinh-sach",
];

const PUBLIC_API_PREFIXES = ["/api/auth", "/api/public"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow static assets and root public pages
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // Allow public APIs
  if (PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Fetch token from NextAuth
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = !!token;
  const role = token?.role as string | undefined;

  // Handling API routes
  if (pathname.startsWith("/api/")) {
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    // Customer API protection
    if (pathname.startsWith("/api/customer/")) {
      if (role !== "CUSTOMER" && role !== "ADMIN") {
        return NextResponse.json({ error: "Không có quyền truy cập API khách hàng" }, { status: 403 });
      }
    }

    // Admin/Staff API protection
    if (pathname.startsWith("/api/admin/") || pathname.startsWith("/api/dashboard/")) {
      if (!role || !["ADMIN", "RECEPTIONIST", "HOUSEKEEPING"].includes(role)) {
        return NextResponse.json({ error: "Không có quyền truy cập API quản trị" }, { status: 403 });
      }
    }

    return NextResponse.next();
  }

  // Handling Page UI routes
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    if (role === "CUSTOMER") {
      const url = req.nextUrl.clone();
      url.pathname = "/tai-khoan";
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/tai-khoan")) {
    if (!isAuthenticated) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
