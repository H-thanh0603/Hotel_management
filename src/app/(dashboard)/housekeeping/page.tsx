"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Play, CheckCircle, Sparkles } from "lucide-react";

const statusConfig: Record<string, { label: string; variant: string }> = {
  PENDING: { label: "Cần dọn", variant: "destructive" },
  IN_PROGRESS: { label: "Đang dọn", variant: "warning" },
  COMPLETED: { label: "Hoàn tất", variant: "success" },
};

export default function HousekeepingPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const load = () => { fetch("/api/housekeeping").then(r => r.json()).then(setTasks); };
  useEffect(load, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/housekeeping", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    load();
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dọn phòng</h1>
        <p className="text-gray-500 text-sm mt-1">Quản lý tình trạng vệ sinh phòng</p>
      </div>
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <Sparkles className="w-12 h-12 mb-3" />
          <p>Tất cả phòng đã sạch sẽ!</p>
        </div>
      ) : (
        <Table>
          <TableHeader><TableRow>
            <TableHead>Phòng</TableHead><TableHead>Tầng</TableHead><TableHead>Loại phòng</TableHead>
            <TableHead>Trạng thái</TableHead><TableHead>Nhân viên</TableHead><TableHead>Thao tác</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {tasks.map((t: any) => {
              const cfg = statusConfig[t.status] || statusConfig.PENDING;
              return (
                <TableRow key={t.id}>
                  <TableCell className="font-bold text-lg">{t.room?.roomNumber}</TableCell>
                  <TableCell>Tầng {t.room?.floor}</TableCell>
                  <TableCell>{t.room?.roomType?.name}</TableCell>
                  <TableCell><Badge variant={cfg.variant as any}>{cfg.label}</Badge></TableCell>
                  <TableCell>{t.assignedTo?.fullName || <span className="text-gray-400">Chưa phân công</span>}</TableCell>
                  <TableCell>
                    <div className="flex gap-1.5">
                      {t.status === "PENDING" && (
                        <Button size="sm" variant="outline" onClick={() => updateStatus(t.id, "IN_PROGRESS")}>
                          <Play className="w-3.5 h-3.5 mr-1" /> Bắt đầu
                        </Button>
                      )}
                      {t.status === "IN_PROGRESS" && (
                        <Button size="sm" variant="success" onClick={() => updateStatus(t.id, "COMPLETED")}>
                          <CheckCircle className="w-3.5 h-3.5 mr-1" /> Hoàn tất
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
