import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Seleccionamos los campos necesarios pero optimizamos la carga de imágenes 
    // para mantener el peso del JSON por debajo del límite de Vercel (4.5MB)
    const { data, error } = await supabase
      .from('products')
      .select('id, name, description, category, categories, subcategory, price, original_price, image_url, promo, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error en Supabase GET:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || [], {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (err: any) {
    console.error("Excepción en GET /api/products:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('products')
      .insert([body])
      .select();

    if (error) {
      console.error("Error en Supabase POST:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Excepción en POST /api/products:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}