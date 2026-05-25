"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BedDouble, DoorOpen, Users, CalendarCheck, TrendingUp, Activity } from "lucide-react";

interface DashboardData {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  todayBookings: number;
  totalCustomers: number;
  totalRevenue: number;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/dashboard").then(res => res.json()).then(setData).catch(console.error);
  }, []);

  const stats = [
    { label: "Tổng số phòng", value: data?.totalRooms || 0, icon: BedDouble, color: "from-blue-500 to-blue-600", bg: "bg-blue-50", text: "text-blue-700" },
    { label: "Phòng trống", value: data?.availableRooms || 0, icon: DoorOpen, color: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50", text: "text-emerald-700" },
    { label: "Đang có khách", value: data?.occupiedRooms || 0, icon: Activity, color: "from-orange-500 to-red-500", bg: "bg-orange-50", text: "text-orange-700" },
    { label: "Booking hôm nay", value: data?.todayBookings || 0, icon: CalendarCheck, color: "from-violet-500 to-purple-600", bg: "bg-violet-50", text: "text-violet-700" },
    { label: "Khách hàng", value: data?.totalCustomers || 0, icon: Users, color: "from-cyan-500 to-teal-600", bg: "bg-cyan-50", text: "text-cyan-700" },
    { label: "Doanh thu", value: `${((data?.totalRevenue || 0) / 1000000).toFixed(1)}M`, icon: TrendingUp, color: "from-amber-500 to-orange-500", bg: "bg-amber-50", text: "text-amber-700", suffix: "đ" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Xin chào, {session?.user?.name}! 👋</h1>
        <p className="text-gray-500 mt-1">Đây là tổng quan hoạt động khách sạn hôm nay.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {stat.value}{stat.suffix || ""}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${stat.text}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
