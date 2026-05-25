"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Hotel, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) { setError("Mật khẩu xác nhận không khớp"); return; }
    if (form.password.length < 6) { setError("Mật khẩu tối thiểu 6 ký tự"); return; }
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: form.fullName, email: form.email, phone: form.phone, password: form.password }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Đăng ký thất bại"); setLoading(false); return; }
    router.push("/login?registered=1");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
      <Card className="w-full max-w-[440px] mx-4 border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-2 pt-8">
          <div className="mx-auto w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
            <Hotel className="w-7 h-7 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Đăng ký tài khoản</CardTitle>
          <p className="text-gray-500 text-sm mt-1">Tạo tài khoản để đặt phòng trực tuyến</p>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 px-7 pb-7">
            {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-lg text-center">{error}</div>}
            <Input label="Họ tên *" placeholder="Nguyễn Văn A" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} required />
            <Input label="Email *" type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            <Input label="Số điện thoại" placeholder="0912345678" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            <Input label="Mật khẩu *" type="password" placeholder="Tối thiểu 6 ký tự" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
            <Input label="Xác nhận mật khẩu *" type="password" placeholder="Nhập lại mật khẩu" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} required />
            <Button type="submit" className="w-full h-11 mt-2" disabled={loading}>
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Đăng ký <ArrowRight className="w-4 h-4" /></>}
            </Button>
            <p className="text-center text-sm text-gray-500">Đã có tài khoản? <Link href="/login" className="text-blue-600 hover:underline font-medium">Đăng nhập</Link></p>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
