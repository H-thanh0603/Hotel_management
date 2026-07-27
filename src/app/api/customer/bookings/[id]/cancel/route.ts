import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { writeAudit, getClientIp } from "@/lib/audit";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Vui lòng đăng nhập để thực hiện" } },
      { status: 401 }
    );
  }

  const { id } = await params;
  let body: any = {};
  try {
    body = await req.json().catch(() => ({}));
  } catch {
    body = {};
  }

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { customer: true },
  });

  if (!booking) {
    return NextResponse.json(
      { error: { code: "BOOKING_NOT_FOUND", message: "Không tìm thấy thông tin đặt phòng" } },
      { status: 404 }
    );
  }

  // Check ownership: current logged-in user email must match booking.customer.email (or user is ADMIN)
  const isOwner = booking.customer?.email === session.user.email;
  const isAdmin = (session.user as any).role === "ADMIN";

  if (!isOwner && !isAdmin) {
    return NextResponse.json(
      { error: { code: "FORBIDDEN", message: "Bạn không có quyền hủy đặt phòng của người khác" } },
      { status: 403 }
    );
  }

  // Check cancellable state
  if (booking.status === "CHECKED_IN" || booking.status === "CHECKED_OUT") {
    return NextResponse.json(
      { error: { code: "STATE_NOT_CANCELLABLE", message: "Đơn đặt phòng đang lưu trú hoặc đã hoàn thành, không thể hủy." } },
      { status: 409 }
    );
  }

  if (booking.status === "CANCELLED") {
    return NextResponse.json(
      { error: { code: "ALREADY_CANCELLED", message: "Đơn đặt phòng này đã được hủy trước đó." } },
      { status: 409 }
    );
  }

  // Policy check: checkInDate has not passed (e.g. checkIn is in the past)
  const checkInDate = new Date(booking.checkInDate);
  const now = new Date();
  if (checkInDate < now && booking.status !== "PENDING") {
    return NextResponse.json(
      { error: { code: "POLICY_VIOLATION", message: "Đã qua thời gian cho phép hủy phòng theo quy định." } },
      { status: 422 }
    );
  }

  try {
    const updatedBooking = await prisma.$transaction(async (tx) => {
      // Release room if assigned
      if (booking.roomId) {
        await tx.room.update({
          where: { id: booking.roomId },
          data: { status: "AVAILABLE" },
        });
      }

      // Update booking status
      const updated = await tx.booking.update({
        where: { id },
        data: {
          status: "CANCELLED",
          note: body.cancellationReason
            ? `${booking.note || ""} | Lý do hủy: ${body.cancellationReason}`.trim()
            : booking.note,
        },
      });

      return updated;
    });

    await writeAudit({
      action: "CANCEL_BOOKING",
      entity: "Booking",
      entityId: id,
      detail: `Khách hàng ${session.user.email} hủy booking ${booking.bookingCode}`,
      ip: getClientIp(req),
    });

    return NextResponse.json({
      success: true,
      message: "Hủy đặt phòng thành công",
      booking: updatedBooking,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: { code: "TRANSACTION_FAILED", message: e.message || "Lỗi hệ thống khi hủy booking" } },
      { status: 500 }
    );
  }
}
