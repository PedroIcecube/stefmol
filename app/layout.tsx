import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Stefmol | Bienestar íntimo",
  description: "Explora nuestro catálogo de bienestar íntimo. Compra discreta y atención por WhatsApp.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}