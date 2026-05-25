"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BedDouble, Layers } from "lucide-react";

const statusConfig: Record<string, { label: string; variant: string; dot: string }> = {
  AVAILABLE: { label: "Trống", variant: "success", dot: "bg-emerald-500" },
  RESERVED: { label: "Đã đặt", variant: "warning", dot: "bg-amber-500" },
  OCCUPIED: { label: "Đang ở", variant: "destructive", dot: "bg-red-500" },
  CLEANING: { label: "Đang dọn", variant: "info", dot: "bg-cyan-500" },
  MAINTENANCE: { label: "Bảo trì", variant: "secondary", dot: "bg-gray-500" },
  UNAVAILABLE: { label: "Tạm ngưng", variant: "outline", dot: "bg-gray-400" },
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/rooms").then(r => r.json()).then(data => { setRooms(data); setLoading(false); });
  }, []);

  const floors = [...new Set(rooms.map(r => r.floor))].sort();

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sơ đồ phòng</h1>
          <p className="text-gray-500 text-sm mt-1">Trạng thái phòng theo từng tầng</p>
        </div>
      </div>
      <div className="flex gap-3 mb-6 flex-wrap">
        {Object.entries(statusConfig).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs text-gray-600">
            <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
            <span>{cfg.label}</span>
          </div>
        ))}
      </div>
      {floors.map(floor => (
        <div key={floor} className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Tầng {floor}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {rooms.filter(r => r.floor === floor).map(room => {
              const cfg = statusConfig[room.status] || statusConfig.UNAVAILABLE;
              return (
                <Card key={room.id} className="group cursor-pointer hover:scale-[1.02] transition-all duration-200 border-0 shadow-sm">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                      <div className={`w-2 h-2 rounded-full ${cfg.dot} animate-pulse`} />
                      <span className="text-lg font-bold text-gray-900">{room.roomNumber}</span>
                    </div>
                    <p className="text-xs text-gray-500">{room.roomType?.name}</p>
                    <p className="text-[10px] text-blue-500 mb-2">{(room.roomType?.pricePerHour || 0).toLocaleString()}đ/giờ</p>
                    <Badge variant={cfg.variant as any} className="text-[10px]">{cfg.label}</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
