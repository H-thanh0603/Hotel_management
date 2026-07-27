import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";
import { writeAudit, getClientIp } from "@/lib/audit";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireRole(["ADMIN"]);
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const body = await req.json();
  const existing = await prisma.voucher.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Voucher không tồn tại" }, { status: 404 });

  const data: any = {};
  if (body.description !== undefined) data.description = body.description;
  if (body.discountType !== undefined) data.discountType = body.discountType;
  if (body.discountAmount !== undefined) data.discountAmount = Number(body.discountAmount);
  if (body.minOrderAmount !== undefined) data.minOrderAmount = Number(body.minOrderAmount);
  if (body.maxDiscount !== undefined) data.maxDiscount = body.maxDiscount ? Number(body.maxDiscount) : null;
  if (body.maxUses !== undefined) data.maxUses = Number(body.maxUses);
  if (body.status !== undefined) data.status = body.status;
  if (body.validUntil !== undefined) data.validUntil = new Date(body.validUntil);

  const updated = await prisma.voucher.update({ where: { id }, data });
  await writeAudit({ action: "UPDATE", entity: "Voucher", entityId: id, detail: `Sửa voucher ${existing.code}`, ip: getClientIp(req) });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireRole(["ADMIN"]);
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const existing = await prisma.voucher.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Voucher không tồn tại" }, { status: 404 });

  const updated = await prisma.voucher.update({
    where: { id },
    data: { status: "INACTIVE" },
  });

  await writeAudit({ action: "ARCHIVE", entity: "Voucher", entityId: id, detail: `Tạm ngưng voucher ${existing.code}`, ip: getClientIp(req) });
  return NextResponse.json({ success: true, voucher: updated });
}
