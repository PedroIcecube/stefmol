import type { Metadata } from "next";
import { Italianno, Inter } from "next/font/google";

// @ts-ignore
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const italianno = Italianno({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-italianno",
});

export const metadata: Metadata = {
  title: "Stefmol · Boutique Erótica",
  description: "Juguetes, lencería, accesorios y mucho más.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.className} ${italianno.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}