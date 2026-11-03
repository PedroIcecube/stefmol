import { NextResponse } from "next/server";
import { adminCookie, adminCookieAge, createSession, isAdmin, verifyPassword } from "@/lib/admin-auth";
export const runtime = "nodejs";
export async function GET(req: Request) { return NextResponse.json({ authenticated: isAdmin(req) }, { headers: { "Cache-Control": "no-store" } }); }
export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    if (typeof password !== "string" || !verifyPassword(password)) return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
    const response = NextResponse.json({ authenticated: true });
    response.cookies.set(adminCookie, createSession(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: adminCookieAge });
    return response;
  } catch { return NextResponse.json({ error: "No se pudo iniciar sesión. Comprueba ADMIN_PASSWORD en el servidor." }, { status: 500 }); }
}
export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(adminCookie, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 0 });
  return response;
}
