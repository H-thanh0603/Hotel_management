import { z } from "zod";
import { NextResponse } from "next/server";

export function parseBody<T>(
  schema: z.ZodSchema<T>,
  body: unknown
): { data: T; errorResponse?: NextResponse } {
  const result = schema.safeParse(body);
  if (!result.success) {
    const errorMsg = (result.error.issues || []).map((e: any) => `${e.path?.join(".")}: ${e.message}`).join(", ");
    return {
      data: {} as T,
      errorResponse: NextResponse.json({ error: `Dữ liệu không hợp lệ: ${errorMsg}` }, { status: 400 }),
    };
  }
  return { data: result.data };
}

export const bookingCreateSchema = z.object({
  customerId: z.string().min(1, "Vui lòng chọn khách hàng"),
  roomTypeId: z.string().min(1, "Vui lòng chọn hạng phòng"),
  roomId: z.string().optional().nullable(),
  checkInDate: z.string().min(1, "Ngày nhận phòng không được để trống"),
  checkOutDate: z.string().min(1, "Ngày trả phòng không được để trống"),
  numberOfGuests: z.number().min(1).default(1),
  bookingType: z.string().default("NIGHTLY"),
  hours: z.number().optional().nullable(),
  depositAmount: z.number().min(0).default(0),
  discountAmount: z.number().min(0).default(0),
  taxAmount: z.number().min(0).default(0),
  voucherCode: z.string().optional().nullable(),
  status: z.string().optional(),
  specialRequests: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
});

export const walkinSchema = z.object({
  fullName: z.string().min(2, "Họ tên tối thiểu 2 ký tự"),
  phone: z.string().optional(),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  identityNumber: z.string().optional(),
  roomId: z.string().min(1, "Vui lòng chọn phòng"),
  checkInDate: z.string(),
  checkOutDate: z.string(),
  numberOfGuests: z.number().min(1).default(1),
  bookingType: z.string().default("NIGHTLY"),
  hours: z.number().optional(),
  depositAmount: z.number().default(0),
  note: z.string().optional(),
});

export const customerCreateSchema = z.object({
  fullName: z.string().min(2, "Họ và tên tối thiểu 2 ký tự"),
  phone: z.string().optional(),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  identityNumber: z.string().optional(),
  nationality: z.string().optional(),
  address: z.string().optional(),
  note: z.string().optional(),
});

export const paymentSchema = z.object({
  amount: z.number().min(1, "Số tiền thanh toán phải lớn hơn 0"),
  method: z.string().default("CASH"),
  note: z.string().optional(),
});

export const invoiceCreateSchema = z.object({
  bookingId: z.string().min(1, "Thiếu mã đặt phòng"),
  surchargeAmount: z.number().min(0).default(0),
  discountAmount: z.number().min(0).default(0),
  taxAmount: z.number().min(0).default(0),
});

export const roomTypeCreateSchema = z.object({
  name: z.string().min(2, "Tên hạng phòng tối thiểu 2 ký tự"),
  description: z.string().optional(),
  pricePerNight: z.number().min(0),
  pricePerHour: z.number().min(0).default(0),
  overnightPrice: z.number().min(0).default(0),
  maxGuests: z.number().min(1).default(2),
  bedCount: z.number().min(1).default(1),
  area: z.number().optional(),
  amenities: z.string().optional(),
  imageUrl: z.string().optional(),
  status: z.string().optional(),
});

export const roomCreateSchema = z.object({
  roomNumber: z.string().min(1, "Số phòng không được để trống"),
  floor: z.number().min(1, "Tầng phải từ 1 trở lên"),
  roomTypeId: z.string().min(1, "Vui lòng chọn hạng phòng"),
  status: z.string().default("AVAILABLE"),
  note: z.string().optional(),
});

export const serviceCreateSchema = z.object({
  name: z.string().min(2, "Tên dịch vụ tối thiểu 2 ký tự"),
  price: z.number().min(0, "Giá dịch vụ không được âm"),
  unit: z.string().min(1, "Đơn vị tính không được để trống"),
  description: z.string().optional(),
  status: z.string().optional(),
});

export const userCreateSchema = z.object({
  fullName: z.string().min(2, "Họ tên nhân viên tối thiểu 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
  phone: z.string().optional(),
  role: z.enum(["ADMIN", "RECEPTIONIST", "HOUSEKEEPING", "CUSTOMER"]),
});

export const VoucherSchema = z.object({
  code: z.string().min(3).max(20).transform((val) => val.toUpperCase()),
  description: z.string().max(300).optional(),
  discountType: z.enum(["PERCENT", "FIXED"]).default("PERCENT"),
  discountAmount: z.number().min(1),
  minOrderAmount: z.number().min(0).default(0),
  maxUses: z.number().min(1).default(100),
  validUntil: z.string(),
});
