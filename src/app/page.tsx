"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Hotel, Calendar, Sparkles, ArrowRight, BedDouble, Phone, MapPin,
  Users, Star, Award, CheckCircle2, Coffee, Utensils, Waves, Compass, ChevronRight
} from "lucide-react";

export default function Home() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const next2Days = new Date(tomorrow);
  next2Days.setDate(next2Days.getDate() + 2);

  const [checkIn, setCheckIn] = useState(tomorrow.toISOString().split("T")[0]);
  const [checkOut, setCheckOut] = useState(next2Days.toISOString().split("T")[0]);
  const [adults, setAdults] = useState(2);

  const featuredRooms = [
    {
      id: "presidential-suite",
      name: "Presidential Suite Sunset View",
      price: "4.500.000đ",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80",
      guests: "4 Khách",
      beds: "1 King Master + 1 Queen",
      area: "120 m²",
      tags: ["Ban công riêng", "Bồn tắm Jacuzzi", "Quầy Bar Mini", "Phục vụ 24/7"],
      rating: "5.0 (128 đánh giá)",
    },
    {
      id: "deluxe-ocean-suite",
      name: "Deluxe Ocean View Suite",
      price: "2.800.000đ",
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80",
      guests: "2 Khách",
      beds: "1 King Size",
      area: "65 m²",
      tags: ["Hướng biển", "Bữa sáng miễn phí", "Wifi 1Gbps", "Sofa cao cấp"],
      rating: "4.9 (96 đánh giá)",
    },
    {
      id: "executive-family-suite",
      name: "Executive Family Panoramic",
      price: "3.200.000đ",
      image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1000&q=80",
      guests: "6 Khách",
      beds: "2 King Size",
      area: "95 m²",
      tags: ["Phòng đôi", "Bếp nhỏ", "Tầm nhìn thành phố", "Đưa đón sân bay"],
      rating: "4.95 (210 đánh giá)",
    },
  ];

  const amenities = [
    {
      title: "Hồ Bơi Vô Cực Rooftop",
      desc: "Thưởng thức cocktail xa xỉ tại hồ bơi tràn bờ tầng 35 với tầm nhìn panorama ngắm trọn hoàng hôn thành phố.",
      icon: Waves,
      image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Nhà Hàng Thượng Hạng Michelin",
      desc: "Hương vị ẩm thực Á - Âu chuẩn 5 sao được chuẩn bị bởi những đầu bếp đạt sao Michelin quốc tế.",
      icon: Utensils,
      image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Wellness Organic Spa & Sauna",
      desc: "Trải nghiệm liệu trình chăm sóc sức khỏe toàn diện với tinh dầu thiên nhiên organic và phòng xông hơi đá muối.",
      icon: Sparkles,
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Lounge & Bar Đêm Sang Trọng",
      desc: "Thư giãn cùng dòng nhạc Jazz êm dịu, danh mục rượu vang phong phú và dịch vụ phục vụ thượng khách 24/7.",
      icon: Coffee,
      image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const stats = [
    { value: "99.8%", label: "Hài lòng của khách hàng" },
    { value: "50+", label: "Hạng phòng xa xỉ" },
    { value: "15,000+", label: "Lượt lưu trú ấn tượng" },
    { value: "24/7", label: "Quản gia & Lễ tân tận tâm" },
  ];

  const testimonials = [
    {
      quote: "Trải nghiệm nghỉ dưỡng tuyệt vời nhất tôi từng có tại Việt Nam. Phòng President Suite thiết kế tinh tế, tầm nhìn triệu đô và dịch vụ chu đáo từng chi tiết nhỏ.",
      author: "Nguyễn Minh Tuấn",
      role: "CEO Tech Vision",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      rating: 5,
    },
    {
      quote: "Hệ thống đặt phòng trực tuyến mượt mà, thông tin minh bạch. Đồ ăn tại nhà hàng Michelin thực sự khiến gia đình tôi bất ngờ!",
      author: "Trần Thu Thảo",
      role: "Kiến trúc sư trưởng",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300">
              <Hotel className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-black bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent tracking-tight">
                HotelFlow
              </span>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Luxury Hotel & Suites</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <Link href="/" className="text-blue-400 flex items-center gap-1">
              Trang chủ <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
            </Link>
            <Link href="/phong" className="hover:text-blue-400 transition-colors">Hạng phòng</Link>
            <Link href="/dich-vu" className="hover:text-blue-400 transition-colors">Dịch vụ</Link>
            <Link href="/uu-dai" className="hover:text-blue-400 transition-colors">Ưu đãi</Link>
            <Link href="/gioi-thieu" className="hover:text-blue-400 transition-colors">Giới thiệu</Link>
            <Link href="/lien-he" className="hover:text-blue-400 transition-colors">Liên hệ</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" className="border-slate-700/80 text-slate-200 hover:bg-slate-800 font-semibold">
                Tài khoản
              </Button>
            </Link>
            <Link href="/dat-phong">
              <Button className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold gap-2 shadow-lg shadow-blue-500/30">
                <BedDouble className="w-4 h-4" /> Đặt phòng ngay
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION 1: Grand Welcome & Real-Time Booking Bar */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/60 via-slate-950/90 to-slate-950 z-10" />
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-40 scale-105 animate-pulse transition-transform duration-10000"
        />

        <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md shadow-inner">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" /> Trải Nghiệm Khách Sạn Biểu Tượng Đẳng Cấp 5 Sao
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none">
            Chạm Tới Đỉnh Cao <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
              Nghỉ Dưỡng Thượng Lưu
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
            Chào mừng bạn đến với HotelFlow — Nơi hội tụ tinh hoa kiến trúc hiện đại, ẩm thực Michelin và dịch vụ lưu trú thiết kế riêng cho sự thư thái hoàn hảo của bạn.
          </p>

          {/* Interactive Search Widget Bar */}
          <div className="max-w-4xl mx-auto bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl mt-10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = `/dat-phong?checkIn=${checkIn}&checkOut=${checkOut}&guests=${adults}`;
              }}
              className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end text-left"
            >
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" /> Ngày nhận phòng
                </label>
                <Input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="bg-slate-950 border-slate-700 text-white h-11"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" /> Ngày trả phòng
                </label>
                <Input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="bg-slate-950 border-slate-700 text-white h-11"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-400" /> Số khách
                </label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="bg-slate-950 border-slate-700 text-white h-11"
                />
              </div>

              <Button type="submit" className="h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold gap-2 shadow-lg shadow-blue-600/30">
                <Compass className="w-4 h-4" /> Tìm phòng ngay
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-12 bg-slate-900/80 border-y border-slate-800/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HERO SECTION 2: Featured Luxury Rooms Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Bộ Sưu Tập Độc Bản</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">Các Hạng Phòng Nổi Bật</h2>
          </div>
          <Link href="/phong" className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-cyan-300 transition-colors">
            Xem toàn bộ hạng phòng <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {featuredRooms.map((room) => (
            <div
              key={room.id}
              className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between group shadow-xl"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 text-xs text-amber-400 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {room.rating}
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {room.name}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-400 border-b border-slate-800 pb-3">
                    <span>{room.guests}</span>
                    <span>•</span>
                    <span>{room.beds}</span>
                    <span>•</span>
                    <span>{room.area}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {room.tags.map((tag, i) => (
                      <span key={i} className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-blue-400" /> {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase text-slate-400 font-semibold">Giá mỗi đêm</p>
                    <p className="text-xl font-black text-blue-400">{room.price}</p>
                  </div>
                  <Link href={`/phong/${room.id}`}>
                    <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold gap-1 shadow-md shadow-blue-600/20">
                      Chi tiết <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HERO SECTION 3: Premium Amenities & Experiences */}
      <section className="py-20 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Trải Nghiệm Thượng Lưu</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">Dịch Vụ & Tiện Ích Chuẩn 5 Sao</h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Mọi khoảnh khắc nghỉ dưỡng tại HotelFlow được chăm chút bởi những tiêu chuẩn khắt khe nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {amenities.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-slate-950/80 border border-slate-800 rounded-3xl overflow-hidden grid sm:grid-cols-2 gap-4 group hover:border-slate-700 transition-all shadow-2xl">
                  <div className="h-48 sm:h-auto overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6 space-y-3 flex flex-col justify-center">
                    <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/20">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HERO SECTION 4: Guest Testimonials & Reviews */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
            <Award className="w-4 h-4" /> Đánh Giá Từ Thượng Khách
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Cảm Nhận Về HotelFlow</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-2xl space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
                <img src={t.avatar} alt={t.author} className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/30" />
                <div>
                  <h4 className="font-bold text-white text-sm">{t.author}</h4>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-blue-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-black text-white">Sẵn Sàng Trải Nghiệm Kỳ Nghỉ Trong Mơ?</h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Đặt phòng ngay hôm nay để nhận được ưu đãi giảm 20% và dịch vụ đưa đón VIP sân bay miễn phí.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dat-phong">
                <Button size="lg" className="h-14 px-10 text-base bg-blue-500 hover:bg-blue-400 text-white font-bold gap-2 shadow-xl shadow-blue-500/30">
                  <BedDouble className="w-5 h-5" /> Đặt phòng ngay bây giờ
                </Button>
              </Link>
              <Link href="/lien-he">
                <Button size="lg" variant="outline" className="h-14 px-8 text-base border-slate-700 text-slate-200 hover:bg-slate-800">
                  Liên hệ cố vấn lưu trú
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-12 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Hotel className="w-5 h-5 text-blue-400" />
            <span className="font-semibold text-white">HotelFlow Luxury System</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6 text-xs">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-blue-400" /> 123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</span>
            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-blue-400" /> Hotline: 1900 1234</span>
          </div>
          <p className="text-xs">© 2026 HotelFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
