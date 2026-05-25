import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const users = await prisma.user.findMany({
    select: { id: true, fullName: true, email: true, phone: true, role: true, status: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const body = await req.json();
  const hash = await bcrypt.hash(body.password || "123456", 10);
  const user = await prisma.user.create({
    data: { fullName: body.fullName, email: body.email, passwordHash: hash, phone: body.phone, role: body.role, status: "ACTIVE" },
  });
  return NextResponse.json({ id: user.id, fullName: user.fullName, email: user.email, role: user.role }, { status: 201 });
}
