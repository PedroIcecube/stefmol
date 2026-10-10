"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Menu, X, Search, ShoppingBag, Sparkles, CheckCircle2,
    ChevronRight, MessageCircle, Heart, ShieldCheck
} from "lucide-react";

const initialProducts = [
    {
        id: 1,
        name: "Estimulador Erótico Pro",
        category: "Juguetes",
        price: "$149.900",
        description: "Diseño ergonómico de tacto sedoso con múltiples modos de vibración silenciosa.",
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 2,
        name: "Lubricante Íntimo Natural",
        category: "Lubricantes y bienestar",
        price: "$45.000",
        description: "Base de agua, pH balanceado, ideal para pieles sensibles y compatible con látex.",
        image: "https://images.unsplash.com/photo-1608248597359-974b09b55f65?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 3,
        name: "Vibrador de Pareja Dual",
        category: "Juguetes",
        price: "$189.000",
        description: "Flexible, recargable por USB y diseñado para estimulación simultánea.",
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600"
    }
];

export default function HomePage() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [cart, setCart] = useState<number[]>([]);
    const [addedId, setAddedId] = useState<number | null>(null);

    const handleAddToCart = (id: number) => {
        setCart([...cart, id]);
        setAddedId(id);
        setTimeout(() => setAddedId(null), 2000);
    };

    const filteredProducts = initialProducts.filter((p) => {
        const matchesCategory = selectedCategory === "Todas" || p.category === selectedCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-rose-600 selection:text-white">

            {/* BARRA DE NAVEGACIÓN SUPERIOR */}
            <nav className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-rose-950/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">

                        {/* BOTÓN DE 3 RAYAS SIEMPRE VISIBLE */}
                        <button
                            onClick={() => setIsOpen(true)}
                            className="p-2 rounded-xl bg-slate-900 border border-rose-900/40 text-rose-300 hover:bg-rose-950 transition-all active:scale-95 flex items-center gap-2 cursor-pointer shadow-md"
                            aria-label="Abrir menú"
                        >
                            <Menu className="w-6 h-6 text-rose-400" />
                            <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline">Menú</span>
                        </button>

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-wider text-rose-100">
                            <Sparkles className="w-5 h-5 text-rose-500 animate-pulse" />
                            <span>STEFMOL</span>
                        </Link>

                        {/* Carrito y Buscador rápido */}
                        <div className="flex items-center gap-3">
                            <div className="relative p-2 rounded-xl bg-rose-950/30 border border-rose-900/30 text-rose-300">
                                <ShoppingBag className="w-5 h-5" />
                                {cart.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                        {cart.length}
                                    </span>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </nav>

            {/* MENÚ LATERAL DESPLEGABLE (DRAWER) */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Fondo oscuro traslúcido */}
                    <div
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Panel Deslizable */}
                    <div className="relative w-full max-w-sm sm:max-w-md bg-slate-950 text-slate-100 h-full shadow-2xl flex flex-col z-10 overflow-y-auto border-r border-rose-950/40">

                        {/* Cabecera del Menú con Cerrar */}
                        <div className="flex items-center justify-between p-4 border-b border-rose-950/40">
                            <span className="font-bold text-rose-300 tracking-wider text-sm">MENÚ PRINCIPAL</span>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-full hover:bg-slate-900 text-slate-300 transition-colors"
                                aria-label="Cerrar menú"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Buscador dentro del menú */}
                        <div className="p-4">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                                    <Search className="w-4 h-4" />
                                </span>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Busca juguetes o marcas..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-900 border border-rose-950/60 text-sm focus:outline-none focus:border-rose-500 text-slate-200"
                                />
                            </div>
                        </div>

                        {/* Lista de Categorías */}
                        <div className="flex-1 px-4 py-2 space-y-1">
                            {[
                                "Nuevos",
                                "Juguetes",
                                "Lubricantes y bienestar",
                                "Lencería y BDSM",
                                "Marcas",
                                "Más vendidos",
                                "Blog"
                            ].map((category, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setIsOpen(false);
                                        const el = document.getElementById("catalogo");
                                        if (el) el.scrollIntoView({ behavior: "smooth" });
                                    }}
                                    className="w-full flex items-center justify-between py-3.5 px-3 rounded-xl text-slate-200 font-semibold hover:bg-rose-950/40 border-b border-rose-950/20 transition-colors text-left"
                                >
                                    <span>{category}</span>
                                    <ChevronRight className="w-5 h-5 text-slate-600" />
                                </button>
                            ))}
                        </div>

                        {/* Tarjeta de Asesoría WhatsApp */}
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

                        {/* Acceso Admin */}
                        <div className="px-4 pb-6 text-center">
                            <Link href="/admin" onClick={() => setIsOpen(false)} className="text-xs text-slate-500 hover:underline">
                                Panel de Administración
                            </Link>
                        </div>

                    </div>
                </div>
            )}

            {/* BANNER PRINCIPAL / PORTADA */}
            <header className="py-16 px-4 text-center bg-gradient-to-b from-slate-950 via-rose-950/10 to-slate-950 border-b border-rose-950/30">
                <div className="max-w-3xl mx-auto space-y-4 flex flex-col items-center">
                    <p className="text-pink-300 text-lg sm:text-2xl font-light italic tracking-wide">
                        Explora tu lado más
                    </p>
                    <div className="flex items-center justify-center gap-3 py-1">
                        <h1 className="text-5xl sm:text-7xl font-serif italic font-bold text-pink-400 tracking-wider">
                            Hot
                        </h1>
                        <Heart className="w-10 h-10 sm:w-14 sm:h-14 text-pink-400 stroke-[1.5] fill-pink-400/20 animate-pulse" />
                    </div>
                    <p className="text-slate-300 text-xs sm:text-sm font-semibold tracking-widest uppercase pt-2 max-w-md">
                        JUGUETES, LENCERÍA, ACCESORIOS Y MUCHO MÁS
                    </p>
                </div>
            </header>

            {/* CATÁLOGO DE PRODUCTOS */}
            <main id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Heart className="w-6 h-6 text-rose-500" />
                            <span>{selectedCategory === "Todas" ? "Catálogo de productos" : selectedCategory}</span>
                        </h2>
                        {selectedCategory !== "Todas" && (
                            <button
                                onClick={() => setSelectedCategory("Todas")}
                                className="text-xs text-rose-400 hover:underline mt-1"
                            >
                                ← Mostrar todos los productos
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map((product) => {
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
            <footer className="border-t border-rose-950/30 bg-slate-950 py-10 text-center text-slate-500 text-sm space-y-2">
                <p className="font-semibold text-rose-300">STEFMOL — Bienestar Íntimo & Discreción Absoluta</p>
                <p className="text-xs text-slate-600">© 2026 Stefmol. Todos los derechos reservados.</p>
            </footer>

        </div>
    );
}