"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Plus, X } from "lucide-react";

const roleLabels: Record<string, string> = {
  ADMIN: "Quản trị viên",
  RECEPTIONIST: "Lễ tân",
  HOUSEKEEPING: "Buồng phòng",
  CUSTOMER: "Khách hàng",
};

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", role: "RECEPTIONIST", password: "123456" });

  const load = () => { fetch("/api/users").then(r => r.json()).then(setUsers); };
  useEffect(load, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    load(); setShowForm(false); setForm({ fullName: "", email: "", phone: "", role: "RECEPTIONIST", password: "123456" });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nhân viên</h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý tài khoản nhân viên</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? <><X className="w-4 h-4" /> Đóng</> : <><Plus className="w-4 h-4" /> Thêm nhân viên</>}
        </Button>
      </div>
      {showForm && (
        <Card className="mb-6 border-blue-100 bg-blue-50/30">
          <CardContent className="p-5">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Họ tên *" placeholder="Nguyễn Văn A" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} required />
              <Input label="Email *" type="email" placeholder="email@hotelflow.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              <Input label="Số điện thoại" placeholder="0901000000" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              <Select label="Vai trò" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                <option value="RECEPTIONIST">Lễ tân</option>
                <option value="HOUSEKEEPING">Buồng phòng</option>
                <option value="ADMIN">Quản trị viên</option>
              </Select>
              <Input label="Mật khẩu" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
              <div className="flex items-end">
                <Button type="submit" variant="success">Lưu nhân viên</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      <Table>
        <TableHeader><TableRow>
          <TableHead>Họ tên</TableHead><TableHead>Email</TableHead><TableHead>SĐT</TableHead>
          <TableHead>Vai trò</TableHead><TableHead>Trạng thái</TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {users.map((u: any) => (
            <TableRow key={u.id}>
              <TableCell className="font-medium">{u.fullName}</TableCell>
              <TableCell className="text-gray-500">{u.email}</TableCell>
              <TableCell>{u.phone || "—"}</TableCell>
              <TableCell><Badge>{roleLabels[u.role] || u.role}</Badge></TableCell>
              <TableCell><Badge variant={u.status === "ACTIVE" ? "success" : "destructive"}>{u.status === "ACTIVE" ? "Hoạt động" : "Khoá"}</Badge></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
