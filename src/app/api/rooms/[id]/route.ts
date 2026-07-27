import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";
import { writeAudit, getClientIp } from "@/lib/audit";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireRole(["ADMIN"]);
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const body = await req.json();
  const existing = await prisma.room.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Phòng không tồn tại" }, { status: 404 });

  const data: any = {};
  if (body.roomNumber !== undefined) data.roomNumber = body.roomNumber;
  if (body.floor !== undefined) data.floor = body.floor;
  if (body.roomTypeId !== undefined) data.roomTypeId = body.roomTypeId;
  if (body.status !== undefined) data.status = body.status;
  if (body.note !== undefined) data.note = body.note;

  const updated = await prisma.room.update({ where: { id }, data });
  await writeAudit({ action: "UPDATE", entity: "Room", entityId: id, detail: `Sửa phòng ${existing.roomNumber}`, ip: getClientIp(req) });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireRole(["ADMIN"]);
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const existing = await prisma.room.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Phòng không tồn tại" }, { status: 404 });

  // Soft delete / archive to preserve history
  const updated = await prisma.room.update({
    where: { id },
    data: { status: "INACTIVE" },
  });
  await writeAudit({ action: "ARCHIVE", entity: "Room", entityId: id, detail: `Lưu trữ/vô hiệu hóa phòng ${existing.roomNumber}`, ip: getClientIp(req) });
  return NextResponse.json({ success: true, message: "Phòng đã được lưu trữ (vô hiệu hóa)", room: updated });
}
