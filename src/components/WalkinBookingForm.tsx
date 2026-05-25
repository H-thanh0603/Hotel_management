"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UserPlus, X } from "lucide-react";

interface WalkinFormProps {
  roomTypes: any[];
  rooms: any[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function WalkinBookingForm({ roomTypes, rooms, onClose, onSuccess }: WalkinFormProps) {
  const [form, setForm] = useState({
    customerName: "", customerPhone: "", customerEmail: "", customerIdentity: "",
    roomTypeId: "", roomId: "", checkInDate: "", checkOutDate: "",
    numberOfGuests: 1, depositAmount: 0, note: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <Card className="mb-6 border-emerald-200 bg-emerald-50/30">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-emerald-600" />
          <CardTitle className="text-base">Đặt phòng trực tiếp (Walk-in)</CardTitle>
        </div>
        <Button size="icon" variant="ghost" onClick={onClose}><X className="w-4 h-4" /></Button>
      </CardHeader>
      <CardContent>
        {message && <div className="mb-3 px-4 py-2 rounded-lg text-sm bg-red-50 border border-red-200 text-red-700">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <p className="text-sm font-medium text-gray-700 mb-3">Thông tin khách hàng</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input label="Họ tên khách *" placeholder="Nguyễn Văn A" value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} required />
              <Input label="Số điện thoại" placeholder="0912345678" value={form.customerPhone} onChange={e => setForm({...form, customerPhone: e.target.value})} />
              <Input label="Email" placeholder="email@example.com" value={form.customerEmail} onChange={e => setForm({...form, customerEmail: e.target.value})} />
              <Input label="CCCD / Hộ chiếu" placeholder="079123456789" value={form.customerIdentity} onChange={e => setForm({...form, customerIdentity: e.target.value})} />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <p className="text-sm font-medium text-gray-700 mb-3">Thông tin đặt phòng</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Select label="Loại phòng *" value={form.roomTypeId} onChange={e => setForm({...form, roomTypeId: e.target.value})} required>
                <option value="">-- Chọn loại phòng --</option>
                {roomTypes.map((t: any) => <option key={t.id} value={t.id}>{t.name} — {t.pricePerNight.toLocaleString()}đ/đêm</option>)}
              </Select>
              <Select label="Phòng" value={form.roomId} onChange={e => setForm({...form, roomId: e.target.value})}>
                <option value="">-- Tự động --</option>
                {rooms.filter(r => r.status === "AVAILABLE").map((r: any) => <option key={r.id} value={r.id}>{r.roomNumber} ({r.roomType?.name})</option>)}
              </Select>
              <Input label="Số khách" type="number" value={form.numberOfGuests} onChange={e => setForm({...form, numberOfGuests: +e.target.value})} min={1} />
              <Input label="Ngày nhận phòng *" type="date" value={form.checkInDate} onChange={e => setForm({...form, checkInDate: e.target.value})} required />
              <Input label="Ngày trả phòng *" type="date" value={form.checkOutDate} onChange={e => setForm({...form, checkOutDate: e.target.value})} required />
              <Input label="Tiền cọc (VNĐ)" type="number" placeholder="0" value={form.depositAmount || ""} onChange={e => setForm({...form, depositAmount: +e.target.value})} />
            </div>
            <div className="mt-3">
              <Input label="Ghi chú" placeholder="Yêu cầu đặc biệt..." value={form.note} onChange={e => setForm({...form, note: e.target.value})} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="success" disabled={loading}>
              {loading ? "Đang xử lý..." : "Xác nhận đặt phòng"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
