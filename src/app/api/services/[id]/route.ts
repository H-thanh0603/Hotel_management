import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";
import { writeAudit, getClientIp } from "@/lib/audit";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireRole(["ADMIN"]);
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const body = await req.json();
  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Dịch vụ không tồn tại" }, { status: 404 });

  const data: any = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.price !== undefined) data.price = body.price;
  if (body.unit !== undefined) data.unit = body.unit;
  if (body.description !== undefined) data.description = body.description;
  if (body.status !== undefined) data.status = body.status;

  const updated = await prisma.service.update({ where: { id }, data });
  await writeAudit({ action: "UPDATE", entity: "Service", entityId: id, detail: `Sửa dịch vụ ${existing.name}`, ip: getClientIp(req) });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireRole(["ADMIN"]);
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Dịch vụ không tồn tại" }, { status: 404 });

  // Soft delete / archive
  const updated = await prisma.service.update({
    where: { id },
    data: { status: "INACTIVE" },
  });
  await writeAudit({ action: "ARCHIVE", entity: "Service", entityId: id, detail: `Lưu trữ dịch vụ ${existing.name}`, ip: getClientIp(req) });
  return NextResponse.json({ success: true, message: "Dịch vụ đã được vô hiệu hóa", service: updated });
}
