"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, BedDouble, Users, X, Edit2, Trash2, Tag, Search, RefreshCw } from "lucide-react";

export default function RoomTypesPage() {
  const [types, setTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    pricePerNight: 0,
    pricePerHour: 0,
    overnightPrice: 0,
    maxGuests: 2,
    bedCount: 1,
    area: 30,
    imageUrl: "",
    amenities: '["Wifi miễn phí", "Điều hòa 2 chiều", "TV 4K", "Bồn tắm"]',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadRoomTypes = () => {
    setLoading(true);
    fetch("/api/room-types")
      .then((r) => r.json())
      .then((data) => {
        setTypes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetch("/api/room-types")
      .then((r) => r.json())
      .then((data) => {
        setTypes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      name: "",
      description: "",
      pricePerNight: 500000,
      pricePerHour: 100000,
      overnightPrice: 300000,
      maxGuests: 2,
      bedCount: 1,
      area: 30,
      imageUrl: "",
      amenities: '["Wifi miễn phí", "Điều hòa 2 chiều", "TV 4K", "Bồn tắm"]',
    });
    setError("");
    setShowModal(true);
  };

  const openEditModal = (roomType: any) => {
    setEditingId(roomType.id);
    setForm({
      name: roomType.name || "",
      description: roomType.description || "",
      pricePerNight: roomType.pricePerNight || 0,
      pricePerHour: roomType.pricePerHour || 0,
      overnightPrice: roomType.overnightPrice || 0,
      maxGuests: roomType.maxGuests || 2,
      bedCount: roomType.bedCount || 1,
      area: roomType.area || 30,
      imageUrl: roomType.imageUrl || "",
      amenities: typeof roomType.amenities === "string" ? roomType.amenities : JSON.stringify(roomType.amenities || []),
    });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editingId ? `/api/room-types/${editingId}` : "/api/room-types";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không thể lưu hạng phòng");

      loadRoomTypes();
      setShowModal(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa hạng phòng "${name}"?`)) return;

    try {
      const res = await fetch(`/api/room-types/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi xóa hạng phòng");

      loadRoomTypes();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredTypes = types.filter((t) => {
    const q = search.toLowerCase();
    return (
      (t.name && t.name.toLowerCase().includes(q)) ||
      (t.description && t.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Tag className="w-6 h-6 text-blue-600" /> Quản Lý Hạng Phòng & Bảng Giá
          </h1>
          <p className="text-sm text-slate-500 mt-1">Cấu hình giá đêm, giá giờ, giá qua đêm, sức chứa và tiện nghi</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={loadRoomTypes} variant="outline" size="sm" className="gap-1">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Làm mới
          </Button>
          <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-500 text-white gap-2">
            <Plus className="w-4 h-4" /> Thêm Hạng Phòng
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Tìm theo tên hạng phòng, mô tả..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Room Types Grid */}
      {loading ? (
        <div className="p-8 text-center text-slate-500 text-sm">Đang tải danh sách hạng phòng...</div>
      ) : filteredTypes.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-sm">Không tìm thấy hạng phòng nào phù hợp</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTypes.map((t) => (
            <Card key={t.id} className="border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-base font-bold text-slate-900">{t.name}</CardTitle>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{t.description || "Chưa có mô tả"}</p>
                    </div>
                    <Badge variant="success" className="shrink-0">
                      {t._count?.rooms || 0} phòng
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-5 space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-2.5">
                      <p className="text-xs text-slate-500">Giá / đêm</p>
                      <p className="text-base font-bold text-blue-600 font-mono mt-0.5">
                        {t.pricePerNight?.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                    <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-2.5">
                      <p className="text-xs text-slate-500">Giá / giờ</p>
                      <p className="text-base font-bold text-amber-600 font-mono mt-0.5">
                        {t.pricePerHour?.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                    <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-2.5">
                      <p className="text-xs text-slate-500">Qua đêm</p>
                      <p className="text-base font-bold text-purple-600 font-mono mt-0.5">
                        {t.overnightPrice?.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-around text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-blue-500" /> Tối đa {t.maxGuests} khách
                    </span>
                    <span className="flex items-center gap-1">
                      <BedDouble className="w-3.5 h-3.5 text-blue-500" /> {t.bedCount} giường
                    </span>
                    <span>{t.area || 30} m²</span>
                  </div>
                </CardContent>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => openEditModal(t)} className="gap-1 text-slate-700">
                  <Edit2 className="w-3.5 h-3.5" /> Sửa
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(t.id, t.name)} className="gap-1 text-rose-600 hover:bg-rose-50 border-rose-200">
                  <Trash2 className="w-3.5 h-3.5" /> Xóa
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-lg">
                {editingId ? "Chỉnh Sửa Hạng Phòng" : "Thêm Hạng Phòng Mới"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">{error}</div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Tên hạng phòng *</label>
                <Input
                  required
                  placeholder="VD: Deluxe Ocean View"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Giá / Đêm (VND) *</label>
                  <Input
                    type="number"
                    required
                    min={0}
                    value={form.pricePerNight || ""}
                    onChange={(e) => setForm({ ...form, pricePerNight: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Giá / Giờ (VND) *</label>
                  <Input
                    type="number"
                    required
                    min={0}
                    value={form.pricePerHour || ""}
                    onChange={(e) => setForm({ ...form, pricePerHour: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Giá Qua Đêm (VND) *</label>
                  <Input
                    type="number"
                    required
                    min={0}
                    value={form.overnightPrice || ""}
                    onChange={(e) => setForm({ ...form, overnightPrice: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Số khách tối đa *</label>
                  <Input
                    type="number"
                    required
                    min={1}
                    value={form.maxGuests || ""}
                    onChange={(e) => setForm({ ...form, maxGuests: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Số giường *</label>
                  <Input
                    type="number"
                    required
                    min={1}
                    value={form.bedCount || ""}
                    onChange={(e) => setForm({ ...form, bedCount: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Diện tích (m²)</label>
                  <Input
                    type="number"
                    min={0}
                    value={form.area || ""}
                    onChange={(e) => setForm({ ...form, area: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">URL Hình ảnh đại diện</label>
                <Input
                  placeholder="https://images.unsplash.com/photo-..."
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Mô tả hạng phòng</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả chi tiết về không gian, tầm nhìn và tiện nghi..."
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
