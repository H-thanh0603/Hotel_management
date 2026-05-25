import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const body = await req.json();
  const { fullName, email, phone, password } = body;

  if (!fullName || !email || !password) {
    return NextResponse.json({ error: "Vui lòng điền đầy đủ thông tin" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email đã được sử dụng" }, { status: 400 });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { fullName, email, passwordHash: hash, phone, role: "CUSTOMER", status: "ACTIVE" },
  });

  // Also create a customer record linked by email
  await prisma.customer.create({
    data: { fullName, email, phone },
  });

  return NextResponse.json({ id: user.id, fullName: user.fullName, email: user.email }, { status: 201 });
}
