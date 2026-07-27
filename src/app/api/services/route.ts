import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";
import { serviceCreateSchema, parseBody } from "@/lib/validators";

export async function GET() {
  const guard = await requireRole(["ADMIN", "RECEPTIONIST", "HOUSEKEEPING"]);
  if (guard instanceof NextResponse) return guard;

  const services = await prisma.service.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(services);
}

export async function POST(req: Request) {
  const guard = await requireRole(["ADMIN"]);
  if (guard instanceof NextResponse) return guard;

  const parsed = parseBody(serviceCreateSchema, await req.json());
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const body = parsed.data;
  const service = await prisma.service.create({
    data: {
      name: body.name,
      price: body.price,
      unit: body.unit ?? "",
      description: body.description,
      status: body.status || "ACTIVE",
    },
  });
  return NextResponse.json(service, { status: 201 });
}
