"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UserPlus, X, Clock } from "lucide-react";

interface WalkinFormProps {
  roomTypes: any[];
  rooms: any[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function WalkinBookingForm({ roomTypes, rooms, onClose, onSuccess }: WalkinFormProps) {
  const [form, setForm] = useState({
    customerName: "", customerPhone: "", customerIdentity: "",
    roomId: "", hours: 2, note: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedRoom = rooms.find((r: any) => r.id === form.roomId);
  const pricePerHour = selectedRoom?.roomType?.pricePerHour || 0;
  const estimatedTotal = pricePerHour * form.hours;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setMessage("");
    const res = await fetch("/api/bookings/walkin", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) { onSuccess(); onClose(); }
    else { setMessage(data.error || "Có lỗi xảy ra"); }
  };

  const availableRooms = rooms.filter((r: any) => r.status === "AVAILABLE");

  return (
    <Card className="mb-6 border-emerald-200 bg-emerald-50/30">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-emerald-600" />
          <CardTitle className="text-base">Nhận khách trực tiếp (tính theo giờ)</CardTitle>
        </div>
        <Button size="icon" variant="ghost" onClick={onClose}><X className="w-4 h-4" /></Button>
      </CardHeader>
      <CardContent>
        {message && <div className="mb-3 px-4 py-2 rounded-lg text-sm bg-red-50 border border-red-200 text-red-700">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <p className="text-sm font-medium text-gray-700 mb-3">Thông tin khách</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input label="Họ tên khách *" placeholder="Nguyễn Văn A" value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} required />
              <Input label="Số điện thoại" placeholder="0912345678" value={form.customerPhone} onChange={e => setForm({...form, customerPhone: e.target.value})} />
              <Input label="CCCD" placeholder="079123456789" value={form.customerIdentity} onChange={e => setForm({...form, customerIdentity: e.target.value})} />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <p className="text-sm font-medium text-gray-700 mb-3">Chọn phòng & thời gian</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Select label="Phòng trống *" value={form.roomId} onChange={e => setForm({...form, roomId: e.target.value})} required>
                <option value="">-- Chọn phòng --</option>
                {availableRooms.map((r: any) => (
                  <option key={r.id} value={r.id}>
                    {r.roomNumber} - {r.roomType?.name} ({(r.roomType?.pricePerHour || 0).toLocaleString()}đ/giờ)
                  </option>
                ))}
              </Select>
              <Input label="Số giờ *" type="number" value={form.hours} onChange={e => setForm({...form, hours: +e.target.value})} min={1} max={24} />
              <Input label="Ghi chú" placeholder="Ghi chú..." value={form.note} onChange={e => setForm({...form, note: e.target.value})} />
            </div>
            {form.roomId && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <Clock className="w-4 h-4" />
                  <span>{form.hours} giờ × {pricePerHour.toLocaleString()}đ/giờ</span>
                </div>
                <span className="text-lg font-bold text-blue-700">{estimatedTotal.toLocaleString()}đ</span>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="success" disabled={loading}>
              {loading ? "Đang xử lý..." : "Check-in ngay"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
