"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ConciergeBell } from "lucide-react";

export default function PublicServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/services")
      .then((r) => r.json())
      .then((data) => {
        setServices(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 space-y-12 max-w-7xl mx-auto">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
          <Sparkles className="w-4 h-4" /> Trải Nghiệm Đỉnh Cao
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Dịch Vụ & <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Tiện Ích Khách Sạn</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-base">
          HotelFlow mang đến hệ thống dịch vụ cao cấp nhằm chăm sóc chu đáo mọi khoảnh khắc nghỉ dưỡng của bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center text-slate-400">Đang tải danh sách dịch vụ...</div>
        ) : (
          services.map((service) => (
            <Card key={service.id} className="bg-slate-800/60 border-slate-700/60 shadow-xl space-y-4">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center">
                  <ConciergeBell className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{service.name}</h3>
                  <p className="text-sm text-slate-400 mt-1">{service.description || "Dịch vụ đẳng cấp phục vụ theo yêu cầu quý khách."}</p>
                </div>
                <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Đơn vị: {service.unit}</span>
                  <span className="text-lg font-extrabold text-blue-400">
                    {service.price?.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
