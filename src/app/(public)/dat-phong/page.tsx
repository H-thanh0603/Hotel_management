"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, CheckCircle2, ArrowRight, ArrowLeft, Ticket, QrCode } from "lucide-react";
import { generateVietQRUrl } from "@/lib/vietqr";

function BookingFlowContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const next2Days = new Date(tomorrow);
  next2Days.setDate(next2Days.getDate() + 2);

  const initialRoomTypeId = searchParams.get("roomTypeId") || "";
  const initialCheckIn = searchParams.get("checkIn") || tomorrow.toISOString().split("T")[0];
  const initialCheckOut = searchParams.get("checkOut") || next2Days.toISOString().split("T")[0];

  const [step, setStep] = useState(1);
  const [checkInDate, setCheckInDate] = useState(initialCheckIn);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOut);
  const [numberOfGuests, setNumberOfGuests] = useState(2);
  const [selectedRoomType, setSelectedRoomType] = useState<any>(null);
  const [availableRoomTypes, setAvailableRoomTypes] = useState<any[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  // Voucher state
  const [voucherCodeInput, setVoucherCodeInput] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  const [voucherError, setVoucherError] = useState("");
  const [verifyingVoucher, setVerifyingVoucher] = useState(false);

  // Guest details
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [note, setNote] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);
  const [error, setError] = useState("");

  const loadAvailabilityData = () => {
    setLoadingAvailability(true);
    setError("");
    fetch("/api/public/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checkInDate, checkOutDate, adults: numberOfGuests }),
    })
      .then((r) => r.json())
      .then((data) => {
        const items = data.availableRoomTypes || [];
        setAvailableRoomTypes(items);
        if (initialRoomTypeId) {
          const found = items.find((i: any) => (i.roomType?.id || i.id) === initialRoomTypeId);
          if (found) setSelectedRoomType(found.roomType || found);
        }
      })
      .catch((e: any) => setError(e.message))
      .finally(() => setLoadingAvailability(false));
  };

  useEffect(() => {
    fetch("/api/public/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checkInDate: initialCheckIn, checkOutDate: initialCheckOut }),
    })
      .then((r) => r.json())
      .then((data) => {
        const items = data.availableRoomTypes || [];
        setAvailableRoomTypes(items);
        if (initialRoomTypeId) {
          const found = items.find((i: any) => (i.roomType?.id || i.id) === initialRoomTypeId);
          if (found) setSelectedRoomType(found.roomType || found);
        }
      })
      .catch(() => {});
  }, [initialCheckIn, initialCheckOut, initialRoomTypeId]);

  const calculateNights = () => {
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return isNaN(diff) || diff <= 0 ? 1 : diff;
  };

  const nights = calculateNights();
  const roomPricePerNight = selectedRoomType?.pricePerNight || 0;
  const roomSubtotal = roomPricePerNight * nights;
  const discountAmount = appliedVoucher?.calculatedDiscount || 0;
  const totalAmount = Math.max(0, roomSubtotal - discountAmount);

  const handleApplyVoucher = async () => {
    if (!voucherCodeInput.trim()) return;
    setVerifyingVoucher(true);
    setVoucherError("");
    try {
      const res = await fetch("/api/vouchers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: voucherCodeInput.trim(), totalAmount: roomSubtotal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Mã voucher không hợp lệ");
      setAppliedVoucher(data.voucher);
    } catch (e: any) {
      setVoucherError(e.message);
      setAppliedVoucher(null);
    } finally {
      setVerifyingVoucher(false);
    }
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      setError("Ngày trả phòng phải sau ngày nhận phòng");
      return;
    }
    setError("");
    loadAvailabilityData();
    setStep(2);
  };

  const handleSelectRoomType = (rt: any) => {
    setSelectedRoomType(rt);
    setStep(3);
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomType) return;
    if (!agreedTerms) {
      setError("Vui lòng đồng ý với các điều khoản đặt phòng");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const res = await fetch("/api/bookings/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomTypeId: selectedRoomType.id,
          checkInDate,
          checkOutDate,
          numberOfGuests,
          voucherCode: appliedVoucher?.code || null,
          note: `Khách hàng: ${guestName} | SĐT: ${guestPhone} | Ghi chú: ${note}`.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Đặt phòng thất bại. Vui lòng đăng nhập hoặc thử lại.");

      setBookingResult(data);
      setStep(5); // Success step
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 space-y-8 max-w-5xl mx-auto">
      {/* Step Indicator */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        {[
          { num: 1, label: "Ngày & Số khách" },
          { num: 2, label: "Chọn hạng phòng" },
          { num: 3, label: "Thông tin khách" },
          { num: 4, label: "Xác nhận & Đặt phòng" },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                step === s.num
                  ? "bg-blue-600 text-white ring-4 ring-blue-500/20"
                  : step > s.num
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-800 text-slate-500"
              }`}
            >
              {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
            </div>
            <span className={`text-xs font-semibold hidden sm:inline ${step === s.num ? "text-blue-400" : "text-slate-400"}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm text-center">
          {error}
        </div>
      )}

      {/* STEP 1: Search Dates & Guests */}
      {step === 1 && (
        <Card className="bg-slate-800/80 border-slate-700/80 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" /> Bước 1: Chọn Ngày Nhận / Trả Phòng
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleNextStep1}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Ngày nhận phòng</label>
                  <Input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Ngày trả phòng</label>
                  <Input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Số lượng khách</label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={numberOfGuests}
                    onChange={(e) => setNumberOfGuests(Number(e.target.value))}
                    className="bg-slate-900 border-slate-700 text-white"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold gap-2">
                Tiếp tục chọn hạng phòng <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </form>
        </Card>
      )}

      {/* STEP 2: Select Room Type */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Bước 2: Chọn Hạng Phòng Còn Trống</h2>
            <Button variant="outline" size="sm" onClick={() => setStep(1)} className="border-slate-700 text-slate-300">
              <ArrowLeft className="w-4 h-4 mr-1" /> Đổi ngày
            </Button>
          </div>

          {loadingAvailability ? (
            <div className="p-12 text-center text-slate-400">Đang tìm phòng còn trống...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableRoomTypes.map((item) => {
                const rt = item.roomType || item;
                const isAvailable = item.isAvailable ?? true;
                const count = item.availableCount ?? 4;

                return (
                  <Card key={rt.id} className="bg-slate-800/60 border-slate-700/60 overflow-hidden flex flex-col justify-between">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-bold text-white">{rt.name}</h3>
                          <p className="text-xs text-slate-400">Tối đa {rt.maxGuests} khách | {rt.bedCount} giường</p>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${isAvailable ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-red-500/20 text-red-300 border-red-500/30"}`}>
                          {isAvailable ? `Còn ${count} phòng` : "Hết phòng"}
                        </span>
                      </div>

                      <div className="flex items-end justify-between pt-4 border-t border-slate-700/50">
                        <div>
                          <p className="text-[10px] text-slate-400">Giá mỗi đêm</p>
                          <p className="text-xl font-extrabold text-blue-400">{rt.pricePerNight?.toLocaleString("vi-VN")}đ</p>
                        </div>
                        <Button
                          disabled={!isAvailable}
                          onClick={() => handleSelectRoomType(rt)}
                          className="bg-blue-600 hover:bg-blue-500 text-white"
                        >
                          Chọn phòng
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* STEP 3: Guest Details */}
      {step === 3 && (
        <Card className="bg-slate-800/80 border-slate-700/80 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-700 pb-4">
            <CardTitle className="text-xl font-bold text-white">Bước 3: Thông Tin Khách Hàng</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setStep(2)} className="border-slate-700 text-slate-300">
              <ArrowLeft className="w-4 h-4 mr-1" /> Chọn lại phòng
            </Button>
          </CardHeader>
          <form onSubmit={(e) => { e.preventDefault(); setStep(4); }}>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Họ và tên *</label>
                  <Input
                    required
                    placeholder="Nguyễn Văn A"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Email *</label>
                  <Input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300">Số điện thoại *</label>
                  <Input
                    required
                    placeholder="0912345678"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300">Ghi chú / Yêu cầu đặc biệt</label>
                  <textarea
                    rows={3}
                    placeholder="VD: Phòng tầng cao, 1 giường lớn..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full rounded-md border border-slate-700 bg-slate-900 p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold gap-2 mt-4">
                Tới bước xác nhận <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </form>
        </Card>
      )}

      {/* STEP 4: Summary & Confirm */}
      {step === 4 && selectedRoomType && (
        <Card className="bg-slate-800/80 border-slate-700/80 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-700 pb-4">
            <CardTitle className="text-xl font-bold text-white">Bước 4: Tóm Tắt & Xác Nhận Booking</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setStep(3)} className="border-slate-700 text-slate-300">
              <ArrowLeft className="w-4 h-4 mr-1" /> Sửa thông tin
            </Button>
          </CardHeader>
          <form onSubmit={handleCreateBooking}>
            <CardContent className="space-y-6 pt-6">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700 space-y-3">
                <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Hạng phòng:</span>
                  <span className="font-bold text-white">{selectedRoomType.name}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Thời gian:</span>
                  <span className="text-slate-200">
                    {new Date(checkInDate).toLocaleDateString("vi-VN")} đến {new Date(checkOutDate).toLocaleDateString("vi-VN")} ({nights} đêm)
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Người đặt:</span>
                  <span className="text-slate-200">{guestName} ({guestEmail})</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Tạm tính:</span>
                  <span className="text-slate-200">{roomSubtotal.toLocaleString("vi-VN")}đ</span>
                </div>

                {/* Voucher Input */}
                <div className="py-2 space-y-2">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Ticket className="w-4 h-4 text-blue-400" /> Mã giảm giá (Voucher)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nhập mã (VD: SUMMER2026, VIP10)"
                      value={voucherCodeInput}
                      onChange={(e) => setVoucherCodeInput(e.target.value.toUpperCase())}
                      className="bg-slate-900 border-slate-700 text-white uppercase font-mono"
                    />
                    <Button
                      type="button"
                      onClick={handleApplyVoucher}
                      disabled={verifyingVoucher}
                      className="bg-slate-700 hover:bg-slate-600 text-white shrink-0"
                    >
                      Áp dụng
                    </Button>
                  </div>
                  {voucherError && <p className="text-xs text-red-400">{voucherError}</p>}
                  {appliedVoucher && (
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
                      <span>Mã <strong>{appliedVoucher.code}</strong> được áp dụng</span>
                      <span>Giảm -{appliedVoucher.calculatedDiscount.toLocaleString("vi-VN")}đ</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center text-base pt-2">
                  <span className="font-bold text-white">Tổng tiền thanh toán:</span>
                  <span className="text-2xl font-black text-blue-400">{totalAmount.toLocaleString("vi-VN")}đ</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700"
                />
                <label htmlFor="terms" className="text-xs text-slate-300 cursor-pointer">
                  Tôi đã đọc và đồng ý với điều khoản đặt phòng & chính sách hủy phòng của HotelFlow.
                </label>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-lg gap-2 shadow-xl shadow-blue-500/25"
              >
                {submitting ? "Đang xử lý đặt phòng..." : "Xác Nhận Đặt Phòng Ngay"}
              </Button>
            </CardContent>
          </form>
        </Card>
      )}

      {/* STEP 5: Success Result & VietQR Payment */}
      {step === 5 && bookingResult && (
        <Card className="bg-slate-800/80 border-slate-700/80 shadow-2xl text-center p-8 space-y-6">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Đặt Phòng Thành Công!</h2>
            <p className="text-sm text-slate-400 mt-1">Cảm ơn bạn đã lựa chọn nghỉ dưỡng tại HotelFlow</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-center max-w-2xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700 space-y-2 text-sm h-full flex flex-col justify-center">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Mã booking:</span>
                <span className="font-mono font-bold text-blue-400">{bookingResult.bookingCode}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Trạng thái:</span>
                <span className="text-emerald-400 font-semibold">{bookingResult.status}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Tổng thanh toán:</span>
                <span className="font-bold text-white text-base">{totalAmount.toLocaleString("vi-VN")}đ</span>
              </div>
            </div>

            {/* VietQR Display */}
            <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/30 text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                <QrCode className="w-4 h-4" /> Thanh Toán VietQR Tự Động
              </div>
              <p className="text-[11px] text-slate-400">Quét mã bằng app Ngân hàng / MoMo để cọc phòng</p>
              <div className="bg-white p-2 rounded-xl inline-block shadow-lg">
                <img
                  src={generateVietQRUrl(totalAmount, `COC ${bookingResult.bookingCode}`)}
                  alt="VietQR Payment"
                  className="w-44 h-44 object-contain"
                />
              </div>
              <p className="text-[10px] text-slate-400 font-mono">Chủ TK: HOTELFLOW LUXURY SYSTEM</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button onClick={() => router.push("/tai-khoan")} className="bg-blue-600 hover:bg-blue-500 text-white">
              Xem đơn đặt phòng trong Tài khoản
            </Button>
            <Button variant="outline" onClick={() => router.push("/")} className="border-slate-700 text-slate-200">
              Về Trang chủ
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

export default function BookingFlowPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Đang tải luồng đặt phòng...</div>}>
      <BookingFlowContent />
    </Suspense>
  );
}
