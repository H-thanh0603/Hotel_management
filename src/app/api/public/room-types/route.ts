import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const roomTypes = await prisma.roomType.findMany({
      where: { status: "ACTIVE" },
      orderBy: { pricePerNight: "asc" },
    });
    return NextResponse.json(roomTypes);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Lỗi tải danh sách hạng phòng" }, { status: 500 });
  }
}
