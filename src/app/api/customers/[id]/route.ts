import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";
import { writeAudit, getClientIp } from "@/lib/audit";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireRole(["ADMIN", "RECEPTIONIST"]);
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const body = await req.json();
  const existing = await prisma.customer.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Khách hàng không tồn tại" }, { status: 404 });

  const data: any = {};
  if (body.fullName !== undefined) data.fullName = body.fullName;
  if (body.phone !== undefined) data.phone = body.phone;
  if (body.email !== undefined) data.email = body.email;
  if (body.identityNumber !== undefined) data.identityNumber = body.identityNumber;
  if (body.nationality !== undefined) data.nationality = body.nationality;
  if (body.address !== undefined) data.address = body.address;
  if (body.note !== undefined) data.note = body.note;

  const updated = await prisma.customer.update({ where: { id }, data });
  await writeAudit({ action: "UPDATE", entity: "Customer", entityId: id, detail: `Sửa khách ${existing.fullName}`, ip: getClientIp(req) });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireRole(["ADMIN", "RECEPTIONIST"]);
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const existing = await prisma.customer.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Khách hàng không tồn tại" }, { status: 404 });

  await prisma.customer.delete({ where: { id } });
  await writeAudit({ action: "DELETE", entity: "Customer", entityId: id, detail: `Xóa khách ${existing.fullName}`, ip: getClientIp(req) });
  return NextResponse.json({ success: true });
}
