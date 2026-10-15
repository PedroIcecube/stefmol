import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    if (req.headers.get("x-admin-password") !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await req.json();
        const db = supabaseAdmin();

        const { data, error } = await db
            .from("products")
            .update({
                name: String(body.name ?? "").trim(),
                description: String(body.description ?? ""),
                category: String(body.category ?? "Juguetes"),
                subcategory: String(body.subcategory ?? ""),
                price: Number(body.price),
                image_url: String(body.image_url ?? ""),
                image_urls: body.image_urls ?? []
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (e: any) {
        console.error("Error al actualizar:", e);
        return NextResponse.json({ error: e.message || "Error al actualizar" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    if (req.headers.get("x-admin-password") !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const db = supabaseAdmin();

        const { error } = await db.from("products").delete().eq("id", id);
        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error("Error al eliminar:", e);
        return NextResponse.json({ error: e.message || "Error al eliminar" }, { status: 500 });
    }
}