"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import productsData from "../data/products.json";
import { ProductCard, Product } from "../components/ProductCard";
import { useApp } from "../context/AppContext";
import { ArrowRight, Sparkles, RefreshCw } from "lucide-react";

export default function Home() {
  const { t } = useApp();
  const [shuffledProducts, setShuffledProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Shuffle products on mount to show random products
  useEffect(() => {
    const list = [...productsData] as Product[];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    setShuffledProducts(list);
  }, []);

  // Progressive scroll loading (Intersection Observer)
  useEffect(() => {
    const target = observerTarget.current;
    if (!target || shuffledProducts.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < shuffledProducts.length) {
          // Add delay to simulate database load latency and show loading spinner
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + 4, shuffledProducts.length));
          }, 600);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [shuffledProducts, visibleCount]);

  const hasMore = visibleCount < shuffledProducts.length;

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Hero Section */}
      <section className="relative w-full min-h-[70vh] flex items-center bg-slate-900 text-white overflow-hidden py-16">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-banner.png"
            alt="Hero Banner"
            className="w-full h-full object-cover object-center opacity-40 dark:opacity-30 scale-105 animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center space-x-2 bg-indigo-600/30 border border-indigo-500/30 px-3.5 py-1.5 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Coleção de Verão 2026</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none text-white drop-shadow-sm">
              {t("heroTitle")}
            </h1>
            
            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
              {t("heroSub")}
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/categories"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-indigo-500/20 scale-100 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center space-x-2"
              >
                <span>{t("heroBtn")}</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
              {t("sectionFeatured")}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Descubra a nossa seleção curada de produtos atualizada em tempo real.
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {shuffledProducts.slice(0, visibleCount).map((product) => (
            <div key={product.id} className="animate-fade-in-up">
              <ProductCard product={product} imageOnly={true} />
            </div>
          ))}
        </div>

        {/* Observer Trigger Element / Loading Indicator */}
        <div ref={observerTarget} className="mt-12 flex justify-center py-6">
          {hasMore ? (
            <div className="flex flex-col items-center space-y-2 text-indigo-600 dark:text-indigo-400">
              <RefreshCw className="h-8 w-8 animate-spin" />
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                A carregar mais produtos...
              </span>
            </div>
          ) : (
            <p className="text-xs text-slate-400 dark:text-slate-500 tracking-wider">
              Mostrando todos os {shuffledProducts.length} produtos.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
