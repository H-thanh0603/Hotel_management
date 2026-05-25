import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const rooms = await prisma.room.findMany({
    include: { roomType: true },
    orderBy: { roomNumber: "asc" },
  });
  return NextResponse.json(rooms);
}

export async function POST(req: Request) {
  const body = await req.json();
  const room = await prisma.room.create({
    data: {
      roomNumber: body.roomNumber,
      floor: body.floor,
      roomTypeId: body.roomTypeId,
      status: body.status || "AVAILABLE",
      note: body.note,
    },
  });
  return NextResponse.json(room, { status: 201 });
}
