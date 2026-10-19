import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const id = resolvedParams.id;
        const body = await request.json();

        const categories = Array.isArray(body.categories) && body.categories.length > 0
            ? body.categories
            : [body.category || "Juguetes"];

        const promo = Boolean(body.promo);
        const original_price = promo && body.original_price ? Number(body.original_price) : null;

        const { data, error } = await db
            .from("products")
            .update({
                name: String(body.name ?? "").trim(),
                description: String(body.description ?? ""),
                category: categories[0] || "Juguetes",
                categories: categories,
                subcategory: body.subcategory ? String(body.subcategory) : null,
                price: Number(body.price),
                original_price,
                image_url: String(body.image_url ?? ""),
                image_urls: body.image_urls ?? [],
                promo,
            })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Error en Supabase (PUT):", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error("Error del servidor (PUT):", err);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const id = resolvedParams.id;
        const { error } = await db.from("products").delete().eq("id", id);
        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
    }
}