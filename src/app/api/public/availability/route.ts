import { NextResponse } from "next/server";
import { searchAvailability } from "@/lib/services/availability";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { checkInDate, checkOutDate, roomTypeId, adults, children } = body;

    if (!checkInDate || !checkOutDate) {
      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: "Vui lòng chọn ngày nhận phòng và trả phòng" } },
        { status: 400 }
      );
    }

    const results = await searchAvailability({
      checkInDate,
      checkOutDate,
      roomTypeId,
      adults: adults ? Number(adults) : undefined,
      children: children ? Number(children) : undefined,
    });

    return NextResponse.json({
      checkInDate,
      checkOutDate,
      availableRoomTypes: results,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: { code: "AVAILABILITY_SEARCH_FAILED", message: e.message || "Lỗi tra cứu phòng trống" } },
      { status: 400 }
    );
  }
}
