import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdmin } from "@/lib/admin-auth";
export const runtime = "nodejs";
export async function POST(req:Request){
 if(!isAdmin(req))return NextResponse.json({error:"No autorizado"},{status:401});
 try{
  const form=await req.formData();const file=form.get("file");
  if(!(file instanceof File) || !["image/jpeg","image/png","image/webp"].includes(file.type) || file.size>5*1024*1024 || file.size===0) return NextResponse.json({error:"Usa JPG, PNG o WebP de hasta 5 MB"},{status:400});
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key)throw new Error("Falta configuración");
  const supabase=createClient(url,key);
  const ext=file.type==="image/png"?"png":file.type==="image/webp"?"webp":"jpg";
  const path=`nuevos/${crypto.randomUUID()}.${ext}`;
  const {error}=await supabase.storage.from("product-images").upload(path,file,{contentType:file.type,upsert:false});
  if(error)throw error;
  const {data}=supabase.storage.from("product-images").getPublicUrl(path);
  return NextResponse.json({url:data.publicUrl});
 }catch{return NextResponse.json({error:"No se pudo subir la fotografía"},{status:500});}
}
