"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

const statusLabels: Record<string, string> = { PENDING: "Can don", IN_PROGRESS: "Dang don", COMPLETED: "Hoan tat" };
const statusColors: Record<string, string> = { PENDING: "destructive", IN_PROGRESS: "warning", COMPLETED: "success" };

export default function HousekeepingPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const load = () => { fetch("/api/housekeeping").then(r => r.json()).then(setTasks); };
  useEffect(load, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/housekeeping", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Don phong</h1>
      <Table>
        <TableHeader><TableRow>
          <TableHead>Phong</TableHead><TableHead>Tang</TableHead><TableHead>Loai</TableHead>
          <TableHead>Trang thai</TableHead><TableHead>Nhan vien</TableHead><TableHead>Thao tac</TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {tasks.map((t: any) => (
            <TableRow key={t.id}>
              <TableCell className="font-bold">{t.room?.roomNumber}</TableCell>
              <TableCell>{t.room?.floor}</TableCell>
              <TableCell>{t.room?.roomType?.name}</TableCell>
              <TableCell><Badge variant={statusColors[t.status] as any}>{statusLabels[t.status]}</Badge></TableCell>
              <TableCell>{t.assignedTo?.fullName || "-"}</TableCell>
              <TableCell className="space-x-1">
                {t.status === "PENDING" && <Button size="sm" onClick={() => updateStatus(t.id, "IN_PROGRESS")}>Bat dau</Button>}
                {t.status === "IN_PROGRESS" && <Button size="sm" onClick={() => updateStatus(t.id, "COMPLETED")}>Hoan tat</Button>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
