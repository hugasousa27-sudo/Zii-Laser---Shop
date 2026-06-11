"use client";

import React, { useState, useEffect } from "react";
import productsData from "../../data/products.json";
import { ProductCard, Product } from "../../components/ProductCard";
import { useApp } from "../../context/AppContext";
import { ArrowRight, Tag, Layers, Filter } from "lucide-react";

interface CategoryInfo {
  id: string;
  nameKey: string;
  image: string;
  slug: string; // matches product.category
}

export default function Categories() {
  const { t } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const categories: CategoryInfo[] = [
    { id: "1", nameKey: "catRoupa", image: "/images/cat-clothing.svg", slug: "Roupa" },
    { id: "2", nameKey: "catCalcado", image: "/images/cat-footwear.svg", slug: "Calçado" },
    { id: "3", nameKey: "catAcessorios", image: "/images/cat-accessories.svg", slug: "Acessórios" },
    { id: "4", nameKey: "catTecnologia", image: "/images/cat-technology.svg", slug: "Tecnologia" },
    { id: "5", nameKey: "catGaming", image: "/images/cat-gaming.svg", slug: "Gaming" },
    { id: "6", nameKey: "catCasa", image: "/images/cat-home.svg", slug: "Casa e Decoração" },
    { id: "7", nameKey: "catDesporto", image: "/images/cat-sports.svg", slug: "Desporto" },
    { id: "8", nameKey: "catAutomovel", image: "/images/cat-auto.svg", slug: "Automóvel" },
    { id: "9", nameKey: "catBeleza", image: "/images/cat-beauty.svg", slug: "Beleza" },
    { id: "10", nameKey: "catPromocoes", image: "/images/cat-sales.svg", slug: "Promoções" }
  ];

  useEffect(() => {
    const allProducts = productsData as Product[];
    if (selectedCategory) {
      setFilteredProducts(allProducts.filter(p => p.category === selectedCategory));
    } else {
      setFilteredProducts(allProducts);
    }
  }, [selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      {/* Title */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50 flex items-center justify-center md:justify-start gap-2">
          <Layers className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          <span>{t("navCategories")}</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
          Navegue pelas nossas coleções especializadas e descubra artigos exclusivos adaptados ao seu estilo de vida.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 mb-16">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(isSelected ? null : cat.slug)}
              className={`group relative text-left bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border transition-all duration-300 shadow-sm hover:shadow-md ${
                isSelected
                  ? "border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-600/20"
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              {/* Category Image */}
              <div className="aspect-[4/3] w-full bg-slate-100 dark:bg-slate-950 overflow-hidden relative">
                <img
                  src={cat.image}
                  alt={t(cat.nameKey)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              </div>

              {/* Title & Action */}
              <div className="p-4 flex flex-col justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-slate-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {t(cat.nameKey)}
                </span>
                
                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-widest flex items-center gap-1 group-hover:text-indigo-500 transition-colors">
                  <span>{t("catViewBtn")}</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter Header & Products */}
      <div>
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5 mb-8">
          <h2 className="text-2xl font-extrabold text-slate-950 dark:text-slate-50 flex items-center gap-2">
            <Filter className="h-5 w-5 text-slate-400" />
            {selectedCategory ? (
              <span>
                {t("navCategories")}: <span className="text-indigo-600 dark:text-indigo-400">{selectedCategory}</span>
              </span>
            ) : (
              <span>Todos os Produtos</span>
            )}
          </h2>

          {/* Reset Filter Button */}
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 flex items-center gap-1 bg-slate-100 dark:bg-slate-850 px-3 py-1.5 rounded-full"
            >
              Clear Filter
            </button>
          )}
        </div>

        {/* Dynamic Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="animate-fade-in-up">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
            <Tag className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Nenhum produto encontrado nesta categoria de momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
