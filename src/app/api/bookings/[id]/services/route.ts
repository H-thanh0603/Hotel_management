import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const service = await prisma.service.findUnique({ where: { id: body.serviceId } });
  if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });

  const totalAmount = service.price * (body.quantity || 1);
  const bs = await prisma.bookingService.create({
    data: { bookingId: id, serviceId: body.serviceId, quantity: body.quantity || 1, priceAtTime: service.price, totalAmount },
  });
  return NextResponse.json(bs, { status: 201 });
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const services = await prisma.bookingService.findMany({ where: { bookingId: id }, include: { service: true } });
  return NextResponse.json(services);
}
