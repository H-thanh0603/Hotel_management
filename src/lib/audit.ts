import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import prisma from "./prisma";

export async function writeAudit(data: {
  action: string;
  entity: string;
  entityId?: string;
  detail?: string;
  ip?: string | null;
}) {
  try {
    const session = await getServerSession(authOptions);
    await prisma.auditLog.create({
      data: {
        userId: session?.user?.id ?? null,
        userRole: (session?.user as any)?.role ?? null,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        detail: data.detail,
        ip: data.ip,
      },
    });
  } catch {
    // audit log thất bại không được làm hỏng request chính
  }
}

// Rate limiter đơn giản in-memory (per-process). Đủ cho đồ án/dev.
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  bucket.count++;
  if (bucket.count > limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfter: 0 };
}

export function getClientIp(req: Request): string | null {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip");
}

export function rateLimited(res: { ok: boolean; retryAfter: number }) {
  return NextResponse.json(
    { error: "Quá nhiều yêu cầu, thử lại sau" },
    { status: 429, headers: { "Retry-After": String(res.retryAfter) } }
  );
}
