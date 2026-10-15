"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ImagePlus, LoaderCircle, PlusCircle, CheckCircle2, X } from "lucide-react";

type CategoryStructure = {
    name: string;
    subcategories: string[];
};

// Mismas categorías y subsecciones definidas en el catálogo de la tienda
const categoryStructure: CategoryStructure[] = [
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

export default function Admin() {
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("Juguetes");
    const [subcategory, setSubcategory] = useState("Vibradores");
    const [description, setDescription] = useState("");

    // Soporte para múltiples archivos e imágenes de vista previa
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);

    // Manejar la selección de la categoría principal y reiniciar la subcategoría adecuada
    function handleCategoryChange(newCat: string) {
        setCategory(newCat);
        const catObj = categoryStructure.find(c => c.name === newCat);
        if (catObj && catObj.subcategories.length > 0) {
            setSubcategory(catObj.subcategories[0]);
        } else {
            setSubcategory("");
        }
    }

    // Manejar selección de múltiples fotos
    function handleFileSelect(selectedFiles: FileList | null) {
        if (!selectedFiles) return;
        const newFiles = Array.from(selectedFiles);

        setFiles(prev => [...prev, ...newFiles]);

        const newPreviews = newFiles.map(f => URL.createObjectURL(f));
        setPreviews(prev => [...prev, ...newPreviews]);
    }

    // Eliminar una imagen individual seleccionada
    function removeImage(index: number) {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setBusy(true);
        setMessage("");
        setError(false);

        try {
            const uploadedUrls: string[] = [];

            // Subir todas las imágenes seleccionadas a la API
            for (const file of files) {
                const fd = new FormData();
                fd.append("file", file);
                const up = await fetch("/api/upload", {
                    method: "POST",
                    headers: { "x-admin-password": password },
                    body: fd
                });
                const ud = await up.json();
                if (!up.ok) throw new Error(ud.error || `Error subiendo la imagen ${file.name}`);
                uploadedUrls.push(ud.url);
            }

            // Guardar el producto con sus múltiples URLs de imagen y subcategoría
            const r = await fetch("/api/products", {
                method: "POST",
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
                    image_url: uploadedUrls[0] || "", // Mantener compatibilidad con la primera foto
                    image_urls: uploadedUrls           // Arreglo completo de imágenes
                })
            });

            const d = await r.json();
            if (!r.ok) throw new Error(d.error || "No se pudo guardar el producto");

            setMessage("¡Producto guardado exitosamente con todas sus fotos!");
            setName("");
            setPrice("");
            setDescription("");
            setFiles([]);
            setPreviews([]);
        } catch (err) {
            setError(true);
            setMessage(err instanceof Error ? err.message : "Ocurrió un error al guardar");
        } finally {
            setBusy(false);
        }
    }

    const currentCategoryObj = categoryStructure.find(c => c.name === category);

    return (
        <main className="min-h-screen bg-gradient-to-br from-rose-50 to-white p-5 md:p-10">
            <div className="max-w-2xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-pink-700 mb-7 hover:underline">
                    <ArrowLeft size={18} /> Volver a la tienda
                </Link>

                <div className="bg-white rounded-3xl soft-shadow p-6 md:p-9 border border-pink-100">
                    <div className="brand-script text-4xl text-pink-600">Stefmol</div>
                    <h1 className="text-2xl font-black mt-2">Administrar productos</h1>
                    <p className="text-gray-500 text-sm mt-2">
                        Sube fotos directamente desde la galería del celular o desde tu computador.
                    </p>

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
                            <label className="block text-sm font-semibold mb-2">Fotos del producto (puedes elegir varias)</label>
                            <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-pink-300 bg-pink-50 rounded-2xl p-6 text-center cursor-pointer hover:bg-pink-100/80 transition-colors">
                                <ImagePlus size={34} className="text-pink-600" />
                                <span className="font-semibold text-slate-800">
                                    {files.length > 0 ? `${files.length} foto(s) seleccionada(s)` : "Toca para elegir imágenes"}
                                </span>
                                <span className="text-xs text-gray-500">JPG, PNG, WEBP · Puedes seleccionar múltiples fotos</span>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={e => handleFileSelect(e.target.files)}
                                    className="sr-only"
                                />
                            </label>

                            {/* VISTAS PREVIAS DE MÚLTIPLES FOTOS */}
                            {previews.length > 0 && (
                                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
                                    {previews.map((src, index) => (
                                        <div key={index} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-50">
                                            <img src={src} alt={`Vista previa ${index + 1}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            disabled={busy}
                            className="w-full rounded-xl pink-gradient text-white font-bold py-4 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer shadow-lg shadow-pink-500/20"
                        >
                            {busy ? (
                                <>
                                    <LoaderCircle className="animate-spin" /> Guardando producto…
                                </>
                            ) : (
                                <>
                                    <PlusCircle /> Guardar producto
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

                <p className="text-xs text-gray-500 mt-5 text-center">
                    Consejo: usa fotos propias o imágenes que tengas autorización para publicar.
                </p>
            </div>
        </main>
    );
}