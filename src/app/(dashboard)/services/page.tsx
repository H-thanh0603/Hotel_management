"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dich vu</h1>
        <Button onClick={() => setShowForm(!showForm)}>+ Them dich vu</Button>
      </div>
      {showForm && (
        <Card className="mb-6"><CardContent className="p-4">
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <Input placeholder="Ten dich vu *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            <Input type="number" placeholder="Gia *" value={form.price || ""} onChange={e => setForm({...form, price: +e.target.value})} required />
            <Input placeholder="Don vi (vd: lan, kg, phut)" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} required />
            <Input placeholder="Mo ta" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            <Button type="submit">Luu</Button>
          </form>
        </CardContent></Card>
      )}
      <Table>
        <TableHeader><TableRow>
          <TableHead>Ten</TableHead><TableHead>Gia</TableHead><TableHead>Don vi</TableHead>
          <TableHead>Mo ta</TableHead><TableHead>Trang thai</TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {services.map((s: any) => (
            <TableRow key={s.id}>
              <TableCell className="font-medium">{s.name}</TableCell>
              <TableCell>{s.price.toLocaleString()}d</TableCell>
              <TableCell>{s.unit}</TableCell>
              <TableCell className="text-gray-500">{s.description}</TableCell>
              <TableCell><Badge variant={s.status === "ACTIVE" ? "success" : "secondary"}>{s.status}</Badge></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
