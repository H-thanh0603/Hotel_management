import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPass = await bcrypt.hash("123456", 10);
  
  await prisma.user.upsert({
    where: { email: "admin@hotelflow.com" },
    update: { passwordHash: adminPass },
    create: {
      fullName: "Admin Hotel",
      email: "admin@hotelflow.com",
      passwordHash: adminPass,
      phone: "0901000001",
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  await prisma.user.upsert({
    where: { email: "letan@hotelflow.com" },
    update: { passwordHash: adminPass },
    create: {
      fullName: "Nguyen Van Letan",
      email: "letan@hotelflow.com",
      passwordHash: adminPass,
      phone: "0901000002",
      role: "RECEPTIONIST",
      status: "ACTIVE",
    },
  });

  await prisma.user.upsert({
    where: { email: "buongphong@hotelflow.com" },
    update: { passwordHash: adminPass },
    create: {
      fullName: "Tran Thi Buong",
      email: "buongphong@hotelflow.com",
      passwordHash: adminPass,
      phone: "0901000003",
      role: "HOUSEKEEPING",
      status: "ACTIVE",
    },
  });

  await prisma.user.upsert({
    where: { email: "khach@hotelflow.com" },
    update: { passwordHash: adminPass },
    create: {
      fullName: "Le Van Khach",
      email: "khach@hotelflow.com",
      passwordHash: adminPass,
      phone: "0901000004",
      role: "CUSTOMER",
      status: "ACTIVE",
    },
  });

  const roomTypeDefs = [
    { name: "Standard Room", slug: "standard-room", description: "Phòng tiêu chuẩn", pricePerNight: 500000, pricePerHour: 100000, overnightPrice: 240000, maxGuests: 2, bedCount: 1, area: 25, amenities: JSON.stringify(["WiFi","TV","Điều hòa","Tủ lạnh"]), status: "ACTIVE" },
    { name: "Superior Room", slug: "superior-room", description: "Phòng cao cấp", pricePerNight: 800000, pricePerHour: 150000, overnightPrice: 350000, maxGuests: 2, bedCount: 1, area: 30, amenities: JSON.stringify(["WiFi","TV","Điều hòa","Tủ lạnh","Bồn tắm","Ban công"]), status: "ACTIVE" },
    { name: "Deluxe Room", slug: "deluxe-room", description: "Phòng sang trọng", pricePerNight: 1200000, pricePerHour: 200000, overnightPrice: 450000, maxGuests: 3, bedCount: 2, area: 40, amenities: JSON.stringify(["WiFi","TV","Điều hòa","Tủ lạnh","Bồn tắm","Minibar"]), status: "ACTIVE" },
    { name: "Family Room", slug: "family-room", description: "Phòng gia đình", pricePerNight: 1500000, pricePerHour: 250000, overnightPrice: 550000, maxGuests: 5, bedCount: 3, area: 50, amenities: JSON.stringify(["WiFi","TV","Điều hòa","Tủ lạnh","Bồn tắm","Bếp nhỏ"]), status: "ACTIVE" },
    { name: "Suite Room", slug: "suite-room", description: "Phòng suite VIP", pricePerNight: 2500000, pricePerHour: 400000, overnightPrice: 800000, maxGuests: 4, bedCount: 2, area: 70, amenities: JSON.stringify(["WiFi","TV","Jacuzzi","Butler","Minibar"]), status: "ACTIVE" },
  ];

  const roomTypes: any[] = [];
  for (const rtDef of roomTypeDefs) {
    const rt = await prisma.roomType.upsert({
      where: { name: rtDef.name },
      update: rtDef,
      create: rtDef,
    });
    roomTypes.push(rt);
  }

  let roomNum = 101;
  for (let floor = 1; floor <= 5; floor++) {
    for (let i = 0; i < 4; i++) {
      const typeIndex = Math.min(floor - 1, roomTypes.length - 1);
      const roomStr = String(roomNum);
      await prisma.room.upsert({
        where: { roomNumber: roomStr },
        update: { floor, roomTypeId: roomTypes[typeIndex].id },
        create: { roomNumber: roomStr, floor, roomTypeId: roomTypes[typeIndex].id, status: "AVAILABLE" },
      });
      roomNum++;
    }
    roomNum = (floor + 1) * 100 + 1;
  }

  const services = [
    { name: "Ăn sáng buffet", price: 150000, unit: "người/bữa", description: "Buffet sáng" },
    { name: "Giặt ủi", price: 50000, unit: "kg", description: "Giặt ủi trong ngày" },
    { name: "Minibar", price: 100000, unit: "lần", description: "Đồ uống minibar" },
    { name: "Spa", price: 500000, unit: "60 phút", description: "Massage" },
    { name: "Thuê xe", price: 800000, unit: "ngày", description: "Xe 4 chỗ có tài xế" },
    { name: "Đưa đón sân bay", price: 350000, unit: "lượt", description: "Xe đưa đón" },
  ];
  for (const svc of services) {
    const existingSvc = await prisma.service.findFirst({ where: { name: svc.name } });
    if (existingSvc) {
      await prisma.service.update({ where: { id: existingSvc.id }, data: { ...svc, status: "ACTIVE" } });
    } else {
      await prisma.service.create({ data: { ...svc, status: "ACTIVE" } });
    }
  }

  const vouchers = [
    { code: "SUMMER2026", description: "Ưu đãi nghỉ dưỡng hè 20%", discountType: "PERCENT", discountAmount: 20, minOrderAmount: 500000, maxUses: 500, validUntil: new Date("2026-12-31") },
    { code: "VIP10", description: "Ưu đãi thành viên VIP 10%", discountType: "PERCENT", discountAmount: 10, minOrderAmount: 0, maxUses: 1000, validUntil: new Date("2026-12-31") },
    { code: "WELCOME100K", description: "Voucher chào mừng 100,000đ", discountType: "FIXED", discountAmount: 100000, minOrderAmount: 300000, maxUses: 200, validUntil: new Date("2026-12-31") },
  ];

  for (const v of vouchers) {
    await prisma.voucher.upsert({
      where: { code: v.code },
      update: v,
      create: v,
    });
  }

  await prisma.customer.upsert({
    where: { email: "nguyenvana@gmail.com" },
    update: {},
    create: { fullName: "Nguyen Van A", phone: "0912345678", email: "nguyenvana@gmail.com", identityNumber: "079123456789", nationality: "Viet Nam", address: "123 Nguyen Hue, Q1, TP.HCM" },
  });

  await prisma.customer.upsert({
    where: { email: "tranthib@gmail.com" },
    update: {},
    create: { fullName: "Tran Thi B", phone: "0987654321", email: "tranthib@gmail.com", identityNumber: "079987654321", nationality: "Viet Nam", address: "456 Le Loi, Q3, TP.HCM" },
  });

  await prisma.customer.upsert({
    where: { email: "khach@hotelflow.com" },
    update: {},
    create: { fullName: "Le Van Khach", phone: "0901000004", email: "khach@hotelflow.com" },
  });

  await prisma.pricingConfig.upsert({
    where: { name: "default" },
    update: {},
    create: {
      name: "default",
      overnightStart: "23:00",
      overnightEnd: "11:00",
      gracePeriod: 15,
      overtimeCharge: 30,
    },
  });

  console.log("Idempotent seed with Vouchers completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
