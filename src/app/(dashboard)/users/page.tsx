"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

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

  const roleLabels: Record<string, string> = { ADMIN: "Admin", RECEPTIONIST: "Le tan", HOUSEKEEPING: "Buong phong", CUSTOMER: "Khach" };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Nhan vien</h1>
        <Button onClick={() => setShowForm(!showForm)}>+ Them nhan vien</Button>
      </div>
      {showForm && (
        <Card className="mb-6"><CardContent className="p-4">
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <Input placeholder="Ho ten *" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} required />
            <Input placeholder="Email *" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            <Input placeholder="SDT" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            <Select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
              <option value="RECEPTIONIST">Le tan</option>
              <option value="HOUSEKEEPING">Buong phong</option>
              <option value="ADMIN">Admin</option>
            </Select>
            <Input placeholder="Mat khau" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            <Button type="submit">Luu</Button>
          </form>
        </CardContent></Card>
      )}
      <Table>
        <TableHeader><TableRow>
          <TableHead>Ho ten</TableHead><TableHead>Email</TableHead><TableHead>SDT</TableHead>
          <TableHead>Vai tro</TableHead><TableHead>Trang thai</TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {users.map((u: any) => (
            <TableRow key={u.id}>
              <TableCell className="font-medium">{u.fullName}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.phone}</TableCell>
              <TableCell><Badge>{roleLabels[u.role] || u.role}</Badge></TableCell>
              <TableCell><Badge variant={u.status === "ACTIVE" ? "success" : "destructive"}>{u.status}</Badge></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
