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
  const { customerName, customerPhone, customerIdentity, roomId, hours, note } = body;

  if (!customerName || !roomId || !hours) {
    return NextResponse.json({ error: "Vui lòng điền đầy đủ thông tin" }, { status: 400 });
  }

  // Find or create customer
  let customer = null;
  if (customerPhone) {
    customer = await prisma.customer.findFirst({ where: { phone: customerPhone } });
  }
  if (!customer) {
    customer = await prisma.customer.create({
      data: { fullName: customerName, phone: customerPhone || null, identityNumber: customerIdentity || null },
    });
  }

  // Get room and verify available
  const room = await prisma.room.findUnique({ where: { id: roomId }, include: { roomType: true } });
  if (!room) return NextResponse.json({ error: "Phòng không tồn tại" }, { status: 404 });
  if (room.status !== "AVAILABLE") return NextResponse.json({ error: "Phòng không trống" }, { status: 400 });

  const now = new Date();
  const checkOut = new Date(now.getTime() + hours * 60 * 60 * 1000);

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
      bookingType: "HOURLY",
      hours: hours,
      numberOfGuests: 1,
      note,
      createdById: (session.user as any).id,
    },
    include: { customer: true, room: true, roomType: true },
  });

  // Update room to OCCUPIED
  await prisma.room.update({ where: { id: roomId }, data: { status: "OCCUPIED" } });

  return NextResponse.json(booking, { status: 201 });
}
