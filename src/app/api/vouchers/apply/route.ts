import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { code, totalAmount } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Vui lòng nhập mã voucher" }, { status: 400 });
    }

    const voucher = await prisma.voucher.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (!voucher || voucher.status !== "ACTIVE") {
      return NextResponse.json({ error: "Mã voucher không tồn tại hoặc đã hết hạn" }, { status: 404 });
    }

    const now = new Date();
    if (voucher.validUntil < now) {
      return NextResponse.json({ error: "Mã voucher đã hết hạn sử dụng" }, { status: 400 });
    }

    if (voucher.usedCount >= voucher.maxUses) {
      return NextResponse.json({ error: "Mã voucher đã hết lượt sử dụng" }, { status: 400 });
    }

    const orderAmt = Number(totalAmount || 0);
    if (orderAmt < voucher.minOrderAmount) {
      return NextResponse.json(
        { error: `Mã voucher áp dụng cho đơn tối thiểu từ ${voucher.minOrderAmount.toLocaleString("vi-VN")}đ` },
        { status: 400 }
      );
    }

    let calculatedDiscount = 0;
    if (voucher.discountType === "PERCENT") {
      calculatedDiscount = Math.round((orderAmt * voucher.discountAmount) / 100);
      if (voucher.maxDiscount && calculatedDiscount > voucher.maxDiscount) {
        calculatedDiscount = voucher.maxDiscount;
      }
    } else {
      calculatedDiscount = voucher.discountAmount;
    }

    // Don't discount more than total amount
    calculatedDiscount = Math.min(calculatedDiscount, orderAmt);

    return NextResponse.json({
      success: true,
      voucher: {
        code: voucher.code,
        discountType: voucher.discountType,
        discountAmount: voucher.discountAmount,
        calculatedDiscount,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Lỗi kiểm tra voucher" }, { status: 500 });
  }
}
