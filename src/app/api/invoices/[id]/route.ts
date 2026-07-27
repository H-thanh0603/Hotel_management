import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";
import { paymentSchema, parseBody } from "@/lib/validators";
import { writeAudit, getClientIp } from "@/lib/audit";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireRole(["ADMIN", "RECEPTIONIST"]);
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const parsed = parseBody(paymentSchema, await req.json());
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const body = parsed.data;

  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice) return NextResponse.json({ error: "Hóa đơn không tồn tại" }, { status: 404 });

  const paymentAmount = Math.round(body.amount);
  if (paymentAmount <= 0) {
    return NextResponse.json({ error: "Số tiền thanh toán phải lớn hơn 0" }, { status: 400 });
  }

  const newPaid = invoice.paidAmount + paymentAmount;
  if (newPaid > invoice.totalAmount) {
    const remaining = Math.max(0, invoice.totalAmount - invoice.paidAmount);
    return NextResponse.json(
      {
        error: `Số tiền thanh toán vượt quá dư nợ cần trả. Số tiền còn nợ: ${remaining.toLocaleString("vi-VN")}đ`,
      },
      { status: 400 }
    );
  }

  try {
    const updatedInvoice = await prisma.$transaction(async (tx) => {
      await tx.payment.create({
        data: {
          invoiceId: id,
          amount: paymentAmount,
          method: body.method || "CASH",
          note: body.note,
        },
      });

      const status = newPaid >= invoice.totalAmount ? "PAID" : "PARTIAL";
      const updated = await tx.invoice.update({
        where: { id },
        data: { paidAmount: newPaid, paymentStatus: status },
      });

      return updated;
    });

    await writeAudit({
      action: "PAYMENT",
      entity: "Invoice",
      entityId: id,
      detail: `Thanh toán ${paymentAmount.toLocaleString("vi-VN")}đ - ${body.method || "CASH"}`,
      ip: getClientIp(req),
    });

    return NextResponse.json(updatedInvoice);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Xử lý thanh toán thất bại" }, { status: 500 });
  }
}
