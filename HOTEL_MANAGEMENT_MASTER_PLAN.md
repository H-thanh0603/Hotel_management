# HOTEL MANAGEMENT SYSTEM — MASTER PLAN & AI IMPLEMENTATION SPECIFICATION

> Tài liệu này là nguồn yêu cầu chính để AI Coding tiếp tục phát triển dự án hệ thống quản lý khách sạn hiện có.
> Mục tiêu không phải viết lại toàn bộ dự án, mà là **đánh giá code hiện tại, sửa lỗi nghiệp vụ quan trọng, hoàn thiện back-office và phát triển website đặt phòng dành cho khách**.

---

## 1. Bối cảnh dự án

Dự án hiện đã có một phần nền tảng:

- Đăng nhập và phân quyền theo role.
- API guard.
- Validation cho một số API tạo mới.
- Audit log phía backend.
- CRUD API cho một số tài nguyên.
- Luồng booking, check-in, check-out cơ bản.
- TypeScript build sạch tại thời điểm đánh giá.

Tuy nhiên, hệ thống hiện thiên về phần mềm quản trị nội bộ. Role `CUSTOMER` đang bị đưa vào cùng dashboard nghiệp vụ với nhân viên, nên trải nghiệm khách hàng chưa giống một website khách sạn thực tế.

Dự án sau khi hoàn thiện phải gồm ba khu vực độc lập nhưng dùng chung dữ liệu:

| Khu vực | Người dùng | Mục tiêu |
|---|---|---|
| Website công khai | Khách chưa đăng nhập và khách hàng | Xem khách sạn, tìm phòng, kiểm tra phòng trống, đặt phòng |
| Tài khoản khách | CUSTOMER | Quản lý hồ sơ, booking, hóa đơn, yêu cầu cá nhân |
| Back-office | ADMIN, RECEPTIONIST, HOUSEKEEPING | Vận hành khách sạn |

---

## 2. Mục tiêu tổng thể

Xây dựng một hệ thống khách sạn đủ hoàn chỉnh để:

1. Có thể demo như một sản phẩm thực tế, không chỉ là CRUD.
2. Phân tách rõ website khách hàng và hệ thống quản trị.
3. Tránh overbooking và sai lệch trạng thái phòng.
4. Có quy trình booking, xác nhận, check-in, sử dụng dịch vụ, thanh toán, check-out và dọn phòng nhất quán.
5. Có giao diện hiện đại, responsive, dễ dùng trên điện thoại.
6. Có dữ liệu mẫu đẹp để thuyết trình đồ án.
7. Có test cho các luồng nghiệp vụ trọng yếu.
8. Có thể triển khai lên môi trường production/demo online.

---

## 3. Nguyên tắc bắt buộc dành cho AI Coding

AI phải tuân thủ các nguyên tắc sau trong toàn bộ quá trình triển khai.

### 3.1. Không viết lại dự án khi chưa cần thiết

- Trước mỗi giai đoạn, phải đọc cấu trúc repository, schema database, auth, middleware, API routes và các component hiện có.
- Tận dụng code đang hoạt động.
- Chỉ refactor phần cần thiết để sửa lỗi, tăng khả năng bảo trì hoặc đáp ứng yêu cầu.
- Không đổi framework, ORM hoặc auth library nếu không có lý do kỹ thuật rõ ràng.

### 3.2. Backend phải là nghiệp vụ thật

Không được tạo giao diện “giả hoàn chỉnh” nhưng dữ liệu hard-code hoặc hành động không gọi API.

Mọi chức năng phải có đầy đủ:

- UI.
- API hoặc server action.
- Validation.
- Phân quyền.
- Xử lý lỗi.
- Trạng thái loading.
- Thông báo thành công/thất bại.
- Cập nhật database thật.

### 3.3. Ưu tiên sửa tính đúng đắn trước thẩm mỹ

Thứ tự bắt buộc:

1. Authorization và route guard.
2. Booking availability và chống trùng phòng.
3. Transaction cho các state transition.
4. Validation và database constraint.
5. CRUD UI back-office.
6. Website khách hàng.
7. Báo cáo, tối ưu và tính năng nâng cao.

### 3.4. Không tự suy đoán cấu trúc code

Nếu tên model, field hoặc route hiện tại khác tài liệu này, AI phải:

1. Đọc implementation hiện tại.
2. Lập bảng mapping giữa cấu trúc cũ và yêu cầu mới.
3. Chọn phương án migration ít phá vỡ nhất.
4. Cập nhật tài liệu hoặc ghi chú implementation.

### 3.5. Mỗi giai đoạn phải kết thúc bằng kiểm tra

Tối thiểu chạy:

```bash
npm run lint
npm run typecheck
npm run build
npm test
```

Nếu project dùng `pnpm` hoặc script khác thì dùng script tương ứng trong `package.json`.

Không được tuyên bố hoàn thành khi build hoặc test còn lỗi.

---

## 4. Phạm vi sản phẩm

### 4.1. Vai trò người dùng

#### ADMIN

Có toàn quyền:

- Quản lý tài khoản nhân viên.
- Quản lý phòng và hạng phòng.
- Quản lý khách hàng.
- Quản lý booking.
- Quản lý dịch vụ.
- Quản lý hóa đơn và thanh toán.
- Quản lý khuyến mãi.
- Xem báo cáo.
- Xem audit log.
- Cấu hình khách sạn.

#### RECEPTIONIST

- Tìm và tạo booking.
- Xác nhận booking.
- Gán hoặc đổi phòng hợp lệ.
- Check-in/check-out.
- Quản lý hồ sơ khách.
- Thêm dịch vụ vào booking.
- Lập hóa đơn và nhận thanh toán.
- Không được quản lý role admin hoặc cấu hình nhạy cảm.

#### HOUSEKEEPING

- Xem danh sách phòng cần dọn.
- Xem task được giao.
- Chuyển task qua các trạng thái.
- Báo phòng đã sạch, có sự cố hoặc cần bảo trì.
- Không được xem dữ liệu tài chính hoặc PII không cần thiết.

#### CUSTOMER

- Đăng ký/đăng nhập.
- Xem và cập nhật hồ sơ cá nhân.
- Tìm phòng còn trống.
- Đặt phòng.
- Xem booking của chính mình.
- Hủy booking của chính mình khi còn đủ điều kiện.
- Xem hóa đơn và trạng thái thanh toán của chính mình.
- Gửi yêu cầu đặc biệt.
- Không được truy cập back-office.

#### GUEST — chưa đăng nhập

- Xem trang công khai.
- Tìm phòng.
- Xem chi tiết hạng phòng.
- Bắt đầu luồng đặt phòng.
- Được yêu cầu đăng nhập/đăng ký đúng thời điểm cần xác nhận booking, hoặc sử dụng guest checkout nếu dự án chọn hỗ trợ.

---

## 5. Kiến trúc điều hướng

### 5.1. Website công khai

```text
/                         Trang chủ
/phong                    Danh sách hạng phòng
/phong/[slug]             Chi tiết hạng phòng
/dat-phong                Luồng đặt phòng
/dat-phong/xac-nhan       Kết quả/xác nhận booking
/uu-dai                   Danh sách ưu đãi
/dich-vu                  Dịch vụ khách sạn
/gioi-thieu               Giới thiệu khách sạn
/lien-he                  Liên hệ
/chinh-sach               Chính sách nhận/trả phòng, hủy, thanh toán
/dang-nhap                Đăng nhập
/dang-ky                  Đăng ký
```

### 5.2. Khu tài khoản khách

```text
/tai-khoan
/tai-khoan/dat-phong
/tai-khoan/dat-phong/[id]
/tai-khoan/ho-so
/tai-khoan/hoa-don
/tai-khoan/hoa-don/[id]
/tai-khoan/doi-mat-khau
```

### 5.3. Back-office

```text
/dashboard
/dashboard/bookings
/dashboard/bookings/[id]
/dashboard/rooms
/dashboard/room-types
/dashboard/customers
/dashboard/users
/dashboard/services
/dashboard/invoices
/dashboard/payments
/dashboard/housekeeping
/dashboard/promotions
/dashboard/reports
/dashboard/audit-logs
/dashboard/settings
```

Có thể giữ route cũ để tránh phá code, nhưng kiến trúc layout và guard phải tách rõ.

### 5.4. Điều hướng sau đăng nhập

- `ADMIN`, `RECEPTIONIST`, `HOUSEKEEPING` → `/dashboard` hoặc trang nghiệp vụ phù hợp.
- `CUSTOMER` → URL đang đặt phòng trước đó; nếu không có thì `/tai-khoan`.
- Không redirect `/` thẳng sang `/dashboard`.
- `/` luôn là trang công khai.

---

## 6. Các lỗi ưu tiên P0 phải sửa trước

### P0.1. Tách dashboard nhân viên và tài khoản khách

Hiện trạng cần loại bỏ:

- Customer vào `/dashboard`.
- Customer gọi API dashboard dành cho staff và nhận 403.
- Housekeeping gọi dashboard không đúng quyền.

Yêu cầu:

- Layout back-office chỉ cho role phù hợp.
- Customer truy cập `/dashboard` phải được redirect về `/tai-khoan` hoặc trang 403 thân thiện.
- API dashboard phải trả đúng dữ liệu theo role, hoặc tách dashboard API theo role.
- Sidebar không phải lớp bảo mật; middleware/server guard mới là lớp bảo mật.

### P0.2. API hủy booking cho khách

Tạo endpoint riêng:

```text
POST /api/customer/bookings/[id]/cancel
```

Điều kiện:

- Người dùng đã đăng nhập và có role `CUSTOMER`.
- Booking thuộc chính customer hiện tại.
- Booking ở trạng thái cho phép hủy.
- Chưa check-in.
- Chưa qua thời hạn hủy theo chính sách.
- Ghi lý do hủy và người thực hiện.
- Thực hiện transaction khi giải phóng reservation/room assignment.
- Ghi audit log.

Response lỗi phải rõ ràng:

- `401` chưa đăng nhập.
- `403` không phải chủ booking.
- `404` không tồn tại.
- `409` trạng thái không cho phép hủy.
- `422` vi phạm chính sách hủy.

### P0.3. Availability thật và chống overbooking

Tạo service nghiệp vụ dùng chung, ví dụ:

```text
availabilityService.search()
availabilityService.assertAvailable()
bookingService.confirmAndAssignRoom()
```

Endpoint:

```text
POST /api/public/availability
```

Input tối thiểu:

```json
{
  "checkInDate": "2026-08-10",
  "checkOutDate": "2026-08-12",
  "adults": 2,
  "children": 0,
  "roomTypeId": "optional"
}
```

Quy tắc:

- `checkOutDate > checkInDate`.
- Sức chứa hạng phòng đủ cho tổng số khách.
- Phòng không bị bảo trì hoặc inactive.
- Phòng không có booking giao nhau trong các trạng thái giữ chỗ.

Hai khoảng ngày bị xem là giao nhau khi:

```text
existing.checkIn < requested.checkOut
AND
existing.checkOut > requested.checkIn
```

Booking bị hủy hoặc no-show đã đóng không được giữ phòng.

Khi xác nhận booking/gán phòng:

- Phải kiểm tra lại availability trong transaction.
- Không tin kết quả tìm kiếm trước đó vì có thể đã thay đổi.
- Có cơ chế unique/constraint hoặc khóa phù hợp với database production để giảm race condition.

### P0.4. Chuẩn hóa state machine

Không cập nhật trạng thái tùy ý từ request.

#### Booking status đề xuất

```text
PENDING
CONFIRMED
CHECKED_IN
CHECKED_OUT
CANCELLED
NO_SHOW
```

Transition hợp lệ:

| Từ | Sang | Người thực hiện |
|---|---|---|
| PENDING | CONFIRMED | ADMIN/RECEPTIONIST hoặc payment workflow |
| PENDING | CANCELLED | CUSTOMER/ADMIN/RECEPTIONIST |
| CONFIRMED | CHECKED_IN | ADMIN/RECEPTIONIST |
| CONFIRMED | CANCELLED | CUSTOMER/ADMIN/RECEPTIONIST theo policy |
| CONFIRMED | NO_SHOW | ADMIN/RECEPTIONIST |
| CHECKED_IN | CHECKED_OUT | ADMIN/RECEPTIONIST |

Không cho phép:

- `CHECKED_OUT → CHECKED_IN`.
- `CANCELLED → CONFIRMED` nếu không có quy trình restore riêng.
- Hủy booking đã check-in.

#### Room operational status đề xuất

```text
AVAILABLE
OCCUPIED
DIRTY
CLEANING
MAINTENANCE
INACTIVE
```

Lưu ý quan trọng:

- Booking trong tương lai không nhất thiết phải đổi `Room.status` thành `RESERVED` nếu trạng thái phòng đại diện cho tình trạng vận hành hiện tại.
- Availability theo ngày phải dựa trên booking intervals, không chỉ dựa vào `Room.status`.

#### Housekeeping task status

```text
PENDING
ASSIGNED
IN_PROGRESS
COMPLETED
CANCELLED
```

### P0.5. Transaction cho các luồng trọng yếu

Các hành động sau phải chạy trong transaction:

- Confirm booking và assign room.
- Check-in và cập nhật room status.
- Check-out, cập nhật room thành DIRTY và tạo housekeeping task.
- Ghi payment và cập nhật paid amount/invoice status.
- Cancel booking và giải phóng assignment nếu hợp lệ.

Không được cập nhật từng bảng rời rạc khiến hệ thống ở trạng thái nửa hoàn tất.

### P0.6. Route-level guard và fetch helper

Tạo cơ chế guard dùng chung:

```text
requireAuth()
requireRole([...roles])
requireOwnershipOrRole()
```

Tạo fetch/API client chuẩn hóa:

- Kiểm tra `response.ok`.
- Parse error có kiểm soát.
- Không gán object lỗi vào state array.
- Có type cho response.
- Có timeout hoặc abort khi phù hợp.
- UI hiển thị lỗi thay vì crash.

Mọi list page phải khởi tạo array an toàn và kiểm tra shape của payload.

### P0.7. CRUD UI hoàn chỉnh

Các module đã có API PATCH/DELETE phải có giao diện tương ứng:

- Users.
- Rooms.
- Room Types.
- Customers.
- Services.

Mỗi module cần:

- Danh sách.
- Search/filter.
- Tạo mới.
- Xem chi tiết.
- Sửa.
- Archive/khóa thay vì xóa cứng khi đã có quan hệ.
- Modal xác nhận.
- Toast thành công/thất bại.
- Empty state.
- Loading skeleton.
- Pagination nếu dữ liệu có thể lớn.

---

## 7. Thiết kế dữ liệu đề xuất

AI phải đối chiếu schema hiện tại trước khi migration.

### 7.1. Nguyên tắc dữ liệu

- Tiền VND dùng `Int` theo đơn vị đồng hoặc `Decimal`, không dùng `Float`.
- Các trạng thái quan trọng dùng enum.
- Dùng `createdAt`, `updatedAt` đồng nhất.
- Dữ liệu có lịch sử giao dịch ưu tiên archive/soft delete.
- Hóa đơn đã phát hành và payment không xóa cứng.
- Mọi quan hệ cần khai báo `onDelete` rõ ràng.

### 7.2. Các model cốt lõi

Tối thiểu nên có:

```text
User
CustomerProfile
RoomType
Room
Booking
BookingGuest
RoomAssignment hoặc quan hệ booking-room phù hợp
Service
BookingService
Invoice
InvoiceItem
Payment
Refund hoặc PaymentAdjustment
HousekeepingTask
Promotion
HotelSetting
AuditLog
```

### 7.3. RoomType

Field gợi ý:

```prisma
model RoomType {
  id            String   @id @default(cuid())
  name          String   @unique
  slug          String   @unique
  shortDescription String?
  description   String?
  basePrice     Int
  maxAdults     Int
  maxChildren   Int      @default(0)
  sizeSqm       Int?
  bedType       String?
  amenities     Json?
  images        Json?
  featured      Boolean  @default(false)
  displayOrder  Int      @default(0)
  status        EntityStatus @default(ACTIVE)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### 7.4. Room

```prisma
model Room {
  id                String @id @default(cuid())
  roomNumber        String @unique
  floor             Int?
  roomTypeId        String
  operationalStatus RoomOperationalStatus @default(AVAILABLE)
  note              String?
  status            EntityStatus @default(ACTIVE)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

### 7.5. Booking

Booking phải lưu snapshot giá tại thời điểm đặt, không chỉ đọc giá hiện tại của room type.

Field gợi ý:

```text
bookingCode
customerId
roomTypeId
assignedRoomId nullable
checkInDate
checkOutDate
adults
children
status
nightlyRateSnapshot
discountAmount
taxAmount
surchargeAmount
totalAmount
depositAmount
specialRequests
cancellationReason
cancelledAt
cancelledByUserId
confirmedAt
checkedInAt
checkedOutAt
createdByUserId
createdAt
updatedAt
```

### 7.6. Invoice và Payment

Yêu cầu:

- `Invoice.bookingId` unique nếu mỗi booking chỉ có một hóa đơn chính.
- Có invoice items để lưu tiền phòng, dịch vụ, phụ thu, giảm giá, thuế.
- `paidAmount` có thể được tính từ payment hợp lệ hoặc cập nhật transactionally.
- Payment có mã giao dịch, phương thức, trạng thái, số tiền, người thu.
- Không cho tổng payment thành công vượt số tiền cần thanh toán.
- Có `VOIDED`, `REFUNDED`, `PARTIALLY_REFUNDED` nếu phát triển nâng cao.

### 7.7. HotelSetting

```text
hotelName
logoUrl
heroImageUrl
address
phone
email
description
checkInTime
checkOutTime
cancellationPolicy
mapEmbedUrl
socialLinks
```

### 7.8. Promotion

```text
code
title
description
discountType: PERCENT | FIXED
discountValue
minBookingAmount
maxDiscountAmount
startAt
endAt
usageLimit
usedCount
active
applicableRoomTypeIds hoặc bảng quan hệ
```

### 7.9. Soft delete

Không dùng DELETE vật lý cho entity đã phát sinh quan hệ.

Dùng một trong các cách:

```text
status = ACTIVE | INACTIVE | ARCHIVED
```

hoặc:

```text
deletedAt nullable
```

API DELETE có thể được giữ về mặt route nhưng hành vi thực tế là archive, đồng thời trả thông báo rõ ràng.

---

## 8. Danh sách API mục tiêu

Tên route có thể điều chỉnh theo code hiện tại nhưng phải giữ ranh giới public/customer/staff.

### 8.1. Public API

```text
GET  /api/public/hotel
GET  /api/public/room-types
GET  /api/public/room-types/[slug]
POST /api/public/availability
GET  /api/public/promotions
GET  /api/public/services
```

Không trả dữ liệu nội bộ như số phòng cụ thể, trạng thái dọn phòng, ghi chú vận hành hoặc thông tin khách khác.

### 8.2. Customer API

```text
POST  /api/customer/bookings
GET   /api/customer/bookings
GET   /api/customer/bookings/[id]
POST  /api/customer/bookings/[id]/cancel
GET   /api/customer/profile
PATCH /api/customer/profile
GET   /api/customer/invoices
GET   /api/customer/invoices/[id]
```

Mọi query phải filter theo customer hiện tại ở server, không nhận `customerId` tùy ý từ client.

### 8.3. Staff API

```text
GET/POST       /api/admin/room-types
GET/PATCH      /api/admin/room-types/[id]
GET/POST       /api/admin/rooms
GET/PATCH      /api/admin/rooms/[id]
GET/POST       /api/admin/bookings
GET/PATCH      /api/admin/bookings/[id]
POST           /api/admin/bookings/[id]/confirm
POST           /api/admin/bookings/[id]/check-in
POST           /api/admin/bookings/[id]/check-out
POST           /api/admin/bookings/[id]/cancel
GET/POST       /api/admin/customers
GET/PATCH      /api/admin/customers/[id]
GET/POST       /api/admin/services
GET/PATCH      /api/admin/services/[id]
GET/POST       /api/admin/invoices
GET            /api/admin/invoices/[id]
POST           /api/admin/invoices/[id]/payments
POST           /api/admin/payments/[id]/void
GET/POST       /api/admin/housekeeping
PATCH          /api/admin/housekeeping/[id]
GET            /api/admin/reports/*
GET            /api/admin/audit-logs
GET/PATCH      /api/admin/settings
```

Nếu giữ `/api/...` hiện tại, vẫn phải áp dụng phân quyền và DTO tương đương.

### 8.4. Response format

List API:

```json
{
  "items": [],
  "total": 0,
  "page": 1,
  "pageSize": 20,
  "totalPages": 0
}
```

Error format:

```json
{
  "error": {
    "code": "BOOKING_NOT_CANCELLABLE",
    "message": "Booking này không còn đủ điều kiện hủy.",
    "details": null
  }
}
```

---

## 9. Website công khai

### 9.1. Trang chủ

Cấu trúc đề xuất:

1. Header trong suốt hoặc nền sáng, sticky.
2. Hero lớn có hình khách sạn.
3. Form tìm phòng nổi bật.
4. Hạng phòng nổi bật.
5. Lý do chọn khách sạn.
6. Tiện nghi/dịch vụ.
7. Ưu đãi hiện hành.
8. Trải nghiệm hoặc testimonial.
9. Gallery.
10. Vị trí và liên hệ.
11. Footer đầy đủ.

Yêu cầu UX:

- CTA “Đặt phòng ngay” rõ ràng.
- Form ngày tháng dễ dùng trên mobile.
- Không bắt đăng nhập trước khi khách được xem phòng.
- Hiển thị giá theo định dạng VND.
- Không hard-code nội dung quan trọng nếu đã có HotelSetting/API.

### 9.2. Danh sách hạng phòng

Mỗi card:

- Ảnh.
- Tên hạng phòng.
- Diện tích.
- Loại giường.
- Sức chứa.
- Tiện nghi nổi bật.
- Giá từ.
- Trạng thái còn phòng theo ngày tìm kiếm.
- Nút xem chi tiết và đặt ngay.

Filter:

- Ngày nhận/trả.
- Số khách.
- Khoảng giá.
- Loại giường.
- Tiện nghi.

### 9.3. Chi tiết hạng phòng

- Gallery responsive.
- Mô tả đầy đủ.
- Sức chứa.
- Tiện nghi.
- Chính sách.
- Giá.
- Form tìm phòng sticky trên desktop.
- Tổng tiền dự kiến.
- Hạng phòng liên quan.

Không hiển thị số phòng vật lý cho khách ở bước catalog.

### 9.4. Luồng đặt phòng nhiều bước

#### Bước 1 — Tìm kiếm

- Check-in.
- Check-out.
- Người lớn.
- Trẻ em.
- Validate ngày.

#### Bước 2 — Chọn hạng phòng

- Gọi availability thật.
- Hiển thị số lượng còn lại nếu phù hợp.
- Không cho chọn loại đã hết.

#### Bước 3 — Thông tin khách

- Họ tên.
- Email.
- Số điện thoại.
- Thông tin giấy tờ chỉ hỏi khi cần thiết.
- Ghi chú/yêu cầu đặc biệt.

#### Bước 4 — Xác nhận

- Tóm tắt ngày.
- Số đêm.
- Hạng phòng.
- Giá phòng.
- Phụ thu/giảm giá/thuế.
- Tổng tiền.
- Tiền cọc.
- Chính sách hủy.
- Checkbox đồng ý điều khoản.

#### Kết quả

- Booking code.
- Trạng thái.
- Hướng dẫn tiếp theo.
- Link về tài khoản khách.
- Email xác nhận ở giai đoạn nâng cao.

### 9.5. Chính sách giá

Một phiên bản MVP có thể dùng:

```text
roomSubtotal = nightlyRate × numberOfNights
serviceSubtotal = tổng dịch vụ
discount = theo voucher hợp lệ
tax = policy do server tính
total = roomSubtotal + serviceSubtotal + surcharge + tax - discount
```

Toàn bộ phép tính cuối cùng phải chạy trên server. Client chỉ hiển thị estimate.

---

## 10. Khu tài khoản khách

### 10.1. Tổng quan

- Lời chào.
- Booking sắp tới.
- Trạng thái thanh toán.
- CTA xem chi tiết hoặc đặt phòng mới.
- Lịch sử gần đây.

### 10.2. Booking của tôi

Tabs/filter:

```text
Sắp tới
Đang lưu trú
Đã hoàn thành
Đã hủy
```

Mỗi booking hiển thị:

- Booking code.
- Ảnh và tên hạng phòng.
- Ngày nhận/trả.
- Tổng tiền.
- Trạng thái.
- Nút xem chi tiết.
- Nút hủy chỉ khi server xác nhận còn hợp lệ.

### 10.3. Chi tiết booking

- Timeline trạng thái.
- Thông tin người đặt.
- Hạng phòng/phòng được gán nếu phù hợp.
- Dịch vụ đã dùng.
- Hóa đơn.
- Chính sách hủy.
- Yêu cầu đặc biệt.

### 10.4. Hồ sơ

- Họ tên.
- Email.
- Số điện thoại.
- Ngày sinh tùy chọn.
- Địa chỉ tùy chọn.
- CCCD/hộ chiếu phải masking ở UI.
- Đổi mật khẩu hoặc auth action tương ứng.

---

## 11. Back-office

### 11.1. Dashboard

Dashboard theo role, không hiển thị dữ liệu không liên quan.

#### ADMIN/RECEPTIONIST

KPI:

- Khách đang lưu trú.
- Booking hôm nay.
- Check-in hôm nay.
- Check-out hôm nay.
- Công suất phòng.
- Doanh thu hôm nay/tháng.
- Công nợ chưa thanh toán.

Widget:

- Booking mới nhất.
- Lịch nhận/trả phòng.
- Trạng thái phòng.
- Cảnh báo phòng bảo trì.
- Housekeeping chưa hoàn thành.

#### HOUSEKEEPING

- Task hôm nay.
- Task được giao.
- Phòng dirty.
- Phòng đang cleaning.
- Task quá hạn.

### 11.2. Quản lý booking

Danh sách có:

- Search booking code, tên, phone.
- Filter trạng thái, ngày, nguồn booking, hạng phòng.
- Sort.
- Pagination.
- Badge trạng thái.

Trang chi tiết:

- Thông tin booking.
- Thông tin khách.
- Lịch sử trạng thái.
- Room assignment.
- Dịch vụ.
- Invoice/payment.
- Audit trail.
- Các action hợp lệ theo state machine.

### 11.3. Quản lý phòng

Có hai góc nhìn:

1. Danh sách CRUD.
2. Room board trực quan theo tầng/trạng thái.

Action:

- Chuyển bảo trì.
- Kết thúc bảo trì.
- Đánh dấu dirty/available theo quyền.
- Xem booking hiện tại/sắp tới.

Không cho đổi room thành AVAILABLE tùy ý nếu đang có khách lưu trú.

### 11.4. Hạng phòng

- CRUD đầy đủ.
- Upload nhiều ảnh.
- Sắp xếp ảnh.
- Tiện nghi.
- Giá cơ bản.
- Sức chứa.
- Featured/display order.
- Preview trang public.

### 11.5. Customer CRM nhẹ

- Danh sách khách.
- Lịch sử booking.
- Tổng chi tiêu.
- Ghi chú nội bộ có phân quyền.
- Masking giấy tờ.
- Archive thay vì xóa nếu đã có booking.

### 11.6. Dịch vụ

Ví dụ:

- Ăn sáng.
- Giặt ủi.
- Spa.
- Đưa đón sân bay.
- Minibar.

Field:

- Tên.
- Đơn vị tính.
- Giá.
- Trạng thái.
- Mô tả.

### 11.7. Housekeeping

Task được sinh tự động khi checkout.

Thông tin task:

- Room.
- Loại công việc.
- Priority.
- Người được giao.
- Trạng thái.
- Ghi chú.
- Thời gian bắt đầu/hoàn thành.
- Ảnh sự cố tùy chọn.

Khi task hoàn thành:

- Chỉ chuyển room về AVAILABLE nếu không còn lý do maintenance và room không đang occupied.

### 11.8. Invoice và payment

- Một invoice chính cho mỗi booking theo thiết kế MVP.
- Invoice item rõ ràng.
- Thanh toán một phần/nhiều lần.
- Phương thức: CASH, BANK_TRANSFER, CARD, VNPAY, MOMO tùy phạm vi.
- Receipt hoặc mã tham chiếu.
- Không cho over-payment.
- Void/refund phải có lý do và audit log.

### 11.9. Audit log UI

Chỉ ADMIN hoặc role được cấp quyền.

Filter:

- Người thực hiện.
- Action.
- Entity type.
- Khoảng ngày.
- IP nếu có.

Hiển thị:

- Thời gian.
- Actor.
- Hành động.
- Đối tượng.
- Tóm tắt thay đổi.
- Chi tiết before/after có masking dữ liệu nhạy cảm.

---

## 12. Validation và quy tắc nghiệp vụ

Dùng Zod hoặc thư viện validation hiện có cho cả create và update.

Tạo schema riêng:

```text
roomCreateSchema
roomUpdateSchema
roomTypeCreateSchema
roomTypeUpdateSchema
customerCreateSchema
customerUpdateSchema
serviceCreateSchema
serviceUpdateSchema
userCreateSchema
userUpdateSchema
bookingCreateSchema
bookingUpdateSchema
checkInSchema
checkOutSchema
paymentCreateSchema
promotionSchema
```

PATCH schema phải hỗ trợ partial nhưng không được nhận field tùy ý.

Quy tắc tối thiểu:

- Giá không âm.
- Sức chứa > 0.
- Email đúng format.
- Phone được normalize.
- Role nằm trong enum cho phép.
- Staff không được tự nâng role thành ADMIN nếu không có quyền.
- Date range hợp lệ.
- Payment amount > 0.
- Discount trong giới hạn policy.
- Không cho gửi `customerId`, `paidAmount`, `totalAmount` tùy ý từ customer client.

---

## 13. Bảo mật và quyền riêng tư

### 13.1. Authorization

- Kiểm tra quyền ở server cho mọi endpoint.
- Không dựa vào việc ẩn button.
- Customer chỉ truy cập resource thuộc chính mình.
- Housekeeping chỉ thấy dữ liệu cần cho công việc.

### 13.2. PII

PII gồm:

- CCCD/hộ chiếu.
- Địa chỉ.
- Phone.
- Email.

Yêu cầu:

- Masking ở list và audit log.
- Hạn chế field theo role bằng DTO/select.
- Không log raw request chứa giấy tờ hoặc password.
- Không commit database production.
- Có retention policy trong tài liệu triển khai thật.

### 13.3. Authentication

- Password hash đúng chuẩn library hiện tại.
- Session/cookie secure khi production.
- CSRF protection nếu kiến trúc cần.
- Không tiết lộ email tồn tại hay không trong lỗi đăng nhập/reset password nếu cần bảo mật cao.

### 13.4. Rate limiting

- Development có thể dùng memory.
- Production dùng Redis/Upstash hoặc gateway tương đương.
- Trả `429 Too Many Requests`.
- Có retry information.
- Áp dụng cho login, register, availability và endpoint nhạy cảm.

### 13.5. Secrets

- Không hard-code secret.
- Có `.env.example` không chứa giá trị thật.
- Production bắt buộc secret mạnh.
- Validate env khi startup.

---

## 14. UX/UI Design System

Mục tiêu: hiện đại, cao cấp, sạch, dễ sử dụng; không sao chép giao diện admin template cũ kỹ.

### 14.1. Website khách

Phong cách:

- Hình ảnh lớn.
- Nhiều khoảng trắng.
- Typography rõ cấp bậc.
- Card phòng tinh tế.
- Màu thương hiệu nhất quán.
- Chuyển động nhẹ, không lạm dụng animation.

### 14.2. Back-office

- Sidebar thu gọn được.
- Header có breadcrumb, quick action, user menu.
- Table dễ đọc.
- Filter bar rõ ràng.
- Modal/drawer cho action ngắn.
- Detail page cho nghiệp vụ phức tạp.

### 14.3. Trạng thái UI bắt buộc

Mỗi trang phải có:

- Loading/skeleton.
- Empty state.
- Error state.
- Success feedback.
- Disabled state.
- Permission denied state.
- Responsive state.

### 14.4. Accessibility

- Label cho input.
- Keyboard navigation.
- Focus visible.
- Contrast đủ tốt.
- Button/icon có aria-label khi cần.
- Không chỉ dùng màu để biểu thị trạng thái.

---

## 15. Báo cáo và KPI

Giai đoạn hoàn thiện cần có:

### 15.1. Doanh thu

- Doanh thu theo ngày/tháng.
- Doanh thu phòng.
- Doanh thu dịch vụ.
- Payment theo phương thức.
- Công nợ.

### 15.2. Vận hành khách sạn

- Occupancy Rate.
- ADR — Average Daily Rate.
- RevPAR — Revenue per Available Room.
- Booking cancellation rate.
- Average length of stay.
- Số check-in/check-out.

Công thức phải được ghi chú trong code/report.

Ví dụ:

```text
Occupancy Rate = Room nights sold / Room nights available × 100%
ADR = Room revenue / Room nights sold
RevPAR = Room revenue / Room nights available
```

Không dùng dữ liệu demo hard-code trong chart.

---

## 16. Testing strategy

### 16.1. Unit tests

- Date overlap.
- Tính số đêm.
- Tính giá.
- Promotion validation.
- Booking state transition.
- Invoice balance.
- Cancellation eligibility.

### 16.2. Integration/API tests

Bắt buộc:

- 401 khi chưa có session.
- 403 khi sai role.
- Customer không đọc booking người khác.
- Customer không hủy booking người khác.
- Booking trùng phòng bị từ chối.
- Confirm race condition được xử lý an toàn nhất có thể.
- Check-in sai trạng thái bị từ chối.
- Check-in room sai room type bị từ chối.
- Check-out tạo housekeeping task.
- Payment vượt balance bị từ chối.
- Không tạo hai invoice chính cho một booking.

### 16.3. E2E tests

Luồng quan trọng:

1. Guest tìm phòng → đăng ký → đặt phòng.
2. Lễ tân xác nhận → check-in.
3. Thêm dịch vụ → thanh toán → check-out.
4. Housekeeping hoàn thành task → phòng available.
5. Customer đăng nhập → xem booking/hóa đơn.
6. Customer hủy booking đúng policy.

### 16.4. Test data

Seed phải idempotent bằng `upsert` hoặc cơ chế reset có chủ đích.

Seed nên tạo:

- 1 admin.
- 2 receptionist.
- 2 housekeeping.
- 5–10 customer.
- 4–6 room type.
- 20–40 room.
- Booking ở nhiều trạng thái.
- Dịch vụ.
- Invoice/payment mẫu.
- Housekeeping task.
- Promotion.
- Hotel setting và ảnh mẫu.

---

## 17. Performance và kỹ thuật

### 17.1. Pagination

Các list lớn phải có pagination server-side:

- Bookings.
- Customers.
- Invoices.
- Payments.
- Audit logs.
- Users.

### 17.2. Query

- Dùng select chỉ lấy field cần thiết.
- Tránh N+1.
- Index các field thường tìm/filter.

Index gợi ý:

```text
Booking(status, checkInDate, checkOutDate)
Booking(customerId, createdAt)
Room(roomTypeId, operationalStatus)
Payment(invoiceId, status)
AuditLog(createdAt, actorId, entityType)
```

### 17.3. Image storage

Giai đoạn đầu có thể dùng URL mẫu.

Giai đoạn nâng cao dùng:

- Cloudinary.
- S3-compatible storage.
- Supabase Storage nếu phù hợp hệ thống hiện tại.

Không lưu binary ảnh trực tiếp trong database quan hệ.

### 17.4. Database production

- Không dùng SQLite cho triển khai nhiều người dùng.
- Khuyến nghị PostgreSQL.
- Dùng migration, không dùng `prisma db push` làm quy trình production.
- Có backup/restore plan.

---

## 18. Lộ trình triển khai chi tiết

## Giai đoạn 0 — Khảo sát và baseline

### Công việc

- Đọc repository và ghi lại stack.
- Vẽ sơ đồ route hiện tại.
- Liệt kê model/enum hiện tại.
- Liệt kê API và permission hiện tại.
- Chạy lint/typecheck/build/test.
- Ghi nhận lỗi baseline.
- Tạo branch triển khai.

### Deliverables

- `docs/current-state-audit.md`.
- Bảng mapping yêu cầu với code hiện tại.
- Danh sách migration dự kiến.

### Definition of Done

- AI hiểu cấu trúc dự án trước khi sửa.
- Không có thay đổi chức năng lớn ở giai đoạn này.

---

## Giai đoạn 1 — Sửa P0 authorization và stability

### Công việc

- Tách layout public/customer/staff.
- Role redirect sau login.
- Route guard.
- Fetch helper chuẩn.
- Error boundary và error state.
- Customer cancel API.
- Zod schemas cho PATCH.
- Archive/restrict delete.

### Definition of Done

- CUSTOMER không thể mở trang back-office.
- Không còn lỗi `.map is not a function` do API error.
- Nút customer cancel hoạt động hoặc bị disable với lý do đúng.
- CRUD update input được validate.

---

## Giai đoạn 2 — Sửa booking engine và database integrity

### Công việc

- Chuẩn hóa enum.
- Đổi tiền Float sang Int/Decimal bằng migration an toàn.
- Availability service.
- Overlap check.
- Transaction confirm/check-in/check-out/cancel/payment.
- Unique invoice per booking.
- Booking state machine.
- Room operational state.
- Seed idempotent.

### Definition of Done

- Không thể gán cùng phòng cho hai booking giao nhau.
- Check-in kiểm tra room type, room status và date conflict.
- Check-out luôn tạo housekeeping task trong cùng transaction.
- Không thể overpay invoice.
- Test nghiệp vụ trọng yếu pass.

---

## Giai đoạn 3 — Hoàn thiện CRUD back-office

### Công việc

- Users UI.
- Rooms UI và room board.
- Room Types UI.
- Customers UI.
- Services UI.
- Promotions UI.
- Audit log UI.
- Pagination/filter/sort.
- Toast/modal/loading/empty/error state.

### Definition of Done

- Tất cả API CRUD có UI tương ứng.
- Không có nút không hoạt động.
- Archive có confirmation và thông báo nghiệp vụ.
- Table responsive ở mức hợp lý.

---

## Giai đoạn 4 — Website khách MVP

### Công việc

- Public header/footer.
- Landing page.
- Room listing.
- Room detail.
- Availability form.
- Booking multi-step.
- Confirmation page.
- Responsive/mobile navigation.

### Definition of Done

- Guest có thể xem phòng và tìm availability.
- Customer có thể tạo booking thật.
- Giá/tổng tiền do server xác nhận.
- UI không lộ thông tin nội bộ.
- Mobile flow dùng được từ đầu đến cuối.

---

## Giai đoạn 5 — Tài khoản khách

### Công việc

- Overview.
- My bookings.
- Booking detail/timeline.
- Cancel action.
- Profile.
- My invoices.

### Definition of Done

- Customer chỉ thấy dữ liệu của mình.
- Mọi action đều xử lý ownership ở server.
- Hủy booking tuân theo policy.

---

## Giai đoạn 6 — Invoice, payment và housekeeping nâng cao

### Công việc

- Invoice item.
- Partial payment.
- Void/refund cơ bản.
- Payment audit.
- Housekeeping assignment workflow.
- Room maintenance workflow.

### Definition of Done

- Balance luôn chính xác.
- Payment history không bị xóa.
- Checkout và housekeeping liên kết đúng.

---

## Giai đoạn 7 — Báo cáo và tính năng nổi bật

### Công việc

- Revenue dashboard.
- Occupancy/ADR/RevPAR.
- Date range filter.
- Export CSV/Excel nếu cần.
- Audit log detail.
- Promotion/voucher.

### Definition of Done

- KPI được tính từ database thật.
- Có chú thích định nghĩa metric.
- Chart có loading, empty và error state.

---

## Giai đoạn 8 — Production readiness

### Công việc

- PostgreSQL.
- Prisma migration.
- Docker nếu cần.
- Upload ảnh.
- Email xác nhận.
- Payment sandbox tùy phạm vi.
- Redis rate limit.
- Error monitoring.
- SEO public pages.
- Backup/restore docs.
- Dependency audit và upgrade có kiểm soát.

### Definition of Done

- Build production thành công.
- Env được validate.
- Không có secret trong repository.
- Có hướng dẫn deploy và rollback.

---

## 19. Backlog theo độ ưu tiên

### P0 — bắt buộc trước mọi phần mở rộng

- Role guard và redirect.
- Customer cancel ownership API.
- Availability thật.
- Booking overlap protection.
- Transaction state transition.
- PATCH validation.
- Soft delete/restrict delete.
- Money type.
- Invoice/payment constraint.

### P1 — cần cho sản phẩm hoàn chỉnh

- CRUD UI.
- Public website.
- Customer account.
- Pagination/filter.
- Audit log UI.
- Automated tests.
- Seed idempotent.

### P2 — nâng chất lượng

- Promotion.
- Email.
- Image upload.
- Reports.
- Export.
- Payment gateway sandbox.
- SEO/analytics/monitoring.

### P3 — mở rộng tương lai

- Multi-hotel/multi-branch.
- Channel manager/OTA integration.
- Dynamic pricing.
- Loyalty program.
- Mobile app.
- QR room service.
- Smart lock integration.

Không triển khai P3 trong đồ án hiện tại nếu P0/P1 chưa hoàn thành.

---

## 20. Checklist nghiệm thu

### Nghiệp vụ

- [ ] Không overbooking.
- [ ] Booking state transition hợp lệ.
- [ ] Check-in kiểm tra phòng.
- [ ] Check-out tạo housekeeping task.
- [ ] Customer chỉ xem dữ liệu của mình.
- [ ] Payment không vượt invoice balance.
- [ ] Tiền không dùng Float.
- [ ] Dữ liệu lịch sử không xóa cứng tùy tiện.

### Phân quyền

- [ ] Guest chỉ xem public pages.
- [ ] Customer không truy cập back-office.
- [ ] Housekeeping không xem tài chính.
- [ ] Receptionist không quản lý admin trái quyền.
- [ ] API kiểm tra role và ownership.

### UI/UX

- [ ] Public website có header/footer/hero.
- [ ] Có room catalog và room detail.
- [ ] Booking flow hoàn chỉnh.
- [ ] Admin CRUD có create/edit/archive.
- [ ] Có loading/empty/error/success states.
- [ ] Responsive trên mobile/tablet/desktop.
- [ ] Không có button giả hoặc route chết.

### Kỹ thuật

- [ ] Lint pass.
- [ ] Typecheck pass.
- [ ] Build pass.
- [ ] Test pass.
- [ ] Migration chạy được từ database sạch.
- [ ] Seed chạy lại không lỗi.
- [ ] Không hard-code secret.
- [ ] Có `.env.example`.
- [ ] List API có pagination.
- [ ] Dependency critical/high được xử lý hoặc ghi chú.

### Demo đồ án

- [ ] Dữ liệu mẫu đẹp và hợp lý.
- [ ] Có tài khoản demo từng role.
- [ ] Có kịch bản demo end-to-end.
- [ ] Có README hướng dẫn chạy.
- [ ] Có sơ đồ kiến trúc và ERD.
- [ ] Có ảnh screenshot hoặc video demo.

---

## 21. Kịch bản demo đề xuất

1. Mở trang chủ với tư cách guest.
2. Chọn ngày và số khách.
3. Xem hạng phòng còn trống.
4. Đăng ký/đăng nhập customer.
5. Hoàn tất booking.
6. Đăng nhập receptionist.
7. Xác nhận booking và gán phòng.
8. Check-in.
9. Thêm dịch vụ.
10. Tạo invoice và nhận thanh toán.
11. Check-out.
12. Đăng nhập housekeeping và hoàn thành task dọn phòng.
13. Trở lại receptionist xem phòng AVAILABLE.
14. Đăng nhập customer xem lịch sử và hóa đơn.
15. Admin xem báo cáo và audit log.

---

## 22. Cách AI báo cáo tiến độ

Sau mỗi giai đoạn, AI phải trả báo cáo theo mẫu:

```markdown
## Giai đoạn đã thực hiện

### Chức năng hoàn thành
- ...

### Kiểm tra đã chạy
- lint: PASS/FAIL
- typecheck: PASS/FAIL
- test: PASS/FAIL
- build: PASS/FAIL

### Vấn đề còn lại
- ...

### Bước tiếp theo
- ...
``

Không được chỉ trả lời “đã hoàn thành” mà không liệt kê file, test và hạn chế.

---


---

## 24. Kết luận

Định hướng đúng của dự án là một sản phẩm gồm:

- Website đặt phòng dành cho khách.
- Tài khoản self-service dành cho customer.
- Back-office vận hành khách sạn.
- Booking engine có kiểm tra availability thật.
- Luồng tài chính và trạng thái phòng an toàn.

Ưu tiên lớn nhất không phải thêm thật nhiều màn hình, mà là làm cho các luồng cốt lõi **đúng, nhất quán, có phân quyền và có thể kiểm chứng bằng test**. Sau khi nền tảng này ổn định, việc nâng cấp UI, báo cáo và tích hợp dịch vụ bên ngoài mới mang lại giá trị thực tế.
