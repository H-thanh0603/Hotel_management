"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", identityNumber: "", nationality: "Viet Nam", address: "" });

  const load = () => { fetch(`/api/customers?search=${search}`).then(r => r.json()).then(setCustomers); };
  useEffect(load, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/customers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    load(); setShowForm(false); setForm({ fullName: "", phone: "", email: "", identityNumber: "", nationality: "Viet Nam", address: "" });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Khach hang</h1>
        <Button onClick={() => setShowForm(!showForm)}>+ Them khach</Button>
      </div>
      <Input placeholder="Tim kiem theo ten, SDT, email..." value={search} onChange={e => setSearch(e.target.value)} className="mb-4 max-w-md" />
      {showForm && (
        <Card className="mb-6"><CardContent className="p-4">
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <Input placeholder="Ho ten *" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} required />
            <Input placeholder="SDT" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            <Input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            <Input placeholder="CCCD/Ho chieu" value={form.identityNumber} onChange={e => setForm({...form, identityNumber: e.target.value})} />
            <Input placeholder="Quoc tich" value={form.nationality} onChange={e => setForm({...form, nationality: e.target.value})} />
            <Input placeholder="Dia chi" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
            <Button type="submit">Luu</Button>
          </form>
        </CardContent></Card>
      )}
      <Table>
        <TableHeader><TableRow>
          <TableHead>Ho ten</TableHead><TableHead>SDT</TableHead><TableHead>Email</TableHead>
          <TableHead>CCCD</TableHead><TableHead>Quoc tich</TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {customers.map((c: any) => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{c.fullName}</TableCell>
              <TableCell>{c.phone}</TableCell>
              <TableCell>{c.email}</TableCell>
              <TableCell>{c.identityNumber}</TableCell>
              <TableCell>{c.nationality}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
