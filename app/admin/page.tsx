"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit3, Check, X, ArrowLeft, Image as ImageIcon, Sparkles } from "lucide-react";

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
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Formulario
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Juguetes");
    const [subcategory, setSubcategory] = useState("");
    const [price, setPrice] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [promo, setPromo] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

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
        setImageUrl("");
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
        setImageUrl(p.image_url || "");
        setPromo(Boolean(p.promo));
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!name.trim() || !price) {
            alert("Por favor ingresa al menos el nombre y el precio.");
            return;
        }

        // Permite emojis y cualquier carácter UTF-8
        const payload = {
            name: name,
            description: description,
            category: category,
            subcategory: subcategory,
            price: Number(price),
            image_url: imageUrl,
            promo: promo,
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
            } else {
                alert("Ocurrió un error al guardar el producto.");
            }
        } catch {
            alert("Error de conexión al guardar.");
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

    const currentSubcategories = categoryStructure.find((c) => c.name === category)?.subcategories || [];

    return (
        <main className="min-h-screen bg-[#FAF0EE] text-[#3B3B3B] p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* ENCABEZADO ADMIN */}
                <div className="flex items-center justify-between bg-gradient-to-r from-[#3B3B3B] via-[#1A1A1A] to-[#000000] p-6 rounded-3xl text-white shadow-xl border border-[#CFA18D]/30">
                    <div>
                        <a href="/" className="inline-flex items-center gap-2 text-xs text-[#CFA18D] hover:text-white font-bold mb-2 transition-colors">
                            <ArrowLeft size={16} /> Volver a la Tienda
                        </a>
                        <h1 className="brand-script text-4xl md:text-5xl rose-gold-text">Administración Stefmol</h1>
                        <p className="text-xs text-[#F5D9D6] uppercase tracking-wider font-semibold mt-1">Gestión de Catálogo y Productos</p>
                    </div>
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

                        {/* NOMBRE (ACEPTA EMOJIS) */}
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

                        {/* CATEGORÍA */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#3B3B3B] mb-1">
                                Categoría Principal
                            </label>
                            <select
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                    setSubcategory("");
                                }}
                                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-[#B76E79] bg-[#FAF0EE]/30"
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

                        {/* URL DE IMAGEN */}
                        <div className={currentSubcategories.length > 0 ? "" : "md:col-span-2"}>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#3B3B3B] mb-1">
                                URL de la Imagen (Link externo)
                            </label>
                            <input
                                type="url"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://ejemplo.com/imagen.jpg"
                                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-[#B76E79] bg-[#FAF0EE]/30"
                            />
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
                                Marcar como "Promoción del Mes" (Aparecerá en el banner principal y en ofertas especiales ✨)
                            </label>
                        </div>

                    </div>

                    {/* BOTÓN ALTA VISIBILIDAD DE GUARDADO / ACTUALIZADO */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#B76E79] via-[#CFA18D] to-[#B76E79] text-white font-black text-base uppercase tracking-wider shadow-xl hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 border border-white/20 cursor-pointer"
                        >
                            {editingId ? (
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

                {/* LISTADO DE PRODUCTOS EXISTENTES */}
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
                            {products.map((p) => (
                                <div key={p.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-xl bg-[#FAF0EE] border border-[#F5D9D6] overflow-hidden flex items-center justify-center shrink-0">
                                            {p.image_url ? (
                                                <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
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
                                                {p.category} {p.subcategory ? `· ${p.subcategory}` : ""}
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
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </main>
    );
}