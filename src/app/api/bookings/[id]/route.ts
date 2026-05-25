import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { action } = body;

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return NextResponse.json({ error: "Booking khong ton tai" }, { status: 404 });

  switch (action) {
    case "confirm": {
      if (booking.status !== "PENDING") return NextResponse.json({ error: "Chi xac nhan booking Pending" }, { status: 400 });
      const updated = await prisma.booking.update({ where: { id }, data: { status: "CONFIRMED" } });
      if (booking.roomId) await prisma.room.update({ where: { id: booking.roomId }, data: { status: "RESERVED" } });
      return NextResponse.json(updated);
    }
    case "check-in": {
      if (booking.status !== "CONFIRMED") return NextResponse.json({ error: "Chi check-in booking da Confirmed" }, { status: 400 });
      const roomId = body.roomId || booking.roomId;
      if (!roomId) return NextResponse.json({ error: "Can chon phong" }, { status: 400 });
      const updated = await prisma.booking.update({ where: { id }, data: { status: "CHECKED_IN", roomId, actualCheckIn: new Date() } });
      await prisma.room.update({ where: { id: roomId }, data: { status: "OCCUPIED" } });
      return NextResponse.json(updated);
    }
    case "check-out": {
      if (booking.status !== "CHECKED_IN") return NextResponse.json({ error: "Chỉ check-out booking đang CheckedIn" }, { status: 400 });
      const now = new Date();
      const expectedCheckOut = new Date(booking.checkOutDate);
      
      // Calculate overtime
      let overtimeMinutes = 0;
      let overtimeCharge = 0;
      if (now > expectedCheckOut) {
        overtimeMinutes = Math.ceil((now.getTime() - expectedCheckOut.getTime()) / (1000 * 60));
        const config = await prisma.pricingConfig.findUnique({ where: { name: "default" } });
        const gracePeriod = config?.gracePeriod || 15;
        const chargeAfter = config?.overtimeCharge || 30;
        if (overtimeMinutes > gracePeriod) {
          const roomType = await prisma.roomType.findUnique({ where: { id: booking.roomTypeId } });
          const pricePerHour = roomType?.pricePerHour || 0;
          const chargeableMinutes = overtimeMinutes - gracePeriod;
          const chargeableHours = Math.ceil(chargeableMinutes / 60);
          overtimeCharge = chargeableHours * pricePerHour;
        }
      }

      const updated = await prisma.booking.update({
        where: { id },
        data: { status: "CHECKED_OUT", actualCheckOut: now, note: overtimeCharge > 0 ? `${booking.note || ""} | Phụ thu quá giờ: ${overtimeCharge.toLocaleString()}đ (${overtimeMinutes} phút)`.trim() : booking.note },
      });
      if (booking.roomId) {
        await prisma.room.update({ where: { id: booking.roomId }, data: { status: "CLEANING" } });
        await prisma.housekeepingTask.create({ data: { roomId: booking.roomId, status: "PENDING" } });
      }
      return NextResponse.json({ ...updated, overtimeMinutes, overtimeCharge });
    }
    case "cancel": {
      if (["CHECKED_IN", "CHECKED_OUT"].includes(booking.status)) return NextResponse.json({ error: "Khong the huy booking nay" }, { status: 400 });
      const updated = await prisma.booking.update({ where: { id }, data: { status: "CANCELLED" } });
      if (booking.roomId) await prisma.room.update({ where: { id: booking.roomId }, data: { status: "AVAILABLE" } });
      return NextResponse.json(updated);
    }
    default:
      return NextResponse.json({ error: "Action khong hop le" }, { status: 400 });
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { customer: true, room: true, roomType: true, bookingServices: { include: { service: true } }, invoices: true },
  });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(booking);
}
