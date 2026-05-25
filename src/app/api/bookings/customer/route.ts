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
  if (!session?.user?.email) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const body = await req.json();
  const checkIn = new Date(body.checkInDate);
  const checkOut = new Date(body.checkOutDate);

  if (checkOut <= checkIn) return NextResponse.json({ error: "Ngày trả phòng phải sau ngày nhận phòng" }, { status: 400 });
  if (checkIn < new Date(new Date().toDateString())) return NextResponse.json({ error: "Ngày nhận phòng không được trong quá khứ" }, { status: 400 });

  // Find or create customer by email
  let customer = await prisma.customer.findUnique({ where: { email: session.user.email } });
  if (!customer) {
    customer = await prisma.customer.create({
      data: { fullName: session.user.name || "Khách hàng", email: session.user.email },
    });
  }

  const booking = await prisma.booking.create({
    data: {
      bookingCode: generateBookingCode(),
      customerId: customer.id,
      roomTypeId: body.roomTypeId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfGuests: body.numberOfGuests || 1,
      note: body.note,
      status: "PENDING",
    },
    include: { roomType: true },
  });

  return NextResponse.json(booking, { status: 201 });
}
