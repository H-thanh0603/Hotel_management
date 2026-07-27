"use client";
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Hotel, Mail, Lock, ArrowRight } from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      setError("Email hoặc mật khẩu không đúng");
      setLoading(false);
      return;
    }

    // Fetch session to determine role and redirect accordingly
    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();
    const role = session?.user?.role;

    if (callbackUrl) {
      router.push(callbackUrl);
    } else if (role === "CUSTOMER") {
      router.push("/tai-khoan");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <Card className="w-full max-w-[420px] mx-4 border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
      <CardHeader className="text-center pb-2 pt-8">
        <div className="mx-auto w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
          <Hotel className="w-7 h-7 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">HotelFlow</CardTitle>
        <p className="text-gray-500 text-sm mt-1">Hệ thống quản lý khách sạn & Đặt phòng</p>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 px-7 pb-7">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-lg text-center">
              {error}
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hotelflow.com"
                required
                className="flex h-11 w-full rounded-lg border border-gray-200 bg-gray-50/50 pl-10 pr-4 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                required
                className="flex h-11 w-full rounded-lg border border-gray-200 bg-gray-50/50 pl-10 pr-4 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>
          <Button type="submit" className="w-full h-11 mt-2" disabled={loading}>
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Đăng nhập <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
          <div className="pt-3 border-t border-gray-100">
            <p className="text-center text-sm text-gray-500 mb-3">
              Chưa có tài khoản?{" "}
              <a href="/register" className="text-blue-600 hover:underline font-medium">
                Đăng ký
              </a>
            </p>
            <p className="text-xs text-gray-400 text-center mb-2">Tài khoản demo</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
              <div className="bg-gray-50 rounded-md px-2.5 py-1.5">
                <span className="font-medium">Admin:</span> admin@hotelflow.com
              </div>
              <div className="bg-gray-50 rounded-md px-2.5 py-1.5">
                <span className="font-medium">Lễ tân:</span> letan@hotelflow.com
              </div>
              <div className="bg-gray-50 rounded-md px-2.5 py-1.5 col-span-2">
                <span className="font-medium">Khách hàng:</span> khach@hotelflow.com
              </div>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">Mật khẩu: 123456</p>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
      <Suspense fallback={<div className="text-white text-sm">Đang tải form đăng nhập...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
