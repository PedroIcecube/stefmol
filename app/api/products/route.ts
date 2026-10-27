import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    // Traemos únicamente las columnas necesarias para aligerar la transferencia
    const { data, error } = await supabase
      .from('products')
      .select('id, name, description, category, categories, subcategory, price, original_price, image_url, image_urls, promo')
      .order('price', { ascending: false });

    if (error) {
      return NextResponse.json([], { status: 500 });
    }

    // Cabecera Cache-Control: Sirve la respuesta al instante desde la CDN de Vercel
    return NextResponse.json(data || [], {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}