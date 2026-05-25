"use client";
import Sidebar from "@/components/layout/Sidebar";
import AuthProvider from "@/components/layout/AuthProvider";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  if (status === "loading") return <div className="flex items-center justify-center min-h-screen"><p>Loading...</p></div>;
  if (!session) { redirect("/login"); return null; }
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-6 overflow-auto">{children}</main>
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
