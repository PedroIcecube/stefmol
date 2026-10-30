import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const body = await request.json();

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

        const supabase = createClient(supabaseUrl, supabaseKey);

        const payload = {
            name: body.name,
            description: body.description,
            category: body.category,
            categories: body.categories,
            subcategory: body.subcategory,
            subcategories: body.subcategories || [],
            price: body.price,
            original_price: body.original_price,
            image_url: body.image_urls?.[0] || body.image_url || "",
            image_urls: body.image_urls || [],
            promo: body.promo,
        };

        const { data, error } = await supabase
            .from('products')
            .update(payload)
            .eq('id', id)
            .select();

        if (error) {
            console.error("Error al actualizar producto:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

        const supabase = createClient(supabaseUrl, supabaseKey);

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}