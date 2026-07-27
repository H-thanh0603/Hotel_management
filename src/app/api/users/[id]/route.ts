import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { requireRole } from "@/lib/auth-helpers";
import { writeAudit, getClientIp } from "@/lib/audit";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireRole(["ADMIN"]);
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const body = await req.json();
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "User không tồn tại" }, { status: 404 });

  const data: any = {};
  if (body.fullName !== undefined) data.fullName = body.fullName;
  if (body.phone !== undefined) data.phone = body.phone;
  if (body.status !== undefined) data.status = body.status;
  if (body.password) data.passwordHash = await bcrypt.hash(body.password, 10);
  if (body.role && ["ADMIN", "RECEPTIONIST", "HOUSEKEEPING", "CUSTOMER"].includes(body.role)) {
    if (existing.id === (guard.user as any).id && body.role !== "ADMIN") {
      return NextResponse.json({ error: "Không thể tự đổi role của mình" }, { status: 400 });
    }
    data.role = body.role;
  }

  const updated = await prisma.user.update({ where: { id }, data });
  await writeAudit({
    action: "UPDATE",
    entity: "User",
    entityId: id,
    detail: `Cập nhật user ${existing.email}`,
    ip: getClientIp(req),
  });
  return NextResponse.json({
    id: updated.id,
    fullName: updated.fullName,
    email: updated.email,
    role: updated.role,
    status: updated.status,
  });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireRole(["ADMIN"]);
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  if (id === (guard.user as any).id) {
    return NextResponse.json({ error: "Không thể xóa chính mình" }, { status: 400 });
  }
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "User không tồn tại" }, { status: 404 });

  // Soft delete / archive
  const updated = await prisma.user.update({
    where: { id },
    data: { status: "INACTIVE" },
  });
  await writeAudit({
    action: "ARCHIVE",
    entity: "User",
    entityId: id,
    detail: `Vô hiệu hóa user ${existing.email}`,
    ip: getClientIp(req),
  });
  return NextResponse.json({ success: true, message: "Tài khoản đã được vô hiệu hóa", user: updated });
}
