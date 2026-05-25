import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const customers = await prisma.customer.findMany({
    where: search ? {
      OR: [
        { fullName: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
      ],
    } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(customers);
}

export async function POST(req: Request) {
  const body = await req.json();
  const customer = await prisma.customer.create({
    data: {
      fullName: body.fullName,
      phone: body.phone,
      email: body.email,
      identityNumber: body.identityNumber,
      nationality: body.nationality,
      address: body.address,
      note: body.note,
    },
  });
  return NextResponse.json(customer, { status: 201 });
}
