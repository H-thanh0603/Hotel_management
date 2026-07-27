"use client";
import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BedDouble, Users, CheckCircle2, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";

export default function RoomDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [roomType, setRoomType] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/public/room-types/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Hạng phòng không tồn tại");
        return r.json();
      })
      .then((data) => {
        setRoomType(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen bg-slate-900 text-slate-300 p-12 text-center">Đang tải thông tin chi tiết hạng phòng...</div>;
  }

  if (error || !roomType) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-300 p-12 text-center space-y-4">
        <h2 className="text-2xl font-bold text-red-400">{error || "Không tìm thấy hạng phòng"}</h2>
        <Link href="/phong">
          <Button variant="outline" className="border-slate-700 text-slate-200">Quay lại danh sách phòng</Button>
        </Link>
      </div>
    );
  }

  let amenitiesList: string[] = [];
  try {
    amenitiesList = typeof roomType.amenities === "string" ? JSON.parse(roomType.amenities) : roomType.amenities || [];
  } catch {
    amenitiesList = [];
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
      <Link href="/phong" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách phòng
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl h-80 sm:h-96">
            <img
              src={roomType.imageUrl || "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"}
              alt={roomType.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{roomType.name}</h1>
            <p className="text-slate-300 text-base leading-relaxed">{roomType.description || "Phòng nghỉ sang trọng được thiết kế tinh tế với đầy đủ các tiện ích phục vụ nghỉ dưỡng cao cấp."}</p>

            <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-slate-800/60 border border-slate-800 text-center">
              <div>
                <p className="text-xs text-slate-400">Sức chứa</p>
                <p className="text-lg font-bold text-white flex items-center justify-center gap-1 mt-1">
                  <Users className="w-4 h-4 text-blue-400" /> {roomType.maxGuests} Khách
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Loại giường</p>
                <p className="text-lg font-bold text-white flex items-center justify-center gap-1 mt-1">
                  <BedDouble className="w-4 h-4 text-blue-400" /> {roomType.bedCount} Giường
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Diện tích</p>
                <p className="text-lg font-bold text-white mt-1">{roomType.area || 30} m²</p>
              </div>
            </div>

            {/* Amenities Section */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h3 className="text-lg font-bold text-white">Tiện Nghi Hạng Phòng</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {amenitiesList.map((amenity, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/40 border border-slate-800 text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hotel Policies */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" /> Chính Sách Nhận / Trả Phòng
              </h3>
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 text-sm text-slate-300 space-y-2">
                <p>• <strong>Giờ nhận phòng:</strong> Từ 14:00 mỗi ngày.</p>
                <p>• <strong>Giờ trả phòng:</strong> Trước 12:00 trưa mỗi ngày.</p>
                <p>• <strong>Chính sách hủy:</strong> Hủy miễn phí trước ngày nhận phòng theo quy định của khách sạn.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Booking Card */}
        <div className="space-y-6">
          <Card className="bg-slate-800/80 border-slate-700/80 shadow-2xl sticky top-24">
            <CardContent className="p-6 space-y-6">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Giá mỗi đêm từ</p>
                <p className="text-3xl font-black text-blue-400 mt-1">
                  {roomType.pricePerNight?.toLocaleString("vi-VN")}đ
                </p>
              </div>

              {roomType.pricePerHour > 0 && (
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-700 text-xs text-slate-300 space-y-1">
                  <p>• Thuê theo giờ: <strong>{roomType.pricePerHour?.toLocaleString("vi-VN")}đ / giờ</strong></p>
                  {roomType.overnightPrice > 0 && <p>• Thuê qua đêm: <strong>{roomType.overnightPrice?.toLocaleString("vi-VN")}đ / đêm</strong></p>}
                </div>
              )}

              <Link href={`/dat-phong?roomTypeId=${roomType.id}`} className="block">
                <Button size="lg" className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold gap-2 shadow-lg shadow-blue-600/30">
                  Đặt phòng này ngay <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
