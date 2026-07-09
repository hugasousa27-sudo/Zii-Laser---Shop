"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import productsData from "../data/products.json";
import { ProductCard, Product } from "../components/ProductCard";
import { useApp } from "../context/AppContext";
import { Sparkles, RefreshCw } from "lucide-react";

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
      <section className="relative w-full min-h-[50vh] md:min-h-[60vh] lg:min-h-[65vh] flex items-center bg-neutral-900 text-white overflow-hidden pt-20 pb-12 md:pb-16">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/florest.jpg"
            alt="Hero Banner"
            className="w-full h-full object-cover object-center opacity-75 scale-105 animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center space-x-2 bg-amber-700/30 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-amber-300 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Novidades em breve! Dia 01/09/2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none text-white drop-shadow-sm">
              {t("heroTitle")}
            </h1>

            <p className="text-base sm:text-lg text-white font-semibold leading-relaxed drop-shadow-sm">
              Descobre as nossas peças
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/categories"
                className="galaxy-btn relative"
              >
                <div id="container-stars">
                  <div id="stars"></div>
                </div>
                <div id="glow">
                  <div className="circle"></div>
                  <div className="circle"></div>
                </div>
                <strong>{t("heroBtn")}</strong>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Discount Banner */}
      <section className="w-full py-4 px-4" style={{ background: 'linear-gradient(to right, #815438, #B9844F, #815438)' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
          <span className="text-2xl">🎁</span>
          <p className="font-bold text-sm sm:text-base" style={{ color: '#F5EDE3' }}>
            Receba <span className="text-lg font-black" style={{ color: '#FFE4B5' }}>10% de desconto</span> na primeira compra!
          </p>
          <a
            href="/contact"
            className="ml-0 sm:ml-4 font-black text-xs uppercase tracking-widest px-5 py-2 rounded-full hover:scale-105 active:scale-95 transition-all duration-200 shadow"
            style={{ backgroundColor: '#F5EDE3', color: '#815438' }}
          >
            Quero o desconto →
          </a>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="w-full border-b bg-transparent" style={{ borderColor: '#272727' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-center text-xl font-black uppercase tracking-widest mb-8" style={{ color: 'var(--muted)' }}>
            Porquê comprar na <span style={{ color: 'var(--primary)' }}>Zii Laser</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Badge 1 */}
            <div className="group flex flex-col items-center text-center p-6 rounded-2xl border hover:shadow-lg hover:-translate-y-1 transition-all duration-300" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: 'var(--accent)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" style={{ color: 'var(--primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-extrabold text-sm uppercase tracking-wide mb-1" style={{ color: 'var(--foreground)' }}>Envios no próprio dia</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>Encomendas pagas até às 12H</p>
            </div>

            {/* Badge 2 */}
            <div className="group flex flex-col items-center text-center p-6 rounded-2xl border hover:shadow-lg hover:-translate-y-1 transition-all duration-300" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: 'var(--accent)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" style={{ color: 'var(--primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-extrabold text-sm uppercase tracking-wide mb-1" style={{ color: 'var(--foreground)' }}>Worldwide Shipping</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>Açores, Madeira, Europa, Brasil, EUA e muitos mais</p>
            </div>

            {/* Badge 3 */}
            <div className="group flex flex-col items-center text-center p-6 rounded-2xl border hover:shadow-lg hover:-translate-y-1 transition-all duration-300" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: 'var(--accent)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" style={{ color: 'var(--primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-extrabold text-sm uppercase tracking-wide mb-1" style={{ color: 'var(--foreground)' }}>Pagamentos 100% Seguros</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>MB, MBWAY, PAYPAL ou Cartão de Crédito protegidos por SSL</p>
            </div>

            {/* Badge 4 */}
            <div className="group flex flex-col items-center text-center p-6 rounded-2xl border hover:shadow-lg hover:-translate-y-1 transition-all duration-300" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: 'var(--accent)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" style={{ color: 'var(--primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-extrabold text-sm uppercase tracking-wide mb-1" style={{ color: 'var(--foreground)' }}>Proteção ao Cliente</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>Devolva em 14 dias. Troque em 30 dias, sem perguntas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-5 border-b animate-fade-in" style={{ borderColor: '#272727' }}>
          <div className="flex flex-col gap-1 w-full">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight on-bg-blur" style={{ color: 'var(--foreground)' }}>
                {t("sectionFeatured")}
              </h2>
            </div>
            <div>
              <p className="text-base mt-2 font-medium on-bg-blur" style={{ color: 'var(--foreground)' }}>
                Navegue pelos nossos produtos, não se esqueça que pode sempre personalizar ao seu gosto.
              </p>
            </div>
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
            <div className="flex flex-col items-center space-y-2 text-amber-700 dark:text-amber-400">
              <RefreshCw className="h-8 w-8 animate-spin" />
              <span className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--foreground)' }}>
                A carregar mais produtos...
              </span>
            </div>
          ) : (
            <p className="text-sm font-bold tracking-wider" style={{ color: 'var(--foreground)' }}>
              Mostrando todos os {shuffledProducts.length} produtos.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
