import HomeClient from './HomeClient';

export const dynamic = "force-dynamic";

export default function Page() {
  // Renderizamos el cliente directamente sin sobrecargar el payload HTML con 21MB de datos
  return <HomeClient initialProducts={[]} />;
}