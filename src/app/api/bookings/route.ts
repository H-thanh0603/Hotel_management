import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";
import { bookingCreateSchema, parseBody } from "@/lib/validators";
import { assertAvailable } from "@/lib/services/availability";

function generateBookingCode() {
  const prefix = "BK";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

export async function GET(req: Request) {
  const guard = await requireRole(["ADMIN", "RECEPTIONIST", "HOUSEKEEPING"]);
  if (guard instanceof NextResponse) return guard;

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
  const guard = await requireRole(["ADMIN", "RECEPTIONIST"]);
  if (guard instanceof NextResponse) return guard;

  const raw = await req.json();
  const parsed = parseBody(bookingCreateSchema, raw);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const body = parsed.data;

  const checkIn = new Date(body.checkInDate);
  const checkOut = new Date(body.checkOutDate);
  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    return NextResponse.json({ error: "Ngày không hợp lệ" }, { status: 400 });
  }
  if (checkOut <= checkIn) {
    return NextResponse.json({ error: "Ngày trả phòng phải sau ngày nhận phòng" }, { status: 400 });
  }

  // Transaction: kiểm tra trùng + tạo booking trong cùng 1 DB transaction chống race condition.
  try {
    const booking = await prisma.$transaction(async (tx) => {
      await assertAvailable(tx, {
        roomTypeId: body.roomTypeId,
        roomId: body.roomId,
        checkInDate: checkIn,
        checkOutDate: checkOut,
      });

      const customer = await tx.customer.findUnique({ where: { id: body.customerId } });
      if (!customer) throw new Error("Khách hàng không tồn tại");

      const roomType = await tx.roomType.findUnique({ where: { id: body.roomTypeId } });
      if (!roomType) throw new Error("Hạng phòng không tồn tại");

      return tx.booking.create({
        data: {
          bookingCode: generateBookingCode(),
          customerId: body.customerId,
          roomId: body.roomId,
          roomTypeId: body.roomTypeId,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          numberOfGuests: body.numberOfGuests || 1,
          depositAmount: body.depositAmount || 0,
          nightlyRateSnapshot: roomType.pricePerNight,
          note: body.note,
          status: body.status || "PENDING",
          createdById: (guard.user as any).id,
        },
        include: { customer: true, room: true, roomType: true },
      });
    });
    return NextResponse.json(booking, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Tạo booking thất bại" }, { status: 400 });
  }
}
