import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const types = await prisma.roomType.findMany({
    include: { _count: { select: { rooms: true } } },
    orderBy: { pricePerNight: "asc" },
  });
  return NextResponse.json(types);
}

export async function POST(req: Request) {
  const body = await req.json();
  const roomType = await prisma.roomType.create({
    data: {
      name: body.name,
      description: body.description,
      pricePerNight: body.pricePerNight,
      maxGuests: body.maxGuests,
      bedCount: body.bedCount,
      area: body.area,
      amenities: body.amenities,
      imageUrl: body.imageUrl,
      status: body.status || "ACTIVE",
    },
  });
  return NextResponse.json(roomType, { status: 201 });
}
