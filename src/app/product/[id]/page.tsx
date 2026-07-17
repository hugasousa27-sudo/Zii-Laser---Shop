"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import productsData from "../../../data/products.json";
import { ProductCard, Product } from "../../../components/ProductCard";
import { useApp } from "../../../context/AppContext";
import { ShoppingCart, Plus, Minus, ArrowLeft, RefreshCw, CheckCircle, X, Upload, ImagePlus, Trash2, ChevronDown } from "lucide-react";

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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState("");

  // Customization fields
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null); // The actual File object
  const [mainText, setMainText] = useState("");
  const [secondaryText, setSecondaryText] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);

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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      }
    };
    if (isLightboxOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center text-amber-700 dark:text-amber-400">
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

  // Handles image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    setUploadedFile(file); // Store the actual File object
    const reader = new FileReader();
    reader.onload = (ev) => setUploadedImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeUploadedImage = () => {
    setUploadedImage(null);
    setUploadedFileName("");
    setUploadedFile(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  // Handles adding to cart
  const handleAddToCart = () => {
    const finalSize = selectedSize === "Personalizado" ? `${t("customOption")} (${customSizeText.trim() || "N/A"})` : selectedSize;
    const finalColor = selectedColor === "Personalizado" ? `${t("customOption")} (${customColorText.trim() || "N/A"})` : selectedColor;
    const parts = [
      customSizeText ? `Tamanho: ${customSizeText}` : "",
      customColorText ? `Cor: ${customColorText}` : "",
      mainText ? `Texto principal: ${mainText}` : "",
      secondaryText ? `Texto secundário: ${secondaryText}` : "",
      orderNote ? `Anotação: ${orderNote}` : "",
      uploadedFileName ? `Imagem: ${uploadedFileName}` : "",
    ].filter(Boolean);
    const customText = parts.join(" | ");

    addToCart({
      id: product.id,
      namePt: product.namePt,
      nameEn: product.nameEn,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
      selectedSize: finalSize,
      selectedColor: finalColor,
      customText: customText,
      uploadedImageFile: uploadedFile,
      uploadedImageName: uploadedFileName || undefined,
    });

    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 8000);
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
      case "azul": return "bg-amber-800 text-white";
      case "vermelho": return "bg-rose-800 text-white";
      default: return "bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200";
    }
  };

  // Fallback images including teamwork/car placeholder
  const productImages = [...product.images, "/images/florest.jpg", "/teamwork.jpeg"];

  // Related products: same category, exclude current
  const relatedProducts = (productsData as Product[])
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
      {/* Back Link */}
      <button
        onClick={() => router.back()}
        className="flex items-center space-x-2 text-sm text-slate-500 hover:text-amber-700 dark:text-slate-400 dark:hover:text-amber-400 mb-8 font-semibold transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>{t("btnBack")}</span>
      </button>

      {/* Main Details layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Column: Media (Gallery & 360 Viewer) */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          {/* Viewer area */}
          <div className="w-full flex justify-center">
            <div className="relative w-full aspect-[100/85] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-sm flex items-center justify-center cursor-pointer group"
              onClick={() => {
                setLightboxImage(selectedImage);
                setIsLightboxOpen(true);
              }}
            >
              <img
                src={selectedImage}
                alt={name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Secondary Thumbnail Gallery */}
          <div className="flex justify-center space-x-3 overflow-x-auto py-2">
            {productImages.map((img, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setSelectedImage(img); }}
                className={`relative w-20 h-20 bg-white dark:bg-slate-900 border-2 rounded-xl overflow-hidden transition-all flex-shrink-0 ${
                  selectedImage === img
                    ? "border-amber-700 dark:border-amber-500 scale-105"
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
        </div>

        {/* Right Column: Info & Action Card */}
        <div className="lg:col-span-4 flex flex-col justify-start">
          <div className="product-info-pattern-box text-white space-y-6">
            <div>
              {/* Category */}
              <span className="text-xs font-bold text-amber-300 tracking-widest uppercase">
                {product.category}
              </span>
              {/* Name */}
              <h1 className="text-3xl font-black mt-1 mb-2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                {name}
              </h1>
              {/* Price */}
              <div className="text-2xl font-extrabold text-[#F2C879]">
                {product.price.toLocaleString(language === "pt" ? "pt-PT" : "en-US", {
                  style: "currency",
                  currency: "EUR",
                })}
              </div>
            </div>

            {/* Description */}
            <div className="text-base leading-relaxed border-t border-white/10 pt-4 font-semibold text-stone-100">
              {description}
            </div>

            {/* Configurable Options */}
            <div className="space-y-5 border-t border-white/10 pt-5">
              {/* Size Selector */}
              {product.sizes.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-300 uppercase tracking-wide">
                    {t("labelSize")}
                  </span>
                  <div className="flex flex-wrap items-end gap-4">
                    <div className="radio-inputs">
                      {product.sizes.map((size) => (
                        <label key={size} className="radio">
                          <input
                            type="radio"
                            name="size-option"
                            checked={selectedSize === size}
                            onChange={() => {
                              setSelectedSize(size);
                              if (size !== "Personalizado") setCustomSizeText("");
                            }}
                          />
                          <span className="name">{size === "Personalizado" ? t("customOption") : size}</span>
                        </label>
                      ))}
                    </div>

                    {/* Custom Size Text Input */}
                    {isSizeCustom && (
                      <div className="input-container animate-fade-in-down mb-1">
                        <input
                          type="text"
                          id="customSizeInput"
                          value={customSizeText}
                          onChange={(e) => setCustomSizeText(e.target.value)}
                          placeholder=" "
                          required
                        />
                        <label htmlFor="customSizeInput" className="label">{t("customPlaceholder")}</label>
                        <div className="underline"></div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {product.colors.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-300 uppercase tracking-wide">
                    {t("labelColor")}
                  </span>
                  <div className="flex flex-wrap items-end gap-4">
                    <div className="radio-inputs">
                      {product.colors.map((color) => (
                        <label key={color} className="radio">
                          <input
                            type="radio"
                            name="color-option"
                            checked={selectedColor === color}
                            onChange={() => {
                              setSelectedColor(color);
                              if (color !== "Personalizado") setCustomColorText("");
                            }}
                          />
                          <span className="name flex items-center justify-center space-x-1.5">
                            {color !== "Personalizado" && (
                              <span className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${getColorBadgeClass(color)}`} />
                            )}
                            <span>{color === "Personalizado" ? t("customOption") : color}</span>
                          </span>
                        </label>
                      ))}
                    </div>

                    {/* Custom Color Text Input */}
                    {isColorCustom && (
                      <div className="input-container animate-fade-in-down mb-1">
                        <input
                          type="text"
                          id="customColorInput"
                          value={customColorText}
                          onChange={(e) => setCustomColorText(e.target.value)}
                          placeholder=" "
                          required
                        />
                        <label htmlFor="customColorInput" className="label">{t("customPlaceholder")}</label>
                        <div className="underline"></div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-stone-300 uppercase tracking-wide">
                  {t("labelQuantity")}
                </span>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center border border-white/10 rounded-xl bg-black/35">
                    <button
                      onClick={() => changeQuantity(-1)}
                      className="p-3 text-stone-300 hover:text-white transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 font-black text-sm text-white font-mono w-12 text-center select-none">
                      {quantity}
                    </span>
                    <button
                      onClick={() => changeQuantity(1)}
                      className="p-3 text-stone-300 hover:text-white transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="text-xs text-stone-300 font-medium">
                    {quantity} x {product.price.toLocaleString(language === "pt" ? "pt-PT" : "en-US", { style: "currency", currency: "EUR" })}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Personalização do artigo ── */}
            <div className="border-t border-white/10 pt-5 space-y-5">
              <button 
                type="button"
                onClick={() => setIsCustomizationOpen(!isCustomizationOpen)}
                className="w-full flex items-center justify-between focus:outline-none"
              >
                <span className="text-xs font-black text-amber-300 uppercase tracking-widest block text-left">
                  {language === "pt" ? "Personalização do Artigo" : "Item Customization"}
                </span>
                <ChevronDown className={`h-4 w-4 text-amber-300 transition-transform ${isCustomizationOpen ? "rotate-180" : ""}`} />
              </button>

              {isCustomizationOpen && (
                <div className="space-y-5 animate-fade-in-down">
                  {/* 1 – Image upload */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-300 uppercase tracking-wide block">
                  {language === "pt" ? "1. Imagem de Referência" : "1. Reference Image"}
                </span>
                {!uploadedImage ? (
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-white/20 hover:border-amber-400/60 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group bg-black/20 hover:bg-black/30"
                  >
                    <ImagePlus className="h-7 w-7 text-stone-400 group-hover:text-amber-400 transition-colors" />
                    <span className="text-xs text-stone-400 group-hover:text-amber-300 font-semibold transition-colors text-center">
                      {language === "pt" ? "Clique para carregar imagem" : "Click to upload image"}
                    </span>
                    <span className="text-[10px] text-stone-500">
                      PNG, JPG, SVG (máx. 10MB)
                    </span>
                  </button>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-white/15 animate-fade-in-down">
                    <img src={uploadedImage} alt="Preview" className="w-full h-36 object-cover object-center" />
                    <div className="absolute inset-0 bg-black/40 flex items-end justify-between p-2.5">
                      <span className="text-[10px] text-white/80 font-bold truncate max-w-[70%]">{uploadedFileName}</span>
                      <button
                        type="button"
                        onClick={removeUploadedImage}
                        className="p-1.5 bg-red-500/80 hover:bg-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-white" />
                      </button>
                    </div>
                  </div>
                )}
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              {/* 2 – Main text */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-stone-300 uppercase tracking-wide block">
                  {language === "pt" ? "2. Texto Principal" : "2. Main Text"}
                </span>
                <input
                  type="text"
                  value={mainText}
                  onChange={(e) => setMainText(e.target.value)}
                  placeholder={language === "pt" ? "Ex: Nome, frase, logótipo..." : "E.g. Name, phrase, logo..."}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-amber-400/60 text-white placeholder:text-stone-500 transition-colors"
                  maxLength={80}
                />
                <div className="text-right text-[10px] text-stone-500">{mainText.length}/80</div>
              </div>

              {/* 3 – Secondary text */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-stone-300 uppercase tracking-wide block">
                  {language === "pt" ? "3. Texto Secundário" : "3. Secondary Text"}
                </span>
                <input
                  type="text"
                  value={secondaryText}
                  onChange={(e) => setSecondaryText(e.target.value)}
                  placeholder={language === "pt" ? "Ex: Data, subtítulo, lema..." : "E.g. Date, subtitle, motto..."}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-amber-400/60 text-white placeholder:text-stone-500 transition-colors"
                  maxLength={80}
                />
                <div className="text-right text-[10px] text-stone-500">{secondaryText.length}/80</div>
              </div>

              {/* 4 – Order note */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-stone-300 uppercase tracking-wide block">
                  {language === "pt" ? "4. Anotação do Pedido" : "4. Order Note"}
                </span>
                <textarea
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder={language === "pt" ? "Informações adicionais, preferências, dúvidas..." : "Additional information, preferences, questions..."}
                  rows={3}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-amber-400/60 text-white placeholder:text-stone-500 transition-colors resize-none"
                  maxLength={300}
                />
                <div className="text-right text-[10px] text-stone-500">{orderNote.length}/300</div>
              </div>
                </div>
              )}
            </div>

            {/* Customization Warning */}
            {(isSizeCustom || isColorCustom) && (
              <div className="text-xs border border-amber-500/25 bg-black/40 rounded-xl p-3.5 text-amber-200/90 leading-relaxed animate-fade-in-down">
                ⚠️ <span className="font-extrabold text-amber-400">{language === "pt" ? "Nota de Personalização:" : "Customization Note:"}</span>{" "}
                {language === "pt" 
                  ? "Ao personalizar o artigo, o preço poderá sofrer alterações. Será enviado um orçamento por email após submeter o pedido."
                  : "By customizing the item, the price may vary. A budget/quote will be sent by email after placing your order."}
              </div>
            )}

            {/* Add to Cart Drawer/Card */}
            <div className="border-t border-white/10 pt-6 flex flex-col space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold text-stone-300">{t("summaryTotal")}</span>
                <span className="text-2xl font-black text-[#F2C879]">
                  {totalPrice.toLocaleString(language === "pt" ? "pt-PT" : "en-US", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="btn-add-to-cart text-base"
              >
                <span className="btn-add-to-cart__text">{t("btnAddToCart")}</span>
                <span className="btn-add-to-cart__icon">
                  <ShoppingCart className="h-5 w-5 svg" />
                </span>
              </button>
            </div>
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

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-slate-200 dark:border-slate-800 pt-10">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--foreground)' }}>
              Produtos Relacionados
            </h2>
            <p className="text-sm mt-1 font-medium" style={{ color: 'var(--muted)' }}>
              Mais artigos da categoria <span className="font-bold" style={{ color: 'var(--primary)' }}>{product.category}</span>
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relProduct) => (
              <div key={relProduct.id} className="animate-fade-in-up">
                <ProductCard product={relProduct} imageOnly={true} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Image Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-0 animate-fade-in"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title={t("close")}
          >
            <X className="h-7 w-7" />
          </button>

          {/* Image and navigation wrapper */}
          <div className="relative w-full h-full flex flex-col items-center justify-between py-6">
            {/* Top spacing to keep image centered */}
            <div className="h-10" />

            {/* Image */}
            <div
              className="relative max-w-[90vw] max-h-[75vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxImage}
                alt={name}
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl transition-all duration-300"
              />
            </div>

            {/* Bottom thumbnail gallery & Hint */}
            <div className="w-full flex flex-col items-center gap-4 z-10" onClick={(e) => e.stopPropagation()}>
              {productImages.length > 1 && (
                <div className="flex justify-center gap-2.5 overflow-x-auto px-4 py-1.5 max-w-[80vw] bg-black/60 rounded-full backdrop-blur-md border border-white/10">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setLightboxImage(img)}
                      className={`relative w-12 h-12 rounded-lg overflow-hidden transition-all flex-shrink-0 ${
                        lightboxImage === img
                          ? "border-2 border-amber-500 scale-110"
                          : "border border-white/20 opacity-60 hover:opacity-100 hover:scale-105"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${name} preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
              <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">
                Clique fora da imagem para fechar
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
