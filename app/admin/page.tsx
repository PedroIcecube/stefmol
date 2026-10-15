"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ImagePlus, LoaderCircle, PlusCircle, CheckCircle2, X, Trash2, Edit3 } from "lucide-react";

type CategoryStructure = {
    name: string;
    subcategories: string[];
};

const categoryStructure: CategoryStructure[] = [
    { name: "Promociones del Mes", subcategories: [] },
    {
        name: "Juguetes",
        subcategories: ["Anillos vibradores", "Dildos", "Juegos eróticos", "Masturbadores", "Plugs anales", "BDSM", "Succionadores", "Vibradores"]
    },
    {
        name: "Placer y Sensaciones",
        subcategories: ["Anal", "Cremas fusión", "Estrechante", "Feromonas", "Garganta profunda", "Lubricantes", "Multiorgasmo", "Potenciador", "Comestibles", "Retardantes"]
    },
    {
        name: "Lencería",
        subcategories: ["Talla XS", "Talla S", "Talla M", "Talla L", "Talla XL", "Talla XXL", "Mallas", "Cuero"]
    }
];

type Product = {
    id: string;
    name: string;
    description: string | null;
    category: string | null;
    subcategory?: string | null;
    price: number;
    image_url: string | null;
    image_urls?: string[];
};

export default function Admin() {
    const [password, setPassword] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null); // ID del producto si estamos editando
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("Juguetes");
    const [subcategory, setSubcategory] = useState("Vibradores");
    const [description, setDescription] = useState("");

    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]); // Fotos previas al editar

    const [products, setProducts] = useState<Product[]>([]);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);

    // Cargar productos para la lista de administración
    useEffect(() => {
        fetchProducts();
    }, []);

    function fetchProducts() {
        fetch("/api/products")
            .then(r => r.json())
            .then(d => {
                if (Array.isArray(d)) setProducts(d);
            })
            .catch(() => { });
    }

    function handleCategoryChange(newCat: string) {
        setCategory(newCat);
        const catObj = categoryStructure.find(c => c.name === newCat);
        if (catObj && catObj.subcategories.length > 0) {
            setSubcategory(catObj.subcategories[0]);
        } else {
            setSubcategory("");
        }
    }

    function handleFileSelect(selectedFiles: FileList | null) {
        if (!selectedFiles) return;
        const newFiles = Array.from(selectedFiles);
        setFiles(prev => [...prev, ...newFiles]);
        const newPreviews = newFiles.map(f => URL.createObjectURL(f));
        setPreviews(prev => [...prev, ...newPreviews]);
    }

    function removeNewImage(index: number) {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    }

    function removeExistingImage(index: number) {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    }

    // Cargar datos de un producto en el formulario para editarlo
    function startEdit(product: Product) {
        setEditingId(product.id);
        setName(product.name);
        setPrice(String(product.price));
        setCategory(product.category || "Juguetes");
        setSubcategory(product.subcategory || "");
        setDescription(product.description || "");
        setExistingImages(product.image_urls && product.image_urls.length > 0 ? product.image_urls : (product.image_url ? [product.image_url] : []));
        setFiles([]);
        setPreviews([]);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function cancelEdit() {
        setEditingId(null);
        setName("");
        setPrice("");
        setDescription("");
        setExistingImages([]);
        setFiles([]);
        setPreviews([]);
    }

    async function handleDelete(id: string) {
        if (!password) {
            alert("Por favor ingresa la contraseña de administrador arriba para confirmar la eliminación.");
            return;
        }
        if (!confirm("¿Estás seguro de eliminar este producto?")) return;

        try {
            const r = await fetch(`/api/products/${id}`, {
                method: "DELETE",
                headers: { "x-admin-password": password }
            });
            const d = await r.json();
            if (!r.ok) throw new Error(d.error || "No se pudo eliminar");

            setMessage("¡Producto eliminado correctamente!");
            fetchProducts();
        } catch (err: any) {
            setError(true);
            setMessage(err.message || "Error al eliminar");
        }
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setBusy(true);
        setMessage("");
        setError(false);

        try {
            const uploadedUrls: string[] = [...existingImages];

            // Subir nuevas imágenes si se seleccionaron
            for (const file of files) {
                const fd = new FormData();
                fd.append("file", file);
                const up = await fetch("/api/upload", {
                    method: "POST",
                    headers: { "x-admin-password": password },
                    body: fd
                });
                const ud = await up.json();
                if (!up.ok) throw new Error(ud.error || `Error subiendo imagen`);
                uploadedUrls.push(ud.url);
            }

            const endpoint = editingId ? `/api/products/${editingId}` : "/api/products";
            const method = editingId ? "PUT" : "POST";

            const r = await fetch(endpoint, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "x-admin-password": password
                },
                body: JSON.stringify({
                    name,
                    price: Number(price),
                    category,
                    subcategory,
                    description,
                    image_url: uploadedUrls[0] || "",
                    image_urls: uploadedUrls
                })
            });

            const d = await r.json();
            if (!r.ok) throw new Error(d.error || "No se pudo guardar el producto");

            setMessage(editingId ? "¡Producto actualizado con éxito!" : "¡Producto guardado exitosamente!");
            cancelEdit();
            fetchProducts();
        } catch (err: any) {
            setError(true);
            setMessage(err.message || "Ocurrió un error");
        } finally {
            setBusy(false);
        }
    }

    const currentCategoryObj = categoryStructure.find(c => c.name === category);

    return (
        <main className="min-h-screen bg-gradient-to-br from-rose-50 to-white p-5 md:p-10">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-pink-700 mb-7 hover:underline">
                    <ArrowLeft size={18} /> Volver a la tienda
                </Link>

                {/* FORMULARIO DE CREACIÓN / EDICIÓN */}
                <div className="bg-white rounded-3xl shadow-xl border border-pink-100 p-6 md:p-9 mb-10">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="brand-script text-4xl text-pink-600">Stefmol</div>
                            <h1 className="text-2xl font-black mt-2">
                                {editingId ? "✏️ Editando Producto" : "Administrar productos"}
                            </h1>
                        </div>
                        {editingId && (
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-xl font-semibold cursor-pointer"
                            >
                                Cancelar edición
                            </button>
                        )}
                    </div>

                    <form onSubmit={submit} className="mt-7 space-y-5">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Contraseña de administrador</label>
                            <input
                                required
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full border rounded-xl p-3 focus:outline-pink-500"
                                placeholder="Contraseña configurada en Vercel"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Nombre del producto</label>
                            <input
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full border rounded-xl p-3 focus:outline-pink-500"
                                placeholder="Ej. Vibrador Conejito 12 modos"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Precio (COP)</label>
                                <input
                                    required
                                    min="0"
                                    type="number"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                    className="w-full border rounded-xl p-3 focus:outline-pink-500"
                                    placeholder="89900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">Categoría principal</label>
                                <select
                                    value={category}
                                    onChange={e => handleCategoryChange(e.target.value)}
                                    className="w-full border rounded-xl p-3 bg-white focus:outline-pink-500"
                                >
                                    {categoryStructure.map(c => (
                                        <option key={c.name} value={c.name}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">Subsección</label>
                                <select
                                    value={subcategory}
                                    disabled={!currentCategoryObj || currentCategoryObj.subcategories.length === 0}
                                    onChange={e => setSubcategory(e.target.value)}
                                    className="w-full border rounded-xl p-3 bg-white disabled:bg-gray-100 disabled:text-gray-400 focus:outline-pink-500"
                                >
                                    {currentCategoryObj && currentCategoryObj.subcategories.length > 0 ? (
                                        currentCategoryObj.subcategories.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))
                                    ) : (
                                        <option value="">Sin subsecciones</option>
                                    )}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Descripción</label>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="w-full border rounded-xl p-3 min-h-24 focus:outline-pink-500"
                                placeholder="Características, tallas, material…"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Fotos del producto</label>
                            <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-pink-300 bg-pink-50 rounded-2xl p-6 text-center cursor-pointer hover:bg-pink-100/85 transition-colors">
                                <ImagePlus size={34} className="text-pink-600" />
                                <span className="font-semibold text-slate-800">Toca para agregar más imágenes</span>
                                <span className="text-xs text-gray-500">JPG, PNG, WEBP</span>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={e => handleFileSelect(e.target.files)}
                                    className="sr-only"
                                />
                            </label>

                            {/* FOTOS EXISTENTES AL EDITAR */}
                            {existingImages.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-xs font-bold text-gray-500 mb-2">Imágenes actuales:</p>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                        {existingImages.map((src, index) => (
                                            <div key={`ex-${index}`} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-50">
                                                <img src={src} alt="Actual" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingImage(index)}
                                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 transition-colors cursor-pointer"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* NUEVAS VISTAS PREVIAS */}
                            {previews.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-xs font-bold text-gray-500 mb-2">Nuevas imágenes a subir:</p>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                        {previews.map((src, index) => (
                                            <div key={`new-${index}`} className="relative group rounded-xl overflow-hidden border border-pink-200 aspect-square bg-pink-50">
                                                <img src={src} alt="Nueva" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(index)}
                                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 transition-colors cursor-pointer"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            disabled={busy}
                            className="w-full rounded-xl pink-gradient text-white font-bold py-4 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer shadow-lg shadow-pink-500/20"
                        >
                            {busy ? (
                                <>
                                    <LoaderCircle className="animate-spin" /> Guardando cambios…
                                </>
                            ) : (
                                <>
                                    <PlusCircle /> {editingId ? "Actualizar producto" : "Guardar producto"}
                                </>
                            )}
                        </button>

                        {message && (
                            <p className={`rounded-xl p-3 text-sm flex items-center gap-2 ${error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
                                {!error && <CheckCircle2 size={18} />}
                                {message}
                            </p>
                        )}
                    </form>
                </div>

                {/* LISTADO DE PRODUCTOS PARA EDITAR O ELIMINAR */}
                <div className="bg-white rounded-3xl shadow-xl border border-pink-100 p-6 md:p-9">
                    <h2 className="text-xl font-black mb-4">Inventario de Productos ({products.length})</h2>
                    <div className="space-y-3">
                        {products.map(p => {
                            const thumb = p.image_urls?.[0] || p.image_url;
                            return (
                                <div key={p.id} className="flex items-center justify-between gap-4 p-3 border border-gray-100 rounded-2xl bg-gray-50/50 hover:bg-white transition-all">
                                    <div className="flex items-center gap-3">
                                        {thumb ? (
                                            <img src={thumb} alt={p.name} className="w-12 h-12 rounded-xl object-cover border" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-xs">Sin foto</div>
                                        )}
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-900">{p.name}</h4>
                                            <p className="text-xs text-pink-600 font-semibold">${p.price?.toLocaleString()} COP</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => startEdit(p)}
                                            className="bg-blue-50 text-blue-600 p-2.5 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer"
                                            title="Editar producto"
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className="bg-red-50 text-red-600 p-2.5 rounded-xl hover:bg-red-100 transition-colors cursor-pointer"
                                            title="Eliminar producto"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </main>
    );
}