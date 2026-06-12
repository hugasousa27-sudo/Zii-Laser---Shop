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
  const [activeTab, setActiveTab] = useState<"standard" | "360">("standard");
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
      
      // If product only has 360 view (or starts with it), set tab
      if (foundProduct.has360 && foundProduct.images.length === 0) {
        setActiveTab("360");
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
    }, 3000);
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
        <span>{t("navHome")}</span>
      </button>

      {/* Main Details layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Media (Gallery & 360 Viewer) */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          {/* Main Viewer Switcher Tabs */}
          {product.has360 && (
            <div className="flex space-x-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl w-fit self-center">
              <button
                onClick={() => setActiveTab("standard")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "standard"
                    ? "bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                {t("viewStatic")}
              </button>
              <button
                onClick={() => setActiveTab("360")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "360"
                    ? "bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                {t("view360").split(" (")[0]}
              </button>
            </div>
          )}

          {/* Viewer area */}
          <div className="w-full flex justify-center">
            {activeTab === "360" && product.has360 ? (
              <Viewer360 productId={product.id} productName={name} />
            ) : (
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
            )}
          </div>

          {/* Secondary Thumbnail Gallery */}
          {activeTab === "standard" && product.images.length > 1 && (
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

            {addedMessage && (
              <div className="mt-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-3 flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold animate-fade-in-up">
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                <span>{t("itemAdded")}</span>
              </div>
            )}
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
    </div>
  );
}
