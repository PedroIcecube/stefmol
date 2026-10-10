"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Menu, X, Search, ShoppingBag, Sparkles, CheckCircle2,
    ChevronRight, MessageCircle, Heart, ShieldCheck
} from "lucide-react";

// Lista de productos con categorías integradas
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
        <div className="min-h-screen bg-white text-slate-900 selection:bg-purple-600 selection:text-white">

            {/* BARRA DE NAVEGACIÓN */}
            <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">

                        {/* Botón 3 Rayas (Menú Hamburguesa) */}
                        <button
                            onClick={() => setIsOpen(true)}
                            className="p-2 rounded-xl text-slate-800 hover:bg-gray-100 transition-all active:scale-95"
                            aria-label="Abrir menú"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* Logo Stefmol */}
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-wider text-purple-950">
                            <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
                            <span>STEFMOL</span>
                        </Link>

                        {/* Bolsa / Carrito */}
                        <div className="relative p-2 rounded-xl bg-purple-50 text-purple-900 border border-purple-100">
                            <ShoppingBag className="w-5 h-5" />
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-purple-700 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                    {cart.length}
                                </span>
                            )}
                        </div>

                    </div>
                </div>
            </nav>

            {/* MENÚ LATERAL DESPLEGABLE (DRAWER IGUAL A LA REFERENCIA) */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Fondo oscuro traslúcido */}
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Panel del Menú */}
                    <div className="relative w-full max-w-sm sm:max-w-md bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">

                        {/* Botón de cerrar X arriba a la derecha */}
                        <div className="flex justify-end p-4 pb-2">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-full hover:bg-gray-100 text-slate-800 transition-colors"
                                aria-label="Cerrar menú"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Buscador de la referencia */}
                        <div className="px-5 pb-4">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                                    <Search className="w-4 h-4" />
                                </span>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Busca juguetes o marcas..."
                                    className="w-full pl-11 pr-4 py-3 rounded-full bg-[#FAF5F0] border border-[#F2E8DF] text-sm text-slate-800 focus:outline-none focus:border-purple-600 placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        {/* Opciones de Menú Categorías */}
                        <div className="flex-1 px-5 space-y-1">
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
                                    className="w-full flex items-center justify-between py-3.5 px-2 text-slate-900 font-bold text-base hover:bg-purple-50 rounded-xl transition-colors border-b border-gray-100/70 text-left"
                                >
                                    <span>{category}</span>
                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                </button>
                            ))}
                        </div>

                        {/* Tarjeta inferior de Asesoría por WhatsApp */}
                        <div className="p-5 m-5 bg-[#FAF3F0] rounded-3xl border border-[#F3E6E0] space-y-3">
                            <div>
                                <h4 className="font-bold text-slate-900 text-base">¿Dudas? Te asesoramos</h4>
                                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                    Escríbenos por WhatsApp, respondemos con total discreción.
                                </p>
                            </div>
                            <a
                                href="https://wa.me/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-3 px-4 rounded-full bg-[#90247C] hover:bg-[#781B66] text-white font-semibold flex items-center justify-center gap-2 shadow-md transition-colors text-sm"
                            >
                                <MessageCircle className="w-5 h-5 fill-white text-[#90247C]" />
                                <span>Escribir por WhatsApp</span>
                            </a>
                        </div>

                        {/* Link Admin discreto al final */}
                        <div className="pb-6 text-center">
                            <Link
                                href="/admin"
                                onClick={() => setIsOpen(false)}
                                className="text-xs text-slate-400 hover:text-purple-700 hover:underline"
                            >
                                Acceso Administrador
                            </Link>
                        </div>

                    </div>
                </div>
            )}

            {/* BANNER PRINCIPAL / HERO */}
            <section className="bg-gradient-to-b from-purple-50/50 to-white py-12 px-4 border-b border-gray-100">
                <div className="max-w-3xl mx-auto text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-semibold uppercase tracking-wider">
                        <ShieldCheck className="w-4 h-4 text-purple-700" />
                        <span>Envío 100% Discreto</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                        Tu bienestar, <span className="text-[#90247C]">a tu manera</span>
                    </h1>
                    <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto">
                        Discreción · Confianza · Atención personalizada
                    </p>
                </div>
            </section>

            {/* CATÁLOGO DE PRODUCTOS */}
            <main id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Heart className="w-6 h-6 text-[#90247C]" />
                            <span>{selectedCategory === "Todas" ? "Catálogo de productos" : selectedCategory}</span>
                        </h2>
                        {selectedCategory !== "Todas" && (
                            <button
                                onClick={() => setSelectedCategory("Todas")}
                                className="text-xs text-purple-700 font-semibold hover:underline mt-1"
                            >
                                ← Mostrar todos los productos
                            </button>
                        )}
                    </div>
                </div>

                {/* Muestra de Tarjetas de Producto */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map((product) => {
                        const isAdded = addedId === product.id;
                        return (
                            <div
                                key={product.id}
                                className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                            >
                                <div>
                                    <div className="relative h-64 overflow-hidden bg-gray-50">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md border border-purple-100 text-purple-900 text-xs px-3 py-1 rounded-full font-semibold">
                                            {product.category}
                                        </span>
                                    </div>
                                    <div className="p-6 space-y-2">
                                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#90247C] transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="text-slate-500 text-sm line-clamp-2">
                                            {product.description}
                                        </p>
                                        <p className="text-xl font-black text-[#90247C] pt-1">
                                            {product.price}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6 pt-0">
                                    <button
                                        onClick={() => handleAddToCart(product.id)}
                                        className={`w-full py-3 px-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all shadow-sm ${isAdded
                                                ? "bg-emerald-600 text-white scale-[1.01]"
                                                : "bg-[#90247C] hover:bg-[#781B66] text-white"
                                            }`}
                                    >
                                        {isAdded ? (
                                            <>
                                                <CheckCircle2 className="w-5 h-5 animate-bounce" />
                                                <span>¡Agregado al pedido!</span>
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
            <footer className="border-t border-gray-100 bg-gray-50 py-10 text-center text-slate-500 text-sm space-y-2">
                <p className="font-semibold text-purple-950">STEFMOL — Bienestar Íntimo & Discreción Absoluta</p>
                <p className="text-xs text-slate-400">© 2026 Stefmol. Todos los derechos reservados.</p>
            </footer>

        </div>
    );
}