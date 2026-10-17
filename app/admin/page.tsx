"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit3, Check, X, ArrowLeft, Image as ImageIcon, Sparkles, Upload, Lock, KeyRound } from "lucide-react";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "stefmol2026";

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

const categoryStructure = [
    { name: "Promociones del Mes", subcategories: [] },
    { name: "Juguetes", subcategories: ["Anillos vibradores", "Dildos", "Juegos eróticos", "Masturbadores", "Plugs anales", "BDSM", "Succionadores", "Vibradores"] },
    { name: "Placer y Sensaciones", subcategories: ["Anal", "Cremas fusión", "Estrechante", "Feromonas", "Garganta profunda", "Lubricantes", "Multiorgasmo", "Potenciador", "Comestibles", "Retardantes"] },
    { name: "Lencería", subcategories: ["Talla XS", "Talla S", "Talla M", "Talla L", "Talla XL", "Talla XXL", "Mallas", "Cuero"] }
];

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [inputPassword, setInputPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Formulario
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Juguetes");
    const [subcategory, setSubcategory] = useState("");
    const [price, setPrice] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [promo, setPromo] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const sessionAuth = sessionStorage.getItem("admin_auth");
        if (sessionAuth === "true") {
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            loadProducts();
        }
    }, [isAuthenticated]);

    function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        if (inputPassword === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            sessionStorage.setItem("admin_auth", "true");
            setPasswordError(false);
        } else {
            setPasswordError(true);
        }
    }

    function handleLogout() {
        setIsAuthenticated(false);
        sessionStorage.removeItem("admin_auth");
        setInputPassword("");
    }

    function loadProducts() {
        setLoading(true);
        fetch("/api/products")
            .then((r) => (r.ok ? r.json() : []))
            .then((data) => {
                if (Array.isArray(data)) setProducts(data);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }

    function resetForm() {
        setName("");
        setDescription("");
        setCategory("Juguetes");
        setSubcategory("");
        setPrice("");
        setImages([]);
        setPromo(false);
        setEditingId(null);
    }

    function handleEdit(p: Product) {
        setEditingId(p.id);
        setName(p.name || "");
        setDescription(p.description || "");
        setCategory(p.category || "Juguetes");
        setSubcategory(p.subcategory || "");
        setPrice(p.price ? String(p.price) : "");

        const existingImages: string[] = [];
        if (p.image_urls && p.image_urls.length > 0) {
            existingImages.push(...p.image_urls);
        } else if (p.image_url) {
            existingImages.push(p.image_url);
        }
        setImages(existingImages);

        setPromo(Boolean(p.promo));
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // COMPRESIÓN ULTRALIGERA PARA SUPERAR EL LÍMITE DE VERCEL (MAX 400px / 0.4 CALIDAD)
    function compressImage(file: File): Promise<string> {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const MAX_WIDTH = 400;
                    const MAX_HEIGHT = 400;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx?.drawImage(img, 0, 0, width, height);

                    // Calidad super comprimida
                    const dataUrl = canvas.toDataURL("image/jpeg", 0.4);
                    resolve(dataUrl);
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        });
    }

    async function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const compressed = await Promise.all(files.map((file) => compressImage(file)));
        setImages((prev) => [...prev, ...compressed]);
    }

    function removeImage(index: number) {
        setImages((prev) => prev.filter((_, i) => i !== index));
    }

    function handleCategoryChange(newCategory: string) {
        setCategory(newCategory);
        const catData = categoryStructure.find((c) => c.name === newCategory);
        if (!catData || !catData.subcategories.includes(subcategory)) {
            setSubcategory("");
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!name.trim() || !price) {
            alert("Por favor ingresa al menos el nombre y el precio.");
            return;
        }

        setIsSaving(true);

        const payload = {
            name,
            description,
            category,
            subcategory: subcategory || null,
            price: Number(price),
            image_url: images[0] || "",
            image_urls: images,
            promo,
        };

        try {
            const url = editingId ? `/api/products/${editingId}` : "/api/products";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                resetForm();
                loadProducts();
                alert("¡Producto guardado exitosamente!");
            } else {
                alert("Ocurrió un error al guardar en el servidor. Intenta subir menos fotos o fotos más pequeñas.");
            }
        } catch {
            alert("Error de conexión al guardar el producto.");
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) return;

        try {
            const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
            if (res.ok) {
                loadProducts();
            } else {
                alert("No se pudo eliminar el producto.");
            }
        } catch {
            alert("Error al conectar con el servidor.");
        }
    }

    if (!isAuthenticated) {
        return (
            <main className="min-h-screen bg-[#FAF0EE] text-[#3B3B3B] flex items-center justify-center p-4">
                <div className="bg-white max-w-md w-full p-8 rounded-3xl shadow-2xl border border-[#F5D9D6] space-y-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-tr from-[#B76E79] to-[#CFA18D] rounded-2xl flex items-center justify-center mx-auto text-white shadow-md">
                        <Lock size={32} />
                    </div>

                    <div>
                        <h1 className="brand-script text-4xl rose-gold-text">Stefmol Admin</h1>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
                            Acceso Restringido
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="text-left">
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#3B3B3B] mb-2">
                                Ingresa tu contraseña:
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={inputPassword}
                                    onChange={(e) => {
                                        setInputPassword(e.target.value);
                                        setPasswordError(false);
                                    }}
                                    placeholder="••••••••"
                                    className="w-full border border-gray-300 rounded-xl p-3.5 pl-11 text-sm focus:outline-[#B76E79] bg-[#FAF0EE]/30"
                                    required
                                />
                                <KeyRound size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                            </div>
                            {passwordError && (
                                <p className="text-xs text-red-600 font-bold mt-2">
                                    Contraseña incorrecta. Inténtalo de nuevo.
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#B76E79] via-[#CFA18D] to-[#B76E79] text-white font-black text-sm uppercase tracking-wider shadow-lg hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
                        >
                            Ingresar al Panel
                        </button>
                    </form>

                    <a
                        href="/"
                        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#B76E79] font-bold transition-colors"
                    >
                        <ArrowLeft size={14} /> Volver a la Tienda
                    </a>
                </div>
            </main>
        );
    }

    const currentSubcategories = categoryStructure.find((c) => c.name === category)?.subcategories || [];

    return (
        <main className="min-h-screen bg-[#FAF0EE] text-[#3B3B3B] p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* ENCABEZADO */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-[#3B3B3B] via-[#1A1A1A] to-[#000000] p-6 rounded-3xl text-white shadow-xl border border-[#CFA18D]/30">
                    <div>
                        <a href="/" className="inline-flex items-center gap-2 text-xs text-[#CFA18D] hover:text-white font-bold mb-2 transition-colors">
                            <ArrowLeft size={16} /> Volver a la Tienda
                        </a>
                        <h1 className="brand-script text-4xl md:text-5xl rose-gold-text">Administración Stefmol</h1>
                        <p className="text-xs text-[#F5D9D6] uppercase tracking-wider font-semibold mt-1">Gestión Protegida de Catálogo</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-[#CFA18D] text-xs font-bold transition-colors cursor-pointer border border-[#CFA18D]/30"
                    >
                        Cerrar Sesión
                    </button>
                </div>

                {/* FORMULARIO AGREGAR / EDITAR */}
                <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-[#F5D9D6] space-y-6">
                    <div className="flex items-center justify-between border-b border-[#F5D9D6] pb-4">
                        <h2 className="text-xl font-bold text-[#3B3B3B] flex items-center gap-2">
                            <Sparkles size={20} className="text-[#B76E79]" />
                            {editingId ? "Editar Producto" : "Agregar Nuevo Producto"}
                        </h2>
                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="text-xs text-red-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                            >
                                <X size={14} /> Cancelar Edición
                            </button>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">

                        {/* NOMBRE */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#3B3B3B] mb-1">
                                Nombre del Producto (puedes incluir emojis ✨🔥)
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ej: Vibrador Varita Mágica 💖 10 Modos"
                                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-[#B76E79] bg-[#FAF0EE]/30"
                                required
                            />
                        </div>

                        {/* PRECIO */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#3B3B3B] mb-1">
                                Precio (COP)
                            </label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Ej: 89900"
                                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-[#B76E79] bg-[#FAF0EE]/30"
                                required
                            />
                        </div>

                        {/* CATEGORÍA PRINCIPAL */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#3B3B3B] mb-1">
                                Categoría Principal
                            </label>
                            <select
                                value={category}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-[#B76E79] bg-[#FAF0EE]/30 font-semibold"
                            >
                                {categoryStructure.map((c) => (
                                    <option key={c.name} value={c.name}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* SUBCATEGORÍA */}
                        {currentSubcategories.length > 0 && (
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#3B3B3B] mb-1">
                                    Subcategoría
                                </label>
                                <select
                                    value={subcategory}
                                    onChange={(e) => setSubcategory(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-[#B76E79] bg-[#FAF0EE]/30"
                                >
                                    <option value="">-- Sin subcategoría --</option>
                                    {currentSubcategories.map((sub) => (
                                        <option key={sub} value={sub}>
                                            {sub}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* FOTOS DEL PRODUCTO */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#3B3B3B]">
                                Fotos del Producto
                            </label>

                            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#CFA18D] hover:border-[#B76E79] rounded-2xl p-5 bg-[#FAF0EE]/40 cursor-pointer text-[#3B3B3B] font-semibold transition-colors text-center">
                                <Upload size={24} className="text-[#B76E79]" />
                                <span className="text-sm font-bold">Haz clic aquí para seleccionar fotos</span>
                                <input type="file" accept="image/*" multiple onChange={handleImagesChange} className="hidden" />
                            </label>

                            {images.length > 0 && (
                                <div className="pt-2">
                                    <p className="text-xs font-bold text-[#B76E79] mb-2">Fotos cargadas ({images.length}):</p>
                                    <div className="flex flex-wrap gap-3">
                                        {images.map((img, idx) => (
                                            <div key={idx} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-[#CFA18D] shadow-sm bg-black/5">
                                                <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(idx)}
                                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-90 hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                                                    title="Eliminar foto"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* DESCRIPCIÓN */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#3B3B3B] mb-1">
                                Descripción del Producto
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Escribe detalles del producto, materiales, dimensiones, modos de uso..."
                                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-[#B76E79] bg-[#FAF0EE]/30 min-h-20"
                            />
                        </div>

                        {/* CHECKBOX PROMOCIÓN */}
                        <div className="md:col-span-2 flex items-center gap-3 bg-[#F5D9D6]/30 p-4 rounded-2xl border border-[#CFA18D]/30">
                            <input
                                type="checkbox"
                                id="promoCheck"
                                checked={promo}
                                onChange={(e) => setPromo(e.target.checked)}
                                className="w-5 h-5 accent-[#B76E79] cursor-pointer"
                            />
                            <label htmlFor="promoCheck" className="text-sm font-bold text-[#3B3B3B] cursor-pointer select-none">
                                Marcar como "Promoción del Mes"
                            </label>
                        </div>

                    </div>

                    {/* BOTÓN GUARDAR */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className={`w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#B76E79] via-[#CFA18D] to-[#B76E79] text-white font-black text-base uppercase tracking-wider shadow-xl hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 border border-white/20 ${isSaving ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                            {isSaving ? (
                                <span>Guardando cambios...</span>
                            ) : editingId ? (
                                <>
                                    <Check size={20} /> Guardar Cambios del Producto
                                </>
                            ) : (
                                <>
                                    <Plus size={20} /> Guardar y Publicar Producto
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* LISTADO DE PRODUCTOS */}
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-[#F5D9D6] space-y-4">
                    <h3 className="text-lg font-bold text-[#3B3B3B]">
                        Productos Publicados ({products.length})
                    </h3>

                    {loading ? (
                        <p className="text-sm text-gray-500 py-4">Cargando lista de productos…</p>
                    ) : !products.length ? (
                        <p className="text-sm text-gray-500 py-4">Aún no hay productos registrados.</p>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {products.map((p) => {
                                const prodImgs = p.image_urls && p.image_urls.length > 0 ? p.image_urls : p.image_url ? [p.image_url] : [];

                                return (
                                    <div key={p.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-xl bg-[#FAF0EE] border border-[#F5D9D6] overflow-hidden flex items-center justify-center shrink-0">
                                                {prodImgs[0] ? (
                                                    <img src={prodImgs[0]} alt={p.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon size={24} className="text-[#B76E79]" />
                                                )}
                                            </div>

                                            <div>
                                                <h4 className="font-bold text-[#3B3B3B] text-base flex items-center gap-2">
                                                    {p.name}
                                                    {p.promo && (
                                                        <span className="bg-[#B76E79] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                                                            Promo
                                                        </span>
                                                    )}
                                                </h4>
                                                <p className="text-xs text-gray-500">
                                                    {p.category} {p.subcategory ? `· ${p.subcategory}` : ""} {prodImgs.length > 1 ? `(${prodImgs.length} fotos)` : ""}
                                                </p>
                                                <p className="text-sm font-black text-[#B76E79] mt-0.5">
                                                    ${new Intl.NumberFormat("es-CO").format(p.price)} COP
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 self-end sm:self-center">
                                            <button
                                                onClick={() => handleEdit(p)}
                                                className="py-2 px-4 rounded-xl bg-[#FAF0EE] hover:bg-[#F5D9D6] text-[#B76E79] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#CFA18D]/30"
                                            >
                                                <Edit3 size={15} /> Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-rose-200"
                                            >
                                                <Trash2 size={15} /> Eliminar
                                            </button>
                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </main>
    );
}