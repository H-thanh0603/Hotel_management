"use client";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Receipt } from "lucide-react";

const statusConfig: Record<string, { label: string; variant: string }> = {
  UNPAID: { label: "Chưa thanh toán", variant: "destructive" },
  PAID: { label: "Đã thanh toán", variant: "success" },
  PARTIAL: { label: "Thanh toán một phần", variant: "warning" },
  REFUNDED: { label: "Đã hoàn tiền", variant: "info" },
  CANCELLED: { label: "Đã huỷ", variant: "outline" },
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  useEffect(() => { fetch("/api/invoices").then(r => r.json()).then(setInvoices); }, []);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hoá đơn</h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý hoá đơn và thanh toán</p>
        </div>
      </div>
      {invoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <Receipt className="w-12 h-12 mb-3" />
          <p>Chưa có hoá đơn nào</p>
        </div>
      ) : (
        <Table>
          <TableHeader><TableRow>
            <TableHead>Mã hoá đơn</TableHead><TableHead>Khách hàng</TableHead><TableHead>Phòng</TableHead>
            <TableHead>Tiền phòng</TableHead><TableHead>Dịch vụ</TableHead><TableHead>Tổng cộng</TableHead><TableHead>Trạng thái</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {invoices.map((inv: any) => {
              const cfg = statusConfig[inv.paymentStatus] || statusConfig.UNPAID;
              return (
                <TableRow key={inv.id}>
                  <TableCell><span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{inv.invoiceCode}</span></TableCell>
                  <TableCell className="font-medium">{inv.booking?.customer?.fullName}</TableCell>
                  <TableCell>{inv.booking?.room?.roomNumber || "—"}</TableCell>
                  <TableCell>{inv.roomAmount.toLocaleString()}đ</TableCell>
                  <TableCell>{inv.serviceAmount.toLocaleString()}đ</TableCell>
                  <TableCell className="font-bold text-blue-600">{inv.totalAmount.toLocaleString()}đ</TableCell>
                  <TableCell><Badge variant={cfg.variant as any}>{cfg.label}</Badge></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
