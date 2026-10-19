import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = supabaseAdmin();
    // Quitamos el filtro .eq("active", true) temporalmente en el admin para que muestre todo lo que hay en Supabase
    const { data, error } = await db
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "No fue posible cargar los productos. Revisa la configuración de Supabase." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const price = Number(body.price);

    if (!name || !Number.isFinite(price) || price < 0) {
      return NextResponse.json({ error: "Nombre y precio válidos son obligatorios." }, { status: 400 });
    }

    const db = supabaseAdmin();

    const image_url = String(body.image_url ?? "");
    const image_urls = Array.isArray(body.image_urls) && body.image_urls.length > 0
      ? body.image_urls
      : (image_url ? [image_url] : []);

    const original_price = body.original_price ? Number(body.original_price) : null;
    const { data, error } = await db.from("products").insert({
      name,
      description: String(body.description ?? ""),
      category: String(body.category ?? "Juguetes"),
      subcategory: String(body.subcategory ?? ""),
      price,
      image_url,
      image_urls,
      original_price,
      promo: Boolean(body.promo),
      active: true
    }).select().single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (e: any) {
    console.error("Error al guardar:", e);
    return NextResponse.json({ error: e.message || "No se pudo guardar el producto." }, { status: 500 });
  }
}