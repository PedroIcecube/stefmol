"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Menu, Search, ShoppingCart, Heart, Truck, LockKeyhole,
  Headset, MessageCircle, Plus, Minus, Trash2,
  ArrowRight, X, ChevronRight, ChevronDown, CheckCircle2
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  subcategory?: string | null;
  price: number;
  image_url: string | null;
  image_urls?: string[];
  promo?: boolean;
};

type CartItem = Product & { quantity: number };

const money = (n: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

const categoryStructure = [
  {
    name: "Promociones del Mes",
    subcategories: []
  },
  {
    name: "Juguetes",
    subcategories: [
      "Anillos vibradores",
      "Dildos",
      "Juegos eróticos",
      "Masturbadores",
      "Plugs anales",
      "BDSM",
      "Succionadores",
      "Vibradores"
    ]
  },
  {
    name: "Placer y Sensaciones",
    subcategories: [
      "Anal",
      "Cremas fusión",
      "Estrechante",
      "Feromonas",
      "Garganta profunda",
      "Lubricantes",
      "Multiorgasmo",
      "Potenciador",
      "Comestibles",
      "Retardantes"
    ]
  },
  {
    name: "Lencería",
    subcategories: [
      "Talla XS",
      "Talla S",
      "Talla M",
      "Talla L",
      "Talla XL",
      "Talla XXL",
      "Mallas",
      "Cuero"
    ]
  }
];

const fallback: Product[] = [
  { id: "demo1", name: "Vibrador Conejito 12 modos", description: "Diseño ergonómico · 12 modos", category: "Juguetes", subcategory: "Vibradores", price: 89900, image_url: "", promo: true },
  { id: "demo2", name: "Estimulador de succión", description: "Diseño compacto", category: "Juguetes", subcategory: "Succionadores", price: 99900, image_url: "", promo: false },
  { id: "demo3", name: "Plug anal con joya", description: "Material suave", category: "Juguetes", subcategory: "Plugs anales", price: 59900, image_url: "", promo: true },
  { id: "demo4", name: "Conjunto lencería de encaje", description: "Consulta las tallas disponibles", category: "Lencería", subcategory: "Talla M", price: 79900, image_url: "", promo: false },
  { id: "demo5", name: "Lubricante íntimo base agua 120 ml", description: "Presentación de 120 ml", category: "Placer y Sensaciones", subcategory: "Lubricantes", price: 39900, image_url: "", promo: true },
  { id: "demo6", name: "Kit de bienestar íntimo", description: "Pregunta por disponibilidad", category: "Placer y Sensaciones", subcategory: "Multiorgasmo", price: 119900, image_url: "", promo: true }
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>(fallback);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("Promociones del Mes");
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [expandedMenuCategory, setExpandedMenuCategory] = useState<string | null>("Juguetes");

  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<string | null>(null);

  const [promoImageIndex, setPromoImageIndex] = useState(0);

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((d: Product[]) => { if (Array.isArray(d) && d.length) setProducts(d); })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const promoImages = useMemo(() => {
    const promoProds = products.filter(p => p.promo === true || p.category === "Promociones del Mes");
    const imgs: string[] = [];

    promoProds.forEach(p => {
      if (p.image_urls && p.image_urls.length > 0) {
        imgs.push(...p.image_urls.filter(Boolean));
      } else if (p.image_url) {
        imgs.push(p.image_url);
      }
    });

    return imgs;
  }, [products]);

  useEffect(() => {
    if (promoImages.length <= 1) return;

    const interval = setInterval(() => {
      setPromoImageIndex((prev) => (prev + 1) % promoImages.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [promoImages]);

  const currentSubcategories = useMemo(() => {
    const catObj = categoryStructure.find(c => c.name === activeCategory);
    return catObj ? catObj.subcategories : [];
  }, [activeCategory]);

  const visible = useMemo(() => {
    return products.filter(p => {
      const isPromoProduct = Boolean(p.promo) || p.category === "Promociones del Mes";

      const matchCat = activeCategory === "Promociones del Mes"
        ? isPromoProduct
        : p.category === activeCategory;

      const matchSubcat = activeSubcategory
        ? p.subcategory === activeSubcategory
        : true;

      const matchSearch = `${p.name} ${p.description ?? ""}`.toLowerCase().includes(search.toLowerCase());

      return matchCat && matchSubcat && matchSearch;
    });
  }, [products, activeCategory, activeSubcategory, search]);

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

  function navigateToCategory(catName: string, subName: string | null = null) {
    setActiveCategory(catName);
    setActiveSubcategory(subName);
    setMenuOpen(false);
    const el = document.getElementById("catalogo");
    if (el) el.scrollIntoView({ behavior: "smooth" });
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
    <main className="bg-[#FAF0EE] text-[#3B3B3B] min-h-screen">

      {/* BARRA SUPERIOR */}
      <header className="bg-gradient-to-r from-[#3B3B3B] via-[#1A1A1A] to-[#000000] text-white px-5 md:px-10 py-4 shadow-lg sticky top-0 z-40 border-b border-[#CFA18D]/30">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-3">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Menú"
            className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer text-[#CFA18D]"
          >
            <Menu size={24} />
          </button>

          <a href="#" className="text-center">
            <div className="brand-script text-4xl md:text-5xl rose-gold-text drop-shadow-sm">Stefmol</div>
            <div className="text-[9px] tracking-[.3em] text-[#CFA18D] font-bold uppercase">BOUTIQUE ERÓTICA</div>
          </a>

          <div className="flex gap-4 items-center">
            <a href="#catalogo" aria-label="Buscar" className="p-2 hover:bg-white/10 rounded-xl transition-colors text-[#CFA18D]">
              <Search size={22} />
            </a>
            <button onClick={() => setCartOpen(true)} className="relative p-2 hover:bg-white/10 rounded-xl transition-colors text-[#CFA18D]" aria-label="Carrito">
              <ShoppingCart size={22} />
              {cart.reduce((s, p) => s + p.quantity, 0) > 0 && (
                <span className="absolute -right-1 -top-1 bg-[#B76E79] rounded-full text-xs font-bold w-5 h-5 flex items-center justify-center text-white shadow-sm">
                  {cart.reduce((s, p) => s + p.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MENÚ LATERAL DRAWER */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={() => setMenuOpen(false)} />
          <div className="relative w-full max-w-sm sm:max-w-md bg-white text-[#3B3B3B] h-full shadow-2xl flex flex-col z-10 overflow-y-auto">

            <div className="flex items-center justify-between p-4 border-b border-[#F5D9D6] bg-[#FAF0EE]">
              <div>
                <div className="brand-script text-2xl rose-gold-text">Stefmol</div>
                <div className="text-[8px] tracking-[.2em] text-[#B76E79] font-bold uppercase">BOUTIQUE ERÓTICA</div>
              </div>
              <button onClick={() => setMenuOpen(false)} className="p-2 rounded-full hover:bg-gray-200/60 text-[#3B3B3B] transition-colors" aria-label="Cerrar">
                <X size={22} />
              </button>
            </div>

            <div className="p-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Busca productos..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#F5D9D6]/30 border border-[#CFA18D]/40 text-sm focus:outline-none focus:border-[#B76E79] text-[#3B3B3B] placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="flex-1 px-4 py-2 space-y-2">
              {categoryStructure.map((cat, index) => {
                const isExpanded = expandedMenuCategory === cat.name;
                const hasSubs = cat.subcategories.length > 0;

                return (
                  <div key={index} className="border-b border-gray-100 pb-2">
                    <div
                      onClick={() => {
                        if (hasSubs) {
                          setExpandedMenuCategory(isExpanded ? null : cat.name);
                        } else {
                          navigateToCategory(cat.name, null);
                        }
                      }}
                      className="w-full flex items-center justify-between py-2 px-3 rounded-xl text-[#3B3B3B] font-bold text-sm hover:bg-[#F5D9D6]/40 transition-colors cursor-pointer select-none"
                    >
                      <span>{cat.name}</span>
                      {hasSubs && (
                        <span>
                          {isExpanded ? <ChevronDown size={18} className="text-[#B76E79]" /> : <ChevronRight size={18} className="text-gray-400" />}
                        </span>
                      )}
                    </div>

                    {hasSubs && isExpanded && (
                      <div className="ml-4 mt-1 space-y-1 bg-[#F5D9D6]/20 p-2 rounded-xl border-l-2 border-[#B76E79]">
                        <button
                          onClick={() => navigateToCategory(cat.name, null)}
                          className="w-full text-left py-1.5 px-3 text-xs font-bold text-[#B76E79] hover:bg-[#F5D9D6]/50 rounded-lg transition-colors cursor-pointer"
                        >
                          Ver todo en {cat.name}
                        </button>

                        {cat.subcategories.map((sub, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => navigateToCategory(cat.name, sub)}
                            className="w-full text-left py-1.5 px-3 text-xs font-semibold text-slate-600 hover:text-[#B76E79] hover:bg-[#F5D9D6]/40 rounded-lg transition-colors cursor-pointer"
                          >
                            • {sub}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-5 bg-[#F5D9D6]/30 m-4 rounded-3xl border border-[#CFA18D]/30 space-y-3">
              <div>
                <h4 className="font-bold text-[#3B3B3B] text-base">¿Dudas? Te asesoramos</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Escríbenos por WhatsApp, respondemos con total discreción.
                </p>
              </div>
              <a
                href="https://wa.me/573114020157?text=¡Hola!%20Quiero%20hacer%20una%20consulta%20sobre%20productos%20en%20Stefmol."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-[#B76E79] to-[#CFA18D] text-white font-semibold flex items-center justify-center gap-2 shadow-md transition-all text-sm hover:opacity-95"
              >
                <MessageCircle size={18} />
                <span>Escribir por WhatsApp</span>
              </a>
            </div>

          </div>
        </div>
      )}

      {/* SECCIÓN HERO */}
      <section className="bg-gradient-to-b from-[#3B3B3B] via-[#1F1F1F] to-[#000000] text-white border-b border-[#CFA18D]/20">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-24 grid md:grid-cols-2 items-center gap-8">
          <div className="text-center flex flex-col items-center justify-center">
            <p className="text-[#CFA18D] italic text-xl md:text-2xl font-light">Explora tu lado más</p>
            <h1 className="brand-script text-7xl md:text-9xl rose-gold-shine leading-tight drop-shadow-2xl">
              Hot ♡
            </h1>
            <p className="tracking-[.25em] text-xs md:text-sm mt-2 text-[#F5D9D6] uppercase font-medium">
              JUGUETES, LENCERÍA,<br /> ACCESORIOS Y MUCHO MÁS
            </p>
            <a href="#catalogo" className="inline-flex items-center gap-4 rounded-full bg-gradient-to-r from-[#B76E79] to-[#CFA18D] px-8 py-4 mt-8 font-bold text-white shadow-lg shadow-black/40 hover:scale-105 active:scale-95 transition-all">
              VER PRODUCTOS <ArrowRight size={20} />
            </a>
          </div>

          {/* BANNER DE PROMOCIONES DEL MES */}
          <div
            onClick={() => navigateToCategory("Promociones del Mes", null)}
            className="relative rounded-3xl border border-[#CFA18D]/40 overflow-hidden min-h-64 md:min-h-80 flex items-center justify-center text-center p-8 cursor-pointer hover:border-[#D4AF37] transition-all shadow-2xl hover:scale-[1.01] group bg-black/80"
          >
            {promoImages.length > 0 && promoImages.map((imgUrl, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ${idx === promoImageIndex ? "opacity-45 scale-105" : "opacity-0 scale-100"
                  }`}
                style={{ backgroundImage: `url(${imgUrl})` }}
              />
            ))}

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

            <div className="relative z-10">
              <Heart className="mx-auto text-[#CFA18D] group-hover:scale-110 transition-transform drop-shadow-md" size={52} />
              <p className="brand-script text-4xl md:text-5xl rose-gold-text mt-4 drop-shadow-lg">Promociones del Mes</p>
              <p className="text-xs text-[#F5D9D6] mt-3 font-semibold uppercase tracking-wider bg-black/70 backdrop-blur-xs px-4 py-1.5 rounded-full inline-block border border-[#CFA18D]/40 shadow-md">
                Haz clic aquí para ver ofertas especiales ✨
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TARJETAS INFORMATIVAS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-7xl mx-auto px-5 -mt-6 relative z-10">
        {[
          { icon: <Truck className="text-[#B76E79]" />, title: "Envíos discretos" },
          { icon: <LockKeyhole className="text-[#B76E79]" />, title: "Compra segura" },
          { icon: <Heart className="text-[#B76E79]" />, title: "+18 Solo adultos" },
          { icon: <MessageCircle className="text-[#B76E79]" />, title: "Pedido por WhatsApp" }
        ].map(x => (
          <div key={x.title} className="bg-white rounded-2xl p-4 shadow-md text-center text-[#3B3B3B] flex flex-col items-center gap-2 border border-[#F5D9D6]">
            {x.icon}
            <span className="text-xs md:text-sm font-bold">{x.title}</span>
          </div>
        ))}
      </section>

      {/* CATÁLOGO DE PRODUCTOS */}
      <section id="catalogo" className="max-w-7xl mx-auto px-5 py-12">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
          <div>
            <p className="text-[#B76E79] font-bold text-xs tracking-widest uppercase">ENCUENTRA TUS FAVORITOS</p>
            <h2 className="text-3xl font-black text-[#3B3B3B] mt-1">
              {activeCategory} {activeSubcategory ? `· ${activeSubcategory}` : ""}
            </h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar productos..."
              className="border border-[#CFA18D]/30 rounded-full py-2.5 pl-10 pr-4 w-64 max-w-full outline-[#B76E79] bg-white text-[#3B3B3B] shadow-sm text-sm"
            />
          </div>
        </div>

        {/* CHIPS DE CATEGORÍAS PRINCIPALES */}
        <div className="flex gap-2 overflow-x-auto pb-3">
          {categoryStructure.map(s => (
            <button
              key={s.name}
              onClick={() => {
                setActiveCategory(s.name);
                setActiveSubcategory(null);
                setExpandedMenuCategory(s.name);
              }}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-bold transition-all cursor-pointer ${activeCategory === s.name
                ? "bg-gradient-to-r from-[#B76E79] to-[#CFA18D] text-white shadow-md"
                : "bg-white border border-[#CFA18D]/30 text-[#3B3B3B] hover:bg-[#F5D9D6]/30"
                }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* CHIPS DE SUBSECCIONES */}
        {currentSubcategories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-4 mt-1 pt-2 border-t border-[#CFA18D]/20">
            <button
              onClick={() => setActiveSubcategory(null)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${activeSubcategory === null
                ? "bg-[#3B3B3B] text-white"
                : "bg-white text-[#3B3B3B] border border-gray-200 hover:bg-gray-100"
                }`}
            >
              Ver todos en {activeCategory}
            </button>
            {currentSubcategories.map(sub => (
              <button
                key={sub}
                onClick={() => setActiveSubcategory(sub)}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${activeSubcategory === sub
                  ? "bg-[#B76E79] text-white shadow-sm"
                  : "bg-[#F5D9D6]/40 text-[#B76E79] hover:bg-[#F5D9D6] border border-[#CFA18D]/30"
                  }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {loading && <p className="text-gray-500 py-3">Cargando catálogo…</p>}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {visible.map(p => {
            const isAdded = addedId === p.id;
            return (
              <article key={p.id} className="bg-white rounded-2xl p-3 shadow-md flex flex-col justify-between border border-[#F5D9D6] hover:shadow-lg transition-all">
                <div>
                  <a
                    href={`/producto/${p.id}`}
                    className="aspect-square rounded-xl bg-[#FAF0EE] overflow-hidden flex items-center justify-center relative cursor-pointer group block"
                  >
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="text-center p-4 group-hover:scale-105 transition-transform">
                        <Heart size={44} className="text-[#B76E79] mx-auto" />
                        <p className="text-xs text-[#B76E79] mt-3 font-semibold">Ver detalle</p>
                      </div>
                    )}
                    {p.promo && (
                      <span className="absolute top-2 left-2 bg-[#B76E79] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                        Promo
                      </span>
                    )}
                  </a>

                  <a href={`/producto/${p.id}`}>
                    <h3 className="font-bold mt-3 leading-snug text-[#3B3B3B] cursor-pointer hover:text-[#B76E79] transition-colors">
                      {p.name}
                    </h3>
                  </a>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.description}</p>
                </div>

                <div>
                  <p className="text-[#B76E79] font-black text-lg mt-3">{money(p.price)}</p>

                  <button
                    onClick={() => add(p)}
                    className={`w-full rounded-xl p-3 mt-3 flex justify-center items-center gap-2 font-bold transition-all duration-300 transform active:scale-95 shadow-md cursor-pointer ${isAdded
                      ? "bg-emerald-600 text-white shadow-emerald-500/30"
                      : "bg-gradient-to-r from-[#B76E79] to-[#CFA18D] text-white shadow-black/10 hover:opacity-95"
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
                        <span>Agregar</span>
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {!visible.length && <p className="py-12 text-center text-gray-500">No encontramos productos en esta categoría o subsección.</p>}
      </section>

      {/* FOOTER */}
      <footer className="bg-gradient-to-b from-[#1F1F1F] to-[#000000] text-white px-5 py-10 border-t border-[#CFA18D]/20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-sm">
          {[
            { icon: <Truck />, t: "ENVÍOS DISCRETOS" },
            { icon: <LockKeyhole />, t: "COMPRA SEGURA" },
            { icon: <Heart />, t: "+18 SOLO ADULTOS" },
            { icon: <Headset />, t: "ATENCIÓN POR WHATSAPP" }
          ].map(x => (
            <div key={x.t} className="flex flex-col items-center gap-3 text-[#CFA18D]">
              {x.icon}
              <span className="text-white/80 text-xs tracking-wider font-semibold">{x.t}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-white/50 mt-8">© {new Date().getFullYear()} Stefmol · Boutique Erótica para mayores de 18 años.</p>
        <p className="text-center mt-3"><a className="text-[#D4AF37] underline text-xs cursor-pointer hover:text-white" href="/admin">Administrar productos</a></p>
      </footer>

      {/* CARRITO / CHECKOUT DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-end">
          <div className="bg-white w-full max-w-lg h-full overflow-y-auto p-5 md:p-7 text-[#3B3B3B] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b pb-4 border-[#F5D9D6]">
                <h2 className="text-2xl font-black">Mi carrito ({cart.reduce((s, p) => s + p.quantity, 0)})</h2>
                <button onClick={() => setCartOpen(false)} aria-label="Cerrar" className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"><X /></button>
              </div>

              {!cart.length ? (
                <div className="text-center py-20 text-gray-500">
                  <ShoppingCart size={44} className="mx-auto mb-4 text-gray-400" />
                  Tu carrito está vacío.
                </div>
              ) : (
                <div className="divide-y divide-gray-100 mt-2">
                  {cart.map(p => (
                    <div key={p.id} className="py-4 flex gap-3 items-center">
                      <div className="w-20 h-20 rounded-lg bg-[#FAF0EE] overflow-hidden flex items-center justify-center border border-[#F5D9D6]">
                        {p.image_url ? <img src={p.image_url} className="w-full h-full object-cover" alt={p.name} /> : <Heart className="text-[#B76E79]" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-[#3B3B3B]">{p.name}</p>
                        <p className="text-[#B76E79] font-bold">{money(p.price)}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button className="border rounded p-1 bg-white hover:bg-gray-50 cursor-pointer" onClick={() => qty(p.id, -1)}><Minus size={14} /></button>
                          <span className="font-bold">{p.quantity}</span>
                          <button className="border rounded p-1 bg-white hover:bg-gray-50 cursor-pointer" onClick={() => qty(p.id, 1)}><Plus size={14} /></button>
                          <button className="ml-auto text-gray-400 hover:text-red-600 cursor-pointer" onClick={() => setCart(old => old.filter(x => x.id !== p.id))}><Trash2 size={17} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-[#F5D9D6] pt-4 mt-4">
                <label className="block text-sm font-semibold mb-2">Notas del pedido (opcional)</label>
                <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Color, talla, referencias…" className="w-full border border-gray-200 rounded-xl p-3 min-h-20 text-sm focus:outline-[#B76E79]" />

                <div className="flex justify-between text-xl font-black my-4">
                  <span>Total:</span>
                  <span className="text-[#B76E79]">{money(total)}</span>
                </div>

                <button onClick={checkout} className="w-full rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-4 font-bold flex justify-center items-center gap-2 shadow-lg shadow-green-600/20 transition-all cursor-pointer">
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