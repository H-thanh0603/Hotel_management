import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPass = await bcrypt.hash("123456", 10);
  
  const admin = await prisma.user.upsert({
    where: { email: "admin@hotelflow.com" },
    update: {},
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
    update: {},
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
    update: {},
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
    update: {},
    create: {
      fullName: "Le Van Khach",
      email: "khach@hotelflow.com",
      passwordHash: adminPass,
      phone: "0901000004",
      role: "CUSTOMER",
      status: "ACTIVE",
    },
  });

  const standard = await prisma.roomType.create({
    data: { name: "Standard Room", description: "Phong tieu chuan", pricePerNight: 500000, pricePerHour: 100000, overnightPrice: 240000, maxGuests: 2, bedCount: 1, area: 25, amenities: JSON.stringify(["WiFi","TV","Dieu hoa","Tu lanh"]), status: "ACTIVE" },
  });
  const superior = await prisma.roomType.create({
    data: { name: "Superior Room", description: "Phong cao cap", pricePerNight: 800000, pricePerHour: 150000, overnightPrice: 350000, maxGuests: 2, bedCount: 1, area: 30, amenities: JSON.stringify(["WiFi","TV","Dieu hoa","Tu lanh","Bon tam","Ban cong"]), status: "ACTIVE" },
  });
  const deluxe = await prisma.roomType.create({
    data: { name: "Deluxe Room", description: "Phong sang trong", pricePerNight: 1200000, pricePerHour: 200000, overnightPrice: 450000, maxGuests: 3, bedCount: 2, area: 40, amenities: JSON.stringify(["WiFi","TV","Dieu hoa","Tu lanh","Bon tam","Minibar"]), status: "ACTIVE" },
  });
  const family = await prisma.roomType.create({
    data: { name: "Family Room", description: "Phong gia dinh", pricePerNight: 1500000, pricePerHour: 250000, overnightPrice: 550000, maxGuests: 5, bedCount: 3, area: 50, amenities: JSON.stringify(["WiFi","TV","Dieu hoa","Tu lanh","Bon tam","Bep nho"]), status: "ACTIVE" },
  });
  const suite = await prisma.roomType.create({
    data: { name: "Suite Room", description: "Phong suite VIP", pricePerNight: 2500000, pricePerHour: 400000, overnightPrice: 800000, maxGuests: 4, bedCount: 2, area: 70, amenities: JSON.stringify(["WiFi","TV","Jacuzzi","Butler","Minibar"]), status: "ACTIVE" },
  });

  const roomTypes = [standard, superior, deluxe, family, suite];
  let roomNum = 101;
  for (let floor = 1; floor <= 5; floor++) {
    for (let i = 0; i < 4; i++) {
      const typeIndex = Math.min(floor - 1, roomTypes.length - 1);
      await prisma.room.create({
        data: { roomNumber: String(roomNum), floor, roomTypeId: roomTypes[typeIndex].id, status: "AVAILABLE" },
      });
      roomNum++;
    }
    roomNum = (floor + 1) * 100 + 1;
  }

  const services = [
    { name: "An sang buffet", price: 150000, unit: "nguoi/bua", description: "Buffet sang" },
    { name: "Giat ui", price: 50000, unit: "kg", description: "Giat ui trong ngay" },
    { name: "Minibar", price: 100000, unit: "lan", description: "Do uong minibar" },
    { name: "Spa", price: 500000, unit: "60 phut", description: "Massage" },
    { name: "Thue xe", price: 800000, unit: "ngay", description: "Xe 4 cho co tai xe" },
    { name: "Dua don san bay", price: 350000, unit: "luot", description: "Xe dua don" },
  ];
  for (const svc of services) {
    await prisma.service.create({ data: { ...svc, status: "ACTIVE" } });
  }

  await prisma.customer.create({
    data: { fullName: "Nguyen Van A", phone: "0912345678", email: "nguyenvana@gmail.com", identityNumber: "079123456789", nationality: "Viet Nam", address: "123 Nguyen Hue, Q1, TP.HCM" },
  });
  await prisma.customer.create({
    data: { fullName: "Tran Thi B", phone: "0987654321", email: "tranthib@gmail.com", identityNumber: "079987654321", nationality: "Viet Nam", address: "456 Le Loi, Q3, TP.HCM" },
  });

  // Create pricing config
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

  console.log("Seed completed!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
