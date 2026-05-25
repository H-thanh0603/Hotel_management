"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { X, Clock, Moon } from "lucide-react";

interface WalkinFormProps {
  rooms: any[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function WalkinBookingForm({ rooms, onClose, onSuccess }: WalkinFormProps) {
  const [form, setForm] = useState({ roomId: "", bookingType: "HOURLY", hours: 2, note: "" });
  const [config, setConfig] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/pricing-config").then(r => r.json()).then(setConfig);
  }, []);

  const selectedRoom = rooms.find((r: any) => r.id === form.roomId);
  const pricePerHour = selectedRoom?.roomType?.pricePerHour || 0;
  const overnightPrice = selectedRoom?.roomType?.overnightPrice || 0;
  const estimatedTotal = form.bookingType === "HOURLY" ? pricePerHour * form.hours : overnightPrice;

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
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-600" /> Nhận khách trực tiếp
        </CardTitle>
        <Button size="icon" variant="ghost" onClick={onClose}><X className="w-4 h-4" /></Button>
      </CardHeader>
      <CardContent>
        {message && <div className="mb-3 px-4 py-2 rounded-lg text-sm bg-red-50 border border-red-200 text-red-700">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Select label="Phòng trống *" value={form.roomId} onChange={e => setForm({...form, roomId: e.target.value})} required>
                <option value="">-- Chọn phòng --</option>
                {availableRooms.map((r: any) => (
                  <option key={r.id} value={r.id}>
                    {r.roomNumber} - {r.roomType?.name} ({(r.roomType?.pricePerHour || 0).toLocaleString()}đ/h)
                  </option>
                ))}
              </Select>
              <Select label="Hình thức" value={form.bookingType} onChange={e => setForm({...form, bookingType: e.target.value})}>
                <option value="HOURLY">Theo giờ</option>
                <option value="OVERNIGHT">Qua đêm</option>
              </Select>
              {form.bookingType === "HOURLY" && (
                <Input label="Số giờ *" type="number" value={form.hours} onChange={e => setForm({...form, hours: +e.target.value})} min={1} max={24} />
              )}
            </div>
            {form.bookingType === "OVERNIGHT" && config && (
              <div className="mt-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100 flex items-center gap-2 text-sm text-indigo-700">
                <Moon className="w-4 h-4" />
                <span>Qua đêm: {config.overnightStart} → {config.overnightEnd}</span>
              </div>
            )}
            <div className="mt-3">
              <Input label="Ghi chú" placeholder="Ghi chú..." value={form.note} onChange={e => setForm({...form, note: e.target.value})} />
            </div>
            {form.roomId && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  {form.bookingType === "HOURLY" ? <Clock className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span>{form.bookingType === "HOURLY" ? `${form.hours} giờ × ${pricePerHour.toLocaleString()}đ` : `Qua đêm`}</span>
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
