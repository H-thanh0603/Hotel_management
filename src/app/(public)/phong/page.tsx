"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BedDouble, Users, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";

export default function PublicRoomsPage() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const next2Days = new Date(tomorrow);
  next2Days.setDate(next2Days.getDate() + 2);

  const [checkIn, setCheckIn] = useState(tomorrow.toISOString().split("T")[0]);
  const [checkOut, setCheckOut] = useState(next2Days.toISOString().split("T")[0]);
  const [adults, setAdults] = useState(2);

  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    fetch("/api/public/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checkInDate: checkIn, checkOutDate: checkOut, adults }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.availableRoomTypes) {
          setRoomTypes(data.availableRoomTypes);
        } else {
          return fetch("/api/public/room-types").then((r) => r.json()).then((fallbackData) => {
            setRoomTypes(
              (Array.isArray(fallbackData) ? fallbackData : []).map((rt) => ({
                roomType: rt,
                availableCount: rt.rooms?.length || 4,
                isAvailable: true,
              }))
            );
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Page Title */}
      <div className="max-w-7xl mx-auto text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Danh Sách <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Hạng Phòng</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-base">
          Lựa chọn không gian nghỉ dưỡng phù hợp với nhu cầu và phong cách của bạn tại HotelFlow
        </p>
      </div>

      {/* Filter Bar */}
      <div className="max-w-5xl mx-auto bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setLoading(true);
            loadData();
          }}
          className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end"
        >
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" /> Ngày nhận phòng
            </label>
            <Input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="bg-slate-900 border-slate-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" /> Ngày trả phòng
            </label>
            <Input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="bg-slate-900 border-slate-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-400" /> Số khách
            </label>
            <Input
              type="number"
              min={1}
              max={10}
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              className="bg-slate-900 border-slate-700 text-white"
            />
          </div>

          <Button type="submit" className="h-11 bg-blue-600 hover:bg-blue-500 text-white font-semibold">
            Tra cứu phòng trống
          </Button>
        </form>
      </div>

      {/* Room Types Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-16 text-center text-slate-400">Đang tìm kiếm phòng còn trống...</div>
        ) : roomTypes.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400">Không tìm thấy hạng phòng nào phù hợp</div>
        ) : (
          roomTypes.map((item) => {
            const rt = item.roomType || item;
            const availableCount = item.availableCount ?? 4;
            const isAvailable = item.isAvailable ?? true;
            let amenitiesList: string[] = [];
            try {
              amenitiesList = typeof rt.amenities === "string" ? JSON.parse(rt.amenities) : rt.amenities || [];
            } catch {
              amenitiesList = [];
            }

            return (
              <Card
                key={rt.id}
                className="bg-slate-800/60 border-slate-700/60 overflow-hidden hover:border-blue-500/50 transition-all flex flex-col shadow-xl group"
              >
                <div className="relative h-56 bg-slate-950 overflow-hidden">
                  <img
                    src={rt.imageUrl || "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"}
                    alt={rt.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-bold shadow-md border ${
                        isAvailable
                          ? "bg-emerald-500/90 text-white border-emerald-400"
                          : "bg-red-500/90 text-white border-red-400"
                      }`}
                    >
                      {isAvailable ? `Còn ${availableCount} phòng` : "Hết phòng"}
                    </span>
                  </div>
                </div>

                <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {rt.name}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-2">{rt.description || "Phòng nghỉ hiện đại với đầy đủ tiện nghi cao cấp."}</p>

                    <div className="flex items-center gap-4 text-xs text-slate-300 pt-2 border-t border-slate-700/50">
                      <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-blue-400" /> Tối đa {rt.maxGuests} khách</span>
                      <span className="flex items-center gap-1.5"><BedDouble className="w-3.5 h-3.5 text-blue-400" /> {rt.bedCount} giường</span>
                      {rt.area && <span>{rt.area} m²</span>}
                    </div>

                    {amenitiesList.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {amenitiesList.slice(0, 4).map((amenity, i) => (
                          <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-700/50 text-slate-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-blue-400" /> {amenity}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">Giá mỗi đêm</p>
                      <p className="text-xl font-extrabold text-blue-400">
                        {rt.pricePerNight?.toLocaleString("vi-VN")}đ
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/phong/${rt.slug || rt.id}`}>
                        <Button variant="outline" size="sm" className="border-slate-600 text-slate-200 hover:bg-slate-700">
                          Chi tiết
                        </Button>
                      </Link>
                      <Link href={`/dat-phong?roomTypeId=${rt.id}&checkIn=${checkIn}&checkOut=${checkOut}`}>
                        <Button size="sm" disabled={!isAvailable} className="bg-blue-600 hover:bg-blue-500 text-white gap-1">
                          Đặt ngay <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
