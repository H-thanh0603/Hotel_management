"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Plus, X, Search, Edit2, Trash2, CheckCircle, RefreshCw, ConciergeBell } from "lucide-react";

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Form Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", price: 0, unit: "", description: "", status: "ACTIVE" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadServices = () => {
    setLoading(true);
    fetch("/api/services")
      .then((r) => r.json())
      .then((data) => {
        setServices(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((data) => {
        setServices(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({ name: "", price: 0, unit: "", description: "", status: "ACTIVE" });
    setError("");
    setShowModal(true);
  };

  const openEditModal = (service: any) => {
    setEditingId(service.id);
    setForm({
      name: service.name || "",
      price: service.price || 0,
      unit: service.unit || "",
      description: service.description || "",
      status: service.status || "ACTIVE",
    });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editingId ? `/api/services/${editingId}` : "/api/services";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không thể lưu dịch vụ");

      loadServices();
      setShowModal(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOrArchive = async (id: string, currentStatus: string) => {
    const isArchive = currentStatus === "ACTIVE";
    const confirmMsg = isArchive
      ? "Bạn có chắc chắn muốn ngưng hoạt động dịch vụ này?"
      : "Bạn có muốn kích hoạt lại dịch vụ này?";

    if (!confirm(confirmMsg)) return;

    try {
      if (isArchive) {
        await fetch(`/api/services/${id}`, { method: "DELETE" });
      } else {
        await fetch(`/api/services/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "ACTIVE" }),
        });
      }
      loadServices();
    } catch {
      alert("Lỗi khi thay đổi trạng thái dịch vụ");
    }
  };

  const filteredServices = services.filter((s) => {
    const matchesSearch =
      (s.name && s.name.toLowerCase().includes(search.toLowerCase())) ||
      (s.description && s.description.toLowerCase().includes(search.toLowerCase())) ||
      (s.unit && s.unit.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ConciergeBell className="w-6 h-6 text-blue-600" /> Quản Lý Dịch Vụ Khách Sạn
          </h1>
          <p className="text-sm text-slate-500 mt-1">Thêm mới, chỉnh sửa đơn giá và trạng thái phục vụ</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={loadServices} variant="outline" size="sm" className="gap-1">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Làm mới
          </Button>
          <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-500 text-white gap-2">
            <Plus className="w-4 h-4" /> Thêm Dịch Vụ
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Tìm theo tên dịch vụ, đơn vị..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 font-medium">Trạng thái:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Tất cả dịch vụ</option>
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="INACTIVE">Tạm ngưng</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-slate-500 text-sm">Đang tải danh sách dịch vụ...</div>
          ) : filteredServices.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">Không tìm thấy dịch vụ nào phù hợp</div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Tên Dịch Vụ</TableHead>
                  <TableHead>Đơn Giá (VND)</TableHead>
                  <TableHead>Đơn Vị Tính</TableHead>
                  <TableHead>Mô Tả</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead className="text-right">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((s) => (
                  <TableRow key={s.id} className="hover:bg-slate-50/60">
                    <TableCell className="font-bold text-slate-900">{s.name}</TableCell>
                    <TableCell className="font-semibold text-blue-600 font-mono">
                      {s.price?.toLocaleString("vi-VN")}đ
                    </TableCell>
                    <TableCell className="text-sm text-slate-700">{s.unit}</TableCell>
                    <TableCell className="text-xs text-slate-500 max-w-xs truncate">{s.description || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={s.status === "ACTIVE" ? "success" : "secondary"}>
                        {s.status === "ACTIVE" ? "Đang hoạt động" : "Tạm ngưng"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditModal(s)}
                          className="h-8 w-8 p-0 text-slate-600 hover:text-blue-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteOrArchive(s.id, s.status)}
                          className={`h-8 w-8 p-0 ${
                            s.status === "ACTIVE" ? "text-rose-500 hover:bg-rose-50" : "text-emerald-600 hover:bg-emerald-50"
                          }`}
                        >
                          {s.status === "ACTIVE" ? <Trash2 className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-lg">
                {editingId ? "Chỉnh Sửa Dịch Vụ" : "Thêm Dịch Vụ Mới"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">{error}</div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Tên dịch vụ *</label>
                <Input
                  required
                  placeholder="VD: Giặt ủi cao cấp"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Đơn giá (VND) *</label>
                  <Input
                    type="number"
                    required
                    min={0}
                    placeholder="100000"
                    value={form.price || ""}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Đơn vị tính *</label>
                  <Input
                    required
                    placeholder="kg / lần / bộ"
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Trạng thái</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ACTIVE">Hoạt động</option>
                  <option value="INACTIVE">Tạm ngưng</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Mô tả dịch vụ</label>
                <textarea
                  rows={3}
                  placeholder="Nhập ghi chú chi tiết về dịch vụ..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold">
                  {saving ? "Đang lưu..." : editingId ? "Cập Nhật" : "Tạo Mới"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
