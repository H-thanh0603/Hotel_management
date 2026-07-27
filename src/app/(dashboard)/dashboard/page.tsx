"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BedDouble, DoorOpen, Users, CalendarCheck, TrendingUp, Activity, Percent, DollarSign, BarChart3, Ticket } from "lucide-react";
import Link from "next/link";

interface DashboardData {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
  todayBookings: number;
  totalCustomers: number;
  totalRevenue: number;
  totalVouchers: number;
  occupancyRate: number;
  adr: number;
  revpar: number;
  monthlyRevenue: { month: string; revenue: number }[];
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const role = session?.user?.role;
  const isStaff = role === "ADMIN" || role === "RECEPTIONIST";

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const kpis = [
    { label: "Tổng Doanh Thu", value: `${(data?.totalRevenue || 0).toLocaleString("vi-VN")}đ`, icon: TrendingUp, bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700" },
    { label: "Công Suất Phòng (Occupancy)", value: `${data?.occupancyRate || 0}%`, icon: Percent, bg: "bg-blue-50 border-blue-200", text: "text-blue-700" },
    { label: "Giá Trung Bình (ADR)", value: `${(data?.adr || 0).toLocaleString("vi-VN")}đ`, icon: DollarSign, bg: "bg-amber-50 border-amber-200", text: "text-amber-700" },
    { label: "Doanh Thu / Phòng (RevPAR)", value: `${(data?.revpar || 0).toLocaleString("vi-VN")}đ`, icon: BarChart3, bg: "bg-purple-50 border-purple-200", text: "text-purple-700" },
  ];

  const operationalStats = [
    { label: "Tổng số phòng", value: data?.totalRooms || 0, icon: BedDouble, bg: "bg-slate-100", text: "text-slate-700" },
    { label: "Phòng trống", value: data?.availableRooms || 0, icon: DoorOpen, bg: "bg-emerald-50", text: "text-emerald-700" },
    { label: "Đang có khách", value: data?.occupiedRooms || 0, icon: Activity, bg: "bg-orange-50", text: "text-orange-700" },
    { label: "Booking hôm nay", value: data?.todayBookings || 0, icon: CalendarCheck, bg: "bg-violet-50", text: "text-violet-700" },
    { label: "Khách hàng CRM", value: data?.totalCustomers || 0, icon: Users, bg: "bg-cyan-50", text: "text-cyan-700" },
    { label: "Voucher khả dụng", value: data?.totalVouchers || 0, icon: Ticket, bg: "bg-rose-50", text: "text-rose-700" },
  ];

  const maxMonthlyRevenue = Math.max(...(data?.monthlyRevenue?.map((m) => m.revenue) || [1]));

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Xin chào, {session?.user?.name}! 👋</h1>
          <p className="text-sm text-slate-500 mt-1">
            {isStaff ? "Báo cáo phân tích doanh thu & quản lý công suất phòng thời gian thực." : "Chào mừng bạn đến với HotelFlow."}
          </p>
        </div>
        {isStaff && (
          <Link
            href="/vouchers"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-all shadow-md"
          >
            <Ticket className="w-4 h-4" /> Quản Lý Mã Giảm Giá
          </Link>
        )}
      </div>

      {/* Advanced Revenue Analytics & Key Hotel Metrics */}
      {isStaff && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Báo Cáo Doanh Thu Nâng Cao & Chỉ Số RevPAR / ADR</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, i) => {
              const Icon = kpi.icon;
              return (
                <Card key={i} className={`border ${kpi.bg} shadow-sm hover:shadow-md transition-all`}>
                  <CardContent className="p-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-600">{kpi.label}</p>
                      <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">{kpi.value}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${kpi.text}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Operational Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Trạng Thái Vận Hành Khách Sạn</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {operationalStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className="border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-4 flex flex-col justify-between h-full space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                    <Icon className={`w-4 h-4 ${stat.text}`} />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Revenue Trend Chart */}
      {isStaff && data?.monthlyRevenue && (
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" /> Xu Hướng Doanh Thu Các Tháng
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {data.monthlyRevenue.map((item, idx) => {
              const pct = maxMonthlyRevenue > 0 ? Math.round((item.revenue / maxMonthlyRevenue) * 100) : 0;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{item.month}</span>
                    <span className="text-blue-600 font-mono">{item.revenue.toLocaleString("vi-VN")}đ</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
