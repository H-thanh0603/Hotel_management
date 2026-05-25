"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Plus, X, Check, LogIn, LogOut, Ban, BedDouble, History, CalendarCheck, UserPlus } from "lucide-react";
import WalkinBookingForm from "@/components/WalkinBookingForm";

const statusConfig: Record<string, { label: string; variant: string }> = {
  PENDING: { label: "Chờ xác nhận", variant: "warning" },
  CONFIRMED: { label: "Đã xác nhận", variant: "info" },
  CHECKED_IN: { label: "Đang ở", variant: "success" },
  CHECKED_OUT: { label: "Đã trả phòng", variant: "secondary" },
  CANCELLED: { label: "Đã huỷ", variant: "destructive" },
  NO_SHOW: { label: "Không đến", variant: "outline" },
};

export default function BookingsPage() {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const isStaff = role === "ADMIN" || role === "RECEPTIONIST";

  const [bookings, setBookings] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showWalkin, setShowWalkin] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ customerId: "", roomTypeId: "", roomId: "", checkInDate: "", checkOutDate: "", numberOfGuests: 1, note: "" });

  const load = () => {
    if (isStaff) {
      fetch("/api/bookings").then(r => r.json()).then(setBookings);
      fetch("/api/customers").then(r => r.json()).then(setCustomers);
    } else {
      fetch("/api/bookings/my").then(r => r.json()).then(setBookings);
    }
    fetch("/api/room-types").then(r => r.json()).then(setRoomTypes);
    fetch("/api/rooms").then(r => r.json()).then(setRooms);
  };
  useEffect(load, [isStaff]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setMessage("");
    const url = isStaff ? "/api/bookings" : "/api/bookings/customer";
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    if (res.ok) { setMessage(`Đặt phòng thành công! Mã: ${data.bookingCode}`); setShowForm(false); load(); }
    else { setMessage(data.error || "Có lỗi xảy ra"); }
  };

  const handleAction = async (id: string, action: string) => {
    await fetch(`/api/bookings/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) });
    load();
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isStaff ? "Quản lý đặt phòng" : "Đặt phòng"}</h1>
          <p className="text-gray-500 text-sm mt-1">{isStaff ? "Tạo và theo dõi booking" : "Xem phòng trống và đặt phòng trực tuyến"}</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? <><X className="w-4 h-4" /> Đóng</> : <><Plus className="w-4 h-4" /> {isStaff ? "Tạo booking" : "Đặt phòng mới"}</>}
        </Button>
        {isStaff && <Button variant="success" onClick={() => { setShowWalkin(!showWalkin); setShowForm(false); }}>
          {showWalkin ? <><X className="w-4 h-4" /> Đóng</> : <><UserPlus className="w-4 h-4" /> Khách đến trực tiếp</>}
        </Button>}
      </div>

      {message && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${message.includes("thành công") ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-red-50 border border-red-200 text-red-700"}`}>{message}</div>
      )}

      {showWalkin && isStaff && <WalkinBookingForm roomTypes={roomTypes} rooms={rooms} onClose={() => setShowWalkin(false)} onSuccess={load} />}

      {showForm && (
        <Card className="mb-6 border-blue-100 bg-blue-50/30"><CardContent className="p-5">
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isStaff && (
              <Select label="Khách hàng *" value={form.customerId} onChange={e => setForm({...form, customerId: e.target.value})} required>
                <option value="">-- Chọn khách hàng --</option>
                {customers.map((c: any) => <option key={c.id} value={c.id}>{c.fullName} - {c.phone}</option>)}
              </Select>
            )}
            <Select label="Loại phòng *" value={form.roomTypeId} onChange={e => setForm({...form, roomTypeId: e.target.value})} required>
              <option value="">-- Chọn loại phòng --</option>
              {roomTypes.map((t: any) => <option key={t.id} value={t.id}>{t.name} — {t.pricePerNight.toLocaleString()}đ/đêm</option>)}
            </Select>
            {isStaff && (
              <Select label="Phòng (tuỳ chọn)" value={form.roomId} onChange={e => setForm({...form, roomId: e.target.value})}>
                <option value="">-- Hệ thống tự chọn --</option>
                {rooms.filter(r => r.status === "AVAILABLE").map((r: any) => <option key={r.id} value={r.id}>{r.roomNumber} - {r.roomType?.name}</option>)}
              </Select>
            )}
            <Input label="Ngày nhận phòng *" type="date" value={form.checkInDate} onChange={e => setForm({...form, checkInDate: e.target.value})} required />
            <Input label="Ngày trả phòng *" type="date" value={form.checkOutDate} onChange={e => setForm({...form, checkOutDate: e.target.value})} required />
            <Input label="Số khách" type="number" value={form.numberOfGuests} onChange={e => setForm({...form, numberOfGuests: +e.target.value})} min={1} />
            <div className="md:col-span-3"><Input label="Ghi chú" placeholder="Yêu cầu đặc biệt..." value={form.note} onChange={e => setForm({...form, note: e.target.value})} /></div>
            <div className="md:col-span-3 flex justify-end"><Button type="submit" variant="success">Xác nhận đặt phòng</Button></div>
          </form>
        </CardContent></Card>
      )}

      {/* Room types for customer */}
      {!isStaff && (
        <>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><BedDouble className="w-5 h-5 text-blue-500" /> Các loại phòng</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {roomTypes.map((t: any) => (
              <Card key={t.id} className="hover:scale-[1.01] transition-all"><CardContent className="p-4">
                <h3 className="font-semibold text-gray-900">{t.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{t.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-bold text-blue-600">{(t.pricePerNight/1000).toFixed(0)}K<span className="text-xs text-gray-400">/đêm</span></span>
                  <span className="text-xs text-gray-500">{t.maxGuests} khách · {t.bedCount} giường</span>
                </div>
              </CardContent></Card>
            ))}
          </div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><History className="w-5 h-5 text-blue-500" /> Lịch sử đặt phòng</h2>
        </>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-12 text-gray-400"><CalendarCheck className="w-10 h-10 mx-auto mb-2" /><p>{isStaff ? "Chưa có booking nào" : "Bạn chưa có booking nào"}</p></div>
      ) : (
        <Table><TableHeader><TableRow>
          <TableHead>Mã booking</TableHead>{isStaff && <TableHead>Khách hàng</TableHead>}<TableHead>{isStaff ? "Phòng" : "Loại phòng"}</TableHead>
          <TableHead>Nhận phòng</TableHead><TableHead>Trả phòng</TableHead><TableHead>Trạng thái</TableHead><TableHead>Thao tác</TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {bookings.map((b: any) => {
            const cfg = statusConfig[b.status] || statusConfig.PENDING;
            return (
              <TableRow key={b.id}>
                <TableCell><span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{b.bookingCode}</span></TableCell>
                {isStaff && <TableCell className="font-medium">{b.customer?.fullName}</TableCell>}
                <TableCell>
                  {isStaff ? (b.room?.roomNumber || "—") : b.roomType?.name}
                  {b.bookingType === "HOURLY" && <Badge variant="info" className="ml-1.5 text-[9px]">{b.hours}h</Badge>}
                </TableCell>
                <TableCell>{new Date(b.checkInDate).toLocaleDateString("vi-VN")}</TableCell>
                <TableCell>{new Date(b.checkOutDate).toLocaleDateString("vi-VN")}</TableCell>
                <TableCell><Badge variant={cfg.variant as any}>{cfg.label}</Badge></TableCell>
                <TableCell><div className="flex gap-1.5">
                  {isStaff && b.status === "PENDING" && <Button size="sm" variant="outline" onClick={() => handleAction(b.id, "confirm")} title="Xác nhận"><Check className="w-3.5 h-3.5" /></Button>}
                  {isStaff && b.status === "CONFIRMED" && <Button size="sm" variant="success" onClick={() => handleAction(b.id, "check-in")} title="Check-in"><LogIn className="w-3.5 h-3.5" /></Button>}
                  {isStaff && b.status === "CHECKED_IN" && <Button size="sm" onClick={() => handleAction(b.id, "check-out")} title="Check-out"><LogOut className="w-3.5 h-3.5" /></Button>}
                  {["PENDING","CONFIRMED"].includes(b.status) && <Button size="sm" variant="ghost" onClick={() => handleAction(b.id, "cancel")} title="Huỷ"><Ban className="w-3.5 h-3.5 text-red-500" /></Button>}
                </div></TableCell>
              </TableRow>
            );
          })}
        </TableBody></Table>
      )}
    </div>
  );
}
