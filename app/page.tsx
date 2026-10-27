import HomeClient from './HomeClient';
import { createClient } from '@supabase/supabase-js';

export const revalidate = 60;

type Product = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  categories?: string[];
  subcategory?: string | null;
  price: number;
  original_price?: number | null;
  image_url: string | null;
  image_urls?: string[];
  promo?: boolean;
};

export default async function Page() {
  let products: Product[] = [];

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    const { data } = await supabase
      .from('products')
      .select('id, name, description, category, categories, subcategory, price, original_price, image_url, image_urls, promo')
      .order('price', { ascending: false });

    if (data) {
      products = data as Product[];
    }
  } catch (e) {
    console.error("Error cargando productos iniciales:", e);
  }

  return <HomeClient initialProducts={products} />;
}