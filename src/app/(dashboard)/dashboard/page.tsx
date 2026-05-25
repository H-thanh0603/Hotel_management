"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
    fetch("/api/dashboard")
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Xin chao, {session?.user?.name}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Tong phong</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{data?.totalRooms || 0}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Phong trong</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-green-600">{data?.availableRooms || 0}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Phong dang o</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-red-600">{data?.occupiedRooms || 0}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Booking hom nay</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-blue-600">{data?.todayBookings || 0}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Khach hang</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{data?.totalCustomers || 0}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Doanh thu</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-emerald-600">{(data?.totalRevenue || 0).toLocaleString()}d</p></CardContent>
        </Card>
      </div>
    </div>
  );
}
