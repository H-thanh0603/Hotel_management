"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, BedDouble, Users, Maximize, X } from "lucide-react";

export default function RoomTypesPage() {
  const [types, setTypes] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", pricePerNight: 0, maxGuests: 2, bedCount: 1, area: 0 });

  useEffect(() => { fetch("/api/room-types").then(r => r.json()).then(setTypes); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/room-types", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await fetch("/api/room-types").then(r => r.json());
    setTypes(data);
    setShowForm(false);
    setForm({ name: "", description: "", pricePerNight: 0, maxGuests: 2, bedCount: 1, area: 0 });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loại phòng</h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý các hạng phòng và giá</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? <><X className="w-4 h-4" /> Đóng</> : <><Plus className="w-4 h-4" /> Thêm loại phòng</>}
        </Button>
      </div>
      {showForm && (
        <Card className="mb-6 border-blue-100 bg-blue-50/30">
          <CardContent className="p-5">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Tên loại phòng" placeholder="VD: Deluxe Room" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              <Input label="Mô tả" placeholder="Mô tả ngắn..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              <Input label="Giá / đêm (VNĐ)" type="number" placeholder="500000" value={form.pricePerNight || ""} onChange={e => setForm({...form, pricePerNight: +e.target.value})} required />
              <Input label="Số khách tối đa" type="number" value={form.maxGuests || ""} onChange={e => setForm({...form, maxGuests: +e.target.value})} required />
              <Input label="Số giường" type="number" value={form.bedCount || ""} onChange={e => setForm({...form, bedCount: +e.target.value})} required />
              <Input label="Diện tích (m²)" type="number" value={form.area || ""} onChange={e => setForm({...form, area: +e.target.value})} />
              <div className="md:col-span-3 flex justify-end">
                <Button type="submit" variant="success">Lưu loại phòng</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {types.map((t: any) => (
          <Card key={t.id} className="group hover:scale-[1.01] transition-all duration-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{t.name}</CardTitle>
                <Badge variant="success">{t._count?.rooms || 0} phòng</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-3">{t.description}</p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-lg font-bold text-blue-600">{(t.pricePerNight/1000).toFixed(0)}K</p>
                  <p className="text-[10px] text-gray-500">VNĐ/đêm</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="flex items-center justify-center gap-1">
                    <Users className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-lg font-bold">{t.maxGuests}</span>
                  </div>
                  <p className="text-[10px] text-gray-500">Khách</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="flex items-center justify-center gap-1">
                    <BedDouble className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-lg font-bold">{t.bedCount}</span>
                  </div>
                  <p className="text-[10px] text-gray-500">Giường</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
