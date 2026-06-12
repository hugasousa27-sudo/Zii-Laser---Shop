"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "../context/AppContext";
import { ArrowRight, Sparkles, RotateCw, X } from "lucide-react";
import { Viewer360 } from "./Viewer360";

export interface Product {
  id: string;
  namePt: string;
  nameEn: string;
  descriptionPt: string;
  descriptionEn: string;
  price: number;
  category: string;
  sizes: string[];
  colors: string[];
  images: string[];
  featured: boolean;
  has360: boolean;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language, t } = useApp();
  const [is360ModalOpen, setIs360ModalOpen] = useState(false);

  useEffect(() => {
    if (is360ModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [is360ModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIs360ModalOpen(false);
      }
    };
    if (is360ModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [is360ModalOpen]);

  const name = language === "pt" ? product.namePt : product.nameEn;
  const mainImage = product.images[0] || "/images/placeholder.svg";

  // Category translation helper
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "Roupa": return t("catRoupa");
      case "Calçado": return t("catCalcado");
      case "Acessórios": return t("catAcessorios");
      case "Tecnologia": return t("catTecnologia");
      case "Gaming": return t("catGaming");
      case "Casa e Decoração": return t("catCasa");
      case "Desporto": return t("catDesporto");
      case "Automóvel": return t("catAutomovel");
      case "Beleza": return t("catBeleza");
      case "Promoções": return t("catPromocoes");
      default: return cat;
    }
  };

  return (
    <>
      <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 flex flex-col h-full">
        {/* Product Image */}
        <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-950 overflow-hidden">
          {/* Featured Tag */}
          {product.featured && (
            <div className="absolute top-3 left-3 z-10 bg-indigo-600 text-white text-[10px] font-black tracking-widest uppercase py-1 px-2.5 rounded-full flex items-center gap-1 shadow-sm">
              <Sparkles className="h-3 w-3" />
              <span>Featured</span>
            </div>
          )}
          
          {/* Category Tag */}
          <div className="absolute top-3 right-3 z-10 bg-slate-900/60 backdrop-blur-md text-white text-[10px] font-bold py-1 px-2.5 rounded-full uppercase tracking-wider">
            {getCategoryLabel(product.category)}
          </div>

          {/* Image element */}
          <img
            src={mainImage}
            alt={name}
            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-out"
            loading="lazy"
          />

          {/* Hover overlay button */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Link
              href={`/product/${product.id}`}
              className="bg-white text-slate-900 font-bold px-5 py-2.5 rounded-full shadow-lg scale-90 group-hover:scale-100 hover:bg-slate-100 transition-all duration-300 flex items-center space-x-2 text-sm"
            >
              <span>{t("btnViewProduct")}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* 360° Option floating button */}
          {product.has360 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIs360ModalOpen(true);
              }}
              className="absolute bottom-3 right-3 z-20 flex items-center justify-center bg-white/95 hover:bg-indigo-650 dark:bg-slate-900/95 dark:hover:bg-indigo-600 border border-slate-200 dark:border-slate-800 shadow-md p-2.5 rounded-full hover:scale-110 active:scale-95 transition-all text-slate-850 dark:text-slate-100 hover:text-white dark:hover:text-white group cursor-pointer"
              title={t("btnOpen360")}
            >
              <RotateCw className="h-4 w-4 animate-spin-slow group-hover:rotate-180 transition-transform duration-700" />
              <span className="sr-only">360° View</span>
            </button>
          )}
        </div>

        {/* Info */}
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
            {name}
          </h3>
          
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
            {language === "pt" ? product.descriptionPt : product.descriptionEn}
          </p>

          <div className="mt-auto flex items-center justify-between">
            <span className="text-lg font-black text-slate-900 dark:text-slate-50 font-mono">
              {product.price.toLocaleString(language === "pt" ? "pt-PT" : "en-US", {
                style: "currency",
                currency: "EUR",
              })}
            </span>
            
            <Link
              href={`/product/${product.id}`}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-0.5 group-hover:translate-x-1 transition-all"
            >
              <span>{t("btnViewProduct")}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 360 Interactive Modal Overlay */}
      {is360ModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300">
          {/* Backdrop clickable zone */}
          <div
            className="absolute inset-0 cursor-default"
            onClick={() => setIs360ModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 flex flex-col shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-black text-slate-950 dark:text-slate-50">
                  {name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {t("view360")}
                </p>
              </div>
              <button
                onClick={() => setIs360ModalOpen(false)}
                className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-850 dark:hover:text-white transition-colors border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                title={t("close")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Body: Large 360 Viewer */}
            <div className="flex-grow flex items-center justify-center py-2">
              <Viewer360 productId={product.id} productName={name} isModal={true} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
