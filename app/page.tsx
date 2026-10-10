"use client";
import { useEffect, useMemo, useState } from "react";
import { Menu, Search, ShoppingCart, Heart, Truck, LockKeyhole, ShieldCheck, Headset, MessageCircle, Plus, Minus, Trash2, ArrowRight, X } from "lucide-react";

type Product = { id: string; name: string; description: string | null; category: string | null; price: number; image_url: string | null };
type CartItem = Product & { quantity: number };

const money = (n: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

const fallback: Product[] = [
  { id: "demo1", name: "Vibrador Conejito 12 modos", description: "Diseño ergonómico · 12 modos", category: "Vibradores", price: 89900, image_url: "" },
  { id: "demo2", name: "Estimulador de succión", description: "Diseño compacto", category: "Estimuladores", price: 99900, image_url: "" },
  { id: "demo3", name: "Plug anal con joya", description: "Material suave", category: "Anales", price: 59900, image_url: "" },
  { id: "demo4", name: "Conjunto lencería de encaje", description: "Consulta las tallas disponibles", category: "Lencería", price: 79900, image_url: "" },
  { id: "demo5", name: "Lubricante íntimo base agua 120 ml", description: "Presentación de 120 ml", category: "Lubricantes", price: 39900, image_url: "" },
  { id: "demo6", name: "Kit de bienestar íntimo", description: "Pregunta por disponibilidad", category: "Kits", price: 119900, image_url: "" }
];

const categories = ["Todos", "Vibradores", "Estimuladores", "Anales", "Kits", "Lencería", "Lubricantes", "Accesorios"];

export default function Home() {
  const [products, setProducts] = useState<Product[]>(fallback);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [category, setCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((d: Product[]) => { if (Array.isArray(d) && d.length) setProducts(d); })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => products.filter(p => (category === "Todos" || p.category === category) && `${p.name} ${p.description ?? ""}`.toLowerCase().includes(search.toLowerCase())), [products, category, search]);
  const total = cart.reduce((s, p) => s + p.price * p.quantity, 0);

  function add(p: Product) {
    setCart(old => {
      const found = old.find(x => x.id === p.id);
      return found ? old.map(x => x.id === p.id ? { ...x, quantity: x.quantity + 1 } : x) : [...old, { ...p, quantity: 1 }];
    });
  }

  function qty(id: string, delta: number) {
    setCart(old => old.map(p => p.id === id ? { ...p, quantity: p.quantity + delta } : p).filter(p => p.quantity > 0));
  }

  function checkout() {
    // Toma el número de las variables de entorno o usa el número de respaldo por defecto
    const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573114020157";
    const number = rawNumber.replace(/\D/g, "");

    if (!number) {
      alert("Por favor configura el número de WhatsApp en tu archivo .env.local");
      return;
    }

    const lines = cart.map(p => `🛍️ ${p.name}\nCantidad: ${p.quantity}\nPrecio unidad: ${money(p.price)}\nSubtotal: ${money(p.price * p.quantity)}`).join("\n\n--------------------\n");
    const message = `¡Hola! 👋 Quiero hacer este pedido:\n\n${lines}\n\nTOTAL: ${money(total)}\n\nNotas: ${note || "Sin notas"}\n\n¿Cómo puedo realizar el pago y en cuánto tiempo llega?`;

    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <main>
      <header className="hero-bg text-white px-5 md:px-10 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-3">
          <button aria-label="Menú" className="p-2"><Menu /></button>
          <a href="#" className="text-center">
            <div className="brand-script text-4xl md:text-5xl text-pink-300">Stefmol</div>
            <div className="text-[9px] tracking-[.28em]">TU TIENDA ERÓTICA</div>
          </a>
          <div className="flex gap-4">
            <a href="#catalogo" aria-label="Buscar"><Search /></a>
            <button onClick={() => setCartOpen(true)} className="relative" aria-label="Carrito">
              <ShoppingCart />
              <span className="absolute -right-2 -top-2 bg-pink-500 rounded-full text-xs px-1.5">{cart.reduce((s, p) => s + p.quantity, 0)}</span>
            </button>
          </div>
        </div>
      </header>

      <section className="hero-bg text-white">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-24 grid md:grid-cols-2 items-center gap-8">
          <div>
            <p className="text-pink-300 italic text-xl md:text-2xl">Explora tu lado más</p>
            <h1 className="brand-script text-7xl md:text-9xl text-pink-400 leading-tight">Hot ♡</h1>
            <p className="tracking-widest text-sm md:text-base mt-2">JUGUETES, LENCERÍA,<br /> ACCESORIOS Y MUCHO MÁS</p>
            <a href="#catalogo" className="inline-flex items-center gap-4 rounded-full pink-gradient px-8 py-4 mt-8 font-bold">VER PRODUCTOS <ArrowRight size={20} /></a>
          </div>
          <div className="rounded-3xl border border-pink-300/30 bg-gradient-to-br from-pink-500/20 to-black/50 min-h-64 md:min-h-80 flex items-center justify-center text-center p-8">
            <div>
              <Heart className="mx-auto text-pink-300" size={52} />
              <p className="brand-script text-4xl text-pink-200 mt-4">Tu bienestar, a tu manera</p>
              <p className="text-sm text-white/70 mt-3">Discreción · Confianza · Atención personalizada</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-7xl mx-auto px-5 -mt-5 relative">
        {[
          { icon: <Truck />, title: "Envíos discretos" },
          { icon: <LockKeyhole />, title: "Compra segura" },
          { icon: <Heart />, title: "+18 Solo adultos" },
          { icon: <MessageCircle />, title: "Pedido por WhatsApp" }
        ].map(x => (
          <div key={x.title} className="bg-white rounded-xl p-4 soft-shadow text-center text-rose-900 flex flex-col items-center gap-2">
            {x.icon}
            <span className="text-xs md:text-sm">{x.title}</span>
          </div>
        ))}
      </section>

      <section id="catalogo" className="max-w-7xl mx-auto px-5 py-12">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
          <div>
            <p className="text-pink-600 font-semibold text-sm">ENCUENTRA TUS FAVORITOS</p>
            <h2 className="text-3xl font-black">Catálogo de productos</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar productos..." className="border rounded-full py-2.5 pl-10 pr-4 w-64 max-w-full outline-pink-400 bg-white" />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4">
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${category === c ? "pink-gradient text-white" : "bg-white border"}`}>
              {c}
            </button>
          ))}
        </div>

        {loading && <p className="text-gray-500 py-3">Cargando catálogo…</p>}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {visible.map(p => (
            <article key={p.id} className="bg-white rounded-2xl p-3 soft-shadow flex flex-col">
              <div className="aspect-square rounded-xl bg-gradient-to-br from-pink-50 to-rose-100 overflow-hidden flex items-center justify-center">
                {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" /> : <div className="text-center p-4"><Heart size={44} className="text-pink-400 mx-auto" /><p className="text-xs text-pink-700 mt-3">Imagen del producto</p></div>}
              </div>
              <h3 className="font-semibold mt-3 leading-snug">{p.name}</h3>
              <p className="text-xs text-gray-500 mt-1 flex-1">{p.description}</p>
              <p className="text-pink-600 font-black text-lg mt-2">{money(p.price)}</p>
              <button onClick={() => add(p)} className="pink-gradient text-white rounded-xl p-3 mt-3 flex justify-center items-center gap-2">
                <Plus size={17} /> Agregar
              </button>
            </article>
          ))}
        </div>

        {!visible.length && <p className="py-12 text-center text-gray-500">No encontramos productos con esa búsqueda.</p>}
      </section>

      <footer className="bg-[#0c060a] text-white px-5 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-sm">
          {[
            { icon: <Truck />, t: "ENVÍOS DISCRETOS" },
            { icon: <LockKeyhole />, t: "COMPRA SEGURA" },
            { icon: <Heart />, t: "+18 SOLO ADULTOS" },
            { icon: <Headset />, t: "ATENCIÓN POR WHATSAPP" }
          ].map(x => (
            <div key={x.t} className="flex flex-col items-center gap-3 text-pink-300">
              {x.icon}
              <span className="text-white/80 text-xs tracking-wider">{x.t}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-white/50 mt-8">© {new Date().getFullYear()} Stefmol · Tienda para mayores de 18 años.</p>
        <p className="text-center mt-3"><a className="text-pink-300 underline" href="/admin">Administrar productos</a></p>
      </footer>

      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-end">
          <div className="bg-white w-full max-w-lg h-full overflow-y-auto p-5 md:p-7">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black">Mi carrito ({cart.reduce((s, p) => s + p.quantity, 0)})</h2>
              <button onClick={() => setCartOpen(false)} aria-label="Cerrar"><X /></button>
            </div>

            {!cart.length ? (
              <div className="text-center py-20 text-gray-500">
                <ShoppingCart size={44} className="mx-auto mb-4" />
                Tu carrito está vacío.
              </div>
            ) : (
              <>
                <div className="divide-y">
                  {cart.map(p => (
                    <div key={p.id} className="py-4 flex gap-3">
                      <div className="w-20 h-20 rounded-lg bg-pink-50 overflow-hidden flex items-center justify-center">
                        {p.image_url ? <img src={p.image_url} className="w-full h-full object-cover" alt={p.name} /> : <Heart className="text-pink-400" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-pink-600 font-bold">{money(p.price)}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button className="border rounded p-1" onClick={() => qty(p.id, -1)}><Minus size={14} /></button>
                          <span>{p.quantity}</span>
                          <button className="border rounded p-1" onClick={() => qty(p.id, 1)}><Plus size={14} /></button>
                          <button className="ml-auto text-gray-500" onClick={() => setCart(old => old.filter(x => x.id !== p.id))}><Trash2 size={17} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <label className="block text-sm font-medium mt-5 mb-2">Notas del pedido (opcional)</label>
                <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Color, talla, referencias…" className="w-full border rounded-xl p-3 min-h-20" />

                <div className="flex justify-between text-xl font-black mt-5 mb-5">
                  <span>Total:</span>
                  <span className="text-pink-600">{money(total)}</span>
                </div>

                <button onClick={checkout} className="w-full rounded-full bg-green-600 hover:bg-green-700 text-white py-4 font-bold flex justify-center items-center gap-2">
                  <MessageCircle /> Enviar pedido por WhatsApp
                </button>
              </>
            )}

            <p className="text-xs text-gray-500 mt-5 flex gap-2">
              <ShieldCheck size={16} /> Pedido enviado por WhatsApp para confirmar pago, envío y disponibilidad.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}