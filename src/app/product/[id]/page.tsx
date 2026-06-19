"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import productsData from "../../../data/products.json";
import { Viewer360 } from "../../../components/Viewer360";
import { useApp } from "../../../context/AppContext";
import { Product } from "../../../components/ProductCard";
import { ShoppingCart, Plus, Minus, ArrowLeft, RefreshCw, CheckCircle, RotateCw, X } from "lucide-react";

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const { language, addToCart, t } = useApp();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [customSizeText, setCustomSizeText] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [customColorText, setCustomColorText] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);
  const [is360ModalOpen, setIs360ModalOpen] = useState(false);

  useEffect(() => {
    const foundProduct = productsData.find((p) => p.id === params.id) as Product;
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedImage(foundProduct.images[0]);
      
      // Select first options by default
      if (foundProduct.sizes.length > 0) {
        setSelectedSize(foundProduct.sizes[0]);
      }
      if (foundProduct.colors.length > 0) {
        setSelectedColor(foundProduct.colors[0]);
      }

    }
  }, [params.id]);

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

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center text-indigo-600 dark:text-indigo-400">
        <RefreshCw className="h-10 w-10 animate-spin mb-4" />
        <p className="text-slate-500 font-semibold">Carregando produto...</p>
      </div>
    );
  }

  const name = language === "pt" ? product.namePt : product.nameEn;
  const description = language === "pt" ? product.descriptionPt : product.descriptionEn;

  // Handles quantity changes
  const changeQuantity = (val: number) => {
    setQuantity((prev) => Math.max(1, prev + val));
  };

  // Handles adding to cart
  const handleAddToCart = () => {
    const finalSize = selectedSize === "Personalizado" ? `${t("customOption")} (${customSizeText.trim() || "N/A"})` : selectedSize;
    const finalColor = selectedColor === "Personalizado" ? `${t("customOption")} (${customColorText.trim() || "N/A"})` : selectedColor;
    const customText = customSizeText || customColorText ? `${customSizeText} / ${customColorText}` : "";

    addToCart({
      id: product.id,
      namePt: product.namePt,
      nameEn: product.nameEn,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
      selectedSize: finalSize,
      selectedColor: finalColor,
      customText: customText
    });

    setAddedMessage(true);
    setTimeout(() => {
      setAddedMessage(false);
    }, 8000);
  };

  // Size helper
  const isSizeCustom = selectedSize === "Personalizado";
  // Color helper
  const isColorCustom = selectedColor === "Personalizado";

  // Formatted price total
  const totalPrice = product.price * quantity;

  // Return background class matching text color name
  const getColorBadgeClass = (colorName: string) => {
    switch (colorName.toLowerCase()) {
      case "preto": return "bg-black text-white";
      case "branco": return "bg-white text-slate-800 border border-slate-300";
      case "azul": return "bg-blue-600 text-white";
      case "vermelho": return "bg-red-600 text-white";
      default: return "bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
      {/* Back Link */}
      <button
        onClick={() => router.back()}
        className="flex items-center space-x-2 text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 mb-8 font-semibold transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>{t("btnBack")}</span>
      </button>

      {/* Main Details layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Media (Gallery & 360 Viewer) */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          {/* Viewer area */}
          <div className="w-full flex justify-center">
            <div className="relative w-full aspect-square max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-sm flex items-center justify-center">
              <img
                src={selectedImage}
                alt={name}
                className="w-full h-full object-cover object-center"
              />
              
              {product.has360 && (
                <button
                  onClick={() => setIs360ModalOpen(true)}
                  className="absolute bottom-4 right-4 z-10 flex items-center justify-center bg-white/95 hover:bg-indigo-650 dark:bg-slate-900/95 dark:hover:bg-indigo-600 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-indigo-500/20 px-4 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-all text-slate-850 dark:text-slate-100 hover:text-white dark:hover:text-white group font-extrabold text-xs tracking-wider gap-2 cursor-pointer"
                  title={t("btnOpen360")}
                >
                  <RotateCw className="h-4 w-4 animate-spin-slow group-hover:rotate-180 transition-transform duration-700" />
                  <span>360°</span>
                </button>
              )}
            </div>
          </div>

          {/* Secondary Thumbnail Gallery */}
          {product.images.length > 1 && (
            <div className="flex justify-center space-x-3 overflow-x-auto py-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 bg-white dark:bg-slate-900 border-2 rounded-xl overflow-hidden transition-all flex-shrink-0 ${
                    selectedImage === img
                      ? "border-indigo-600 dark:border-indigo-500 scale-105"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-350"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${name} thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Info & Action Card */}
        <div className="lg:col-span-5 flex flex-col justify-start space-y-6">
          <div>
            {/* Category */}
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-widest uppercase">
              {product.category}
            </span>
            {/* Name */}
            <h1 className="text-3xl font-black text-slate-950 dark:text-slate-50 mt-1 mb-2">
              {name}
            </h1>
            {/* Price */}
            <div className="text-2xl font-black text-slate-900 dark:text-slate-50 font-mono">
              {product.price.toLocaleString(language === "pt" ? "pt-PT" : "en-US", {
                style: "currency",
                currency: "EUR",
              })}
            </div>
          </div>

          {/* Description */}
          <div className="text-sm text-slate-600 dark:text-slate-450 leading-relaxed border-t border-slate-200 dark:border-slate-800/80 pt-4">
            {description}
          </div>

          {/* Configurable Options */}
          <div className="space-y-5 border-t border-slate-200 dark:border-slate-800/80 pt-5">
            {/* Size Selector */}
            {product.sizes.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  {t("labelSize")}
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        if (size !== "Personalizado") setCustomSizeText("");
                      }}
                      className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${
                        selectedSize === size
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-850 text-slate-800 dark:text-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {size === "Personalizado" ? t("customOption") : size}
                    </button>
                  ))}
                </div>

                {/* Custom Size Text Input */}
                {isSizeCustom && (
                  <div className="pt-2 animate-fade-in-down">
                    <input
                      type="text"
                      value={customSizeText}
                      onChange={(e) => setCustomSizeText(e.target.value)}
                      placeholder={t("customPlaceholder")}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-600 transition-colors"
                      required
                    />
                  </div>
                )}
              </div>
            )}

            {/* Color Selector */}
            {product.colors.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  {t("labelColor")}
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor === color;
                    return (
                      <button
                        key={color}
                        onClick={() => {
                          setSelectedColor(color);
                          if (color !== "Personalizado") setCustomColorText("");
                        }}
                        className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all flex items-center space-x-2 ${
                          isSelected
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-850 text-slate-800 dark:text-slate-200 hover:border-slate-350"
                        }`}
                      >
                        {color !== "Personalizado" && (
                          <span className={`h-3 w-3 rounded-full flex-shrink-0 ${getColorBadgeClass(color)}`} />
                        )}
                        <span>{color === "Personalizado" ? t("customOption") : color}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Color Text Input */}
                {isColorCustom && (
                  <div className="pt-2 animate-fade-in-down">
                    <input
                      type="text"
                      value={customColorText}
                      onChange={(e) => setCustomColorText(e.target.value)}
                      placeholder={t("customPlaceholder")}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-600 transition-colors"
                      required
                    />
                  </div>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                {t("labelQuantity")}
              </span>
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
                  <button
                    onClick={() => changeQuantity(-1)}
                    className="p-3 text-slate-500 hover:text-slate-850 dark:hover:text-white transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 font-black text-sm text-slate-900 dark:text-slate-100 font-mono w-12 text-center select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={() => changeQuantity(1)}
                    className="p-3 text-slate-500 hover:text-slate-850 dark:hover:text-white transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-xs text-slate-400 font-medium">
                  {quantity} x {product.price.toLocaleString(language === "pt" ? "pt-PT" : "en-US", { style: "currency", currency: "EUR" })}
                </div>
              </div>
            </div>
          </div>

          {/* Add to Cart Drawer/Card */}
          <div className="border-t border-slate-200 dark:border-slate-800/80 pt-6 flex flex-col space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-slate-500">{t("summaryTotal")}</span>
              <span className="text-2xl font-black text-slate-950 dark:text-slate-50 font-mono">
                {totalPrice.toLocaleString(language === "pt" ? "pt-PT" : "en-US", {
                  style: "currency",
                  currency: "EUR",
                })}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-4 px-6 rounded-2xl shadow-lg hover:shadow-indigo-500/20 active:scale-98 transition-all flex items-center justify-center space-x-2 text-base"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>{t("btnAddToCart")}</span>
            </button>

          </div>
        </div>
      </div>

      {/* Add to Cart Side Popup */}
      {addedMessage && (
        <div className="fixed top-24 right-4 md:right-8 z-[100] w-80 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-5 shadow-2xl animate-[slideInRight_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <span className="font-bold text-sm">Adicionado ao carrinho!</span>
            </div>
            <button onClick={() => setAddedMessage(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 bg-slate-50 dark:bg-slate-800 rounded-full">
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-4 mb-5 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <img src={selectedImage} alt={name} className="w-14 h-14 rounded-lg object-cover border border-slate-200 dark:border-slate-700" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{name}</p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{quantity} x {product.price.toLocaleString(language === "pt" ? "pt-PT" : "en-US", { style: "currency", currency: "EUR" })}</p>
            </div>
          </div>

          <div className="flex flex-col space-y-2.5">
            <button
              onClick={() => router.push('/cart')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl shadow-lg shadow-emerald-600/20 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Comprar já
            </button>
            <button
              onClick={() => setAddedMessage(false)}
              className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3 rounded-xl active:scale-95 transition-all text-sm"
            >
              Continuar a ver a loja
            </button>
          </div>
        </div>
      )}

      {/* 360 Interactive Modal Overlay */}
      {is360ModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-950/90 backdrop-blur-sm transition-opacity duration-300">
          {/* Backdrop clickable zone */}
          <div
            className="absolute inset-0 cursor-default"
            onClick={() => setIs360ModalOpen(false)}
          />

          {/* Close button in the top-right corner */}
          <button
            onClick={() => setIs360ModalOpen(false)}
            className="absolute top-6 right-6 z-50 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            title={t("close")}
          >
            <X className="h-8 w-8" />
          </button>

          {/* Modal Container */}
          <div className="relative w-full max-w-[95vw] lg:max-w-6xl flex flex-col items-center justify-center z-10 max-h-[90vh]">
            {/* Content Body: Large 360 Viewer */}
            <div className="w-full flex-grow flex flex-col items-center justify-center">
              <Viewer360 productId={product.id} productName={name} isModal={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
