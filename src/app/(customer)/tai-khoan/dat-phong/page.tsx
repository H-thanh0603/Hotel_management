"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, AlertCircle } from "lucide-react";

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const loadData = () => {
    fetch("/api/bookings/my")
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải danh sách booking");
        return res.json();
      })
      .then((data) => {
        setBookings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancelBooking = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn hủy đặt phòng này?")) return;
    try {
      setCancellingId(id);
      const res = await fetch(`/api/customer/bookings/${id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cancellationReason: "Khách hàng tự hủy" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Hủy booking thất bại");
      alert("Hủy đặt phòng thành công!");
      loadData();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setCancellingId(null);
    }
  };

  const statusBadges: Record<string, { label: string; className: string }> = {
    PENDING: { label: "Chờ xác nhận", className: "bg-amber-50 text-amber-700 border-amber-200" },
    CONFIRMED: { label: "Đã xác nhận", className: "bg-blue-50 text-blue-700 border-blue-200" },
    CHECKED_IN: { label: "Đang lưu trú", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    CHECKED_OUT: { label: "Đã trả phòng", className: "bg-slate-50 text-slate-700 border-slate-200" },
    CANCELLED: { label: "Đã hủy", className: "bg-red-50 text-red-700 border-red-200" },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Danh Sách Đặt Phòng Của Tôi</h1>
        <p className="text-sm text-slate-500 mt-1">Xem chi tiết trạng thái và lịch sử tất cả lượt đặt phòng</p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-slate-500 text-sm">Đang tải dữ liệu đặt phòng...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500 text-sm flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-slate-500 font-medium">Bạn chưa có lịch đặt phòng nào</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {bookings.map((booking) => {
                const badge = statusBadges[booking.status] || {
                  label: booking.status,
                  className: "bg-slate-100 text-slate-600",
                };
                const canCancel = ["PENDING", "CONFIRMED"].includes(booking.status);

                return (
                  <div key={booking.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-blue-600">{booking.bookingCode}</span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${badge.className}`}>
                          {badge.label}
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-800">{booking.roomType?.name || "Hạng phòng"}</h4>
                      <p className="text-xs text-slate-500">
                        Nhận phòng: {new Date(booking.checkInDate).toLocaleDateString("vi-VN")} | Trả phòng: {new Date(booking.checkOutDate).toLocaleDateString("vi-VN")}
                      </p>
                      {booking.depositAmount > 0 && (
                        <p className="text-xs text-slate-500">
                          Tiền cọc: {booking.depositAmount.toLocaleString("vi-VN")}đ
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      {canCancel && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50"
                          disabled={cancellingId === booking.id}
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          {cancellingId === booking.id ? "Đang hủy..." : "Hủy đặt phòng"}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
