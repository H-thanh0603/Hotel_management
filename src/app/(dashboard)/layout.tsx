"use client";
import Sidebar from "@/components/layout/Sidebar";
import AuthProvider from "@/components/layout/AuthProvider";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Đang tải...</p>
        </div>
      </div>
    );
  }
  if (!session) { redirect("/login"); return null; }
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto animate-fade-in">{children}</main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardContent>{children}</DashboardContent>
    </AuthProvider>
  );
}
