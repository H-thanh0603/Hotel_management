import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { status: "ACTIVE" },
      orderBy: { price: "asc" },
    });
    return NextResponse.json(services);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Lỗi tải dịch vụ" }, { status: 500 });
  }
}
