import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";

export async function GET() {
  const guard = await requireRole(["ADMIN", "RECEPTIONIST", "HOUSEKEEPING"]);
  if (guard instanceof NextResponse) return guard;

  const tasks = await prisma.housekeepingTask.findMany({
    include: { room: { include: { roomType: true } }, assignedTo: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(tasks);
}

export async function PATCH(req: Request) {
  const guard = await requireRole(["ADMIN", "RECEPTIONIST", "HOUSEKEEPING"]);
  if (guard instanceof NextResponse) return guard;

  const body = await req.json();
  if (!body.id) {
    return NextResponse.json({ error: "Thiếu id task" }, { status: 400 });
  }
  const task = await prisma.housekeepingTask.update({
    where: { id: body.id },
    data: {
      status: body.status,
      assignedToId: body.assignedToId,
      completedAt: body.status === "COMPLETED" ? new Date() : undefined,
    },
  });
  if (body.status === "COMPLETED") {
    await prisma.room.update({ where: { id: task.roomId }, data: { status: "AVAILABLE" } });
  } else if (body.status === "IN_PROGRESS") {
    await prisma.room.update({ where: { id: task.roomId }, data: { status: "CLEANING" } });
  }
  return NextResponse.json(task);
}
