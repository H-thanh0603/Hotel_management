import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const tasks = await prisma.housekeepingTask.findMany({
    include: { room: { include: { roomType: true } }, assignedTo: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(tasks);
}

export async function PATCH(req: Request) {
  const body = await req.json();
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
