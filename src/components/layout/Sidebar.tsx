"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const adminLinks = [
  { href: "/dashboard", label: "Tong quan", icon: "📊" },
  { href: "/rooms", label: "Phong", icon: "🏨" },
  { href: "/room-types", label: "Loai phong", icon: "🏷️" },
  { href: "/bookings", label: "Dat phong", icon: "📅" },
  { href: "/customers", label: "Khach hang", icon: "👥" },
  { href: "/services", label: "Dich vu", icon: "🛎️" },
  { href: "/invoices", label: "Hoa don", icon: "🧾" },
  { href: "/housekeeping", label: "Don phong", icon: "🧹" },
  { href: "/users", label: "Nhan vien", icon: "👤" },
];

const roleLinks: Record<string, typeof adminLinks> = {
  ADMIN: adminLinks,
  RECEPTIONIST: adminLinks.filter(l => ["/dashboard","/rooms","/bookings","/customers","/services","/invoices"].includes(l.href)),
  HOUSEKEEPING: adminLinks.filter(l => ["/dashboard","/housekeeping"].includes(l.href)),
  CUSTOMER: adminLinks.filter(l => ["/dashboard","/bookings"].includes(l.href)),
};

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role || "CUSTOMER";
  const links = roleLinks[role] || roleLinks.CUSTOMER;

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-blue-400">HotelFlow</h1>
        <p className="text-xs text-gray-400 mt-1">{session?.user?.name}</p>
        <p className="text-xs text-gray-500">{role}</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
              pathname === link.href
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-md text-left"
        >
          🚪 Dang xuat
        </button>
      </div>
    </aside>
  );
}
