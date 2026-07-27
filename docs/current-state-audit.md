# Báo Cáo Đánh Giá Trạng Thái Hiện Tại (Current State Audit)

> **Dự án**: HotelFlow - Hệ thống Quản lý Khách sạn
> **Ngày đánh giá**: 27/07/2026
> **Tài liệu đối chiếu**: `HOTEL_MANAGEMENT_MASTER_PLAN.md`

---

## 1. Stack Hiện Tại

- **Framework**: Next.js 16.2.6 (App Router), React 19.2.4, TypeScript 5
- **Styling & UI**: TailwindCSS 4, Lucide React, Radix UI (Dialog, Select, Dropdown Menu, Slot, Separator), Class Variance Authority (`cva`), `clsx`, `tailwind-merge`
- **Database & ORM**: SQLite (`prisma/dev.db`), Prisma ORM 5.22.0
- **Authentication**: NextAuth.js 4.24.14 (Credentials Provider, JWT session, `bcryptjs` 3.0.3)
- **Form & Validation**: React Hook Form 7.76.1 + `@hookform/resolvers`, Zod 4.4.3
- **Báo cáo & Thống kê**: Recharts 3.8.1

---

## 2. Chức Năng Đã Có

1. **Authentication & Audit Log**:
   - Đăng nhập/đăng ký với NextAuth (JWT strategy).
   - Mã hóa mật khẩu với `bcryptjs`.
   - Ghi log đăng nhập/thất bại và thao tác dữ liệu cơ bản (`prisma.auditLog`).
   - Rate limiting cơ bản trong bộ nhớ cho login (`src/lib/audit.ts`).

2. **Backend API**:
   - API CRUD cơ bản cho các entity: Room, RoomType, Customer, Service, User, Invoice, Booking, Housekeeping.
   - Route guard phân quyền cơ bản qua `requireRole()` trong `src/lib/auth-helpers.ts`.
   - Validation cơ bản với Zod trong `src/lib/validators.ts` cho các API tạo mới (POST).

3. **Back-office UI (Sơ khai)**:
   - Dashboard tổng quan với các chỉ số phòng, doanh thu.
   - Quản lý sơ đồ phòng theo tầng.
   - Tạo booking walk-in tại quầy và tính phụ thu quá giờ khi check-out.
   - Danh sách đơn dọn phòng (Housekeeping).

---

## 3. Chức Năng Còn Thiếu (So với Master Plan)

1. **Website Công Khai (Guest/Public site)**:
   - Chưa có các trang public: `/` (Landing page), `/phong` (Danh sách phòng), `/phong/[slug]` (Chi tiết phòng), `/dat-phong` (Luồng đặt phòng multi-step), `/uu-dai`, `/dich-vu`, `/gioi-thieu`, `/lien-he`, `/chinh-sach`.
   - Hiện tại `/` đang redirect thẳng 100% sang `/dashboard`.

2. **Khu Tài Khoản Khách (Customer Self-Service)**:
   - Chưa có cụm route `/tai-khoan/*` (`/tai-khoan`, `/tai-khoan/dat-phong`, `/tai-khoan/ho-so`, `/tai-khoan/hoa-don`, v.v.).
   - Khách hàng (`CUSTOMER`) đang bị đưa vào chung layout `/dashboard` của nhân viên.

3. **Booking Engine & Availability Service**:
   - Thiếu service kiểm tra phòng trống thực sự dựa trên thời gian (`availabilityService.search()`, `assertAvailable()`).
   - Thiếu API public kiểm tra availability: `POST /api/public/availability`.
   - Thiếu thuật toán phát hiện khoảng thời gian trùng nhau (`checkIn < requestedCheckOut` AND `checkOut > requestedCheckIn`).

4. **API Hủy Booking Cho Khách**:
   - Thiếu endpoint `POST /api/customer/bookings/[id]/cancel` kiểm tra ownership, điều kiện hủy, thời hạn hủy và giải phóng phòng trong transaction.

5. **State Machine & Database Integrity**:
   - Trạng thái Booking và Room chưa được quản lý bằng enum chuẩn.
   - Chưa phân tách rõ giữa trạng thái vận hành phòng (`AVAILABLE`, `OCCUPIED`, `DIRTY`, `CLEANING`, `MAINTENANCE`, `INACTIVE`) và giữ chỗ đặt phòng.
   - Số tiền phòng/dịch vụ/hóa đơn đang lưu bằng `Float` (gây rủi ro sai số làm tròn số thực) thay vì `Int` (đồng VND).
   - Thiếu ràng buộc `Invoice.bookingId` `@unique` (cho phép tạo nhiều hóa đơn chính trùng lặp cho 1 booking).

6. **Chưa Có Phân Quyền Layout & Route Guard Phía Client/Middleware**:
   - File middleware hiện tại tên là `src/proxy.ts` - Next.js **không** tự động chạy middleware nếu không đặt tên file là `src/middleware.ts` hoặc `middleware.ts`.
   - Khi đăng nhập với tài khoản `CUSTOMER`, giao diện tự chuyển tới `/dashboard` và hiển thị Sidebar back-office.

---

## 4. Lỗi Và Rủi Ro Nghiêm Trọng (Bugs & Risks)

| STT | Mức độ | Lỗi / Rủi ro | Mô tả chi tiết & Hậu quả |
|---|---|---|---|
| 1 | **P0** | **Middleware không hoạt động** | File `src/proxy.ts` không đúng chuẩn Next.js (`src/middleware.ts`), dẫn đến toàn bộ route guard phía proxy bị bypass. |
| 2 | **P0** | **Sai lệch phân quyền Role CUSTOMER** | User role `CUSTOMER` có thể truy cập trang `/dashboard` back-office, nhìn thấy thanh điều hướng quản trị nội bộ. |
| 3 | **P0** | **Nguy cơ Overbooking** | API đặt phòng (`POST /api/bookings/customer` và `POST /api/bookings`) không gọi kiểm tra trùng phòng/loại phòng còn trống trước khi tạo booking. |
| 4 | **P0** | **Thiếu DB Transaction khi chuyển trạng thái** | Các hành động `confirm`, `check-in`, `check-out`, `cancel` booking và `payment` hóa đơn đang ghi dữ liệu xuống nhiều bảng rời rạc. Nếu server sập giữa chừng, trạng thái booking và phòng sẽ bị bất đồng bộ. |
| 5 | **P0** | **Hard Delete phá hủy dữ liệu** | Endpoint `DELETE /api/rooms/[id]` dùng `prisma.room.delete` trực tiếp, làm mất lịch sử hoặc gây crash lỗi Foreign Key Constraint nếu phòng đã có booking. |
| 6 | **P0** | **Kiểu dữ liệu tiền tệ `Float`** | `pricePerNight`, `totalAmount`, `paidAmount` lưu dạng `Float` có thể sinh ra kết quả lẻ như `1500000.0000000002` VND. |
| 7 | **P1** | **Thiếu script typecheck và test** | `package.json` chưa khai báo script `typecheck` và `test`, chưa có bộ test tự động kiểm tra luồng nghiệp vụ trọng yếu. |
| 8 | **P1** | **Thiếu API & UI Hủy Booking của Customer** | Khách hàng không thể chủ động hủy booking của chính mình khi chưa check-in. |

---

## 5. Mapping Route & Model Hiện Tại Với Kiến Trúc Mục Tiêu

### 5.1. Model Mapping

| Model Master Plan | Model Hiện Tại | Đánh giá & Hướng Migration |
|---|---|---|
| `User` | `User` | Thêm Enum Role `ADMIN`, `RECEPTIONIST`, `HOUSEKEEPING`, `CUSTOMER`. Thêm Soft Delete (`status: ACTIVE / INACTIVE / ARCHIVED`). |
| `CustomerProfile` | `Customer` | Liên kết với `User` qua `userId` (1-1 cho tài khoản khách) hoặc email. Masking giấy tờ PII trên UI. |
| `RoomType` | `RoomType` | Đổi `pricePerNight`, `pricePerHour` từ `Float` -> `Int`. Thêm `slug`, `shortDescription`, `maxAdults`, `maxChildren`, `sizeSqm`, `bedType`, `amenities` (JSON), `images` (JSON), `featured`, `status`. |
| `Room` | `Room` | Đổi `status` chuỗi thành Enum `RoomOperationalStatus` (`AVAILABLE`, `OCCUPIED`, `DIRTY`, `CLEANING`, `MAINTENANCE`, `INACTIVE`) và `EntityStatus`. |
| `Booking` | `Booking` | Đổi `status` thành Enum `BookingStatus` (`PENDING`, `CONFIRMED`, `CHECKED_IN`, `CHECKED_OUT`, `CANCELLED`, `NO_SHOW`). Đổi tiền từ `Float` -> `Int`. Thêm snapshot giá, `cancelledAt`, `cancellationReason`, `cancelledByUserId`. |
| `Invoice` | `Invoice` | Thêm `@unique` cho `bookingId`. Đổi tiền tệ `Float` -> `Int`. Thêm `paymentStatus` Enum (`UNPAID`, `PARTIAL`, `PAID`, `VOIDED`). |
| `Payment` | `Payment` | Đổi `amount` từ `Float` -> `Int`. |
| `HousekeepingTask`| `HousekeepingTask`| Đổi `status` thành Enum (`PENDING`, `ASSIGNED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`). |

### 5.2. Route Mapping

| Mục tiêu | Route Hiện Tại | Trạng thái & Kế hoạch |
|---|---|---|
| **Public Website** | `/` (redirect `/dashboard`) | Tháo bỏ redirect. Xây dựng Landing page tại `/` và catalog `/phong`, `/phong/[slug]`, `/dat-phong`. |
| **Customer Area** | N/A (dùng chung `/dashboard`) | Tạo route group `src/app/(customer)/tai-khoan/*` độc lập với layout riêng dành cho khách hàng. |
| **Back-office** | `src/app/(dashboard)/*` | Giữ nguyên cụm route `/dashboard/*`, bảo vệ bằng route guard bắt buộc role Staff (`ADMIN`, `RECEPTIONIST`, `HOUSEKEEPING`). |
| **Public API** | `/api/room-types`, `/api/rooms` | Chuẩn hóa về `/api/public/*` không yêu cầu auth, không trả dữ liệu nhạy cảm. |
| **Customer API** | `/api/bookings/my`, `/api/bookings/customer` | Chuẩn hóa về `/api/customer/*` có middleware/guard xác thực ownership của khách. |
| **Staff API** | `/api/bookings`, `/api/rooms`, ... | Yêu cầu Session & Role phù hợp cho từng endpoint. |

---

## 6. Kế Hoạch Migration Chi Tiết

### Giai đoạn 1 — Authorization, Route Guard & Stability (P0)
1. **Đổi tên & hoàn thiện Middleware**: Đổi `src/proxy.ts` thành `src/middleware.ts`. Kiểm tra quyền truy cập route dựa trên JWT token & Role. Redirect `CUSTOMER` sang `/tai-khoan` nếu cố vào `/dashboard`.
2. **Phân tách Layout & Routing**:
   - Root `/` hiển thị trang công khai thay vì redirect về `/dashboard`.
   - Sửa trang login/register: Redirect `CUSTOMER` -> `/tai-khoan`, Redirect Staff -> `/dashboard`.
   - Tạo Layout riêng cho `(customer)` tại `/tai-khoan`.
3. **Bổ sung API Customer Cancel**:
   - Tạo route `POST /api/customer/bookings/[id]/cancel`.
   - Validate ownership (chính customer sở hữu booking), kiểm tra thời hạn và trạng thái cho phép hủy.
   - Thực hiện transaction giải phóng giữ chỗ/gán phòng và ghi audit log.
4. **Bổ sung Soft Delete / Archive & Input Validation**:
   - Chuyển `DELETE /api/rooms/[id]`, `DELETE /api/users/[id]`... thành soft delete/archive thay vì `prisma.*.delete`.
   - Bổ sung Zod schema validation cho tất cả các endpoint PATCH/PUT.
5. **Thêm script typecheck & unit test runner vào package.json**.

### Giai đoạn 2 — Booking Engine, Database Integrity & Transactions (P0)
1. **Cập nhật Schema & Prisma Migration**:
   - Chuyển các kiểu tiền tệ sang `Int` (đồng VND).
   - Định nghĩa enum chuẩn cho `BookingStatus`, `RoomOperationalStatus`, `HousekeepingStatus`, `InvoiceStatus`, `UserRole`.
   - Thêm `@unique` cho `Invoice.bookingId`.
   - Tạo migration an toàn preserves dữ liệu SQLite/PostgreSQL hiện có.
2. **Xây dựng Availability Service**:
   - Xây dựng module `src/lib/services/availability.ts` với hàm tìm kiếm phòng trống theo khoảng thời gian `(checkInDate, checkOutDate)`.
   - Đảm bảo quy tắc chống overbooking: `existing.checkIn < requested.checkOut AND existing.checkOut > requested.checkIn`.
   - Tạo endpoint `POST /api/public/availability`.
3. **Đảm bảo DB Transactions ($transaction) cho các State Transition**:
   - Confirm booking & room assignment.
   - Check-in (kiểm tra room status, date conflict, room type).
   - Check-out (tự động tạo `HousekeepingTask` + đổi room status thành `DIRTY` trong cùng transaction).
   - Cancel booking (giải phóng room/reservation).
   - Add Payment (kiểm tra không cho over-payment, cập nhật `paidAmount` và `paymentStatus` trong transaction).
4. **Seed Idempotent**:
   - Sửa `prisma/seed.ts` sử dụng `upsert` để có thể chạy lại nhiều lần không bị lỗi trùng lặp dữ liệu.
