"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import productsData from "../../data/products.json";
import { ProductCard, Product } from "../../components/ProductCard";
import { useApp } from "../../context/AppContext";
import { ArrowRight, Tag, Layers, Filter, X, Key, Heart, Briefcase, Home, Gift, PawPrint, Package, Trees, Ghost } from "lucide-react";

interface CategoryInfo {
  id: string;
  nameKey: string;
  slug: string | null;
  icon: React.ComponentType<any>;
  gradient: string;
  image?: string;
}

function CategoriesContent() {
  const { t } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const categoryParam = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(() => {
    const allProducts = productsData as Product[];
    if (categoryParam) {
      return allProducts.filter(p => p.category === categoryParam);
    }
    return allProducts;
  });
  // Start with popup closed since we now have the dropdown in the header
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const categories: CategoryInfo[] = [
    { id: "all", nameKey: "catTodosProdutos", slug: null, icon: Layers, gradient: "from-indigo-700 to-indigo-900", image: "/images/cat-todos.jpg" },
    { id: "1", nameKey: "catPortaChaves", slug: "Porta chaves", icon: Key, gradient: "from-amber-600 to-amber-800", image: "/images/cat-portachaves.jpg" },
    { id: "2", nameKey: "catDiaNamorados", slug: "Dia dos Namorados", icon: Heart, gradient: "from-amber-700 to-red-800", image: "/images/cat-presente.jpg" },
    { id: "3", nameKey: "catProdEscritorio", slug: "Produtos de escritório", icon: Briefcase, gradient: "from-indigo-500 to-indigo-700", image: "/images/cat-escritorio.jpg" },
    { id: "4", nameKey: "catDecoracaoCasa", slug: "Decoração Casa", icon: Home, gradient: "from-amber-800 to-indigo-600", image: "/images/cat-decoracao.jpg" },
    { id: "5", nameKey: "catLembrancas", slug: "Lembranças", icon: Gift, gradient: "from-amber-500 to-indigo-500", image: "/images/cat-presente.jpg" },
    { id: "6", nameKey: "catParaAnimais", slug: "Para animais", icon: PawPrint, gradient: "from-amber-700 to-amber-900", image: "/images/cat-pets.jpg" },
    { id: "7", nameKey: "catCaixas", slug: "Caixas", icon: Package, gradient: "from-stone-600 to-stone-800", image: "/images/cat-boxs.jpg" },
    { id: "8", nameKey: "catNatal", slug: "Natal", icon: Trees, gradient: "from-emerald-800 to-indigo-700", image: "/images/cat-natal.jpg" }
  ];

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    const allProducts = productsData as Product[];
    if (selectedCategory) {
      setFilteredProducts(allProducts.filter(p => p.category === selectedCategory));
    } else {
      setFilteredProducts(allProducts);
    }
  }, [selectedCategory]);

  const handleSelectCategory = (slug: string | null) => {
    setSelectedCategory(slug);
    setIsPopupOpen(false);

    // Update URL so it persists when going back
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 w-full">
        {/* Title */}
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight flex items-center justify-center md:justify-start gap-2" style={{ color: '#272727' }}>
              <Layers className="h-8 w-8 text-amber-700 dark:text-amber-400" />
              <span>{t("navCategories")}</span>
            </h1>
            <p className="mt-2 max-w-xl font-medium" style={{ color: '#272727' }}>
              Navegue pelos nossos produtos, não se esqueça que pode sempre personalizar ao seu gosto.
            </p>
          </div>
          <button
            onClick={() => setIsPopupOpen(true)}
            className="bg-amber-700 hover:bg-amber-800 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-amber-500/20 active:scale-95 transition-all text-sm whitespace-nowrap self-center md:self-auto"
          >
            Selecionar Categoria
          </button>
        </div>

        {/* Filter Header & Products */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5 mb-8">
            <h2 className="text-2xl font-extrabold flex items-center gap-2" style={{ color: '#272727' }}>
              <Filter className="h-5 w-5 text-slate-400" />
              {selectedCategory ? (
                <span>
                  {t("navCategories")}: <span className="text-amber-700 dark:text-amber-400">{selectedCategory}</span>
                </span>
              ) : (
                <span>Todos os Produtos</span>
              )}
            </h2>

            {/* Reset Filter Button */}
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-xs font-bold text-slate-500 hover:text-amber-700 dark:text-slate-400 dark:hover:text-amber-400 flex items-center gap-1 bg-slate-100 dark:bg-slate-850 px-3 py-1.5 rounded-full"
              >
                Clear Filter
              </button>
            )}
          </div>

          {/* Dynamic Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredProducts.map((product) => (
                <div key={product.id} className="animate-fade-in-up">
                  <ProductCard product={product} imageOnly={true} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl animate-fade-in">
              <Tag className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Nenhum produto encontrado nesta categoria de momento.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Category Modal Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          {/* Backdrop click to close */}
          <div className="absolute inset-0 cursor-pointer" onClick={() => setIsPopupOpen(false)} />

          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto animate-scale-up border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">Selecione uma Categoria</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Escolha uma categoria para filtrar os nossos produtos premium.</p>
              </div>
              <button
                onClick={() => setIsPopupOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 mb-6">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.slug)}
                    className={`group relative text-left rounded-2xl overflow-hidden border transition-all duration-300 shadow-sm hover:shadow-md ${isSelected
                        ? "border-amber-700 dark:border-amber-500 ring-2 ring-amber-600/20"
                        : "border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700"
                      }`}
                  >
                    {/* Category Vector Gradient Background */}
                    <div className={`aspect-[4/3] w-full bg-gradient-to-br ${cat.gradient} flex items-center justify-center relative`}>
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={t(cat.nameKey)}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-black/10 opacity-40 group-hover:opacity-10 transition-opacity duration-300" />
                          <Icon className="h-12 w-12 text-white drop-shadow-md relative z-20 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                        </>
                      )}
                    </div>

                    {/* Title */}
                    <div className="p-4 bg-white dark:bg-slate-900 flex justify-between items-center">
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-50 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                        {t(cat.nameKey)}
                      </span>
                      <ArrowRight className="h-4 w-4 text-slate-300 dark:text-slate-600 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function Categories() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-12 text-slate-500">A carregar categorias...</div>}>
      <CategoriesContent />
    </Suspense>
  );
}
