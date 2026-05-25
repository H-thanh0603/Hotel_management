import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function generateBookingCode() {
  const prefix = "BK";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const bookings = await prisma.booking.findMany({
    where: status ? { status } : undefined,
    include: { customer: true, room: true, roomType: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(bookings);
}

export async function POST(req: Request) {
  const body = await req.json();
  const checkIn = new Date(body.checkInDate);
  const checkOut = new Date(body.checkOutDate);

  if (checkOut <= checkIn) {
    return NextResponse.json({ error: "Ngay tra phong phai sau ngay nhan phong" }, { status: 400 });
  }

  // Check room availability if roomId provided
  if (body.roomId) {
    const conflict = await prisma.booking.findFirst({
      where: {
        roomId: body.roomId,
        status: { in: ["CONFIRMED", "CHECKED_IN"] },
        checkInDate: { lt: checkOut },
        checkOutDate: { gt: checkIn },
      },
    });
    if (conflict) {
      return NextResponse.json({ error: "Phong da duoc dat trong khoang thoi gian nay" }, { status: 400 });
    }
  }

  const booking = await prisma.booking.create({
    data: {
      bookingCode: generateBookingCode(),
      customerId: body.customerId,
      roomId: body.roomId,
      roomTypeId: body.roomTypeId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfGuests: body.numberOfGuests || 1,
      depositAmount: body.depositAmount || 0,
      note: body.note,
      status: body.status || "PENDING",
      createdById: body.createdById,
    },
    include: { customer: true, room: true, roomType: true },
  });
  return NextResponse.json(booking, { status: 201 });
}
