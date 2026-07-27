import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";
import { roomCreateSchema, parseBody } from "@/lib/validators";

export async function GET() {
  const rooms = await prisma.room.findMany({
    include: { roomType: true },
    orderBy: { roomNumber: "asc" },
  });
  return NextResponse.json(rooms);
}

export async function POST(req: Request) {
  const guard = await requireRole(["ADMIN"]);
  if (guard instanceof NextResponse) return guard;

  const parsed = parseBody(roomCreateSchema, await req.json());
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const body = parsed.data;
  const room = await prisma.room.create({
    data: {
      roomNumber: body.roomNumber,
      floor: body.floor ?? 1,
      roomTypeId: body.roomTypeId,
      status: body.status || "AVAILABLE",
      note: body.note,
    },
  });
  return NextResponse.json(room, { status: 201 });
}
