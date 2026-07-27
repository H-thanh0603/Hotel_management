import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export type Role = "ADMIN" | "RECEPTIONIST" | "HOUSEKEEPING" | "CUSTOMER";

export async function getSession() {
  return getServerSession(authOptions);
}

export function unauthorized() {
  return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 403 });
}

export function hasRole(
  session: { user?: { role?: string } } | null,
  roles: Role[]
): boolean {
  return !!session?.user?.role && roles.includes(session.user.role as Role);
}

/**
 * Trả về session nếu đã login, ngược lại trả về response 401.
 * Dùng: const guard = await requireSession(); if (guard instanceof NextResponse) return guard;
 */
export async function requireSession() {
  const session = await getSession();
  if (!session?.user) return unauthorized();
  return session;
}

/**
 * Trả về session nếu login + đúng role, ngược lại 401/403.
 */
export async function requireRole(roles: Role[]) {
  const session = await getSession();
  if (!session?.user) return unauthorized();
  if (!hasRole(session, roles)) return forbidden();
  return session;
}
