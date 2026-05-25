import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const services = await prisma.service.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(services);
}

export async function POST(req: Request) {
  const body = await req.json();
  const service = await prisma.service.create({
    data: { name: body.name, price: body.price, unit: body.unit, description: body.description, status: body.status || "ACTIVE" },
  });
  return NextResponse.json(service, { status: 201 });
}
