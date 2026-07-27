import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";

export async function GET() {
  const guard = await requireRole(["ADMIN", "RECEPTIONIST"]);
  if (guard instanceof NextResponse) return guard;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [totalRooms, availableRooms, occupiedRooms, todayBookings, totalCustomers, revenue] =
    await Promise.all([
      prisma.room.count(),
      prisma.room.count({ where: { status: "AVAILABLE" } }),
      prisma.room.count({ where: { status: "OCCUPIED" } }),
      prisma.booking.count({ where: { createdAt: { gte: today, lt: tomorrow } } }),
      prisma.customer.count(),
      prisma.invoice.aggregate({ _sum: { paidAmount: true }, where: { paymentStatus: "PAID" } }),
    ]);

  return NextResponse.json({
    totalRooms,
    availableRooms,
    occupiedRooms,
    todayBookings,
    totalCustomers,
    totalRevenue: revenue._sum.paidAmount || 0,
  });
}
