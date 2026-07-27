import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowRight } from "lucide-react";

export default function PublicPromotionsPage() {
  const deals = [
    {
      title: "Ưu Đãi Mùa Hè - Giảm 20% Cho Kỳ Nghỉ Dài",
      code: "SUMMER2026",
      discount: "Giảm 20%",
      desc: "Áp dụng cho đơn đặt phòng từ 3 đêm trở lên trong giai đoạn hè.",
    },
    {
      title: "Khách Hàng Thân Thiết - Giảm 15%",
      code: "LOYALTY15",
      discount: "Giảm 15%",
      desc: "Dành riêng cho khách hàng đã từng lưu trú tại hệ thống HotelFlow.",
    },
    {
      title: "Đặt Phòng Sớm - Nhận Ngay Voucher Spa",
      code: "EARLYBIRD",
      discount: "Tặng Spa 60p",
      desc: "Đặt phòng trước 14 ngày để nhận ngay voucher trải nghiệm Spa cao cấp.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 space-y-12 max-w-7xl mx-auto">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
          <Sparkles className="w-4 h-4" /> Khuyến Mãi Đặc Biệt
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Danh Sách <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Ưu Đãi Hiện Hành</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-base">
          Tận hưởng kỳ nghỉ sang trọng với các chương trình ưu đãi hấp dẫn dành riêng cho bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {deals.map((deal, i) => (
          <Card key={i} className="bg-slate-800/60 border-slate-700/60 shadow-xl space-y-4">
            <CardContent className="p-6 space-y-4 flex flex-col justify-between h-full">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20">
                    MÃ: {deal.code}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                    {deal.discount}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">{deal.title}</h3>
                <p className="text-sm text-slate-400">{deal.desc}</p>
              </div>

              <div className="pt-4 border-t border-slate-700/50">
                <Link href="/dat-phong">
                  <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white gap-2">
                    Đặt phòng áp dụng ngay <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
