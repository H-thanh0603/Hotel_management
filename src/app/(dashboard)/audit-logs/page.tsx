"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { ShieldAlert, Search, RefreshCw } from "lucide-react";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadLogs = () => {
    setLoading(true);
    fetch("/api/audit-logs?limit=100")
      .then((r) => r.json())
      .then((data) => {
        setLogs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetch("/api/audit-logs?limit=100")
      .then((r) => r.json())
      .then((data) => {
        setLogs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredLogs = logs.filter((log) => {
    const q = search.toLowerCase();
    return (
      (log.action && log.action.toLowerCase().includes(q)) ||
      (log.entity && log.entity.toLowerCase().includes(q)) ||
      (log.detail && log.detail.toLowerCase().includes(q)) ||
      (log.userRole && log.userRole.toLowerCase().includes(q))
    );
  });

  const actionBadges: Record<string, string> = {
    LOGIN: "bg-emerald-50 text-emerald-700 border-emerald-200",
    LOGIN_FAILED: "bg-red-50 text-red-700 border-red-200",
    CREATE: "bg-blue-50 text-blue-700 border-blue-200",
    UPDATE: "bg-amber-50 text-amber-700 border-amber-200",
    DELETE: "bg-rose-50 text-rose-700 border-rose-200",
    ARCHIVE: "bg-slate-100 text-slate-700 border-slate-200",
    CANCEL_BOOKING: "bg-purple-50 text-purple-700 border-purple-200",
    CHECK_IN: "bg-teal-50 text-teal-700 border-teal-200",
    CHECK_OUT: "bg-indigo-50 text-indigo-700 border-indigo-200",
    PAYMENT: "bg-green-50 text-green-700 border-green-200",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-blue-600" /> Nhật Ký Hoạt Động Hệ Thống (Audit Logs)
          </h1>
          <p className="text-sm text-slate-500 mt-1">Giám sát các thao tác người dùng, đăng nhập và bảo mật</p>
        </div>
        <button
          onClick={loadLogs}
          className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Làm mới
        </button>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Tìm theo hành động, đối tượng, mô tả..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
        </div>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-slate-500 text-sm">Đang tải nhật ký hệ thống...</div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">Không tìm thấy nhật ký phù hợp</div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[180px]">Thời gian</TableHead>
                  <TableHead>Hành động</TableHead>
                  <TableHead>Đối tượng</TableHead>
                  <TableHead>Mô tả chi tiết</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => {
                  const badgeClass = actionBadges[log.action] || "bg-slate-100 text-slate-700 border-slate-200";
                  return (
                    <TableRow key={log.id} className="hover:bg-slate-50/60">
                      <TableCell className="text-xs font-mono text-slate-500">
                        {new Date(log.createdAt).toLocaleString("vi-VN")}
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${badgeClass}`}>
                          {log.action}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-slate-800">{log.entity}</TableCell>
                      <TableCell className="text-sm text-slate-600 max-w-xs truncate">{log.detail || "-"}</TableCell>
                      <TableCell className="text-xs text-slate-500 font-medium">{log.userRole || "Hệ thống"}</TableCell>
                      <TableCell className="text-xs font-mono text-slate-400">{log.ip || "127.0.0.1"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
