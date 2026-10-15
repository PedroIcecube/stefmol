"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ShoppingCart, Heart, ArrowLeft, MessageCircle,
    Plus, Minus, CheckCircle2, ChevronLeft, ChevronRight
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

const money = (n: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

const fallback: Product[] = [
    { id: "demo1", name: "Vibrador Conejito 12 modos", description: "Diseño ergonómico · 12 modos de vibración potente y silenciosa.", category: "Juguetes", subcategory: "Vibradores", price: 89900, image_url: "", image_urls: [], promo: true },
];

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        if (!id) return;
        fetch("/api/products")
            .then(r => r.ok ? r.json() : Promise.reject())
            .then((d: Product[]) => {
                if (Array.isArray(d)) {
                    const found = d.find(p => p.id === id);
                    if (found) {
                        setProduct(found);
                        return;
                    }
                }
                const foundFallback = fallback.find(p => p.id === id);
                if (foundFallback) setProduct(foundFallback);
            })
            .catch(() => {
                const foundFallback = fallback.find(p => p.id === id);
                if (foundFallback) setProduct(foundFallback);
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white text-slate-600">
                <p className="font-semibold">Cargando producto…</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white text-slate-800 p-6 text-center">
                <h2 className="text-2xl font-black mb-2">Producto no encontrado</h2>
                <p className="text-gray-500 mb-6">El producto que buscas no existe o fue retirado.</p>
                <button
                    onClick={() => router.push("/")}
                    className="rounded-full pink-gradient text-white px-6 py-3 font-bold shadow-md cursor-pointer"
                >
                    Volver al inicio
                </button>
            </div>
        );
    }

    // Obtener todas las imágenes disponibles (unificando image_urls y image_url)
    const images = product.image_urls && product.image_urls.length > 0
        ? product.image_urls
        : (product.image_url ? [product.image_url] : []);

    const currentImage = images[selectedImageIndex] || "";

    function nextImage() {
        if (images.length > 1) {
            setSelectedImageIndex((prev) => (prev + 1) % images.length);
        }
    }

    function prevImage() {
        if (images.length > 1) {
            setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
        }
    }

    return (
        <main className="bg-gradient-to-br from-rose-50/50 via-white to-pink-50/30 text-slate-900 min-h-screen py-10 px-5">
            <div className="max-w-4xl mx-auto">

                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-pink-600 font-semibold mb-6 hover:underline cursor-pointer"
                >
                    <ArrowLeft size={20} /> Volver a la tienda
                </button>

                <div className="bg-white rounded-3xl shadow-xl border border-pink-100 overflow-hidden grid md:grid-cols-2 gap-8 p-6 md:p-10">

                    {/* GALERÍA DE IMÁGENES INTERACTIVA */}
                    <div className="flex flex-col gap-4">
                        <div className="aspect-square rounded-2xl bg-gradient-to-br from-pink-50 to-rose-100 overflow-hidden flex items-center justify-center relative shadow-inner group">
                            {currentImage ? (
                                <img src={currentImage} alt={product.name} className="w-full h-full object-cover transition-all duration-300" />
                            ) : (
                                <div className="text-center p-6">
                                    <Heart size={64} className="text-pink-400 mx-auto" />
                                    <p className="text-sm text-pink-700 mt-3 font-semibold">Stefmol · Producto Exclusivo</p>
                                </div>
                            )}

                            {/* Botones de navegación lateral si hay más de 1 imagen */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                                        aria-label="Imagen anterior"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                                        aria-label="Siguiente imagen"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </>
                            )}

                            {product.promo && (
                                <span className="absolute top-4 left-4 bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                                    Promoción del Mes
                                </span>
                            )}
                        </div>

                        {/* MINIATURAS CLICKEABLES */}
                        {images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImageIndex(idx)}
                                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0 ${selectedImageIndex === idx ? "border-pink-600 scale-105 shadow-md" : "border-gray-200 opacity-60 hover:opacity-100"
                                            }`}
                                    >
                                        <img src={img} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* INFORMACIÓN DEL PRODUCTO */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-xs font-bold text-pink-600 tracking-wider uppercase">
                                <span>{product.category || "General"}</span>
                                {product.subcategory && (
                                    <>
                                        <span>·</span>
                                        <span className="text-slate-500">{product.subcategory}</span>
                                    </>
                                )}
                            </div>

                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mt-1">{product.name}</h1>
                            <p className="text-pink-600 font-black text-3xl mt-3">{money(product.price)}</p>

                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <h3 className="font-bold text-sm text-slate-800 mb-2">Descripción detallada:</h3>
                                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{product.description || "Sin descripción detallada disponible."}</p>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-semibold text-slate-700">Cantidad:</span>
                                <div className="flex items-center border border-gray-200 rounded-full px-3 py-1.5 gap-4 bg-gray-50">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="text-slate-600 hover:text-pink-600 cursor-pointer"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="font-bold text-slate-900 w-4 text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => q + 1)}
                                        className="text-slate-600 hover:text-pink-600 cursor-pointer"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={() => setAdded(true)}
                                className={`w-full rounded-full py-4 font-bold flex justify-center items-center gap-2 shadow-lg transition-all cursor-pointer ${added
                                    ? "bg-emerald-600 text-white shadow-emerald-500/30"
                                    : "pink-gradient text-white shadow-pink-500/30 hover:scale-[1.02] active:scale-95"
                                    }`}
                            >
                                {added ? (
                                    <>
                                        <CheckCircle2 size={20} className="animate-bounce" />
                                        <span>¡Producto agregado!</span>
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart size={20} />
                                        <span>Agregar al carrito ({quantity})</span>
                                    </>
                                )}
                            </button>

                            <a
                                href={`https://wa.me/573114020157?text=¡Hola!%20Quiero%20comprar%20el%20producto:%20*${encodeURIComponent(product.name)}*%20(Cantidad:%20${quantity},%20Precio:%20${money(product.price * quantity)})`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3.5 font-bold flex justify-center items-center gap-2 shadow-md transition-colors text-sm text-center"
                            >
                                <MessageCircle size={18} />
                                <span>Comprar directamente por WhatsApp</span>
                            </a>
                        </div>

                    </div>

                </div>
            </div>
        </main>
    );
}