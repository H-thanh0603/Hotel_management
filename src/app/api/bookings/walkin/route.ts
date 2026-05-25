import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

function generateBookingCode() {
  const prefix = "BK";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const body = await req.json();
  const { roomId, bookingType, hours, note } = body;

  if (!roomId) return NextResponse.json({ error: "Vui lòng chọn phòng" }, { status: 400 });

  const room = await prisma.room.findUnique({ where: { id: roomId }, include: { roomType: true } });
  if (!room) return NextResponse.json({ error: "Phòng không tồn tại" }, { status: 404 });
  if (room.status !== "AVAILABLE") return NextResponse.json({ error: "Phòng không trống" }, { status: 400 });

  // Create anonymous customer for walk-in
  const customer = await prisma.customer.create({
    data: { fullName: "Khách vãng lai", note: "Walk-in" },
  });

  const now = new Date();
  let checkOut: Date;

  if (bookingType === "OVERNIGHT") {
    const config = await prisma.pricingConfig.findUnique({ where: { name: "default" } });
    const endHour = parseInt((config?.overnightEnd || "11:00").split(":")[0]);
    const endMin = parseInt((config?.overnightEnd || "11:00").split(":")[1]);
    checkOut = new Date(now);
    checkOut.setDate(checkOut.getDate() + 1);
    checkOut.setHours(endHour, endMin, 0, 0);
  } else {
    checkOut = new Date(now.getTime() + (hours || 2) * 60 * 60 * 1000);
  }

  const booking = await prisma.booking.create({
    data: {
      bookingCode: generateBookingCode(),
      customerId: customer.id,
      roomId: room.id,
      roomTypeId: room.roomTypeId,
      checkInDate: now,
      checkOutDate: checkOut,
      actualCheckIn: now,
      status: "CHECKED_IN",
      bookingType: bookingType || "HOURLY",
      hours: bookingType === "HOURLY" ? (hours || 2) : null,
      numberOfGuests: 1,
      note,
      createdById: (session.user as any).id,
    },
    include: { customer: true, room: true, roomType: true },
  });

  await prisma.room.update({ where: { id: roomId }, data: { status: "OCCUPIED" } });

  return NextResponse.json(booking, { status: 201 });
}
