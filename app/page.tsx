"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Menu, Search, ShoppingCart, Heart, Truck, LockKeyhole,
  ShieldCheck, Headset, MessageCircle, Plus, Minus, Trash2,
  ArrowRight, X, ChevronRight, CheckCircle2, Sparkles
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  price: number;
  image_url: string | null;
  promo?: boolean;
};

type CartItem = Product & { quantity: number };

const money = (n: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

const fallback: Product[] = [
  { id: "demo1", name: "Vibrador Conejito 12 modos", description: "Diseño ergonómico · 12 modos", category: "Vibradores", price: 89900, image_url: "", promo: true },
  { id: "demo2", name: "Estimulador de succión", description: "Diseño compacto", category: "Estimuladores", price: 99900, image_url: "", promo: false },
  { id: "demo3", name: "Plug anal con joya", description: "Material suave", category: "Anales", price: 59900, image_url: "", promo: true },
  { id: "demo4", name: "Conjunto lencería de encaje", description: "Consulta las tallas disponibles", category: "Lencería", price: 79900, image_url: "", promo: false },
  { id: "demo5", name: "Lubricante íntimo base agua 120 ml", description: "Presentación de 120 ml", category: "Lubricantes", price: 39900, image_url: "", promo: true },
  { id: "demo6", name: "Kit de bienestar íntimo", description: "Pregunta por disponibilidad", category: "Kits", price: 119900, image_url: "", promo: true }
];

const categories = ["Todos", "Promociones del Mes", "Vibradores", "Estimuladores", "Anales", "Kits", "Lencería", "Lubricantes", "Accesorios"];

export default function Home() {
  const [products, setProducts] = useState<Product[]>(fallback);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [category, setCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((d: Product[]) => { if (Array.isArray(d) && d.length) setProducts(d); })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => {
    return products.filter(p => {
      const matchCat = category === "Todos"
        ? true
        : category === "Promociones del Mes"
          ? p.promo === true
          : p.category === category;
      const matchSearch = `${p.name} ${p.description ?? ""}`.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, category, search]);

  const total = cart.reduce((s, p) => s + p.price * p.quantity, 0);

  function add(p: Product) {
    setCart(old => {
      const found = old.find(x => x.id === p.id);
      return found ? old.map(x => x.id === p.id ? { ...x, quantity: x.quantity + 1 } : x) : [...old, { ...p, quantity: 1 }];
    });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1800);
  }

  function qty(id: string, delta: number) {
    setCart(old => old.map(p => p.id === id ? { ...p, quantity: p.quantity + delta } : p).filter(p => p.quantity > 0));
  }

  function checkout() {
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
    <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-rose-600 selection:text-white">

      {/* BARRA SUPERIOR */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-rose-950/40 text-white px-5 md:px-10 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-3">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Menú"
            className="p-2 rounded-xl bg-slate-900 border border-rose-900/40 text-rose-300 hover:bg-rose-950 transition-all active:scale-95 cursor-pointer shadow-md"
          >
            <Menu className="w-6 h-6 text-rose-400" />
          </button>

          <a href="#" className="text-center">
            <div className="brand-script text-4xl md:text-5xl text-pink-300">Stefmol</div>
            <div className="text-[9px] tracking-[.28em] text-slate-400">TU TIENDA ERÓTICA</div>
          </a>

          <div className="flex gap-4 items-center">
            <button onClick={() => setCartOpen(true)} className="relative p-2 rounded-xl bg-rose-950/30 border border-rose-900/30 text-rose-300" aria-label="Carrito">
              <ShoppingCart className="w-5 h-5" />
              {cart.reduce((s, p) => s + p.quantity, 0) > 0 && (
                <span className="absolute -right-1 -top-1 bg-rose-600 rounded-full text-xs font-bold w-5 h-5 flex items-center justify-center text-white">
                  {cart.reduce((s, p) => s + p.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MENÚ LATERAL TIPO DRAWER (REFERENCIA) */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={() => setMenuOpen(false)} />
          <div className="relative w-full max-w-sm sm:max-w-md bg-slate-950 text-slate-100 h-full shadow-2xl flex flex-col z-10 overflow-y-auto border-r border-rose-950/40">

            <div className="flex items-center justify-between p-4 border-b border-rose-950/40">
              <span className="font-bold text-rose-300 tracking-wider text-sm">MENÚ PRINCIPAL</span>
              <button onClick={() => setMenuOpen(false)} className="p-2 rounded-full hover:bg-slate-900 text-slate-300 transition-colors" aria-label="Cerrar">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Busca juguetes o marcas..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-900 border border-rose-950/60 text-sm focus:outline-none focus:border-rose-500 text-slate-200"
                />
              </div>
            </div>

            <div className="flex-1 px-4 py-2 space-y-1">
              {[
                { name: "Promociones del Mes", cat: "Promociones del Mes" },
                { name: "Nuevos", cat: "Todos" },
                { name: "Juguetes", cat: "Juguetes" },
                { name: "Lubricantes y bienestar", cat: "Lubricantes" },
                { name: "Lencería y BDSM", cat: "Lencería" },
                { name: "Marcas", cat: "Todos" },
                { name: "Más vendidos", cat: "Todos" },
                { name: "Blog", cat: "Todos" }
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCategory(item.cat);
                    setMenuOpen(false);
                    const el = document.getElementById("catalogo");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full flex items-center justify-between py-3.5 px-3 rounded-xl text-slate-200 font-semibold hover:bg-rose-950/40 border-b border-rose-950/20 transition-colors text-left"
                >
                  <span>{item.name}</span>
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </button>
              ))}
            </div>

            <div className="p-5 bg-gradient-to-br from-rose-950/40 to-slate-900 m-4 rounded-3xl border border-rose-900/30 space-y-3">
              <div>
                <h4 className="font-bold text-rose-100 text-base">¿Dudas? Te asesoramos</h4>
                <p className="text-xs text-slate-400 mt-0.5">Escríbenos por WhatsApp, respondemos con total discreción.</p>
              </div>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-2xl bg-rose-800 hover:bg-rose-700 text-white font-medium flex items-center justify-center gap-2 shadow-md transition-colors text-sm"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Escribir por WhatsApp</span>
              </a>
            </div>

          </div>
        </div>
      )}

      {/* SECCIÓN HERO / PORTADA CENTRADA */}
      <section className="bg-gradient-to-b from-slate-950 via-rose-950/10 to-slate-950 text-white border-b border-rose-950/30">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-20 grid md:grid-cols-2 items-center gap-8">

          {/* Columna Izquierda: Centrada */}
          <div className="text-center flex flex-col items-center justify-center">
            <p className="text-pink-300 italic text-xl md:text-2xl">Explora tu lado más</p>
            <div className="flex items-center justify-center gap-2 my-1">
              <h1 className="brand-script text-7xl md:text-9xl text-pink-400 leading-tight">Hot</h1>
              <Heart className="w-12 h-12 text-pink-400 fill-pink-400/20 animate-pulse" />
            </div>
            <p className="tracking-widest text-xs md:text-sm mt-2 text-slate-300 uppercase">JUGUETES, LENCERÍA,<br /> ACCESORIOS Y MUCHO MÁS</p>
            <a href="#catalogo" className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 px-8 py-4 mt-8 font-bold shadow-lg shadow-rose-950/50 hover:scale-105 active:scale-95 transition-all">
              VER PRODUCTOS <ArrowRight size={20} />
            </a>
          </div>

          {/* Columna Derecha: Tarjeta Interactiva "Promociones del Mes" */}
          <div
            onClick={() => {
              setCategory("Promociones del Mes");
              const el = document.getElementById("catalogo");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="rounded-3xl border border-rose-900/40 bg-gradient-to-br from-rose-950/40 to-slate-900 min-h-64 md:min-h-80 flex items-center justify-center text-center p-8 cursor-pointer hover:border-rose-600/70 shadow-xl hover:scale-[1.01] transition-all group"
          >
            <div>
              <Heart className="mx-auto text-pink-400 group-hover:scale-110 transition-transform" size={52} />
              <p className="brand-script text-4xl text-pink-200 mt-4">Promociones del Mes</p>
              <p className="text-xs text-pink-300/80 mt-3 font-semibold uppercase tracking-wider">Haz clic aquí para ver ofertas especiales ✨</p>
            </div>
          </div>

        </div>
      </section>

      {/* ICONOS INFORMATIVOS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-7xl mx-auto px-5 -mt-5 relative z-10">
        {[
          { icon: <Truck className="text-rose-500" />, title: "Envíos discretos" },
          { icon: <LockKeyhole className="text-rose-500" />, title: "Compra segura" },
          { icon: <Heart className="text-rose-500" />, title: "+18 Solo adultos" },
          { icon: <MessageCircle className="text-rose-500" />, title: "Pedido por WhatsApp" }
        ].map(x => (
          <div key={x.title} className="bg-slate-900 border border-rose-950/50 rounded-2xl p-4 shadow-lg text-center text-rose-100 flex flex-col items-center gap-2">
            {x.icon}
            <span className="text-xs md:text-sm font-medium">{x.title}</span>
          </div>
        ))}
      </section>

      {/* CATÁLOGO DE PRODUCTOS */}
      <section id="catalogo" className="max-w-7xl mx-auto px-5 py-12">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
          <div>
            <p className="text-pink-400 font-semibold text-sm uppercase tracking-wider">ENCUENTRA TUS FAVORITOS</p>
            <h2 className="text-3xl font-black text-white">{category === "Promociones del Mes" ? "Promociones del Mes" : "Catálogo de productos"}</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar productos..."
              className="border border-rose-950/60 rounded-full py-2.5 pl-10 pr-4 w-64 max-w-full bg-slate-900 text-white outline-none focus:border-rose-500 text-sm"
            />
          </div>
        </div>

        {/* Categorías en chips */}
        <div className="flex gap-2 overflow-x-auto pb-4">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${category === c
                  ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-950/50"
                  : "bg-slate-900 border border-rose-950/60 text-slate-300 hover:bg-slate-800"
                }`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading && <p className="text-slate-400 py-3">Cargando catálogo…</p>}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
          {visible.map(p => {
            const isAdded = addedId === p.id;
            return (
              <article key={p.id} className="bg-slate-900/60 border border-rose-950/40 rounded-3xl p-4 shadow-xl flex flex-col justify-between group hover:border-rose-800/50 transition-all">
                <div>
                  <div className="aspect-square rounded-2xl bg-slate-950 overflow-hidden flex items-center justify-center relative">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="text-center p-4">
                        <Heart size={44} className="text-pink-400 mx-auto" />
                        <p className="text-xs text-pink-300 mt-3">Stefmol</p>
                      </div>
                    )}
                    {p.promo && (
                      <span className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Promo
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold mt-3 leading-snug text-white group-hover:text-rose-400 transition-colors">{p.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.description}</p>
                </div>

                <div>
                  <p className="text-pink-400 font-black text-lg mt-3">{money(p.price)}</p>

                  {/* BOTÓN AGREGAR CON MOVIMIENTO Y SOMBRA */}
                  <button
                    onClick={() => add(p)}
                    className={`w-full rounded-2xl p-3 mt-3 flex justify-center items-center gap-2 font-semibold transition-all duration-300 transform active:scale-95 shadow-md ${isAdded
                        ? "bg-emerald-600 text-white scale-102 shadow-emerald-950"
                        : "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-rose-950/50 hover:shadow-rose-600/40"
                      }`}
                  >
                    {isAdded ? (
                      <>
                        <CheckCircle2 size={17} className="animate-bounce" />
                        <span>¡Agregado!</span>
                      </>
                    ) : (
                      <>
                        <Plus size={17} />
                        <span>Agregar al pedido</span>
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {!visible.length && <p className="py-12 text-center text-slate-400">No encontramos productos con esa búsqueda.</p>}
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0c060a] border-t border-rose-950/30 text-white px-5 py-10">
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
        <p className="text-center mt-3"><a className="text-pink-300 underline text-xs" href="/admin">Administrar productos</a></p>
      </footer>

      {/* CARRITO / CHECKOUT DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex justify-end">
          <div className="bg-slate-950 text-slate-100 border-l border-rose-950/40 w-full max-w-lg h-full overflow-y-auto p-5 md:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-rose-950/40 pb-4">
                <h2 className="text-2xl font-black text-white">Mi pedido ({cart.reduce((s, p) => s + p.quantity, 0)})</h2>
                <button onClick={() => setCartOpen(false)} aria-label="Cerrar" className="p-2 rounded-full hover:bg-slate-900 text-slate-300"><X /></button>
              </div>

              {!cart.length ? (
                <div className="text-center py-20 text-slate-500">
                  <ShoppingCart size={44} className="mx-auto mb-4 text-slate-600" />
                  Tu carrito está vacío.
                </div>
              ) : (
                <div className="divide-y divide-rose-950/30 mt-4">
                  {cart.map(p => (
                    <div key={p.id} className="py-4 flex gap-3 items-center">
                      <div className="w-20 h-20 rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center border border-rose-950">
                        {p.image_url ? <img src={p.image_url} className="w-full h-full object-cover" alt={p.name} /> : <Heart className="text-pink-400" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white">{p.name}</p>
                        <p className="text-pink-400 font-bold">{money(p.price)}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button className="border border-rose-900 rounded-lg p-1 bg-slate-900 text-white" onClick={() => qty(p.id, -1)}><Minus size={14} /></button>
                          <span className="font-semibold">{p.quantity}</span>
                          <button className="border border-rose-900 rounded-lg p-1 bg-slate-900 text-white" onClick={() => qty(p.id, 1)}><Plus size={14} /></button>
                          <button className="ml-auto text-slate-400 hover:text-rose-400" onClick={() => setCart(old => old.filter(x => x.id !== p.id))}><Trash2 size={17} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-rose-950/40 pt-4 mt-4">
                <label className="block text-sm font-medium mb-2 text-slate-300">Notas del pedido (opcional)</label>
                <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Color, talla, referencias…" className="w-full bg-slate-900 border border-rose-950 rounded-xl p-3 min-h-20 text-white text-sm outline-none focus:border-rose-500" />

                <div className="flex justify-between text-xl font-black my-4">
                  <span>Total:</span>
                  <span className="text-pink-400">{money(total)}</span>
                </div>

                <button onClick={checkout} className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white py-4 font-bold flex justify-center items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all">
                  <MessageCircle /> Enviar pedido por WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}