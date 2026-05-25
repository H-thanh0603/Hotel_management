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
  const { customerName, customerPhone, customerEmail, customerIdentity,
    roomTypeId, roomId, checkInDate, checkOutDate, numberOfGuests, note, depositAmount } = body;

  if (!customerName || !roomTypeId || !checkInDate || !checkOutDate) {
    return NextResponse.json({ error: "Vui lòng điền đầy đủ thông tin bắt buộc" }, { status: 400 });
  }

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  if (checkOut <= checkIn) return NextResponse.json({ error: "Ngày trả phòng phải sau ngày nhận phòng" }, { status: 400 });

  // Find existing customer by phone or create new
  let customer = null;
  if (customerPhone) {
    customer = await prisma.customer.findFirst({ where: { phone: customerPhone } });
  }
  if (!customer && customerEmail) {
    customer = await prisma.customer.findUnique({ where: { email: customerEmail } });
  }
  if (!customer) {
    customer = await prisma.customer.create({
      data: { fullName: customerName, phone: customerPhone, email: customerEmail || null, identityNumber: customerIdentity },
    });
  }

  // Check room availability
  if (roomId) {
    const conflict = await prisma.booking.findFirst({
      where: { roomId, status: { in: ["CONFIRMED", "CHECKED_IN"] }, checkInDate: { lt: checkOut }, checkOutDate: { gt: checkIn } },
    });
    if (conflict) return NextResponse.json({ error: "Phòng đã được đặt trong khoảng thời gian này" }, { status: 400 });
  }

  const booking = await prisma.booking.create({
    data: {
      bookingCode: generateBookingCode(),
      customerId: customer.id,
      roomTypeId, roomId: roomId || null,
      checkInDate: checkIn, checkOutDate: checkOut,
      numberOfGuests: numberOfGuests || 1,
      depositAmount: depositAmount || 0,
      note, status: "CONFIRMED",
      createdById: (session.user as any).id,
    },
    include: { customer: true, room: true, roomType: true },
  });

  // Update room status if assigned
  if (roomId) {
    await prisma.room.update({ where: { id: roomId }, data: { status: "RESERVED" } });
  }

  return NextResponse.json(booking, { status: 201 });
}
