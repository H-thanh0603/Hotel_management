import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hotel, Phone, MapPin, BedDouble } from "lucide-react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Hotel className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                HotelFlow
              </span>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Luxury Hotel & Suites</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link href="/" className="hover:text-blue-400 transition-colors">Trang chủ</Link>
            <Link href="/phong" className="hover:text-blue-400 transition-colors">Hạng phòng</Link>
            <Link href="/dich-vu" className="hover:text-blue-400 transition-colors">Dịch vụ</Link>
            <Link href="/uu-dai" className="hover:text-blue-400 transition-colors">Ưu đãi</Link>
            <Link href="/gioi-thieu" className="hover:text-blue-400 transition-colors">Giới thiệu</Link>
            <Link href="/lien-he" className="hover:text-blue-400 transition-colors">Liên hệ</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800">
                Tài khoản
              </Button>
            </Link>
            <Link href="/dat-phong">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white gap-2 shadow-lg shadow-blue-500/25">
                <BedDouble className="w-4 h-4" /> Đặt phòng ngay
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Hotel className="w-5 h-5 text-blue-400" />
            <span className="font-semibold text-white">HotelFlow Luxury System</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6 text-xs">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> 123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</span>
            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Hotline: 1900 1234</span>
          </div>
          <p className="text-xs">© 2026 HotelFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
