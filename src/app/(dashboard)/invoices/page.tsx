"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

const paymentStatusLabels: Record<string, string> = {
  UNPAID: "Chua thanh toan", PAID: "Da thanh toan", PARTIAL: "Mot phan", REFUNDED: "Hoan tien", CANCELLED: "Da huy",
};
const paymentStatusColors: Record<string, string> = {
  UNPAID: "destructive", PAID: "success", PARTIAL: "warning", REFUNDED: "secondary", CANCELLED: "outline",
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  useEffect(() => { fetch("/api/invoices").then(r => r.json()).then(setInvoices); }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Hoa don</h1>
      <Table>
        <TableHeader><TableRow>
          <TableHead>Ma HD</TableHead><TableHead>Khach</TableHead><TableHead>Phong</TableHead>
          <TableHead>Tien phong</TableHead><TableHead>Dich vu</TableHead><TableHead>Tong</TableHead><TableHead>Trang thai</TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {invoices.map((inv: any) => (
            <TableRow key={inv.id}>
              <TableCell className="font-mono text-xs">{inv.invoiceCode}</TableCell>
              <TableCell>{inv.booking?.customer?.fullName}</TableCell>
              <TableCell>{inv.booking?.room?.roomNumber || "-"}</TableCell>
              <TableCell>{inv.roomAmount.toLocaleString()}d</TableCell>
              <TableCell>{inv.serviceAmount.toLocaleString()}d</TableCell>
              <TableCell className="font-bold">{inv.totalAmount.toLocaleString()}d</TableCell>
              <TableCell><Badge variant={paymentStatusColors[inv.paymentStatus] as any}>{paymentStatusLabels[inv.paymentStatus]}</Badge></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
