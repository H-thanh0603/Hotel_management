"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";

export default function PublicContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-16 px-4 sm:px-6 lg:px-8 space-y-12 max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Liên Hệ VớI <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">HotelFlow</span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-base">
          Chúng tôi luôn lắng nghe và sẵn sàng hỗ trợ giải đáp mọi thắc mắc của quý khách 24/7.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <Card className="bg-slate-800/60 border-slate-700/60 shadow-xl">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Địa Chỉ Khách Sạn</h4>
                  <p className="text-sm text-slate-300 mt-1">123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Điện Thoại & Hotline</h4>
                  <p className="text-sm text-slate-300 mt-1">Hotline Đặt Phòng: 1900 1234</p>
                  <p className="text-sm text-slate-300">Lễ Tân: (028) 3822 9999</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Email Liên Hệ</h4>
                  <p className="text-sm text-slate-300 mt-1">info@hotelflow.com | booking@hotelflow.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Thời Gian Phục Vụ</h4>
                  <p className="text-sm text-slate-300 mt-1">Phục vụ 24/7 tất cả các ngày trong tuần</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div>
          <Card className="bg-slate-800/80 border-slate-700/80 shadow-2xl">
            <CardContent className="p-6">
              {sent ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Gửi Phản Hồi Thành Công!</h3>
                  <p className="text-sm text-slate-400">Chúng tôi đã nhận được thông tin và sẽ phản hồi quý khách sớm nhất.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-lg font-bold text-white border-b border-slate-700 pb-3">Gửi Thắc Mắc Cho Chúng Tôi</h3>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Họ và tên *</label>
                    <Input
                      required
                      placeholder="Nguyễn Văn A"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Email *</label>
                    <Input
                      type="email"
                      required
                      placeholder="email@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Số điện thoại</label>
                    <Input
                      placeholder="0912345678"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Nội dung tin nhắn *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Nhập nội dung bạn cần hỗ trợ..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full rounded-md border border-slate-700 bg-slate-900 p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-bold gap-2 mt-2">
                    <Send className="w-4 h-4" /> Gửi tin nhắn
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
