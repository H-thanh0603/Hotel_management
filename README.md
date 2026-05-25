# HotelFlow - He thong quan li khach san

## Gioi thieu
HotelFlow la he thong quan li khach san web-based, ho tro toan bo quy trinh:
**Dat phong → Nhan phong → Su dung dich vu → Tra phong → Thanh toan → Thong ke**

## Tinh nang chinh
- Dang nhap phan quyen (Admin, Le tan, Buong phong, Khach hang)
- Quan li phong & loai phong (so do theo tang)
- Dat phong online + tai quay
- Check-in / Check-out
- Quan li dich vu khach san
- Hoa don & thanh toan
- Quan li don phong (Housekeeping)
- Dashboard thong ke

## Tech Stack
- **Frontend:** Next.js 16, TypeScript, TailwindCSS
- **Backend:** Next.js API Routes
- **Database:** SQLite + Prisma ORM
- **Auth:** NextAuth.js (JWT)

## Cai dat

```bash
# Clone repo
git clone https://github.com/H-thanh0603/Hotel_management.git
cd Hotel_management

# Cai dat dependencies
npm install

# Tao database & seed data
npx prisma db push
npx tsx prisma/seed.ts

# Chay dev server
npm run dev
```

## Tai khoan demo
| Role | Email | Mat khau |
|------|-------|----------|
| Admin | admin@hotelflow.com | 123456 |
| Le tan | letan@hotelflow.com | 123456 |
| Buong phong | buongphong@hotelflow.com | 123456 |
| Khach hang | khach@hotelflow.com | 123456 |

## Cau truc thu muc
```
src/
├── app/
│   ├── (auth)/login/        # Trang dang nhap
│   ├── (dashboard)/         # Dashboard pages
│   │   ├── dashboard/       # Tong quan
│   │   ├── rooms/           # Quan li phong
│   │   ├── room-types/      # Loai phong
│   │   ├── bookings/        # Dat phong
│   │   ├── customers/       # Khach hang
│   │   ├── services/        # Dich vu
│   │   ├── invoices/        # Hoa don
│   │   ├── housekeeping/    # Don phong
│   │   └── users/           # Nhan vien
│   └── api/                 # API Routes
├── components/
│   ├── ui/                  # UI components
│   └── layout/              # Layout components
├── lib/                     # Prisma, Auth config
└── types/                   # TypeScript types
```
