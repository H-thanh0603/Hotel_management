import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";
import { writeAudit, getClientIp } from "@/lib/audit";

export async function GET() {
  const vouchers = await prisma.voucher.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(vouchers);
}

export async function POST(req: Request) {
  const guard = await requireRole(["ADMIN"]);
  if (guard instanceof NextResponse) return guard;

  try {
    const body = await req.json();
    const { code, description, discountType, discountAmount, minOrderAmount, maxDiscount, maxUses, validUntil } = body;

    if (!code || !discountAmount || !validUntil) {
      return NextResponse.json({ error: "Thiếu thông tin bắt buộc (mã, mức giảm, ngày hết hạn)" }, { status: 400 });
    }

    const existing = await prisma.voucher.findUnique({ where: { code: code.toUpperCase() } });
    if (existing) {
      return NextResponse.json({ error: `Mã voucher "${code}" đã tồn tại` }, { status: 400 });
    }

    const voucher = await prisma.voucher.create({
      data: {
        code: code.toUpperCase().trim(),
        description: description || null,
        discountType: discountType || "PERCENT",
        discountAmount: Number(discountAmount),
        minOrderAmount: Number(minOrderAmount || 0),
        maxDiscount: maxDiscount ? Number(maxDiscount) : null,
        maxUses: Number(maxUses || 100),
        validUntil: new Date(validUntil),
        status: "ACTIVE",
      },
    });

    await writeAudit({
      action: "CREATE",
      entity: "Voucher",
      entityId: voucher.id,
      detail: `Tạo voucher ${voucher.code}`,
      ip: getClientIp(req),
    });

    return NextResponse.json(voucher, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Lỗi tạo voucher" }, { status: 500 });
  }
}
