"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Loai phong</h1>
        <Button onClick={() => setShowForm(!showForm)}>+ Them loai phong</Button>
      </div>
      {showForm && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <Input placeholder="Ten loai phong" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              <Input placeholder="Mo ta" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              <Input type="number" placeholder="Gia/dem" value={form.pricePerNight || ""} onChange={e => setForm({...form, pricePerNight: +e.target.value})} required />
              <Input type="number" placeholder="So nguoi toi da" value={form.maxGuests || ""} onChange={e => setForm({...form, maxGuests: +e.target.value})} required />
              <Input type="number" placeholder="So giuong" value={form.bedCount || ""} onChange={e => setForm({...form, bedCount: +e.target.value})} required />
              <Input type="number" placeholder="Dien tich (m2)" value={form.area || ""} onChange={e => setForm({...form, area: +e.target.value})} />
              <Button type="submit">Luu</Button>
            </form>
          </CardContent>
        </Card>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {types.map((t: any) => (
          <Card key={t.id}>
            <CardHeader><CardTitle className="text-lg">{t.name}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">{t.description}</p>
              <div className="mt-2 space-y-1 text-sm">
                <p><strong>Gia:</strong> {t.pricePerNight.toLocaleString()}d/dem</p>
                <p><strong>Toi da:</strong> {t.maxGuests} nguoi | {t.bedCount} giuong</p>
                <p><strong>Dien tich:</strong> {t.area}m2</p>
                <p><strong>So phong:</strong> {t._count?.rooms || 0}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
