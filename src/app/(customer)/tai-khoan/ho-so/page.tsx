"use client";
import { useSession } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, Mail, ShieldCheck } from "lucide-react";

export default function CustomerProfilePage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Hồ Sơ Cá Nhân</h1>
        <p className="text-sm text-slate-500 mt-1">Thông tin chi tiết tài khoản của bạn</p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" /> Thông tin tài khoản
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Họ và tên</label>
              <p className="text-sm font-medium text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-200">
                {session?.user?.name || "Chưa cập nhật"}
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</label>
              <p className="text-sm font-medium text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" /> {session?.user?.email}
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Vai trò tài khoản</label>
              <p className="text-sm font-medium text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> {session?.user?.role || "CUSTOMER"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
