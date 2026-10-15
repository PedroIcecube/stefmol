import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = supabaseAdmin();
    const { data, error } = await db
      .from("products")
      .select("*")
      .eq("active", true)
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
  if (req.headers.get("x-admin-password") !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const price = Number(body.price);

    if (!name || !Number.isFinite(price) || price < 0) {
      return NextResponse.json({ error: "Nombre y precio válidos son obligatorios." }, { status: 400 });
    }

    const db = supabaseAdmin();

    // Procesar las múltiples imágenes y la subcategoría
    const image_url = String(body.image_url ?? "");
    const image_urls = Array.isArray(body.image_urls) && body.image_urls.length > 0
      ? body.image_urls
      : (image_url ? [image_url] : []);

    const { data, error } = await db.from("products").insert({
      name,
      description: String(body.description ?? ""),
      category: String(body.category ?? "Juguetes"),
      subcategory: String(body.subcategory ?? ""),
      price,
      image_url,
      image_urls,
      active: true
    }).select().single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "No se pudo guardar el producto." }, { status: 500 });
  }
}
