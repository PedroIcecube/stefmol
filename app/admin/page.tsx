"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Plus, Trash, ArrowLeft, Package } from "lucide-react";

export default function AdminPage() {
    const [selectedCategory, setSelectedCategory] = useState("Todas");

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Encabezado */}
                <div className="flex items-center justify-between border-b border-rose-950/40 pb-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="p-2 rounded-xl bg-slate-900 border border-rose-950/40 text-slate-300 hover:text-white"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Heart className="w-6 h-6 text-rose-500" />
                            <span>Panel de Administración</span>
                        </h1>
                    </div>

                    <button className="px-4 py-2 rounded-xl bg-rose-600 text-white font-medium text-sm flex items-center gap-2 hover:bg-rose-500 transition-colors">
                        <Plus className="w-4 h-4" />
                        <span>Nuevo Producto</span>
                    </button>
                </div>

                {/* Filtros rápidos */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {["Todas", "Promociones del Mes", "Juguetes", "Lubricantes"].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === cat
                                    ? "bg-rose-900 text-white border border-rose-700"
                                    : "bg-slate-900 text-slate-400 border border-rose-950/30 hover:bg-slate-800"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Mensaje de estado */}
                <div className="bg-slate-900/60 border border-rose-950/40 rounded-2xl p-8 text-center space-y-3">
                    <Package className="w-10 h-10 text-rose-500 mx-auto opacity-80" />
                    <h3 className="text-lg font-semibold text-white">Gestión de Inventario</h3>
                    <p className="text-slate-400 text-sm max-w-md mx-auto">
                        Categoría seleccionada: <span className="text-rose-400 font-medium">{selectedCategory}</span>. Desde aquí podrás agregar, editar y eliminar productos de la tienda.
                    </p>
                </div>

            </div>
        </div>
    );
}