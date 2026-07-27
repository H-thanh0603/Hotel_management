import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hotel, Calendar, ShieldCheck, Sparkles, ArrowRight, BedDouble, Phone, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Hotel className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                HotelFlow
              </span>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Luxury Hotel & Suites</p>
            </div>
          </div>

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
                Đăng nhập
              </Button>
            </Link>
            <Link href="/dat-phong">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25">
                Đặt phòng ngay
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 via-slate-900/90 to-slate-900 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-30" />
        
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
            <Sparkles className="w-4 h-4" /> Trai nghiệm nghỉ dưỡng đẳng cấp 5 sao
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Khám Phá Không Gian <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
              Sang Trọng & Tinh Tế
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Chào mừng bạn đến với HotelFlow. Nơi hội tụ kiến trúc hiện đại, tiện ích cao cấp và dịch vụ lưu trú hoàn hảo cho mọi hành trình của bạn.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/phong">
              <Button size="lg" className="h-14 px-8 text-base bg-blue-600 hover:bg-blue-500 text-white gap-2 shadow-xl shadow-blue-600/30">
                <BedDouble className="w-5 h-5" /> Xem danh sách phòng
              </Button>
            </Link>
            <Link href="/tai-khoan">
              <Button size="lg" variant="outline" className="h-14 px-8 text-base border-slate-700 text-slate-200 hover:bg-slate-800 gap-2">
                Tài khoản của tôi <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-16 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Đặt Phòng Nhanh Chóng</h3>
            <p className="text-sm text-slate-400">Hệ thống tra cứu phòng trống thời gian thực, đặt phòng giữ chỗ chỉ trong vài bước.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Chính Sách Linh Hoạt</h3>
            <p className="text-sm text-slate-400">Hỗ trợ hủy phòng trực tuyến dễ dàng theo chính sách công khai và minh bạch.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Dịch Vụ Đạt Chuẩn</h3>
            <p className="text-sm text-slate-400">Phục vụ 24/7 với đội ngũ nhân viên chuyên nghiệp và các tiện ích ẩm thực, spa thượng hạng.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-12 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Hotel className="w-5 h-5 text-blue-400" />
            <span className="font-semibold text-white">HotelFlow Luxury System</span>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> 123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</span>
            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Hotline: 1900 1234</span>
          </div>
          <p className="text-xs">© 2026 HotelFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
