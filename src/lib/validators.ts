import { z } from "zod";

export const bookingCreateSchema = z.object({
  customerId: z.string().min(1, "Thiếu customerId"),
  roomId: z.string().optional(),
  roomTypeId: z.string().min(1, "Thiếu roomTypeId"),
  checkInDate: z.string().min(1),
  checkOutDate: z.string().min(1),
  numberOfGuests: z.number().int().positive().optional(),
  depositAmount: z.number().nonnegative().optional(),
  note: z.string().optional(),
  status: z.string().optional(),
});

export const walkinSchema = z.object({
  roomId: z.string().min(1, "Thiếu roomId"),
  bookingType: z.enum(["HOURLY", "OVERNIGHT"]).optional(),
  hours: z.number().positive().optional(),
  note: z.string().optional(),
});

export const customerCreateSchema = z.object({
  fullName: z.string().min(1, "Thiếu họ tên"),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  identityNumber: z.string().optional(),
  nationality: z.string().optional(),
  address: z.string().optional(),
  note: z.string().optional(),
});

export const roomCreateSchema = z.object({
  roomNumber: z.string().min(1, "Thiếu số phòng"),
  floor: z.number().int().optional(),
  roomTypeId: z.string().min(1, "Thiếu loại phòng"),
  status: z.string().optional(),
  note: z.string().optional(),
});

export const roomTypeCreateSchema = z.object({
  name: z.string().min(1, "Thiếu tên"),
  pricePerNight: z.number().nonnegative(),
  pricePerHour: z.number().nonnegative().optional(),
  overnightPrice: z.number().nonnegative().optional(),
  maxGuests: z.number().int().positive().optional(),
  bedCount: z.number().int().nonnegative().optional(),
  area: z.number().nonnegative().optional(),
  amenities: z.string().optional(),
  imageUrl: z.string().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
});

export const serviceCreateSchema = z.object({
  name: z.string().min(1, "Thiếu tên dịch vụ"),
  price: z.number().nonnegative(),
  unit: z.string().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
});

export const invoiceCreateSchema = z.object({
  bookingId: z.string().min(1, "Thiếu bookingId"),
  surchargeAmount: z.number().nonnegative().optional(),
  discountAmount: z.number().nonnegative().optional(),
  taxAmount: z.number().nonnegative().optional(),
});

export const paymentSchema = z.object({
  amount: z.number().positive("Số tiền phải > 0"),
  method: z.string().optional(),
  note: z.string().optional(),
});

export const userCreateSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
  phone: z.string().optional(),
  role: z.enum(["ADMIN", "RECEPTIONIST", "HOUSEKEEPING", "CUSTOMER"]).optional(),
});

export function parseBody<T extends z.ZodTypeAny>(schema: T, body: unknown) {
  const result = schema.safeParse(body);
  if (!result.success) {
    return { error: result.error.issues[0]?.message || "Dữ liệu không hợp lệ" };
  }
  return { data: result.data };
}
