import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const price = Number(body.price);

    if (!name || isNaN(price)) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
    }

    // Asegurar que categories sea un array y tenga al menos una categoría
    const categories = Array.isArray(body.categories) && body.categories.length > 0
      ? body.categories
      : [body.category || "Juguetes"];

    const promo = Boolean(body.promo);
    const original_price = promo && body.original_price ? Number(body.original_price) : null;

    const { data, error } = await db.from("products").insert({
      name,
      description: String(body.description ?? ""),
      category: categories[0] || "Juguetes",
      categories: categories, // <--- Guardar la lista completa aquí
      subcategory: body.subcategory ? String(body.subcategory) : null,
      price,
      original_price,
      image_url: String(body.image_url ?? ""),
      image_urls: body.image_urls ?? [],
      promo,
      active: true
    }).select().single();

    if (error) {
      console.error("Error en Supabase (POST):", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error del servidor (POST):", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await db.from("products").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
  }
}