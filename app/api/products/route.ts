import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Permitir cuerpos de solicitud grandes para las imágenes en Base64
export const maxDuration = 10;
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const { data, error } = await supabase
      .from('products') // <-- Corregido a 'products'
      .select('*')
      .order('price', { ascending: false })
      .limit(50); // Limitamos para evitar sobrecarga de datos pesados

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

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const { data, error } = await supabase
      .from('products') // <-- Corregido a 'products'
      .insert([body])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Server error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}