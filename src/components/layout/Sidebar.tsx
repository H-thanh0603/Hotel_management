"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard, BedDouble, Tag, CalendarCheck, Users,
  ConciergeBell, Receipt, Sparkles, UserCog, LogOut, Hotel
} from "lucide-react";

const adminLinks = [
  { href: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/rooms", label: "Quản lý phòng", icon: BedDouble },
  { href: "/room-types", label: "Loại phòng", icon: Tag },
  { href: "/bookings", label: "Đặt phòng", icon: CalendarCheck },
  { href: "/customers", label: "Khách hàng", icon: Users },
  { href: "/services", label: "Dịch vụ", icon: ConciergeBell },
  { href: "/invoices", label: "Hoá đơn", icon: Receipt },
  { href: "/housekeeping", label: "Dọn phòng", icon: Sparkles },
  { href: "/users", label: "Nhân viên", icon: UserCog },
];

const roleLinks: Record<string, typeof adminLinks> = {
  ADMIN: adminLinks,
  RECEPTIONIST: adminLinks.filter(l => ["/dashboard","/rooms","/bookings","/customers","/services","/invoices"].includes(l.href)),
  HOUSEKEEPING: adminLinks.filter(l => ["/dashboard","/housekeeping","/rooms"].includes(l.href)),
  CUSTOMER: adminLinks.filter(l => ["/dashboard","/bookings"].includes(l.href)),
};

const roleLabels: Record<string, string> = {
  ADMIN: "Quản trị viên",
  RECEPTIONIST: "Lễ tân",
  HOUSEKEEPING: "Buồng phòng",
  CUSTOMER: "Khách hàng",
};

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role || "CUSTOMER";
  const links = roleLinks[role] || roleLinks.CUSTOMER;

  return (
    <aside className="w-[260px] bg-[#0f172a] text-white min-h-screen flex flex-col shadow-xl">
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
            <Hotel className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">HotelFlow</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Quản lý khách sạn</p>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 mx-3 mt-4 rounded-lg bg-white/5 border border-white/10">
        <p className="text-sm font-medium text-gray-200">{session?.user?.name}</p>
        <p className="text-xs text-gray-400">{roleLabels[role]}</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link key={link.href} href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                active ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}>
              <Icon className="w-[18px] h-[18px]" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/10">
        <button onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-all duration-200">
          <LogOut className="w-[18px] h-[18px]" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
