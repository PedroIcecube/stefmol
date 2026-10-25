"use client";

import { useEffect, useState, use } from "react";
import { ArrowLeft, ShoppingCart, CheckCircle2, Heart, Plus, Minus, MessageCircle, Truck, LockKeyhole, Headset } from "lucide-react";

type Product = {
    id: string;
    name: string;
    description: string | null;
    category: string | null;
    categories?: string[];
    subcategory?: string | null;
    price: number;
    original_price?: number | null;
    image_url: string | null;
    image_urls?: string[];
    promo?: boolean;
};

type CartItem = Product & { quantity: number };

const money = (n: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const productId = resolvedParams.id;

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string>("");
    const [added, setAdded] = useState(false);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await fetch(`/api/products`);
                if (res.ok) {
                    const products: Product[] = await res.json();
                    const found = products.find((p) => p.id === productId);
                    if (found) {
                        setProduct(found);
                        const initialImg = (found.image_urls && found.image_urls[0]) || found.image_url || "";
                        setSelectedImage(initialImg);
                    }
                }
            } catch (err) {
                console.error("Error al cargar producto:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [productId]);

    function addToCart() {
        if (!product) return;

        // Obtener carrito guardado
        const savedCart = localStorage.getItem("stefmol_cart");
        let currentCart: CartItem[] = savedCart ? JSON.parse(savedCart) : [];

        const existingIndex = currentCart.findIndex((item) => item.id === product.id);

        if (existingIndex > -1) {
            currentCart[existingIndex].quantity += quantity;
        } else {
            currentCart.push({ ...product, quantity });
        }

        // Guardar carrito actualizado
        localStorage.setItem("stefmol_cart", JSON.stringify(currentCart));

        // Notificar cambio al sistema
        window.dispatchEvent(new Event("storage"));

        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-[#FAF0EE] text-[#3B3B3B] flex items-center justify-center p-4">
                <p className="text-[#B76E79] font-bold text-lg animate-pulse">Cargando detalles del producto...</p>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="min-h-screen bg-[#FAF0EE] text-[#3B3B3B] flex flex-col items-center justify-center p-4 space-y-4">
                <h2 className="text-2xl font-bold">Producto no encontrado</h2>
                <a
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#B76E79] text-white font-bold shadow-md hover:opacity-95 transition-all"
                >
                    <ArrowLeft size={18} /> Volver a la Tienda
                </a>
            </main>
        );
    }

    const allImages = product.image_urls && product.image_urls.length > 0 ? product.image_urls : product.image_url ? [product.image_url] : [];
    const displayCategories = product.categories && product.categories.length > 0 ? product.categories.join(" • ") : product.category || "General";

    return (
        <main className="min-h-screen bg-[#FAF0EE] text-[#3B3B3B]">

            {/* BARRA DE NAVEGACIÓN */}
            <header className="bg-gradient-to-r from-[#3B3B3B] via-[#1A1A1A] to-[#000000] text-white px-5 py-4 shadow-lg border-b border-[#CFA18D]/30 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <a href="/" className="inline-flex items-center gap-2 text-xs md:text-sm text-[#CFA18D] hover:text-white font-bold transition-colors">
                        <ArrowLeft size={20} /> Volver a la Tienda
                    </a>
                    <a href="/" className="brand-script text-3xl md:text-4xl rose-gold-text">Stefmol</a>
                </div>
            </header>

            {/* CONTENIDO PRINCIPAL DEL PRODUCTO */}
            <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-[#F5D9D6] grid md:grid-cols-2 gap-8 md:gap-12">

                    {/* GALERÍA DE IMÁGENES */}
                    <div className="space-y-4">
                        <div className="aspect-square rounded-2xl bg-[#FAF0EE] overflow-hidden border border-[#F5D9D6] flex items-center justify-center relative shadow-inner">
                            {selectedImage ? (
                                <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <Heart size={64} className="text-[#B76E79]" />
                            )}
                            {product.promo && (
                                <span className="absolute top-3 left-3 bg-[#B76E79] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                                    Oferta
                                </span>
                            )}
                        </div>

                        {/* THUMBNAILS SI HAY MÁS DE 1 IMAGEN */}
                        {allImages.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${selectedImage === img ? "border-[#B76E79] scale-105 shadow-md" : "border-gray-200 opacity-70 hover:opacity-100"
                                            }`}
                                    >
                                        <img src={img} alt={`Vista ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* INFORMACIÓN Y BOTÓN DE AGREGAR */}
                    <div className="flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                            <span className="text-xs uppercase font-extrabold text-[#B76E79] tracking-wider bg-[#F5D9D6]/40 px-3 py-1 rounded-full border border-[#CFA18D]/30 inline-block">
                                {displayCategories}
                            </span>

                            <h1 className="text-2xl md:text-3xl font-black text-[#3B3B3B] leading-tight">
                                {product.name}
                            </h1>

                            {/* PRECIOS ANTES Y AHORA */}
                            <div className="flex items-baseline gap-3 pt-1">
                                <span className="text-3xl font-black text-[#B76E79]">
                                    {money(product.price)}
                                </span>
                                {product.original_price && product.original_price > product.price && (
                                    <span className="text-lg text-gray-400 line-through font-semibold">
                                        {money(product.original_price)}
                                    </span>
                                )}
                            </div>

                            {/* DESCRIPCIÓN DETALLADA */}
                            <div className="pt-4 border-t border-gray-100 space-y-2">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Descripción del Producto</h3>
                                <p className="text-sm md:text-base text-gray-700 whitespace-pre-line leading-relaxed">
                                    {product.description || "Sin descripción disponible."}
                                </p>
                            </div>
                        </div>

                        {/* SELECCIÓN DE CANTIDAD Y BOTÓN DE ACCIÓN */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Cantidad:</span>
                                <div className="flex items-center border border-gray-300 rounded-xl bg-[#FAF0EE]/50 overflow-hidden">
                                    <button
                                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                        className="p-2.5 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="px-4 font-bold text-sm">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity((q) => q + 1)}
                                        className="p-2.5 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* BOTÓN CON COLOR ROSE-GOLD VISIBLE Y ACCIÓN DE AGREGAR */}
                            <button
                                onClick={addToCart}
                                className={`w-full py-4 px-6 rounded-2xl text-white font-black text-base uppercase tracking-wider shadow-xl transition-all duration-300 transform active:scale-98 flex items-center justify-center gap-3 cursor-pointer ${added
                                    ? "bg-emerald-600 shadow-emerald-600/30"
                                    : "bg-gradient-to-r from-[#B76E79] via-[#CFA18D] to-[#B76E79] hover:opacity-95 shadow-[#B76E79]/20"
                                    }`}
                            >
                                {added ? (
                                    <>
                                        <CheckCircle2 size={22} className="animate-bounce" />
                                        <span>¡Agregado al Carrito!</span>
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart size={22} />
                                        <span>Agregar al Carrito ({money(product.price * quantity)})</span>
                                    </>
                                )}
                            </button>

                            <a
                                href={`https://wa.me/573114020157?text=${encodeURIComponent(`¡Hola! 👋 Quiero consultar sobre el producto: ${product.name}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-3.5 px-6 rounded-2xl bg-emerald-50 text-emerald-700 font-bold text-sm flex items-center justify-center gap-2 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                            >
                                <MessageCircle size={18} /> Preguntar por WhatsApp sobre este producto
                            </a>
                        </div>

                    </div>

                </div>

                {/* BENEFICIOS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#F5D9D6] flex items-center gap-3">
                        <Truck className="text-[#B76E79]" size={24} />
                        <div>
                            <h4 className="font-bold text-xs uppercase">Envíos Discretos</h4>
                            <p className="text-xs text-gray-500">Empaque 100% neutro sin logos</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#F5D9D6] flex items-center gap-3">
                        <LockKeyhole className="text-[#B76E79]" size={24} />
                        <div>
                            <h4 className="font-bold text-xs uppercase">Compra Confidencial</h4>
                            <p className="text-xs text-gray-500">Tus datos están protegidos</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#F5D9D6] flex items-center gap-3">
                        <Headset className="text-[#B76E79]" size={24} />
                        <div>
                            <h4 className="font-bold text-xs uppercase">Asesoría Personalizada</h4>
                            <p className="text-xs text-gray-500">Atención rápida por WhatsApp</p>
                        </div>
                    </div>
                </div>

            </div>

        </main>
    );
}