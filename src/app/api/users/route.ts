import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { requireRole } from "@/lib/auth-helpers";
import { userCreateSchema, parseBody } from "@/lib/validators";
import { writeAudit, getClientIp } from "@/lib/audit";

export async function GET() {
  const guard = await requireRole(["ADMIN", "RECEPTIONIST"]);
  if (guard instanceof NextResponse) return guard;

  const users = await prisma.user.findMany({
    select: { id: true, fullName: true, email: true, phone: true, role: true, status: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const guard = await requireRole(["ADMIN"]);
  if (guard instanceof NextResponse) return guard;

  const parsed = parseBody(userCreateSchema, await req.json());
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const body = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email: body.email } });
  if (existing) {
    return NextResponse.json({ error: "Email đã được sử dụng" }, { status: 400 });
  }

  // Chỉ ADMIN mới được gán role; mặc định CUSTOMER.
  const role = body.role && ["ADMIN", "RECEPTIONIST", "HOUSEKEEPING", "CUSTOMER"].includes(body.role)
    ? body.role
    : "CUSTOMER";
  const hash = await bcrypt.hash(body.password, 10);
  const user = await prisma.user.create({
    data: {
      fullName: body.fullName,
      email: body.email,
      passwordHash: hash,
      phone: body.phone,
      role,
      status: "ACTIVE",
    },
  });
  await writeAudit({
    action: "CREATE",
    entity: "User",
    entityId: user.id,
    detail: `Tạo user ${user.email} role ${role}`,
    ip: getClientIp(req),
  });
  return NextResponse.json(
    { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
    { status: 201 }
  );
}
