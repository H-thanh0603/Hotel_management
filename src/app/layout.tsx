import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HotelFlow - He thong quan li khach san",
  description: "He thong quan li khach san thong minh",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="antialiased">{children}</body>
    </html>
  );
}
