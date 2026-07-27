import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";
import { writeAudit, getClientIp } from "@/lib/audit";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireRole(["ADMIN", "RECEPTIONIST"]);
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const body = await req.json();
  const { action } = body;

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return NextResponse.json({ error: "Booking không tồn tại" }, { status: 404 });

  try {
    switch (action) {
      case "confirm": {
        if (booking.status !== "PENDING") {
          return NextResponse.json({ error: "Chỉ có thể xác nhận booking ở trạng thái PENDING" }, { status: 400 });
        }
        const updated = await prisma.$transaction(async (tx) => {
          const b = await tx.booking.update({ where: { id }, data: { status: "CONFIRMED" } });
          if (booking.roomId) {
            await tx.room.update({ where: { id: booking.roomId }, data: { status: "RESERVED" } });
          }
          return b;
        });

        await writeAudit({
          action: "CONFIRM_BOOKING",
          entity: "Booking",
          entityId: id,
          detail: `Xác nhận booking ${booking.bookingCode}`,
          ip: getClientIp(req),
        });

        return NextResponse.json(updated);
      }

      case "check-in": {
        if (booking.status !== "CONFIRMED") {
          return NextResponse.json({ error: "Chỉ có thể check-in booking đã CONFIRMED" }, { status: 400 });
        }
        const roomId = body.roomId || booking.roomId;
        if (!roomId) {
          return NextResponse.json({ error: "Vui lòng chọn phòng cụ thể để check-in" }, { status: 400 });
        }

        const updated = await prisma.$transaction(async (tx) => {
          const room = await tx.room.findUnique({ where: { id: roomId } });
          if (!room) throw new Error("Phòng không tồn tại");

          if (room.roomTypeId !== booking.roomTypeId) {
            throw new Error("Phòng chọn không khớp với hạng phòng đăng ký");
          }

          if (room.status === "MAINTENANCE" || room.status === "INACTIVE") {
            throw new Error("Phòng đang bảo trì hoặc tạm ngưng hoạt động");
          }

          // Check if room is currently occupied by another booking
          const existingOccupied = await tx.booking.findFirst({
            where: {
              roomId,
              id: { not: id },
              status: "CHECKED_IN",
            },
          });
          if (existingOccupied) {
            throw new Error(`Phòng ${room.roomNumber} hiện đang có khách lưu trú`);
          }

          const b = await tx.booking.update({
            where: { id },
            data: { status: "CHECKED_IN", roomId, actualCheckIn: new Date() },
          });
          await tx.room.update({ where: { id: roomId }, data: { status: "OCCUPIED" } });
          return b;
        });

        await writeAudit({
          action: "CHECK_IN",
          entity: "Booking",
          entityId: id,
          detail: `Check-in booking ${booking.bookingCode}`,
          ip: getClientIp(req),
        });

        return NextResponse.json(updated);
      }

      case "check-out": {
        if (booking.status !== "CHECKED_IN") {
          return NextResponse.json({ error: "Chỉ có thể check-out booking đang CHECKED_IN" }, { status: 400 });
        }
        const now = new Date();
        const expectedCheckOut = new Date(booking.checkOutDate);

        // Calculate overtime
        let overtimeMinutes = 0;
        let overtimeCharge = 0;
        if (now > expectedCheckOut) {
          overtimeMinutes = Math.ceil((now.getTime() - expectedCheckOut.getTime()) / (1000 * 60));
          const config = await prisma.pricingConfig.findUnique({ where: { name: "default" } });
          const gracePeriod = config?.gracePeriod || 15;
          if (overtimeMinutes > gracePeriod) {
            const roomType = await prisma.roomType.findUnique({ where: { id: booking.roomTypeId } });
            const pricePerHour = roomType?.pricePerHour || 0;
            const chargeableMinutes = overtimeMinutes - gracePeriod;
            const chargeableHours = Math.ceil(chargeableMinutes / 60);
            overtimeCharge = chargeableHours * pricePerHour;
          }
        }

        const result = await prisma.$transaction(async (tx) => {
          const b = await tx.booking.update({
            where: { id },
            data: {
              status: "CHECKED_OUT",
              actualCheckOut: now,
              note: overtimeCharge > 0
                ? `${booking.note || ""} | Phụ thu quá giờ: ${overtimeCharge.toLocaleString("vi-VN")}đ (${overtimeMinutes} phút)`.trim()
                : booking.note,
            },
          });

          if (booking.roomId) {
            // Update room to DIRTY and automatically create a housekeeping task
            await tx.room.update({ where: { id: booking.roomId }, data: { status: "DIRTY" } });
            await tx.housekeepingTask.create({
              data: {
                roomId: booking.roomId,
                status: "PENDING",
                note: `Tự động tạo từ Check-out booking ${booking.bookingCode}`,
              },
            });
          }

          return b;
        });

        await writeAudit({
          action: "CHECK_OUT",
          entity: "Booking",
          entityId: id,
          detail: `Check-out booking ${booking.bookingCode}`,
          ip: getClientIp(req),
        });

        return NextResponse.json({ ...result, overtimeMinutes, overtimeCharge });
      }

      case "cancel": {
        if (["CHECKED_IN", "CHECKED_OUT"].includes(booking.status)) {
          return NextResponse.json({ error: "Không thể hủy booking đã check-in hoặc đã trả phòng" }, { status: 400 });
        }

        const updated = await prisma.$transaction(async (tx) => {
          const b = await tx.booking.update({ where: { id }, data: { status: "CANCELLED" } });
          if (booking.roomId) {
            await tx.room.update({ where: { id: booking.roomId }, data: { status: "AVAILABLE" } });
          }
          return b;
        });

        await writeAudit({
          action: "CANCEL_BOOKING",
          entity: "Booking",
          entityId: id,
          detail: `Nhân viên hủy booking ${booking.bookingCode}`,
          ip: getClientIp(req),
        });

        return NextResponse.json(updated);
      }

      default:
        return NextResponse.json({ error: "Hành động (action) không hợp lệ" }, { status: 400 });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Xử lý booking thất bại" }, { status: 400 });
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireRole(["ADMIN", "RECEPTIONIST", "HOUSEKEEPING"]);
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      customer: true,
      room: true,
      roomType: true,
      bookingServices: { include: { service: true } },
      invoices: true,
    },
  });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(booking);
}
