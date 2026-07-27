import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";
import { customerCreateSchema, parseBody } from "@/lib/validators";

export async function GET(req: Request) {
  const guard = await requireRole(["ADMIN", "RECEPTIONIST"]);
  if (guard instanceof NextResponse) return guard;

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const customers = await prisma.customer.findMany({
    where: search
      ? {
          OR: [
            { fullName: { contains: search } },
            { phone: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(customers);
}

export async function POST(req: Request) {
  const guard = await requireRole(["ADMIN", "RECEPTIONIST"]);
  if (guard instanceof NextResponse) return guard;

  const parsed = parseBody(customerCreateSchema, await req.json());
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const body = parsed.data;
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
