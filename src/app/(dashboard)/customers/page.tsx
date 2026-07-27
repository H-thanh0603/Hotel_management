"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Plus, X, Search, Edit2, Trash2, Users, RefreshCw, Eye, EyeOff } from "lucide-react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showFullPII, setShowFullPII] = useState<Record<string, boolean>>({});

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    identityNumber: "",
    nationality: "Việt Nam",
    address: "",
    note: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadCustomers = () => {
    setLoading(true);
    fetch(`/api/customers?search=${search}`)
      .then((r) => r.json())
      .then((data) => {
        setCustomers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetch(`/api/customers?search=${search}`)
      .then((r) => r.json())
      .then((data) => {
        setCustomers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [search]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      fullName: "",
      phone: "",
      email: "",
      identityNumber: "",
      nationality: "Việt Nam",
      address: "",
      note: "",
    });
    setError("");
    setShowModal(true);
  };

  const openEditModal = (c: any) => {
    setEditingId(c.id);
    setForm({
      fullName: c.fullName || "",
      phone: c.phone || "",
      email: c.email || "",
      identityNumber: c.identityNumber || "",
      nationality: c.nationality || "Việt Nam",
      address: c.address || "",
      note: c.note || "",
    });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editingId ? `/api/customers/${editingId}` : "/api/customers";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không thể lưu thông tin khách hàng");

      loadCustomers();
      setShowModal(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa khách hàng "${name}"?`)) return;

    try {
      const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi xóa khách hàng");

      loadCustomers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const maskIdentity = (idNumber: string, isVisible: boolean) => {
    if (!idNumber) return "-";
    if (isVisible || idNumber.length < 6) return idNumber;
    return idNumber.substring(0, 3) + "*****" + idNumber.substring(idNumber.length - 3);
  };

  const togglePIIVisibility = (id: string) => {
    setShowFullPII((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" /> Quản Lý Khách Hàng (CRM)
          </h1>
          <p className="text-sm text-slate-500 mt-1">Lưu trữ thông tin cá nhân, CCCD, quốc tịch và ghi chú lưu trú</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={loadCustomers} variant="outline" size="sm" className="gap-1">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Làm mới
          </Button>
          <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-500 text-white gap-2">
            <Plus className="w-4 h-4" /> Thêm Khách Hàng
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Tìm theo tên khách, SĐT, email, CCCD..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-slate-500 text-sm">Đang tải hồ sơ khách hàng...</div>
          ) : customers.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">Không tìm thấy khách hàng nào</div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Họ và Tên Khách</TableHead>
                  <TableHead>Số Điện Thoại</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>CCCD / Hộ Chiếu</TableHead>
                  <TableHead>Quốc Tịch</TableHead>
                  <TableHead>Địa Chỉ</TableHead>
                  <TableHead className="text-right">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((c) => (
                  <TableRow key={c.id} className="hover:bg-slate-50/60">
                    <TableCell className="font-bold text-slate-900">{c.fullName}</TableCell>
                    <TableCell className="text-slate-700 font-mono text-xs">{c.phone || "-"}</TableCell>
                    <TableCell className="text-slate-500 text-xs">{c.email || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 font-mono text-xs text-slate-800">
                        <span>{maskIdentity(c.identityNumber, !!showFullPII[c.id])}</span>
                        {c.identityNumber && (
                          <button
                            onClick={() => togglePIIVisibility(c.id)}
                            className="text-slate-400 hover:text-blue-600 transition-colors"
                          >
                            {showFullPII[c.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-700">{c.nationality || "-"}</TableCell>
                    <TableCell className="text-xs text-slate-500 max-w-[180px] truncate">{c.address || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditModal(c)}
                          className="h-8 w-8 p-0 text-slate-600 hover:text-blue-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(c.id, c.fullName)}
                          className="h-8 w-8 p-0 text-rose-500 hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-lg">
                {editingId ? "Chỉnh Sửa Khách Hàng" : "Thêm Khách Hàng Mới"}
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
                <label className="text-xs font-semibold text-slate-700">Họ và tên *</label>
                <Input
                  required
                  placeholder="Nguyễn Văn A"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Số điện thoại</label>
                  <Input
                    placeholder="0912345678"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Email</label>
                  <Input
                    type="email"
                    placeholder="khach@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Số CCCD / Hộ chiếu</label>
                  <Input
                    placeholder="079123456789"
                    value={form.identityNumber}
                    onChange={(e) => setForm({ ...form, identityNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Quốc tịch</label>
                  <Input
                    placeholder="Việt Nam"
                    value={form.nationality}
                    onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Địa chỉ cư trú</label>
                <Input
                  placeholder="123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Ghi chú nội bộ</label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú sở thích, lưu ý đặc biệt..."
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
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
