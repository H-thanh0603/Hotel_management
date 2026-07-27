# 🏨 HotelFlow — Hệ Thống Quản Lý Khách Sạn & Website Đặt Phòng Khách Hàng (Full-Stack Enterprise Solution)

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live_Demo-black?style=flat-svg&logo=vercel)](https://hotelflow-zeta.vercel.app)
[![Supabase Database](https://img.shields.io/badge/Supabase-PostgreSQL_17-3ECF8E?style=flat-svg&logo=supabase)](https://supabase.com)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.2.6-black?style=flat-svg&logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-svg&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=flat-svg&logo=prisma)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-svg&logo=tailwindcss)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen?style=flat-svg)](#-kiểm-thử-tự-động-test-suite)

**HotelFlow** là hệ thống phần mềm quản lý khách sạn toàn diện tích hợp **Website đặt phòng công khai dành cho Khách hàng (Public Guest MVP)**, **Cổng dịch vụ cá nhân (Customer Self-Service Portal)** và **Hệ thống điều hành Back-office chuyên nghiệp** dành cho Ban quản lý, Lễ tân và Buồng phòng.

🌐 **DEMO TRỰC TUYẾN (PRODUCTION):** [https://hotelflow-zeta.vercel.app](https://hotelflow-zeta.vercel.app)

---

## 🌟 Tính Năng Nổi Bật

### 1. Website Đặt Phòng Công Khai & Thanh Toán VietQR
- **Trang chủ giới thiệu (`/`)**: Giao diện hiện đại, giới thiệu dịch vụ 5 sao, ưu đãi và không gian nghỉ dưỡng.
- **Danh mục hạng phòng (`/phong`)**: Tra cứu tình trạng phòng trống thời gian thực (**Real-time Availability Search**), lọc theo ngày nhận/trả phòng và số lượng khách.
- **Chi tiết hạng phòng (`/phong/[slug]`)**: Bộ sưu tập hình ảnh, sức chứa, loại giường, diện tích, tiện nghi và bảng giá thuê theo đêm/giờ/qua đêm.
- **Luồng đặt phòng Multi-step 5 bước (`/dat-phong`)**:
  1. *Chọn ngày & số lượng khách*
  2. *Chọn hạng phòng còn trống thực tế*
  3. *Nhập thông tin người đặt & yêu cầu đặc biệt*
  4. *Áp dụng Mã giảm giá (Voucher Engine) & tóm tắt chi phí*
  5. *Nhận mã Booking Code & Mã VietQR tự động chuyển khoản cọc phòng*
- **Trang thông tin phụ trợ**: Dịch vụ (`/dich-vu`), Ưu đãi (`/uu-dai`), Giới thiệu (`/gioi-thieu`), Liên hệ 24/7 (`/lien-he`).

### 2. Cổng Quản Lý Khách Hàng (`/tai-khoan`)
- **Trang tổng quan (`/tai-khoan`)**: Quản lý thống kê các đơn đặt phòng sắp tới, đang ở và lịch sử lưu trú.
- **Quản lý đặt phòng (`/tai-khoan/dat-phong`)**: Xem chi tiết đơn đặt phòng và **Hủy Đặt Phòng chủ động** (`POST /api/customer/bookings/[id]/cancel`) với cơ chế kiểm tra quyền sở hữu và chính sách thời hạn hủy phòng.
- **Hồ sơ cá nhân (`/tai-khoan/ho-so`)**: Xem và cập nhật thông tin cá nhân.

### 3. Hệ Thống Back-Office Vận Hành Khách Sạn (`/dashboard`)
- **Dashboard tổng quan & RevPAR Analytics (`/dashboard`)**: Thống kê doanh thu, tỷ lệ lấp đầy phòng (Occupancy rate %), chỉ số **RevPAR** (Doanh thu/phòng) & **ADR** (Giá trung bình phòng), biểu đồ doanh thu các tháng.
- **Quản lý Mã Giảm Giá (`/vouchers`)**: Khởi tạo voucher (% hoặc số tiền cố định), thiết lập hạn dùng, lượt dùng tối đa.
- **Sơ đồ phòng theo tầng (`/rooms`)**: Theo dõi trạng thái vận hành thời gian thực (`AVAILABLE`, `OCCUPIED`, `DIRTY`, `CLEANING`, `MAINTENANCE`, `INACTIVE`), cập nhật trạng thái phòng nhanh.
- **Quản lý loại phòng (`/room-types`)**: CRUD loại phòng, thiết lập giá VND (giá đêm, giá giờ, giá qua đêm), ảnh đại diện, tiện nghi.
- **Quản lý đặt phòng (`/bookings`)**: Tiếp nhận đặt phòng online, đặt phòng trực tiếp tại quầy (Walk-in), đổi trạng thái lifecycle (`PENDING` ➔ `CONFIRMED` ➔ `CHECKED_IN` ➔ `CHECKED_OUT` / `CANCELLED`).
- **Tự động hóa dọn phòng (Housekeeping State Machine)**: Khi Check-out phòng, hệ thống tự động đổi trạng thái phòng sang `DIRTY` và khởi tạo đơn dọn phòng `HousekeepingTask` ở trạng thái `PENDING` trong cùng một **Database Transaction**.
- **Quản lý hóa đơn & thanh toán (`/invoices`)**: Tạo hóa đơn, thêm phụ thu dịch vụ, thanh toán từng phần hoặc toàn bộ với cơ chế **Chống Over-payment** (ngăn chặn đóng quá tiền nợ).
- **Quản lý khách hàng CRM (`/customers`)**: Tra cứu PII khách hàng, mã hóa PII nhạy cảm, lịch sử lưu trú.
- **Quản lý nhân viên & Phân quyền (`/users`)**: Tạo nhân viên mới, phân quyền Role (`ADMIN`, `RECEPTIONIST`, `HOUSEKEEPING`), vô hiệu hóa/archive tài khoản (Soft delete).
- **Nhật ký hoạt động hệ thống (`/audit-logs`)**: Giám sát audit log 100% các thao tác người dùng, đăng nhập, bảo mật, thời gian, IP và thông tin chi tiết.

---

## 🛠 Tech Stack & Kiến Trúc High-Performance

- **Core Framework:** Next.js 16.2 (App Router, Turbopack, Dynamic Server API Components).
- **Hosting / Deployment:** Vercel Production Serverless.
- **Cơ sở dữ liệu Production:** Supabase PostgreSQL 17 (Chỉ mục Database Indexes + Connection Pooling PgBouncer).
- **Ngôn ngữ:** TypeScript 5.0 (Strict mode).
- **Styling:** TailwindCSS 3.4 + Shadcn UI + Lucide Icons.
- **Bảo mật:** Rate Limiter per IP (120 req/min) + Zod Input Validation (chống DDoS & SQL Injection/XSS).
- **Authentication & AuthZ:** NextAuth.js (JWT Strategy) + Proxy Middleware Guard (`src/proxy.ts`).
- **Xử lý giao dịch (ACID Transactions):** Prisma `$transaction` đảm bảo tính toàn vẹn dữ liệu cho tất cả các thao tác thay đổi trạng thái booking, thanh toán và tự động tạo việc dọn phòng.

---

## 🔒 Phân Quyền & Role Guard (Authorization Architecture)

Hệ thống phân chia 4 nhóm quyền chính:

| Role | Phạm Vi Quyền Hạn | Đường Dẫn Mặc Định |
|---|---|---|
| **ADMIN** | Toàn quyền quản trị hệ thống, nhân viên, cài đặt giá, Vouchers và xem Audit Logs | `/dashboard` |
| **RECEPTIONIST** | Quản lý đặt phòng, check-in, check-out, tạo hóa đơn, dịch vụ, vouchers và khách hàng | `/dashboard` |
| **HOUSEKEEPING** | Cập nhật trạng thái dọn phòng (`CLEANING`, `CLEAN`), xem danh sách phòng | `/dashboard` |
| **CUSTOMER** | Đặt phòng công khai, xem lịch sử đặt phòng cá nhân, hủy đơn của chính mình | `/tai-khoan` |

---

## 🔑 Tài Khoản Demo

Bạn có thể đăng nhập thử nghiệm trên bản Live Production tại [https://hotelflow-zeta.vercel.app/login](https://hotelflow-zeta.vercel.app/login):

| Vai Trò | Email | Mật Khẩu |
|---|---|---|
| **Quản trị viên (Admin)** | `admin@hotelflow.com` | `123456` |
| **Lễ tân (Receptionist)** | `letan@hotelflow.com` | `123456` |
| **Buồng phòng (Housekeeping)** | `buongphong@hotelflow.com` | `123456` |
| **Khách hàng (Customer)** | `khach@hotelflow.com` | `123456` |

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Cục Bộ

```bash
# 1. Clone repository
git clone https://github.com/H-thanh0603/Hotel_management.git
cd Hotel_management

# 2. Cài đặt dependencies
npm install

# 3. Tạo file cấu hình môi trường (.env)
cp .env.example .env

# 4. Đồng bộ CSDL Supabase PostgreSQL
npx prisma db push
npx tsx prisma/seed.ts

# 5. Chạy môi trường phát triển (Dev server)
npm run dev
```

---

## 🧪 Kiểm Thử Tự Động (Test Suite)

```bash
npm run lint       # Kiểm tra cú pháp & quy chuẩn mã nguồn (ESLint)
npm run typecheck  # Kiểm tra kiểu dữ liệu TypeScript tĩnh
npm run test       # Chạy bộ test suite tự động (4/4 PASS)
npm run build      # Kiểm tra đóng gói build production
```

---

## 📄 Giấy Phép & Bản Quyền

Bản quyền thuộc về **HotelFlow Team** © 2026. All rights reserved.
