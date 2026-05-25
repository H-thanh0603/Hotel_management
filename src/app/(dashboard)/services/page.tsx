"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Plus, X } from "lucide-react";

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", price: 0, unit: "", description: "" });

  const load = () => { fetch("/api/services").then(r => r.json()).then(setServices); };
  useEffect(load, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/services", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    load(); setShowForm(false); setForm({ name: "", price: 0, unit: "", description: "" });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dịch vụ</h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý dịch vụ khách sạn</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? <><X className="w-4 h-4" /> Đóng</> : <><Plus className="w-4 h-4" /> Thêm dịch vụ</>}
        </Button>
      </div>
      {showForm && (
        <Card className="mb-6 border-blue-100 bg-blue-50/30">
          <CardContent className="p-5">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Tên dịch vụ *" placeholder="VD: Ăn sáng buffet" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              <Input label="Đơn giá (VNĐ) *" type="number" placeholder="150000" value={form.price || ""} onChange={e => setForm({...form, price: +e.target.value})} required />
              <Input label="Đơn vị *" placeholder="VD: người/bữa, kg, lần" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} required />
              <Input label="Mô tả" placeholder="Mô tả dịch vụ..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" variant="success">Lưu dịch vụ</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      <Table>
        <TableHeader><TableRow>
          <TableHead>Tên dịch vụ</TableHead><TableHead>Đơn giá</TableHead><TableHead>Đơn vị</TableHead>
          <TableHead>Mô tả</TableHead><TableHead>Trạng thái</TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {services.map((s: any) => (
            <TableRow key={s.id}>
              <TableCell className="font-medium">{s.name}</TableCell>
              <TableCell className="font-semibold text-blue-600">{s.price.toLocaleString()}đ</TableCell>
              <TableCell>{s.unit}</TableCell>
              <TableCell className="text-gray-500 text-xs">{s.description || "—"}</TableCell>
              <TableCell><Badge variant={s.status === "ACTIVE" ? "success" : "secondary"}>{s.status === "ACTIVE" ? "Hoạt động" : "Tạm ngưng"}</Badge></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
