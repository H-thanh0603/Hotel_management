import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function generateInvoiceCode() {
  const prefix = "INV";
  const timestamp = Date.now().toString(36).toUpperCase();
  return `${prefix}${timestamp}`;
}

export async function GET() {
  const invoices = await prisma.invoice.findMany({
    include: { booking: { include: { customer: true, room: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(invoices);
}

export async function POST(req: Request) {
  const body = await req.json();
  const booking = await prisma.booking.findUnique({
    where: { id: body.bookingId },
    include: { roomType: true, bookingServices: true },
  });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  const nights = Math.ceil((new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / (1000*60*60*24));
  const roomAmount = nights * booking.roomType.pricePerNight;
  const serviceAmount = booking.bookingServices.reduce((sum, s) => sum + s.totalAmount, 0);
  const surcharge = body.surchargeAmount || 0;
  const discount = body.discountAmount || 0;
  const tax = body.taxAmount || 0;
  const total = roomAmount + serviceAmount + surcharge + tax - discount - booking.depositAmount;

  const invoice = await prisma.invoice.create({
    data: {
      invoiceCode: generateInvoiceCode(),
      bookingId: booking.id,
      roomAmount, serviceAmount, surchargeAmount: surcharge,
      discountAmount: discount, taxAmount: tax,
      totalAmount: total, paidAmount: 0, paymentStatus: "UNPAID",
    },
  });
  return NextResponse.json(invoice, { status: 201 });
}
