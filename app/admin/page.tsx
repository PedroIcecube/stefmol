"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag, Sparkles, CheckCircle2, ShieldCheck, Heart, MessageCircle } from "lucide-react";

// Ejemplo de productos de la tienda íntima
const products = [
    {
        id: 1,
        name: "Estimulador Erótico Pro",
        category: "Bienestar Avanzado",
        price: "$149.900",
        description: "Diseño ergonómico de tacto sedoso con múltiples modos de vibración silenciosa.",
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 2,
        name: "Lubricante Íntimo Natural",
        category: "Cuidado Íntimo",
        price: "$45.000",
        description: "Base de agua, pH balanceado, ideal para pieles sensibles y compatible con látex.",
        image: "https://images.unsplash.com/photo-1608248597359-974b09b55f65?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 3,
        name: "Vibrador de Pareja Dual",
        category: "Parejas",
        price: "$189.000",
        description: "Flexible, recargable por USB y diseñado para estimulación simultánea.",
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600"
    }
];

export default function HomePage() {
    const [isOpen, setIsOpen] = useState(false);
    const [cart, setCart] = useState<number[]>([]);
    const [addedId, setAddedId] = useState<number | null>(null);

    const handleAddToCart = (id: number) => {
        setCart([...cart, id]);
        setAddedId(id);
        setTimeout(() => setAddedId(null), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-rose-600 selection:text-white">

            {/* BARRA DE NAVEGACIÓN */}
            <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-rose-950/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-wider text-rose-100">
                            <Sparkles className="w-5 h-5 text-rose-500 animate-pulse" />
                            <span>STEFMOL</span>
                        </Link>

                        {/* Menú Desktop */}
                        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
                            <Link href="#catalogo" className="hover:text-rose-400 transition-colors">Catálogo</Link>
                            <Link href="#discrecion" className="hover:text-rose-400 transition-colors">Envío Discreto</Link>
                            <Link href="/admin" className="text-rose-400 hover:text-rose-300 transition-colors">Admin</Link>
                        </div>

                        {/* Acciones derecha (Bolsa + Botón 3 rayas móvil) */}
                        <div className="flex items-center gap-3">
                            <div className="relative p-2 rounded-xl bg-rose-950/30 border border-rose-900/30 text-rose-300">
                                <ShoppingBag className="w-5 h-5" />
                                {cart.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                        {cart.length}
                                    </span>
                                )}
                            </div>

                            {/* Botón 3 Rayas (Menú Hamburguesa) */}
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="md:hidden p-2 rounded-xl bg-rose-950/40 text-rose-200 hover:bg-rose-900/50 transition-all active:scale-90 border border-rose-800/30"
                                aria-label="Abrir menú"
                            >
                                {isOpen ? <X className="w-6 h-6 text-rose-400" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Menú Desplegable Móvil */}
                {isOpen && (
                    <div className="md:hidden bg-slate-950/98 border-b border-rose-900/30 px-4 pt-3 pb-6 space-y-3 transition-all shadow-2xl">
                        <Link
                            href="#catalogo"
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-3 rounded-xl text-base font-medium text-rose-100 bg-rose-950/30 border border-rose-900/20 active:scale-95 transition-transform"
                        >
                            🔥 Ver Catálogo
                        </Link>
                        <Link
                            href="#discrecion"
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-3 rounded-xl text-base font-medium text-slate-300 hover:bg-slate-900 active:scale-95 transition-transform"
                        >
                            🔒 Envío 100% Discreto
                        </Link>
                        <Link
                            href="/admin"
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-3 rounded-xl text-base font-medium text-rose-400 hover:bg-slate-900 active:scale-95 transition-transform"
                        >
                            ⚙️ Panel de Administración
                        </Link>
                    </div>
                )}
            </nav>

            {/* SECCIÓN HERO / BIENVENIDA */}
            <header className="relative py-20 px-4 text-center overflow-hidden border-b border-rose-950/30 bg-gradient-to-b from-slate-950 via-rose-950/10 to-slate-950">
                <div className="max-w-3xl mx-auto space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/50 border border-rose-800/40 text-rose-300 text-xs font-semibold uppercase tracking-widest">
                        <ShieldCheck className="w-4 h-4 text-rose-400" />
                        <span>Compra segura y discreta</span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
                        Explora tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">bienestar íntimo</span>
                    </h1>
                    <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
                        Artículos exclusivos seleccionados para potenciar tus momentos de placer. Envíos empacados sin marcas ni logotipos.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 pt-2">
                        <a
                            href="#catalogo"
                            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 font-semibold text-white shadow-lg shadow-rose-950/50 hover:scale-105 active:scale-95 transition-all"
                        >
                            Ver Productos
                        </a>
                        <a
                            href="https://wa.me/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-3.5 rounded-2xl bg-slate-900 border border-rose-900/40 font-semibold text-rose-200 hover:bg-slate-800 flex items-center gap-2 active:scale-95 transition-all"
                        >
                            <MessageCircle className="w-5 h-5 text-emerald-400" />
                            <span>Atención por WhatsApp</span>
                        </a>
                    </div>
                </div>
            </header>

            {/* CATÁLOGO DE PRODUCTOS */}
            <main id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Heart className="w-6 h-6 text-rose-500" />
                        <span>Catálogo Destacado</span>
                    </h2>
                    <span className="text-xs text-slate-400 uppercase tracking-widest">Empaque discreto garantizado</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => {
                        const isAdded = addedId === product.id;
                        return (
                            <div
                                key={product.id}
                                className="bg-slate-900/60 border border-rose-950/40 rounded-3xl overflow-hidden shadow-xl hover:border-rose-800/50 transition-all duration-300 flex flex-col justify-between group"
                            >
                                <div>
                                    <div className="relative h-64 overflow-hidden bg-slate-950">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90"
                                        />
                                        <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-rose-900/40 text-rose-300 text-xs px-3 py-1 rounded-full font-medium">
                                            {product.category}
                                        </span>
                                    </div>
                                    <div className="p-6 space-y-3">
                                        <h3 className="text-xl font-bold text-white group-hover:text-rose-400 transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="text-slate-400 text-sm line-clamp-2">
                                            {product.description}
                                        </p>
                                        <p className="text-2xl font-black text-rose-400 pt-1">
                                            {product.price}
                                        </p>
                                    </div>
                                </div>

                                {/* BOTÓN AGREGAR INTERACTIVO */}
                                <div className="p-6 pt-0">
                                    <button
                                        onClick={() => handleAddToCart(product.id)}
                                        className={`w-full py-3 px-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-95 shadow-md ${isAdded
                                                ? "bg-emerald-600 text-white shadow-emerald-950/50 scale-[1.02]"
                                                : "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-rose-950/50 hover:shadow-rose-600/30"
                                            }`}
                                    >
                                        {isAdded ? (
                                            <>
                                                <CheckCircle2 className="w-5 h-5 animate-bounce" />
                                                <span>¡Agregado al pedido! ✨</span>
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingBag className="w-5 h-5" />
                                                <span>Agregar al pedido</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

            {/* FOOTER */}
            <footer id="discrecion" className="border-t border-rose-950/30 bg-slate-950 py-12 text-center text-slate-500 text-sm space-y-3">
                <p className="font-semibold text-rose-300">STEFMOL — Bienestar Íntimo & Discreción Absoluta</p>
                <p>Envíos seguros a todo el país en cajas totalmente selladas sin marcas visibles.</p>
                <p className="text-xs pt-4 text-slate-600">© 2026 Stefmol. Todos los derechos reservados.</p>
            </footer>

        </div>
    );
}