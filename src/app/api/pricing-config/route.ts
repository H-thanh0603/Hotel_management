import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  let config = await prisma.pricingConfig.findUnique({ where: { name: "default" } });
  if (!config) {
    config = await prisma.pricingConfig.create({
      data: { name: "default", overnightStart: "23:00", overnightEnd: "11:00", gracePeriod: 15, overtimeCharge: 30 },
    });
  }
  return NextResponse.json(config);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const config = await prisma.pricingConfig.upsert({
    where: { name: "default" },
    update: {
      overnightStart: body.overnightStart,
      overnightEnd: body.overnightEnd,
      gracePeriod: body.gracePeriod,
      overtimeCharge: body.overtimeCharge,
    },
    create: {
      name: "default",
      overnightStart: body.overnightStart || "23:00",
      overnightEnd: body.overnightEnd || "11:00",
      gracePeriod: body.gracePeriod || 15,
      overtimeCharge: body.overtimeCharge || 30,
    },
  });
  return NextResponse.json(config);
}
