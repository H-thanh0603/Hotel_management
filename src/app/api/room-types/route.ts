import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";
import { roomTypeCreateSchema, parseBody } from "@/lib/validators";

export async function GET() {
  const types = await prisma.roomType.findMany({
    include: { _count: { select: { rooms: true } } },
    orderBy: { pricePerNight: "asc" },
  });
  return NextResponse.json(types);
}

export async function POST(req: Request) {
  const guard = await requireRole(["ADMIN"]);
  if (guard instanceof NextResponse) return guard;

  const parsed = parseBody(roomTypeCreateSchema, await req.json());
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const body = parsed.data;
  const roomType = await prisma.roomType.create({
    data: {
      name: body.name,
      description: body.description,
      pricePerNight: body.pricePerNight,
      maxGuests: body.maxGuests || 1,
      bedCount: body.bedCount || 1,
      area: body.area,
      amenities: body.amenities ?? null,
      imageUrl: body.imageUrl,
      status: body.status || "ACTIVE",
    },
  });
  return NextResponse.json(roomType, { status: 201 });
}
