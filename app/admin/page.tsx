"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { Plus, Trash2, Edit3, Check, X, ArrowLeft, Image as ImageIcon, Sparkles, Upload, Lock, KeyRound, ArrowUpDown } from "lucide-react";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "1000440962";

type Product = {
    id: string;
    name: string;
    description: string | null;
    category: string | null;
    categories?: string[];
    subcategory?: string | null;
    subcategories?: string[];
    price: number;
    original_price?: number | null;
    image_url: string | null;
    image_urls?: string[];
    promo?: boolean;
    created_at?: string;
};

const categoryStructure = [
    { name: "Promociones del Mes", subcategories: [] },
    {
        name: "Juguetes",
        subcategories: ["Anillos vibradores", "Dildos", "Juegos eróticos", "Masturbadores", "Plugs anales", "BDSM", "Succionadores", "Vibradores"]
    },
    {
        name: "Placer y Sensaciones",
        subcategories: ["Anal", "Cremas fusión", "Estrechante", "Feromonas", "Garganta profunda", "Lubricantes", "Multiorgasmo", "Potencializador", "Comestibles", "Retardantes"]
    },
    {
        name: "Lencería",
        subcategories: ["Talla XS", "Talla S", "Talla M", "Talla L", "Talla XL", "Talla XXL", "Mallas", "Cuero"]
    }
];

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [inputPassword, setInputPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);

    const [products, setProducts] = useState<Product[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<"price-desc" | "price-asc" | "newest" | "name">("price-desc");

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>(["Juguetes"]);
    const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);

    const [promo, setPromo] = useState(false);
    const [price, setPrice] = useState("");
    const [originalPrice, setOriginalPrice] = useState("");

    const [images, setImages] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isAuthenticated) {
            loadProducts();
        }
    }, [isAuthenticated]);

    function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        if (inputPassword === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            setPasswordError(false);
        } else {
            setPasswordError(true);
        }
    }

    function handleLogout() {
        setIsAuthenticated(false);
        setInputPassword("");
    }

    function loadProducts() {
        fetch("/api/products")
            .then((r) => (r.ok ? r.json() : []))
            .then((data) => {
                if (Array.isArray(data)) {
                    setProducts(data);
                }
            })
            .catch((err) => console.error("Error cargando productos:", err));
    }

    const sortedProducts = useMemo(() => {
        const list = [...products];
        return list.sort((a, b) => {
            if (sortBy === "price-desc") return (Number(b.price) || 0) - (Number(a.price) || 0);
            if (sortBy === "price-asc") return (Number(a.price) || 0) - (Number(b.price) || 0);
            if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
            if (sortBy === "newest") {
                const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                return dateB - dateA;
            }
            return 0;
        });
    }, [products, sortBy]);

    function resetForm() {
        setName("");
        setDescription("");
        setSelectedCategories(["Juguetes"]);
        setSelectedSubcategories([]);
        setPrice("");
        setOriginalPrice("");
        setImages([]);
        setPromo(false);
        setEditingId(null);
    }

    function handleEdit(p: Product) {
        setEditingId(p.id);
        setName(p.name || "");
        setDescription(p.description || "");

        let cats: string[] = [];
        if (p.categories && Array.isArray(p.categories) && p.categories.length > 0) {
            cats = p.categories;
        } else if (p.category) {
            cats = [p.category];
        } else {
            cats = ["Juguetes"];
        }
        setSelectedCategories(cats);

        let subs: string[] = [];
        if (p.subcategories && Array.isArray(p.subcategories)) {
            subs = p.subcategories;
        } else if (p.subcategory) {
            subs = [p.subcategory];
        }
        setSelectedSubcategories(subs);

        const isPromoItem = Boolean(p.promo) || cats.includes("Promociones del Mes");
        setPromo(isPromoItem);

        setPrice(p.price ? String(p.price) : "");
        setOriginalPrice(p.original_price ? String(p.original_price) : "");

        const existingImages: string[] = [];
        if (p.image_urls && p.image_urls.length > 0) {
            existingImages.push(...p.image_urls);
        } else if (p.image_url) {
            existingImages.push(p.image_url);
        }
        setImages(existingImages);

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleFileSelection(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const newImages: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            try {
                const base64 = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = (error) => reject(error);
                    reader.readAsDataURL(file);
                });
                if (base64) {
                    newImages.push(base64);
                }
            } catch (err) {
                console.error("Error leyendo archivo:", err);
            }
        }

        setImages((prev) => [...prev, ...newImages]);
        setIsUploading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    function removeImage(index: number) {
        setImages((prev) => prev.filter((_, i) => i !== index));
    }

    function toggleCategory(catName: string) {
        if (selectedCategories.includes(catName)) {
            if (selectedCategories.length === 1) {
                alert("El producto debe pertenecer al menos a una categoría principal.");
                return;
            }
            setSelectedCategories(selectedCategories.filter((c) => c !== catName));
        } else {
            setSelectedCategories([...selectedCategories, catName]);
        }
    }

    function toggleSubcategory(subName: string) {
        if (selectedSubcategories.includes(subName)) {
            setSelectedSubcategories(selectedSubcategories.filter((s) => s !== subName));
        } else {
            setSelectedSubcategories([...selectedSubcategories, subName]);
        }
    }

    const availableSubcategories = categoryStructure
        .filter((c) => selectedCategories.includes(c.name))
        .flatMap((c) => c.subcategories);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!name.trim() || !price) {
            alert("Por favor ingresa al menos el nombre y el precio.");
            return;
        }

        setIsSaving(true);

        let finalCategories = [...selectedCategories];
        if (promo && !finalCategories.includes("Promociones del Mes")) {
            finalCategories.push("Promociones del Mes");
        } else if (!promo) {
            finalCategories = finalCategories.filter(c => c !== "Promociones del Mes");
        }

        const payload = {
            name: name.trim(),
            description: description.trim(),
            categories: finalCategories,
            category: finalCategories[0] || "Juguetes",
            subcategories: selectedSubcategories,
            subcategory: selectedSubcategories[0] || null,
            price: Number(price),
            original_price: promo && originalPrice ? Number(originalPrice) : null,
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
                alert("¡Producto guardado y publicado exitosamente!");
            } else {
                alert("Ocurrió un error al guardar el producto.");
            }
        } catch {
            alert("Error de conexión al guardar.");
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
                alert("¡Producto eliminado correctamente!");
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
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Acceso Restringido</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="text-left">
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#3B3B3B] mb-2">Ingresa tu contraseña:</label>
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
                            {passwordError && <p className="text-xs text-red-600 font-bold mt-2">Contraseña incorrecta.</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#B76E79] via-[#CFA18D] to-[#B76E79] text-white font-black text-sm uppercase tracking-wider shadow-lg hover:opacity-95 cursor-pointer"
                        >
                            Ingresar al Panel
                        </button>
                    </form>

                    <a href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#B76E79] font-bold transition-colors">
                        <ArrowLeft size={14} /> Volver a la Tienda
                    </a>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#FAF0EE] text-[#3B3B3B] p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-8">

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-[#3B3B3B] via-[#1A1A1A] to-[#000000] p-6 rounded-3xl text-white shadow-xl border border-[#CFA18D]/30">
                    <div>
                        <a href="/" className="inline-flex items-center gap-2 text-xs text-[#CFA18D] hover:text-white font-bold mb-2 transition-colors">
                            <ArrowLeft size={16} /> Volver a la Tienda
                        </a>
                        <h1 className="brand-script text-4xl md:text-5xl rose-gold-text">Administración Stefmol</h1>
                        <p className="text-xs text-[#F5D9D6] uppercase tracking-wider font-semibold mt-1">Gestión de Catálogo</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-[#CFA18D] text-xs font-bold transition-colors cursor-pointer border border-[#CFA18D]/30"
                    >
                        Cerrar Sesión
                    </button>
                </div>

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
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#3B3B3B] mb-1">Nombre del Producto</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ej: Vibrador Varita Mágica 💖"
                                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-[#B76E79] bg-[#FAF0EE]/30"
                                required
                            />
                        </div>

                        <div className="md:col-span-2 flex items-center gap-3 bg-[#F5D9D6]/30 p-4 rounded-2xl border border-[#CFA18D]/30">
                            <input
                                type="checkbox"
                                id="promoCheck"
                                checked={promo}
                                onChange={(e) => setPromo(e.target.checked)}
                                className="w-5 h-5 accent-[#B76E79] cursor-pointer"
                            />
                            <label htmlFor="promoCheck" className="text-sm font-bold text-[#3B3B3B] cursor-pointer select-none">
                                Marcar como "Promoción del Mes" (Activa precios de oferta Antes / Ahora)
                            </label>
                        </div>

                        {promo ? (
                            <>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                                        Precio Normal / Anterior (Tachado)
                                    </label>
                                    <input
                                        type="number"
                                        value={originalPrice}
                                        onChange={(e) => setOriginalPrice(e.target.value)}
                                        placeholder="Ej: 120000"
                                        className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-[#B76E79] bg-gray-50 font-semibold"
                                        required={promo}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#B76E79] mb-1">
                                        Precio en Promoción (Oferta actual)
                                    </label>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="Ej: 89900"
                                        className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-[#B76E79] bg-[#FAF0EE]/50 font-bold text-[#B76E79]"
                                        required
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#3B3B3B] mb-1">
                                    Precio del Producto (COP)
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
                        )}

                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#3B3B3B]">
                                Categorías Principales (Puedes marcar varias)
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {categoryStructure.map((cat) => {
                                    const isChecked = selectedCategories.includes(cat.name);
                                    return (
                                        <button
                                            type="button"
                                            key={cat.name}
                                            onClick={() => toggleCategory(cat.name)}
                                            className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${isChecked
                                                ? "bg-[#B76E79] text-white border-[#B76E79] shadow-md"
                                                : "bg-[#FAF0EE]/40 text-[#3B3B3B] border-gray-200 hover:border-[#CFA18D]"
                                                }`}
                                        >
                                            <span>{cat.name}</span>
                                            {isChecked && <Check size={14} />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {availableSubcategories.length > 0 && (
                            <div className="md:col-span-2 space-y-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#3B3B3B]">
                                    Subcategorías Específicas (Puedes marcar varias)
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {availableSubcategories.map((sub) => {
                                        const isChecked = selectedSubcategories.includes(sub);
                                        return (
                                            <button
                                                type="button"
                                                key={sub}
                                                onClick={() => toggleSubcategory(sub)}
                                                className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${isChecked
                                                    ? "bg-[#3B3B3B] text-white border-[#3B3B3B] shadow-md"
                                                    : "bg-[#FAF0EE]/40 text-[#3B3B3B] border-gray-200 hover:border-[#CFA18D]"
                                                    }`}
                                            >
                                                <span>{sub}</span>
                                                {isChecked && <Check size={14} />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="md:col-span-2 space-y-3">
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#3B3B3B]">
                                Fotos del Producto (Selecciona varias fotos a la vez)
                            </label>

                            {/* Botón directo que activa el selector de archivos sin bloqueos */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="flex flex-col items-center justify-center gap-1 border-2 border-dashed border-[#CFA18D] hover:border-[#B76E79] rounded-2xl p-5 bg-[#FAF0EE]/40 cursor-pointer text-[#3B3B3B] font-semibold text-center transition-colors"
                            >
                                <Upload size={24} className="text-[#B76E79]" />
                                <span className="text-sm font-bold">
                                    {isUploading ? "Cargando fotos..." : "Haz clic aquí para seleccionar múltiples fotos"}
                                </span>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileSelection}
                                    className="hidden"
                                />
                            </div>

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
                                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 cursor-pointer hover:bg-red-700"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#3B3B3B] mb-1">Descripción del Producto</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Detalles, materiales, dimensiones..."
                                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-[#B76E79] bg-[#FAF0EE]/30 min-h-20"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving || isUploading}
                        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#B76E79] via-[#CFA18D] to-[#B76E79] text-white font-black text-base uppercase tracking-wider shadow-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {isSaving ? "Guardando..." : editingId ? <><Check size={20} /> Guardar Cambios</> : <><Plus size={20} /> Publicar Producto</>}
                    </button>
                </form>

                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-[#F5D9D6] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F5D9D6] pb-4">
                        <h3 className="text-lg font-bold text-[#3B3B3B]">Productos Publicados ({sortedProducts.length})</h3>

                        <div className="flex items-center gap-2 bg-[#FAF0EE] px-3 py-1.5 rounded-xl border border-[#CFA18D]/30">
                            <ArrowUpDown size={16} className="text-[#B76E79]" />
                            <span className="text-xs font-bold text-[#3B3B3B]">Ordenar por:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="bg-transparent text-xs font-bold text-[#B76E79] focus:outline-none cursor-pointer"
                            >
                                <option value="price-desc">Mayor a menor precio ⬇️</option>
                                <option value="price-asc">Menor a mayor precio ⬆️</option>
                                <option value="newest">Más recientes 🆕</option>
                                <option value="name">Nombre (A - Z) 🅰️</option>
                            </select>
                        </div>
                    </div>

                    {!sortedProducts.length ? (
                        <p className="text-sm text-gray-500 py-4">Sin productos.</p>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {sortedProducts.map((p) => {
                                const prodImgs = p.image_urls && p.image_urls.length > 0 ? p.image_urls : p.image_url ? [p.image_url] : [];
                                const catText = p.categories && p.categories.length > 0 ? p.categories.join(" • ") : p.category;

                                return (
                                    <div key={p.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-xl bg-[#FAF0EE] border overflow-hidden flex items-center justify-center shrink-0">
                                                {prodImgs[0] ? <img src={prodImgs[0]} alt={p.name} className="w-full h-full object-cover" /> : <ImageIcon size={24} className="text-[#B76E79]" />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[#3B3B3B] text-base flex items-center gap-2">
                                                    {p.name}
                                                    {p.promo && <span className="bg-[#B76E79] text-white text-[9px] px-2 py-0.5 rounded-full uppercase">Promo</span>}
                                                </h4>
                                                <p className="text-xs text-gray-500">{catText}</p>
                                                <p className="text-xs font-bold text-[#B76E79]">
                                                    Fotos: {prodImgs.length} cargadas
                                                </p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-sm font-black text-[#B76E79]">
                                                        ${new Intl.NumberFormat("es-CO").format(p.price)} COP
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 self-end sm:self-center">
                                            <button
                                                onClick={() => handleEdit(p)}
                                                className="py-2 px-4 rounded-xl bg-[#FAF0EE] hover:bg-[#F5D9D6] text-[#B76E79] text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-[#CFA18D]/30"
                                            >
                                                <Edit3 size={15} /> Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-rose-200"
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