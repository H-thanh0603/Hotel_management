"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Settings, Clock, Moon, AlertTriangle } from "lucide-react";

export default function PricingSettingsPage() {
  const [config, setConfig] = useState({ overnightStart: "23:00", overnightEnd: "11:00", gracePeriod: 15, overtimeCharge: 30 });
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetch("/api/pricing-config").then(r => r.json()).then(setConfig); }, []);

  const handleSave = async () => {
    await fetch("/api/pricing-config", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(config) });
    setSaved(true); setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Settings className="w-6 h-6" /> Cài đặt giá</h1>
        <p className="text-gray-500 text-sm mt-1">Cấu hình giờ qua đêm và phụ thu quá giờ</p>
      </div>
      {saved && <div className="mb-4 px-4 py-3 rounded-lg text-sm bg-emerald-50 border border-emerald-200 text-emerald-700">Đã lưu cài đặt!</div>}
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Moon className="w-4 h-4 text-indigo-500" /> Giờ qua đêm</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <Input label="Bắt đầu" type="time" value={config.overnightStart} onChange={e => setConfig({...config, overnightStart: e.target.value})} />
          <Input label="Kết thúc (hôm sau)" type="time" value={config.overnightEnd} onChange={e => setConfig({...config, overnightEnd: e.target.value})} />
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Phụ thu quá giờ</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <Input label="Miễn phí (phút)" type="number" value={config.gracePeriod} onChange={e => setConfig({...config, gracePeriod: +e.target.value})} />
          <Input label="Bắt đầu tính phụ thu sau (phút)" type="number" value={config.overtimeCharge} onChange={e => setConfig({...config, overtimeCharge: +e.target.value})} />
          <p className="col-span-2 text-xs text-gray-500">Ví dụ: miễn phí 15 phút, quá 30 phút tính thêm theo giá giờ của phòng</p>
        </CardContent>
      </Card>
      <Button onClick={handleSave} variant="success">Lưu cài đặt</Button>
    </div>
  );
}
