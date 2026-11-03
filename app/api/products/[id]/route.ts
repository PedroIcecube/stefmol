import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdmin } from "@/lib/admin-auth";
export const runtime = "nodejs";
function db() { const url=process.env.NEXT_PUBLIC_SUPABASE_URL; const key=process.env.SUPABASE_SERVICE_ROLE_KEY; if(!url||!key) throw new Error("Falta configuración de Supabase"); return createClient(url,key); }
export async function PUT(req: Request, context: { params: Promise<{id:string}> }) {
 if(!isAdmin(req)) return NextResponse.json({error:"No autorizado"},{status:401});
 try {
  const {id}=await context.params; const body=await req.json();
  if(typeof body.name!=="string" || !body.name.trim() || !Number.isFinite(Number(body.price)) || Number(body.price)<0) return NextResponse.json({error:"Datos inválidos"},{status:400});
  const images=Array.isArray(body.image_urls)?body.image_urls:[];
  if(!images.every((x:unknown)=>typeof x==="string" && x.startsWith(process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/product-images/"))) return NextResponse.json({error:"Fotos inválidas"},{status:400});
  const payload={name:body.name.trim(),description:body.description||"",category:body.category,categories:body.categories||[],subcategory:body.subcategory||null,subcategories:body.subcategories||[],price:Number(body.price),original_price:body.original_price==null?null:Number(body.original_price),image_url:images[0]||"",image_urls:images,promo:!!body.promo};
  const {error}=await db().from("products").update(payload).eq("id",id); if(error) throw error;
  return NextResponse.json({success:true});
 }catch{return NextResponse.json({error:"No se pudo actualizar"},{status:500});}
}
export async function DELETE(req:Request,context:{params:Promise<{id:string}>}){
 if(!isAdmin(req)) return NextResponse.json({error:"No autorizado"},{status:401});
 try{const {id}=await context.params;const {error}=await db().from("products").delete().eq("id",id);if(error)throw error;return NextResponse.json({success:true});}
 catch{return NextResponse.json({error:"No se pudo eliminar"},{status:500});}
}
