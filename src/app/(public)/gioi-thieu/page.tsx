import { ShieldCheck, Sparkles, Award } from "lucide-react";

export default function PublicAboutPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-16 px-4 sm:px-6 lg:px-8 space-y-16 max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight">
          Về Chúng Tôi — <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">HotelFlow</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Kiến tạo trải nghiệm lưu trú hoàn hảo với tiêu chuẩn dịch vụ 5 sao và phong cách sang trọng độc bản.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl h-80">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80"
            alt="HotelFlow Entrance"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Sứ Mệnh Của HotelFlow</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Tọa lạc tại vị trí đắc địa giữa trung tâm thành phố, HotelFlow được thiết kế để mang đến sự kết hợp hoàn hảo giữa nét hiện đại tinh tế và lòng mến khách nồng hậu.
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">
            Hệ thống phòng nghỉ đa dạng, ẩm thực thượng hạng cùng không gian thư giãn đẳng cấp sẽ ghi dấu ấn khó quên trong mọi hành trình du lịch hay công tác của quý khách.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 text-center">
        <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
          <Award className="w-8 h-8 text-blue-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Tiêu Chuẩn 5 Sao</h3>
          <p className="text-xs text-slate-400">Được đánh giá cao về chất lượng dịch vụ và độ hài lòng của khách hàng.</p>
        </div>
        <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
          <Sparkles className="w-8 h-8 text-blue-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Tiện Nghi Đẳng Cấp</h3>
          <p className="text-xs text-slate-400">Hồ bơi vô cực, Spa thư giãn, nhà hàng Á - Âu và dịch vụ 24/7.</p>
        </div>
        <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
          <ShieldCheck className="w-8 h-8 text-blue-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">An Toàn & Bảo Mật</h3>
          <p className="text-xs text-slate-400">Hệ thống an ninh và quy trình vận hành bảo mật thông tin tuyệt đối.</p>
        </div>
      </div>
    </div>
  );
}
