"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Plus, X, Check, LogIn, LogOut, Ban } from "lucide-react";

const statusConfig: Record<string, { label: string; variant: string }> = {
  PENDING: { label: "Chờ xác nhận", variant: "warning" },
  CONFIRMED: { label: "Đã xác nhận", variant: "info" },
  CHECKED_IN: { label: "Đang ở", variant: "success" },
  CHECKED_OUT: { label: "Đã trả phòng", variant: "secondary" },
  CANCELLED: { label: "Đã huỷ", variant: "destructive" },
  NO_SHOW: { label: "Không đến", variant: "outline" },
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ customerId: "", roomTypeId: "", roomId: "", checkInDate: "", checkOutDate: "", numberOfGuests: 1, note: "" });

  const load = () => {
    fetch("/api/bookings").then(r => r.json()).then(setBookings);
    fetch("/api/customers").then(r => r.json()).then(setCustomers);
    fetch("/api/room-types").then(r => r.json()).then(setRoomTypes);
    fetch("/api/rooms").then(r => r.json()).then(setRooms);
  };
  useEffect(load, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { load(); setShowForm(false); }
  };

  const handleAction = async (id: string, action: string) => {
    await fetch(`/api/bookings/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) });
    load();
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đặt phòng</h1>
          <p className="text-gray-500 text-sm mt-1">Tạo và theo dõi booking</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? <><X className="w-4 h-4" /> Đóng</> : <><Plus className="w-4 h-4" /> Tạo booking</>}
        </Button>
      </div>
      {showForm && (
        <Card className="mb-6 border-blue-100 bg-blue-50/30">
          <CardContent className="p-5">
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select label="Khách hàng" value={form.customerId} onChange={e => setForm({...form, customerId: e.target.value})} required>
                <option value="">-- Chọn khách hàng --</option>
                {customers.map((c: any) => <option key={c.id} value={c.id}>{c.fullName} - {c.phone}</option>)}
              </Select>
              <Select label="Loại phòng" value={form.roomTypeId} onChange={e => setForm({...form, roomTypeId: e.target.value})} required>
                <option value="">-- Chọn loại phòng --</option>
                {roomTypes.map((t: any) => <option key={t.id} value={t.id}>{t.name} - {t.pricePerNight.toLocaleString()}đ</option>)}
              </Select>
              <Select label="Phòng (tuỳ chọn)" value={form.roomId} onChange={e => setForm({...form, roomId: e.target.value})}>
                <option value="">-- Chọn phòng --</option>
                {rooms.filter(r => r.status === "AVAILABLE").map((r: any) => <option key={r.id} value={r.id}>{r.roomNumber} - {r.roomType?.name}</option>)}
              </Select>
              <Input label="Ngày nhận phòng" type="date" value={form.checkInDate} onChange={e => setForm({...form, checkInDate: e.target.value})} required />
              <Input label="Ngày trả phòng" type="date" value={form.checkOutDate} onChange={e => setForm({...form, checkOutDate: e.target.value})} required />
              <Input label="Số khách" type="number" value={form.numberOfGuests} onChange={e => setForm({...form, numberOfGuests: +e.target.value})} min={1} />
              <div className="md:col-span-3">
                <Input label="Ghi chú" placeholder="Ghi chú thêm..." value={form.note} onChange={e => setForm({...form, note: e.target.value})} />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <Button type="submit" variant="success">Tạo booking</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      <Table>
        <TableHeader><TableRow>
          <TableHead>Mã booking</TableHead><TableHead>Khách hàng</TableHead><TableHead>Phòng</TableHead>
          <TableHead>Nhận phòng</TableHead><TableHead>Trả phòng</TableHead><TableHead>Trạng thái</TableHead><TableHead>Thao tác</TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {bookings.map((b: any) => {
            const cfg = statusConfig[b.status] || statusConfig.PENDING;
            return (
              <TableRow key={b.id}>
                <TableCell><span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{b.bookingCode}</span></TableCell>
                <TableCell className="font-medium">{b.customer?.fullName}</TableCell>
                <TableCell>{b.room?.roomNumber || <span className="text-gray-400">—</span>}</TableCell>
                <TableCell>{new Date(b.checkInDate).toLocaleDateString("vi-VN")}</TableCell>
                <TableCell>{new Date(b.checkOutDate).toLocaleDateString("vi-VN")}</TableCell>
                <TableCell><Badge variant={cfg.variant as any}>{cfg.label}</Badge></TableCell>
                <TableCell>
                  <div className="flex gap-1.5">
                    {b.status === "PENDING" && <Button size="sm" variant="outline" onClick={() => handleAction(b.id, "confirm")} title="Xác nhận"><Check className="w-3.5 h-3.5" /></Button>}
                    {b.status === "CONFIRMED" && <Button size="sm" variant="success" onClick={() => handleAction(b.id, "check-in")} title="Check-in"><LogIn className="w-3.5 h-3.5" /></Button>}
                    {b.status === "CHECKED_IN" && <Button size="sm" onClick={() => handleAction(b.id, "check-out")} title="Check-out"><LogOut className="w-3.5 h-3.5" /></Button>}
                    {!["CHECKED_IN","CHECKED_OUT","CANCELLED"].includes(b.status) && <Button size="sm" variant="ghost" onClick={() => handleAction(b.id, "cancel")} title="Huỷ"><Ban className="w-3.5 h-3.5 text-red-500" /></Button>}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
