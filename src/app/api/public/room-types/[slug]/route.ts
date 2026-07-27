import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const roomType = await prisma.roomType.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
        status: "ACTIVE",
      },
    });

    if (!roomType) {
      return NextResponse.json({ error: "Hạng phòng không tồn tại" }, { status: 404 });
    }

    return NextResponse.json(roomType);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Lỗi tải thông tin hạng phòng" }, { status: 500 });
  }
}
