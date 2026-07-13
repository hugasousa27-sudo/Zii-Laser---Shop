"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "../context/AppContext";
import { ArrowRight, Sparkles } from "lucide-react";

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
  imageOnly?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, imageOnly = false }) => {
  const { language, t } = useApp();

  const name = language === "pt" ? product.namePt : product.nameEn;
  const mainImage = product.images[0] || "/images/placeholder.svg";

  // Category translation helper
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "Porta chaves": return t("catPortaChaves");
      case "Dia dos Namorados": return t("catDiaNamorados");
      case "Produtos de escritório": return t("catProdEscritorio");
      case "Decoração Casa": return t("catDecoracaoCasa");
      case "Lembranças": return t("catLembrancas");
      case "Para animais": return t("catParaAnimais");
      case "Caixas": return t("catCaixas");
      case "Natal": return t("catNatal");
      case "Dia das Bruxas": return t("catDiaBruxas");
      default: return cat;
    }
  };

  if (imageOnly) {
    return (
      <Link
        href={`/product/${product.id}`}
        className="group relative bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 flex items-center justify-center aspect-square"
      >
        <img
          src={mainImage}
          alt={name}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Hover overlay with product name and price on the same line */}
        <div className="absolute inset-0 bg-white/95 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4 z-20">
          <div className="flex items-center justify-between w-full gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <span className="text-sm font-bold tracking-tight line-clamp-1 text-left flex-1" style={{ color: '#272727' }}>
              {name}
            </span>
            <span className="text-sm font-extrabold whitespace-nowrap text-right" style={{ color: '#272727' }}>
              {product.price.toLocaleString(language === "pt" ? "pt-PT" : "en-US", {
                style: "currency",
                currency: "EUR",
              })}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 flex flex-col h-full">
      {/* Product Image */}
      <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-950 overflow-hidden">
        {/* Featured Tag */}
        {product.featured && (
          <div className="absolute top-3 left-3 z-10 bg-amber-700 text-white text-[10px] font-black tracking-widest uppercase py-1 px-2.5 rounded-full flex items-center gap-1 shadow-sm">
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
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-base font-semibold mb-1 transition-colors line-clamp-1" style={{ color: '#272727' }}>
          {name}
        </h3>

        <p className="text-sm mb-4 line-clamp-2 font-medium" style={{ color: '#272727' }}>
          {language === "pt" ? product.descriptionPt : product.descriptionEn}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-extrabold text-slate-900 dark:text-slate-50">
            {product.price.toLocaleString(language === "pt" ? "pt-PT" : "en-US", {
              style: "currency",
              currency: "EUR",
            })}
          </span>

          <Link
            href={`/product/${product.id}`}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 flex items-center gap-0.5 group-hover:translate-x-1 transition-all"
          >
            <span>{t("btnViewProduct")}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
