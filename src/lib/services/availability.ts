import prisma from "@/lib/prisma";

export interface AvailabilitySearchParams {
  checkInDate: string | Date;
  checkOutDate: string | Date;
  roomTypeId?: string;
  adults?: number;
  children?: number;
}

export interface AvailableRoomTypeResult {
  roomType: any;
  totalRooms: number;
  reservedCount: number;
  availableCount: number;
  isAvailable: boolean;
}

/**
 * Searches for available room types and calculates real-time room availability for a date range.
 * Overlap formula: existing.checkIn < requested.checkOut AND existing.checkOut > requested.checkIn
 * Excludes CANCELLED and NO_SHOW bookings.
 */
export async function searchAvailability(
  params: AvailabilitySearchParams
): Promise<AvailableRoomTypeResult[]> {
  const checkIn = new Date(params.checkInDate);
  const checkOut = new Date(params.checkOutDate);

  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    throw new Error("Ngày nhận/trả phòng không hợp lệ");
  }

  if (checkOut <= checkIn) {
    throw new Error("Ngày trả phòng phải sau ngày nhận phòng");
  }

  // 1. Fetch active room types
  const roomTypes = await prisma.roomType.findMany({
    where: {
      status: "ACTIVE",
      ...(params.roomTypeId ? { id: params.roomTypeId } : {}),
      ...(params.adults ? { maxGuests: { gte: params.adults } } : {}),
    },
    include: {
      rooms: {
        where: {
          status: { notIn: ["INACTIVE"] },
        },
      },
    },
  });

  // 2. Fetch overlapping active bookings for the specified date range
  const overlappingBookings = await prisma.booking.findMany({
    where: {
      status: { in: ["PENDING", "CONFIRMED", "CHECKED_IN"] },
      checkInDate: { lt: checkOut },
      checkOutDate: { gt: checkIn },
      ...(params.roomTypeId ? { roomTypeId: params.roomTypeId } : {}),
    },
    select: {
      id: true,
      roomTypeId: true,
      roomId: true,
    },
  });

  // 3. Compute availability for each room type
  const results: AvailableRoomTypeResult[] = roomTypes.map((rt) => {
    const totalRooms = rt.rooms.length;
    
    // Count bookings assigned to this roomType that overlap
    const rtBookings = overlappingBookings.filter((b) => b.roomTypeId === rt.id);
    const reservedCount = rtBookings.length;

    const availableCount = Math.max(0, totalRooms - reservedCount);
    const isAvailable = availableCount > 0 && totalRooms > 0;

    return {
      roomType: rt,
      totalRooms,
      reservedCount,
      availableCount,
      isAvailable,
    };
  });

  return results;
}

/**
 * Asserts that a room or room type is available for the given date range within a database transaction.
 * Throws an Error if no room is available or if a specific assigned room has an overlap.
 */
export async function assertAvailable(
  tx: any,
  params: {
    roomTypeId: string;
    roomId?: string | null;
    checkInDate: Date;
    checkOutDate: Date;
    excludeBookingId?: string;
  }
) {
  const { roomTypeId, roomId, checkInDate, checkOutDate, excludeBookingId } = params;

  // If a specific room is selected, check for direct room conflict
  if (roomId) {
    const roomConflict = await tx.booking.findFirst({
      where: {
        roomId,
        id: excludeBookingId ? { not: excludeBookingId } : undefined,
        status: { in: ["PENDING", "CONFIRMED", "CHECKED_IN"] },
        checkInDate: { lt: checkOutDate },
        checkOutDate: { gt: checkInDate },
      },
    });

    if (roomConflict) {
      throw new Error(`Phòng đã được đặt trong khoảng thời gian từ ${checkInDate.toLocaleDateString("vi-VN")} đến ${checkOutDate.toLocaleDateString("vi-VN")}`);
    }
  }

  // Check total room type capacity vs active bookings
  const totalActiveRooms = await tx.room.count({
    where: {
      roomTypeId,
      status: { notIn: ["INACTIVE"] },
    },
  });

  const activeBookingsCount = await tx.booking.count({
    where: {
      roomTypeId,
      id: excludeBookingId ? { not: excludeBookingId } : undefined,
      status: { in: ["PENDING", "CONFIRMED", "CHECKED_IN"] },
      checkInDate: { lt: checkOutDate },
      checkOutDate: { gt: checkInDate },
    },
  });

  if (activeBookingsCount >= totalActiveRooms || totalActiveRooms === 0) {
    throw new Error("Hạng phòng này đã hết phòng trong khoảng thời gian đã chọn");
  }
}
