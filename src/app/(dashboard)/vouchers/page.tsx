"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Plus, X, Search, Edit2, Trash2, CheckCircle, RefreshCw, Ticket } from "lucide-react";

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: "",
    description: "",
    discountType: "PERCENT",
    discountAmount: 10,
    minOrderAmount: 0,
    maxDiscount: 0,
    maxUses: 100,
    validUntil: "2026-12-31",
    status: "ACTIVE",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadVouchers = () => {
    setLoading(true);
    fetch("/api/vouchers")
      .then((r) => r.json())
      .then((data) => {
        setVouchers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetch("/api/vouchers")
      .then((r) => r.json())
      .then((data) => {
        setVouchers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      code: "",
      description: "",
      discountType: "PERCENT",
      discountAmount: 10,
      minOrderAmount: 0,
      maxDiscount: 0,
      maxUses: 100,
      validUntil: "2026-12-31",
      status: "ACTIVE",
    });
    setError("");
    setShowModal(true);
  };

  const openEditModal = (v: any) => {
    setEditingId(v.id);
    setForm({
      code: v.code || "",
      description: v.description || "",
      discountType: v.discountType || "PERCENT",
      discountAmount: v.discountAmount || 0,
      minOrderAmount: v.minOrderAmount || 0,
      maxDiscount: v.maxDiscount || 0,
      maxUses: v.maxUses || 100,
      validUntil: v.validUntil ? new Date(v.validUntil).toISOString().split("T")[0] : "2026-12-31",
      status: v.status || "ACTIVE",
    });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editingId ? `/api/vouchers/${editingId}` : "/api/vouchers";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không thể lưu voucher");

      loadVouchers();
      setShowModal(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const isArchive = currentStatus === "ACTIVE";
    const confirmMsg = isArchive ? "Bạn có muốn ngưng kích hoạt voucher này?" : "Bạn có muốn mở lại voucher này?";
    if (!confirm(confirmMsg)) return;

    try {
      if (isArchive) {
        await fetch(`/api/vouchers/${id}`, { method: "DELETE" });
      } else {
        await fetch(`/api/vouchers/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "ACTIVE" }),
        });
      }
      loadVouchers();
    } catch {
      alert("Lỗi thay đổi trạng thái voucher");
    }
  };

  const filteredVouchers = vouchers.filter((v) => {
    const q = search.toLowerCase();
    return (
      (v.code && v.code.toLowerCase().includes(q)) ||
      (v.description && v.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Ticket className="w-6 h-6 text-blue-600" /> Quản Lý Mã Giảm Giá (Vouchers & Discount Engine)
          </h1>
          <p className="text-sm text-slate-500 mt-1">Khởi tạo mã khuyến mãi, giới hạn lượt dùng và ngày hết hạn</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={loadVouchers} variant="outline" size="sm" className="gap-1">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Làm mới
          </Button>
          <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-500 text-white gap-2">
            <Plus className="w-4 h-4" /> Tạo Mã Giảm Giá
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Tìm theo mã voucher (VD: SUMMER2026)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Vouchers Table */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-slate-500 text-sm">Đang tải danh sách voucher...</div>
          ) : filteredVouchers.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">Không tìm thấy voucher nào</div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Mã Giảm Giá</TableHead>
                  <TableHead>Mức Giảm</TableHead>
                  <TableHead>Đơn Tối Thiểu</TableHead>
                  <TableHead>Lượt Dùng</TableHead>
                  <TableHead>Hạn Sử Dụng</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead className="text-right">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVouchers.map((v) => (
                  <TableRow key={v.id} className="hover:bg-slate-50/60">
                    <TableCell>
                      <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                        {v.code}
                      </span>
                      {v.description && <p className="text-xs text-slate-500 mt-1">{v.description}</p>}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">
                      {v.discountType === "PERCENT" ? `${v.discountAmount}%` : `${v.discountAmount?.toLocaleString("vi-VN")}đ`}
                    </TableCell>
                    <TableCell className="text-xs text-slate-700 font-mono">
                      {v.minOrderAmount ? `${v.minOrderAmount?.toLocaleString("vi-VN")}đ` : "Không giới hạn"}
                    </TableCell>
                    <TableCell className="text-xs text-slate-700 font-mono">
                      {v.usedCount} / {v.maxUses}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 font-mono">
                      {new Date(v.validUntil).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={v.status === "ACTIVE" ? "success" : "secondary"}>
                        {v.status === "ACTIVE" ? "Khả dụng" : "Đã khóa"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditModal(v)}
                          className="h-8 w-8 p-0 text-slate-600 hover:text-blue-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleStatus(v.id, v.status)}
                          className={`h-8 w-8 p-0 ${
                            v.status === "ACTIVE" ? "text-rose-500 hover:bg-rose-50" : "text-emerald-600 hover:bg-emerald-50"
                          }`}
                        >
                          {v.status === "ACTIVE" ? <Trash2 className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
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
                {editingId ? "Chỉnh Sửa Voucher" : "Tạo Mã Giảm Giá Mới"}
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
                <label className="text-xs font-semibold text-slate-700">Mã voucher *</label>
                <Input
                  required
                  disabled={!!editingId}
                  placeholder="VD: SUMMER2026"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className={editingId ? "bg-slate-100 uppercase" : "uppercase font-mono"}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Loại giảm giá *</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PERCENT">Phần trăm (%)</option>
                    <option value="FIXED">Số tiền cố định (VND)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Mức giảm *</label>
                  <Input
                    type="number"
                    required
                    min={1}
                    value={form.discountAmount || ""}
                    onChange={(e) => setForm({ ...form, discountAmount: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Đơn tối thiểu (VND)</label>
                  <Input
                    type="number"
                    min={0}
                    value={form.minOrderAmount || 0}
                    onChange={(e) => setForm({ ...form, minOrderAmount: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Số lượt dùng tối đa *</label>
                  <Input
                    type="number"
                    required
                    min={1}
                    value={form.maxUses || 100}
                    onChange={(e) => setForm({ ...form, maxUses: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Ngày hết hạn *</label>
                <Input
                  type="date"
                  required
                  value={form.validUntil}
                  onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Mô tả chương trình</label>
                <textarea
                  rows={2}
                  placeholder="Mô tả ưu đãi dành cho khách..."
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
