import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdmin } from "@/lib/admin-auth";
export const runtime = "nodejs";
function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Faltan variables privadas de Supabase");
  return createClient(url,key);
}
const fields = "id,name,description,category,categories,subcategory,subcategories,price,original_price,image_url,image_urls,promo,created_at";
export async function GET() {
  try {
    const { data,error } = await db().from("products").select(fields).order("created_at", { ascending: false });
    if(error) throw error;
    return NextResponse.json(data || [], { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
  } catch { return NextResponse.json({ error: "No se pudo cargar el catálogo" }, { status: 500 }); }
}
export async function POST(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  try {
    const body = await req.json();
    if (typeof body.name !== "string" || !body.name.trim() || !Number.isFinite(Number(body.price)) || Number(body.price) < 0) return NextResponse.json({ error: "Nombre o precio inválido" }, { status: 400 });
    const images = Array.isArray(body.image_urls) ? body.image_urls : [];
    if (!images.every((x:unknown) => typeof x === "string" && x.startsWith(process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/product-images/"))) return NextResponse.json({ error: "Las fotos deben estar en Supabase Storage" }, { status: 400 });
    const payload = { name: body.name.trim(), description: body.description || "", category: body.category, categories: body.categories || [], subcategory: body.subcategory || null, subcategories: body.subcategories || [], price: Number(body.price), original_price: body.original_price == null ? null : Number(body.original_price), image_url: images[0] || "", image_urls: images, promo: !!body.promo };
    const { error } = await db().from("products").insert(payload);
    if(error) throw error;
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "No se pudo guardar el producto" }, { status: 500 }); }
}
