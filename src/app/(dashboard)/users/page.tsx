"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Plus, X, Search, Edit2, ShieldAlert, CheckCircle, UserCog, KeyRound } from "lucide-react";

const roleLabels: Record<string, string> = {
  ADMIN: "Quản trị viên",
  RECEPTIONIST: "Lễ tân",
  HOUSEKEEPING: "Buồng phòng",
  CUSTOMER: "Khách hàng",
};

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "RECEPTIONIST",
    password: "",
    status: "ACTIVE",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadUsers = () => {
    setLoading(true);
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => {
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => {
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({ fullName: "", email: "", phone: "", role: "RECEPTIONIST", password: "123456", status: "ACTIVE" });
    setError("");
    setShowModal(true);
  };

  const openEditModal = (user: any) => {
    setEditingId(user.id);
    setForm({
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "RECEPTIONIST",
      password: "",
      status: user.status || "ACTIVE",
    });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editingId ? `/api/users/${editingId}` : "/api/users";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không thể lưu nhân viên");

      loadUsers();
      setShowModal(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const isLocking = currentStatus === "ACTIVE";
    const confirmMsg = isLocking
      ? "Bạn có chắc chắn muốn vô hiệu hóa tài khoản nhân viên này?"
      : "Bạn có muốn mở khóa tài khoản nhân viên này?";

    if (!confirm(confirmMsg)) return;

    try {
      if (isLocking) {
        await fetch(`/api/users/${id}`, { method: "DELETE" });
      } else {
        await fetch(`/api/users/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "ACTIVE" }),
        });
      }
      loadUsers();
    } catch {
      alert("Lỗi khi thay đổi trạng thái tài khoản");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.fullName && u.fullName.toLowerCase().includes(search.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
      (u.phone && u.phone.includes(search));

    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <UserCog className="w-6 h-6 text-blue-600" /> Quản Lý Tài Khoản Nhân Viên
          </h1>
          <p className="text-sm text-slate-500 mt-1">Phân quyền, khởi tạo mật khẩu và quản lý trạng thái truy cập</p>
        </div>
        <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-500 text-white gap-2">
          <Plus className="w-4 h-4" /> Thêm Nhân Viên
        </Button>
      </div>

      {/* Filter & Search */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Tìm theo tên, email, SĐT..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 font-medium">Lọc vai trò:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Tất cả vai trò</option>
              <option value="ADMIN">Quản trị viên</option>
              <option value="RECEPTIONIST">Lễ tân</option>
              <option value="HOUSEKEEPING">Buồng phòng</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-slate-500 text-sm">Đang tải danh sách nhân viên...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">Không tìm thấy tài khoản nhân viên nào</div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Họ và Tên</TableHead>
                  <TableHead>Email Tài Khoản</TableHead>
                  <TableHead>Số Điện Thoại</TableHead>
                  <TableHead>Vai Trò</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead className="text-right">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((u) => (
                  <TableRow key={u.id} className="hover:bg-slate-50/60">
                    <TableCell className="font-bold text-slate-900">{u.fullName}</TableCell>
                    <TableCell className="text-slate-600 font-mono text-xs">{u.email}</TableCell>
                    <TableCell className="text-sm text-slate-700">{u.phone || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-semibold border-slate-300">
                        {roleLabels[u.role] || u.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.status === "ACTIVE" ? "success" : "destructive"}>
                        {u.status === "ACTIVE" ? "Hoạt động" : "Khóa"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditModal(u)}
                          className="h-8 w-8 p-0 text-slate-600 hover:text-blue-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleStatus(u.id, u.status)}
                          className={`h-8 w-8 p-0 ${
                            u.status === "ACTIVE" ? "text-rose-500 hover:bg-rose-50" : "text-emerald-600 hover:bg-emerald-50"
                          }`}
                        >
                          {u.status === "ACTIVE" ? <ShieldAlert className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
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
                {editingId ? "Chỉnh Sửa Nhân Viên" : "Tạo Tài Khoản Nhân Viên"}
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

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Email tài khoản *</label>
                <Input
                  type="email"
                  required
                  disabled={!!editingId}
                  placeholder="email@hotelflow.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={editingId ? "bg-slate-100" : ""}
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
                  <label className="text-xs font-semibold text-slate-700">Vai trò *</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="RECEPTIONIST">Lễ tân</option>
                    <option value="HOUSEKEEPING">Buồng phòng</option>
                    <option value="ADMIN">Quản trị viên</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-slate-400" /> {editingId ? "Đặt mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu ban đầu *"}
                </label>
                <Input
                  type="password"
                  required={!editingId}
                  placeholder={editingId ? "Nhập mật khẩu mới..." : "123456"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold">
                  {saving ? "Đang lưu..." : editingId ? "Cập Nhật" : "Tạo Tài Khoản"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
