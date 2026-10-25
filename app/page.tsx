import { createClient } from '@supabase/supabase-js';
import HomeClient from './HomeClient';

export const revalidate = 60; // Regenerar estáticamente cada 60 segundos desde la caché de la CDN

export default async function Page() {
  let products = [];

  try {
    const db = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    const { data, error } = await db.from("products").select("*").order("created_at", { ascending: false });
    if (!error && data) {
      products = data;
    }
  } catch (err) {
    console.error("Error al obtener productos en el servidor:", err);
  }

  return <HomeClient initialProducts={products} />;
}