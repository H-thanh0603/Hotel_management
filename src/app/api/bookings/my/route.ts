import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const customer = await prisma.customer.findUnique({ where: { email: session.user.email } });
  if (!customer) return NextResponse.json([]);

  const bookings = await prisma.booking.findMany({
    where: { customerId: customer.id },
    include: { room: true, roomType: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(bookings);
}
