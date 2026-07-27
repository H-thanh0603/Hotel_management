"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layers, Plus, Search, Edit2, Trash2, X, RefreshCw, BedDouble } from "lucide-react";

const statusConfig: Record<string, { label: string; variant: string; dot: string }> = {
  AVAILABLE: { label: "Trống", variant: "success", dot: "bg-emerald-500" },
  RESERVED: { label: "Đã đặt", variant: "warning", dot: "bg-amber-500" },
  OCCUPIED: { label: "Đang ở", variant: "destructive", dot: "bg-red-500" },
  DIRTY: { label: "Cần dọn", variant: "warning", dot: "bg-orange-500" },
  CLEANING: { label: "Đang dọn", variant: "info", dot: "bg-cyan-500" },
  MAINTENANCE: { label: "Bảo trì", variant: "secondary", dot: "bg-slate-500" },
  INACTIVE: { label: "Tạm ngưng", variant: "outline", dot: "bg-slate-400" },
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    roomNumber: "",
    floor: 1,
    roomTypeId: "",
    status: "AVAILABLE",
    note: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadRooms = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/rooms").then((r) => r.json()),
      fetch("/api/room-types").then((r) => r.json()),
    ])
      .then(([roomsData, typesData]) => {
        setRooms(Array.isArray(roomsData) ? roomsData : []);
        const validTypes = Array.isArray(typesData) ? typesData : [];
        setRoomTypes(validTypes);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    Promise.all([
      fetch("/api/rooms").then((r) => r.json()),
      fetch("/api/room-types").then((r) => r.json()),
    ])
      .then(([roomsData, typesData]) => {
        setRooms(Array.isArray(roomsData) ? roomsData : []);
        const validTypes = Array.isArray(typesData) ? typesData : [];
        setRoomTypes(validTypes);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      roomNumber: "",
      floor: 1,
      roomTypeId: roomTypes[0]?.id || "",
      status: "AVAILABLE",
      note: "",
    });
    setError("");
    setShowModal(true);
  };

  const openEditModal = (room: any) => {
    setEditingId(room.id);
    setForm({
      roomNumber: room.roomNumber || "",
      floor: room.floor || 1,
      roomTypeId: room.roomTypeId || (roomTypes[0]?.id || ""),
      status: room.status || "AVAILABLE",
      note: room.note || "",
    });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editingId ? `/api/rooms/${editingId}` : "/api/rooms";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không thể lưu phòng");

      loadRooms();
      setShowModal(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOrArchive = async (id: string, roomNumber: string) => {
    if (!confirm(`Bạn có chắc chắn muốn vô hiệu hóa/lưu trữ phòng ${roomNumber}?`)) return;

    try {
      await fetch(`/api/rooms/${id}`, { method: "DELETE" });
      loadRooms();
    } catch {
      alert("Lỗi khi thay đổi trạng thái phòng");
    }
  };

  const filteredRooms = rooms.filter((r) => {
    const matchesSearch =
      (r.roomNumber && r.roomNumber.toLowerCase().includes(search.toLowerCase())) ||
      (r.roomType?.name && r.roomType.name.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const floors = [...new Set(filteredRooms.map((r) => r.floor))].sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BedDouble className="w-6 h-6 text-blue-600" /> Sơ Đồ & Quản Lý Phòng
          </h1>
          <p className="text-sm text-slate-500 mt-1">Theo dõi trạng thái thời gian thực, tạo mới, sửa và đổi chế độ bảo trì</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={loadRooms} variant="outline" size="sm" className="gap-1">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Làm mới
          </Button>
          <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-500 text-white gap-2">
            <Plus className="w-4 h-4" /> Thêm Phòng Mới
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Tìm theo số phòng, hạng phòng..."
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
              <option value="ALL">Tất cả trạng thái</option>
              <option value="AVAILABLE">Trống</option>
              <option value="OCCUPIED">Đang ở</option>
              <option value="RESERVED">Đã đặt</option>
              <option value="DIRTY">Cần dọn</option>
              <option value="CLEANING">Đang dọn</option>
              <option value="MAINTENANCE">Bảo trì</option>
              <option value="INACTIVE">Vô hiệu hóa</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Status Legends */}
      <div className="flex items-center gap-4 flex-wrap text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        {Object.entries(statusConfig).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5 font-medium">
            <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
            <span>{cfg.label}</span>
          </div>
        ))}
      </div>

      {/* Floor Sections Grid */}
      {loading ? (
        <div className="p-8 text-center text-slate-500 text-sm">Đang tải sơ đồ phòng...</div>
      ) : floors.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-sm">Không tìm thấy phòng nào phù hợp</div>
      ) : (
        floors.map((floor) => (
          <div key={floor} className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Tầng {floor}</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredRooms
                .filter((r) => r.floor === floor)
                .map((room) => {
                  const cfg = statusConfig[room.status] || statusConfig.INACTIVE;
                  return (
                    <Card
                      key={room.id}
                      className="border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-black text-slate-900">Phòng {room.roomNumber}</span>
                          <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-slate-700">{room.roomType?.name || "Chưa phân loại"}</p>
                          <p className="text-[11px] font-mono text-blue-600 mt-0.5">
                            {room.roomType?.pricePerNight?.toLocaleString("vi-VN")}đ/đêm
                          </p>
                        </div>

                        <Badge variant={cfg.variant as any} className="text-[10px] w-full justify-center py-0.5">
                          {cfg.label}
                        </Badge>
                      </CardContent>

                      <div className="p-2 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditModal(room)}
                          className="h-7 w-7 p-0 text-slate-600 hover:text-blue-600"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteOrArchive(room.id, room.roomNumber)}
                          className="h-7 w-7 p-0 text-rose-500 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </Card>
                  );
                })}
            </div>
          </div>
        ))
      )}

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-lg">
                {editingId ? "Chỉnh Sửa Phòng" : "Thêm Phòng Mới"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">{error}</div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Số phòng *</label>
                  <Input
                    required
                    placeholder="VD: 101"
                    value={form.roomNumber}
                    onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Tầng *</label>
                  <Input
                    type="number"
                    required
                    min={1}
                    value={form.floor || 1}
                    onChange={(e) => setForm({ ...form, floor: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Hạng phòng *</label>
                <select
                  value={form.roomTypeId}
                  onChange={(e) => setForm({ ...form, roomTypeId: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {roomTypes.map((rt) => (
                    <option key={rt.id} value={rt.id}>
                      {rt.name} ({rt.pricePerNight?.toLocaleString("vi-VN")}đ/đêm)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Trạng thái vận hành</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="AVAILABLE">Trống (Sẵn sàng)</option>
                  <option value="OCCUPIED">Đang ở</option>
                  <option value="RESERVED">Đã đặt</option>
                  <option value="DIRTY">Cần dọn dẹp</option>
                  <option value="CLEANING">Đang dọn dẹp</option>
                  <option value="MAINTENANCE">Bảo trì</option>
                  <option value="INACTIVE">Vô hiệu hóa</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Ghi chú phòng</label>
                <textarea
                  rows={3}
                  placeholder="Ghi chú về thiết bị, vị trí phòng..."
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
