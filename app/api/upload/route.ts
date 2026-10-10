import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (req.headers.get("x-admin-password") !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Selecciona una imagen." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "El archivo debe ser una imagen." }, { status: 400 });
    }

    // Máximo 5 MB (5 * 1024 * 1024 bytes)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "La imagen debe pesar máximo 5 MB." }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "jpg";
    const path = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const supabase = supabaseAdmin();

    // Subir archivo al bucket product-images en Supabase
    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, file, { contentType: file.type, upsert: false });

    if (error) throw error;

    // Obtener la URL pública de la imagen guardada
    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(path);

    return NextResponse.json({ url: data.publicUrl });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "No se pudo subir la imagen. Revisa que exista el bucket product-images en Supabase." },
      { status: 500 }
    );
  }
}