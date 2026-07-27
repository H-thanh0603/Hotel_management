"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import AuthProvider from "@/components/layout/AuthProvider";
import { Hotel, User, Calendar, Receipt, LogOut, Home } from "lucide-react";

function CustomerContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Đang tải tài khoản...</p>
        </div>
      </div>
    );
  }

  const navLinks = [
    { href: "/tai-khoan", label: "Tổng quan", icon: Home },
    { href: "/tai-khoan/dat-phong", label: "Booking của tôi", icon: Calendar },
    { href: "/tai-khoan/ho-so", label: "Hồ sơ cá nhân", icon: User },
    { href: "/tai-khoan/hoa-don", label: "Hóa đơn & Thanh toán", icon: Receipt },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Customer Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Hotel className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                HotelFlow
              </span>
            </Link>
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-medium border border-blue-500/30">
              Khu Vực Khách Hàng
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-300 hidden sm:inline">
              Xin chào, <strong className="text-white">{session?.user?.name || "Khách hàng"}</strong>
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-red-400 bg-slate-800 hover:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" /> Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col md:flex-row gap-8 flex-1">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 space-y-2 shrink-0">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-lg">
                {(session?.user?.name || "K")[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{session?.user?.name}</p>
                <p className="text-xs text-slate-500">{session?.user?.email}</p>
              </div>
            </div>
          </div>

          <nav className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CustomerContent>{children}</CustomerContent>
    </AuthProvider>
  );
}
