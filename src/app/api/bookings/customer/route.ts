import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { assertAvailable } from "@/lib/services/availability";

function generateBookingCode() {
  const prefix = "BK";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const body = await req.json();
  const checkIn = new Date(body.checkInDate);
  const checkOut = new Date(body.checkOutDate);

  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    return NextResponse.json({ error: "Ngày không hợp lệ" }, { status: 400 });
  }
  if (checkOut <= checkIn) {
    return NextResponse.json({ error: "Ngày trả phòng phải sau ngày nhận phòng" }, { status: 400 });
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (checkIn < today) {
    return NextResponse.json({ error: "Ngày nhận phòng không được trong quá khứ" }, { status: 400 });
  }

  try {
    const booking = await prisma.$transaction(async (tx) => {
      // Find or create customer by email
      let customer = await tx.customer.findUnique({ where: { email: session.user.email } });
      if (!customer) {
        customer = await tx.customer.create({
          data: { fullName: session.user.name || "Khách hàng", email: session.user.email },
        });
      }

      // Assert room availability in transaction
      await assertAvailable(tx, {
        roomTypeId: body.roomTypeId,
        checkInDate: checkIn,
        checkOutDate: checkOut,
      });

      // Snapshot room type price
      const roomType = await tx.roomType.findUnique({ where: { id: body.roomTypeId } });
      if (!roomType) throw new Error("Hạng phòng không tồn tại");

      return tx.booking.create({
        data: {
          bookingCode: generateBookingCode(),
          customerId: customer.id,
          roomTypeId: body.roomTypeId,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          numberOfGuests: body.numberOfGuests || 1,
          depositAmount: body.depositAmount || 0,
          nightlyRateSnapshot: roomType.pricePerNight,
          note: body.note,
          status: "PENDING",
        },
        include: { roomType: true },
      });
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Tạo booking thất bại" }, { status: 400 });
  }
}
