import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";
import { writeAudit, getClientIp } from "@/lib/audit";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireRole(["ADMIN"]);
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const body = await req.json();
  const existing = await prisma.roomType.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Loại phòng không tồn tại" }, { status: 404 });

  const data: any = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.description !== undefined) data.description = body.description;
  if (body.pricePerNight !== undefined) data.pricePerNight = body.pricePerNight;
  if (body.pricePerHour !== undefined) data.pricePerHour = body.pricePerHour;
  if (body.overnightPrice !== undefined) data.overnightPrice = body.overnightPrice;
  if (body.maxGuests !== undefined) data.maxGuests = body.maxGuests;
  if (body.bedCount !== undefined) data.bedCount = body.bedCount;
  if (body.area !== undefined) data.area = body.area;
  if (body.amenities !== undefined) data.amenities = body.amenities;
  if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl;
  if (body.status !== undefined) data.status = body.status;

  const updated = await prisma.roomType.update({ where: { id }, data });
  await writeAudit({ action: "UPDATE", entity: "RoomType", entityId: id, detail: `Sửa loại phòng ${existing.name}`, ip: getClientIp(req) });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireRole(["ADMIN"]);
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const existing = await prisma.roomType.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Loại phòng không tồn tại" }, { status: 404 });

  const roomCount = await prisma.room.count({ where: { roomTypeId: id } });
  if (roomCount > 0) {
    return NextResponse.json({ error: "Loại phòng đang có phòng, không thể xóa" }, { status: 400 });
  }

  await prisma.roomType.delete({ where: { id } });
  await writeAudit({ action: "DELETE", entity: "RoomType", entityId: id, detail: `Xóa loại phòng ${existing.name}`, ip: getClientIp(req) });
  return NextResponse.json({ success: true });
}
