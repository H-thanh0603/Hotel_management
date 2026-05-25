"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

const statusLabels: Record<string, string> = {
  PENDING: "Cho xac nhan", CONFIRMED: "Da xac nhan", CHECKED_IN: "Dang o",
  CHECKED_OUT: "Da tra", CANCELLED: "Da huy", NO_SHOW: "Khong den",
};
const statusColors: Record<string, string> = {
  PENDING: "warning", CONFIRMED: "default", CHECKED_IN: "success",
  CHECKED_OUT: "secondary", CANCELLED: "destructive", NO_SHOW: "outline",
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
    await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    load(); setShowForm(false);
  };

  const handleAction = async (id: string, action: string) => {
    await fetch(`/api/bookings/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) });
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dat phong</h1>
        <Button onClick={() => setShowForm(!showForm)}>+ Tao booking</Button>
      </div>
      {showForm && (
        <Card className="mb-6"><CardContent className="p-4">
          <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
            <Select value={form.customerId} onChange={e => setForm({...form, customerId: e.target.value})} required>
              <option value="">-- Chon khach --</option>
              {customers.map((c: any) => <option key={c.id} value={c.id}>{c.fullName} - {c.phone}</option>)}
            </Select>
            <Select value={form.roomTypeId} onChange={e => setForm({...form, roomTypeId: e.target.value})} required>
              <option value="">-- Loai phong --</option>
              {roomTypes.map((t: any) => <option key={t.id} value={t.id}>{t.name} - {t.pricePerNight.toLocaleString()}d</option>)}
            </Select>
            <Select value={form.roomId} onChange={e => setForm({...form, roomId: e.target.value})}>
              <option value="">-- Phong (tuy chon) --</option>
              {rooms.filter(r => r.status === "AVAILABLE").map((r: any) => <option key={r.id} value={r.id}>{r.roomNumber} - {r.roomType?.name}</option>)}
            </Select>
            <Input type="number" placeholder="So khach" value={form.numberOfGuests} onChange={e => setForm({...form, numberOfGuests: +e.target.value})} min={1} />
            <Input type="date" value={form.checkInDate} onChange={e => setForm({...form, checkInDate: e.target.value})} required />
            <Input type="date" value={form.checkOutDate} onChange={e => setForm({...form, checkOutDate: e.target.value})} required />
            <Input placeholder="Ghi chu" value={form.note} onChange={e => setForm({...form, note: e.target.value})} />
            <Button type="submit">Tao booking</Button>
          </form>
        </CardContent></Card>
      )}
      <Table>
        <TableHeader><TableRow>
          <TableHead>Ma</TableHead><TableHead>Khach</TableHead><TableHead>Phong</TableHead>
          <TableHead>Nhan</TableHead><TableHead>Tra</TableHead><TableHead>Trang thai</TableHead><TableHead>Thao tac</TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {bookings.map((b: any) => (
            <TableRow key={b.id}>
              <TableCell className="font-mono text-xs">{b.bookingCode}</TableCell>
              <TableCell>{b.customer?.fullName}</TableCell>
              <TableCell>{b.room?.roomNumber || "-"}</TableCell>
              <TableCell>{new Date(b.checkInDate).toLocaleDateString("vi")}</TableCell>
              <TableCell>{new Date(b.checkOutDate).toLocaleDateString("vi")}</TableCell>
              <TableCell><Badge variant={statusColors[b.status] as any}>{statusLabels[b.status]}</Badge></TableCell>
              <TableCell className="space-x-1">
                {b.status === "PENDING" && <Button size="sm" onClick={() => handleAction(b.id, "confirm")}>Xac nhan</Button>}
                {b.status === "CONFIRMED" && <Button size="sm" onClick={() => handleAction(b.id, "check-in")}>Check-in</Button>}
                {b.status === "CHECKED_IN" && <Button size="sm" onClick={() => handleAction(b.id, "check-out")}>Check-out</Button>}
                {!["CHECKED_IN","CHECKED_OUT","CANCELLED"].includes(b.status) && <Button size="sm" variant="destructive" onClick={() => handleAction(b.id, "cancel")}>Huy</Button>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
