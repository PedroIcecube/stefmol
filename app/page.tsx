import HomeClient from './HomeClient';

// Desactivamos el ISR pesado para evitar el error de los 33MB en Vercel
export const dynamic = 'force-dynamic';

export default function Page() {
  // Entregamos la página vacía al servidor de inmediato (0 segundos de espera)
  // El cliente se encargará de pintar los productos instantáneamente desde su caché local.
  return <HomeClient initialProducts={[]} />;
}