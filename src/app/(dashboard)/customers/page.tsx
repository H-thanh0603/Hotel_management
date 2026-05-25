"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Plus, X, Search } from "lucide-react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", identityNumber: "", nationality: "Việt Nam", address: "" });

  const load = () => { fetch(`/api/customers?search=${search}`).then(r => r.json()).then(setCustomers); };
  useEffect(load, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/customers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    load(); setShowForm(false); setForm({ fullName: "", phone: "", email: "", identityNumber: "", nationality: "Việt Nam", address: "" });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Khách hàng</h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý thông tin khách hàng</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? <><X className="w-4 h-4" /> Đóng</> : <><Plus className="w-4 h-4" /> Thêm khách</>}
        </Button>
      </div>
      <div className="relative max-w-sm mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input placeholder="Tìm theo tên, SĐT, email..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
      </div>
      {showForm && (
        <Card className="mb-6 border-blue-100 bg-blue-50/30">
          <CardContent className="p-5">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Họ tên *" placeholder="Nguyễn Văn A" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} required />
              <Input label="Số điện thoại" placeholder="0912345678" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              <Input label="Email" placeholder="email@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              <Input label="CCCD / Hộ chiếu" placeholder="079123456789" value={form.identityNumber} onChange={e => setForm({...form, identityNumber: e.target.value})} />
              <Input label="Quốc tịch" value={form.nationality} onChange={e => setForm({...form, nationality: e.target.value})} />
              <Input label="Địa chỉ" placeholder="123 Nguyễn Huệ, Q1" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
              <div className="md:col-span-3 flex justify-end">
                <Button type="submit" variant="success">Lưu khách hàng</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      <Table>
        <TableHeader><TableRow>
          <TableHead>Họ tên</TableHead><TableHead>Số điện thoại</TableHead><TableHead>Email</TableHead>
          <TableHead>CCCD</TableHead><TableHead>Quốc tịch</TableHead><TableHead>Địa chỉ</TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {customers.map((c: any) => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{c.fullName}</TableCell>
              <TableCell>{c.phone || "—"}</TableCell>
              <TableCell className="text-gray-500">{c.email || "—"}</TableCell>
              <TableCell><span className="font-mono text-xs">{c.identityNumber || "—"}</span></TableCell>
              <TableCell>{c.nationality || "—"}</TableCell>
              <TableCell className="text-gray-500 text-xs max-w-[150px] truncate">{c.address || "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
