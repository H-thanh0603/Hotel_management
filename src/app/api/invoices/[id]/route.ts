import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

  await prisma.payment.create({
    data: { invoiceId: id, amount: body.amount, method: body.method || "CASH", note: body.note },
  });

  const newPaid = invoice.paidAmount + body.amount;
  const status = newPaid >= invoice.totalAmount ? "PAID" : "PARTIAL";
  const updated = await prisma.invoice.update({ where: { id }, data: { paidAmount: newPaid, paymentStatus: status } });
  return NextResponse.json(updated);
}
