import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { NextRequest } from "next/server";

const COOKIE = "stefmol_admin";
const MAX_AGE = 60 * 60 * 8;
function secret() {
  const value = process.env.ADMIN_PASSWORD;
  if (!value || value.length < 12) throw new Error("Configura ADMIN_PASSWORD con al menos 12 caracteres en el servidor.");
  return value;
}
function signature(payload: string) { return createHmac("sha256", secret()).update(payload).digest("hex"); }
export function verifyPassword(input: string) {
  const expected = Buffer.from(secret());
  const received = Buffer.from(input);
  return expected.length === received.length && timingSafeEqual(expected, received);
}
export function createSession() {
  const expires = Date.now() + MAX_AGE * 1000;
  const payload = `${expires}.${randomBytes(16).toString("hex")}`;
  return `${payload}.${signature(payload)}`;
}
export function isAdmin(req: Request | NextRequest) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const raw = cookie.split(";").map(x => x.trim()).find(x => x.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
    if (!raw) return false;
    const parts = raw.split(".");
    if (parts.length !== 3) return false;
    const payload = `${parts[0]}.${parts[1]}`;
    if (!Number.isFinite(Number(parts[0])) || Number(parts[0]) < Date.now()) return false;
    const a = Buffer.from(signature(payload), "hex");
    const b = Buffer.from(parts[2], "hex");
    return a.length === b.length && timingSafeEqual(a,b);
  } catch { return false; }
}
export const adminCookie = COOKIE;
export const adminCookieAge = MAX_AGE;
