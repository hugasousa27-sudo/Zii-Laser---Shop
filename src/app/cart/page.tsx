"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "../../context/AppContext";
import { Trash2, ShoppingBag, Plus, Minus, CheckCircle, ArrowRight, ClipboardCopy, MessageCircle, Mail } from "lucide-react";

const IconWhatsApp = (props: any) => <MessageCircle {...props} />;
const IconInstagram = (props: any) => (
  <svg {...props} className={`${props.className || ""} stroke-current fill-none`} viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const IconFacebook = (props: any) => (
  <svg {...props} className={`${props.className || ""} fill-current`} viewBox="0 0 24 24">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z"/>
  </svg>
);
const IconEmail = (props: any) => <Mail {...props} />;

interface FormFields {
  name: string;
  email: string;
  phone: string;
  address: string;
  zip: string;
  city: string;
  country: string;
  contactPreference: string;
  contactHandle: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  zip?: string;
  city?: string;
  country?: string;
  contactPreference?: string;
  contactHandle?: string;
}

export default function Cart() {
  const { cart, removeFromCart, updateCartQuantity, clearCart, language, t } = useApp();
  const [orderNotes, setOrderNotes] = useState("");
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [form, setForm] = useState<FormFields>({
    name: "",
    email: "",
    phone: "",
    address: "",
    zip: "",
    city: "",
    country: "",
    contactPreference: "",
    contactHandle: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // Tax breakdown (VAT 23%)
  const subtotalExclVat = cartTotal / 1.23;
  const vatAmount = cartTotal - subtotalExclVat;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === "phone" || (name === "contactHandle" && form.contactPreference === "whatsapp")) {
      newValue = value.replace(/[^\d+]/g, "");
    }
    setForm((prev) => ({ ...prev, [name]: newValue }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const tempErrors: FormErrors = {};
    let isValid = true;

    if (!form.name.trim()) {
      tempErrors.name = t("inputRequired");
      isValid = false;
    }
    
    if (!form.email.trim()) {
      tempErrors.email = t("inputRequired");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      tempErrors.email = t("invalidEmail");
      isValid = false;
    }

    if (!form.phone.trim()) {
      tempErrors.phone = t("inputRequired");
      isValid = false;
    }

    if (!form.address.trim()) {
      tempErrors.address = t("inputRequired");
      isValid = false;
    }

    if (!form.zip.trim()) {
      tempErrors.zip = t("inputRequired");
      isValid = false;
    }

    if (!form.city.trim()) {
      tempErrors.city = t("inputRequired");
      isValid = false;
    }

    if (!form.country.trim()) {
      tempErrors.country = t("inputRequired");
      isValid = false;
    }

    if (!form.contactPreference) {
      tempErrors.contactPreference = t("inputRequired");
      isValid = false;
    }

    if (!form.contactHandle.trim()) {
      tempErrors.contactHandle = t("inputRequired");
      isValid = false;
    } else if (form.contactPreference === "email" && !/\S+@\S+\.\S+/.test(form.contactHandle)) {
      tempErrors.contactHandle = t("invalidEmail");
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Simulate ordering
    const generatedOrderId = "VG-" + Math.floor(100000 + Math.random() * 900000);
    setOrderId(generatedOrderId);
    
    // Prepare order details for email
    const orderDetails = cart.map(item => 
      `${item.quantity}x ${language === "pt" ? item.namePt : item.nameEn} ` +
      `${item.selectedSize ? `(Tamanho: ${item.selectedSize})` : ''} ` +
      `${item.selectedColor ? `(Cor: ${item.selectedColor})` : ''} ` +
      `${item.customText ? `(Texto: ${item.customText})` : ''} ` +
      `- ${(item.price * item.quantity).toFixed(2)}€`
    ).join('\n');

    // Send email via formsubmit.co
    fetch("https://formsubmit.co/ajax/ziilaserloja@gmail.com", {
      method: "POST",
      headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
      body: JSON.stringify({
          _subject: `Nova Encomenda Loja Online: ${generatedOrderId}`,
          "ID da Encomenda": generatedOrderId,
          "Nome do Cliente": form.name,
          "Email do Cliente": form.email,
          "Telefone": form.phone,
          "Preferência de Contacto": form.contactPreference,
          "Identificação do Contacto": form.contactHandle,
          "Morada": `${form.address}, ${form.zip} ${form.city}, ${form.country}`,
          "Notas Adicionais": orderNotes || "Nenhuma",
          "Total a Pagar": `${cartTotal.toFixed(2)}€`,
          "Produtos Escolhidos": "\n" + orderDetails
      })
    }).catch(error => console.error("Erro ao enviar email:", error));

    setSuccessModalOpen(true);
  };

  const closeSuccessModal = () => {
    setSuccessModalOpen(false);
    clearCart();
    setForm({
      name: "",
      email: "",
      phone: "",
      address: "",
      zip: "",
      city: "",
      country: "",
      contactPreference: "",
      contactHandle: "",
    });
    setOrderNotes("");
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
        <div className="bg-amber-50 dark:bg-slate-900 p-6 rounded-full text-amber-700 dark:text-amber-400 mb-6">
          <ShoppingBag className="h-12 w-12" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-950 dark:text-slate-50 mb-3">
          {t("cartEmpty")}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mb-8">
          Ainda não adicionou produtos ao seu carrinho. Explore as nossas coleções para encontrar o seu estilo.
        </p>
        <Link
          href="/categories"
          className="bg-[#F2C879] hover:bg-[#d9b265] text-[#2A1713] font-bold py-3.5 px-8 rounded-full shadow-md hover:shadow-amber-500/20 transition-all flex items-center space-x-2 text-sm"
        >
          <span>{t("btnContinue")}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-grow relative">
      <h1 className="text-3xl font-black text-slate-950 dark:text-slate-50 mb-8 flex items-center gap-2">
        <ShoppingBag className="h-7 w-7 text-amber-700 dark:text-amber-400" />
        <span>{t("cartTitle")}</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Items list, Notes, Client Info Form */}
        <div className="lg:col-span-7 space-y-8">
          {/* Cart Items List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-extrabold text-lg text-slate-950 dark:text-slate-50">
                Produtos selecionados ({cart.length})
              </h2>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {cart.map((item) => (
                <div key={item.cartItemId} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Image & Main Info */}
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={language === "pt" ? item.namePt : item.nameEn}
                      className="w-16 h-16 object-cover rounded-xl border border-slate-200 dark:border-slate-800 flex-shrink-0"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                        {language === "pt" ? item.namePt : item.nameEn}
                      </h3>
                      
                      {/* Configuration Details */}
                      <div className="mt-1.5 space-y-0.5">
                        {item.selectedSize && (
                          <div className="text-xs text-slate-400 font-medium">
                            {t("labelSize")}: <span className="text-slate-600 dark:text-slate-300">{item.selectedSize}</span>
                          </div>
                        )}
                        {item.selectedColor && (
                          <div className="text-xs text-slate-400 font-medium">
                            {t("labelColor")}: <span className="text-slate-600 dark:text-slate-300">{item.selectedColor}</span>
                          </div>
                        )}
                        {item.customText && item.customText.split(" | ").filter(Boolean).map((part, i) => (
                          <div key={i} className="text-xs text-slate-400 font-medium">
                            <span className="text-slate-600 dark:text-slate-300">{part}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Price adjustment */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg">
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold font-mono text-slate-800 dark:text-slate-100 min-w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Price and removal */}
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <span className="block text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">
                          {(item.price * item.quantity).toLocaleString(language === "pt" ? "pt-PT" : "en-US", {
                            style: "currency",
                            currency: "EUR",
                          })}
                        </span>
                        {item.quantity > 1 && (
                          <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                            {item.price.toLocaleString(language === "pt" ? "pt-PT" : "en-US", { style: "currency", currency: "EUR" })} / un
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                        title="Remover produto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Client Shipping Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="font-extrabold text-lg text-slate-950 dark:text-slate-50 mb-6">
              {t("custDataTitle")}
            </h2>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  {t("custName")} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-700 transition-colors ${
                    errors.name ? "border-red-500" : "border-slate-200 dark:border-slate-850"
                  }`}
                />
                {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name}</span>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                    {t("custEmail")} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-700 transition-colors ${
                      errors.email ? "border-red-500" : "border-slate-200 dark:border-slate-850"
                    }`}
                  />
                  {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email}</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                    {t("custPhone")} *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-700 transition-colors ${
                      errors.phone ? "border-red-500" : "border-slate-200 dark:border-slate-850"
                    }`}
                  />
                  {errors.phone && <span className="text-red-500 text-xs mt-1 block">{errors.phone}</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  {t("custAddress")} *
                </label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-700 transition-colors ${
                    errors.address ? "border-red-500" : "border-slate-200 dark:border-slate-850"
                  }`}
                />
                {errors.address && <span className="text-red-500 text-xs mt-1 block">{errors.address}</span>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                    {t("custZip")} *
                  </label>
                  <input
                    type="text"
                    name="zip"
                    value={form.zip}
                    onChange={handleInputChange}
                    placeholder="e.g. 1000-000"
                    className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-700 transition-colors ${
                      errors.zip ? "border-red-500" : "border-slate-200 dark:border-slate-850"
                    }`}
                  />
                  {errors.zip && <span className="text-red-500 text-xs mt-1 block">{errors.zip}</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                    {t("custCity")} *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleInputChange}
                    className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-700 transition-colors ${
                      errors.city ? "border-red-500" : "border-slate-200 dark:border-slate-850"
                    }`}
                  />
                  {errors.city && <span className="text-red-500 text-xs mt-1 block">{errors.city}</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                    {t("custCountry")} *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={form.country}
                    onChange={handleInputChange}
                    className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-700 transition-colors ${
                      errors.country ? "border-red-500" : "border-slate-200 dark:border-slate-850"
                    }`}
                  />
                  {errors.country && <span className="text-red-500 text-xs mt-1 block">{errors.country}</span>}
                </div>
              </div>

              {/* Preferred Contact Method */}
              <div className="grid grid-cols-1 gap-4 border-t border-slate-100 dark:border-slate-800/60 pt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                    {t("labelContactPreference")} *
                  </label>

                  <style dangerouslySetInnerHTML={{ __html: `
                    .cart-radio-tile-group {
                      display: flex;
                      flex-wrap: wrap;
                      gap: 0.75rem;
                      margin-bottom: 0.75rem;
                    }

                    .cart-radio-tile-group .input-container {
                      position: relative;
                      height: 85px;
                      width: 85px;
                    }

                    .cart-radio-tile-group .input-container .radio-button {
                      opacity: 0;
                      position: absolute;
                      top: 0;
                      left: 0;
                      height: 100%;
                      width: 100%;
                      margin: 0;
                      cursor: pointer;
                      z-index: 2;
                    }

                    .cart-radio-tile-group .input-container .radio-tile {
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      justify-content: center;
                      width: 100%;
                      height: 100%;
                      border: 2px solid var(--border);
                      background-color: var(--card);
                      border-radius: 16px;
                      padding: 0.5rem;
                      transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
                    }

                    .cart-radio-tile-group .input-container .icon svg {
                      color: var(--muted);
                      fill: none;
                      width: 1.75rem;
                      height: 1.75rem;
                      transition: all 200ms ease;
                    }

                    .cart-radio-tile-group .input-container .icon svg.fill-current {
                      fill: var(--muted);
                    }

                    .cart-radio-tile-group .input-container .radio-tile-label {
                      text-align: center;
                      font-size: 0.65rem;
                      font-weight: 700;
                      text-transform: uppercase;
                      letter-spacing: 0.5px;
                      color: var(--muted);
                      margin-top: 0.35rem;
                      transition: all 200ms ease;
                    }

                    .cart-radio-tile-group .input-container .radio-button:hover + .radio-tile {
                      border-color: #B9844F;
                    }

                    .cart-radio-tile-group .input-container .radio-button:checked + .radio-tile {
                      background-color: #B9844F;
                      border-color: #B9844F;
                      box-shadow: 0 4px 12px rgba(185, 132, 79, 0.25);
                      transform: scale(1.05);
                    }

                    .cart-radio-tile-group .input-container .radio-button:checked + .radio-tile .icon svg {
                      color: #ffffff;
                      stroke: #ffffff;
                      fill: none;
                    }

                    .cart-radio-tile-group .input-container .radio-button:checked + .radio-tile .icon svg.fill-current {
                      fill: #ffffff;
                      stroke: none;
                    }

                    .cart-radio-tile-group .input-container .radio-button:checked + .radio-tile .radio-tile-label {
                      color: #ffffff;
                    }
                  `}} />

                  {/* Warning Alert */}
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 text-amber-800 dark:text-amber-300 text-xs leading-relaxed font-semibold mb-4">
                    {t("contactAlert")}
                  </div>

                  <div className="cart-radio-tile-group">
                    {[
                      { id: "cart-whatsapp", value: "whatsapp", label: "WhatsApp", icon: IconWhatsApp },
                      { id: "cart-instagram", value: "instagram", label: "Instagram", icon: IconInstagram },
                      { id: "cart-facebook", value: "facebook", label: "Facebook", icon: IconFacebook },
                      { id: "cart-email", value: "email", label: "Email", icon: IconEmail },
                    ].map((option) => {
                      const Icon = option.icon;
                      return (
                        <div className="input-container" key={option.id}>
                          <input
                            id={option.id}
                            className="radio-button"
                            type="radio"
                            name="cartContactPreference"
                            checked={form.contactPreference === option.value}
                            onChange={() => {
                              setForm((prev) => {
                                const nextHandle = option.value === "whatsapp" ? prev.contactHandle.replace(/[^\d+]/g, "") : prev.contactHandle;
                                return { ...prev, contactPreference: option.value, contactHandle: nextHandle };
                              });
                              if (errors.contactPreference) {
                                setErrors((prev) => ({ ...prev, contactPreference: undefined }));
                              }
                            }}
                          />
                          <div className="radio-tile">
                            <div className="icon">
                              <Icon className="h-7 w-7 transition-all duration-200" />
                            </div>
                            <label htmlFor={option.id} className="radio-tile-label">
                              {option.label}
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {errors.contactPreference && <span className="text-red-500 text-xs mt-1 block mb-4">{errors.contactPreference}</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                    {t("labelContactHandle")} *
                  </label>
                  <input
                    type="text"
                    name="contactHandle"
                    value={form.contactHandle}
                    onChange={handleInputChange}
                    placeholder={
                      form.contactPreference === "whatsapp" 
                        ? "910 000 000" 
                        : form.contactPreference === "instagram"
                        ? "@username"
                        : form.contactPreference === "facebook"
                        ? "facebook.com/username"
                        : "email@exemplo.com"
                    }
                    className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-700 transition-colors ${
                      errors.contactHandle ? "border-red-500" : "border-slate-200 dark:border-slate-850"
                    }`}
                  />
                  {errors.contactHandle && <span className="text-red-500 text-xs mt-1 block">{errors.contactHandle}</span>}
                </div>
              </div>
              <button type="submit" id="hidden-submit" className="hidden" />
            </form>
          </div>

          {/* Order Notes Area */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="font-extrabold text-lg text-slate-950 dark:text-slate-50 mb-3">
              {t("cartNotes")}
            </h2>
            <textarea
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              placeholder={t("cartNotesPlaceholder")}
              rows={3}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-700 transition-colors"
            />
          </div>
        </div>

        {/* Right Side: Order Summary Card (Sticky) */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          {/* Opções de Pagamento Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-extrabold text-lg text-slate-950 dark:text-slate-50 border-b border-slate-100 dark:border-slate-800 pb-3">
              Opções de Pagamento
            </h2>
            <div className="space-y-3.5 text-sm font-semibold">
              <div className="flex flex-col gap-1 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850">
                <span className="text-xs uppercase text-amber-750 dark:text-amber-400 font-extrabold">Transferência Bancária</span>
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-350 select-all">IBAN: PT50 0003 0000 0000 0000 0000 0</span>
              </div>
              <div className="flex flex-col gap-1 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850">
                <span className="text-xs uppercase text-amber-750 dark:text-amber-400 font-extrabold">MB WAY</span>
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-350 select-all">+351 913 625 082</span>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl p-3.5 text-amber-800 dark:text-amber-300 text-xs leading-relaxed font-bold">
                ⚠️ Após confirmação do pagamento a sua encomenda será enviada.
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="font-extrabold text-lg text-slate-950 dark:text-slate-50 border-b border-slate-100 dark:border-slate-800 pb-4">
              {t("summaryTitle")}
            </h2>

            {/* Calculations details */}
            <div className="space-y-3 text-sm font-medium">
              <div className="flex justify-between text-slate-500">
                <span>{t("summarySubtotal")} (Excl. IVA)</span>
                <span className="font-mono">
                  {subtotalExclVat.toLocaleString(language === "pt" ? "pt-PT" : "en-US", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>{t("summaryVat")}</span>
                <span className="font-mono">
                  {vatAmount.toLocaleString(language === "pt" ? "pt-PT" : "en-US", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </span>
              </div>
              
              <hr className="border-slate-100 dark:border-slate-800 my-4" />

              <div className="flex justify-between items-baseline text-slate-900 dark:text-white font-extrabold">
                <span className="text-base">{t("summaryTotal")}</span>
                <span className="text-2xl font-black font-mono text-amber-700 dark:text-amber-400">
                  {cartTotal.toLocaleString(language === "pt" ? "pt-PT" : "en-US", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => {
                const submitBtn = document.getElementById("hidden-submit");
                if (submitBtn) submitBtn.click();
              }}
              className="w-full bg-[#F2C879] hover:bg-[#d9b265] text-[#2A1713] font-black py-4 px-6 rounded-xl shadow-lg hover:shadow-amber-500/20 transition-all flex items-center justify-center space-x-2 text-base"
            >
              <span>{t("btnCheckout")}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal Overlay */}
      {successModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-lg w-full rounded-3xl p-8 shadow-2xl space-y-6 text-center animate-scale-up relative">
            
            {/* Checked Icon */}
            <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="h-8 w-8" />
            </div>

            {/* Success text */}
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-950 dark:text-slate-50">
                {t("checkoutSuccessTitle")}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-450">
                {t("checkoutSuccessMsg")}
              </p>
            </div>

            {/* Order details details */}
            <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 border border-slate-200 dark:border-slate-850 text-left space-y-3 font-medium text-xs text-slate-500 dark:text-slate-400">
              <div className="flex justify-between items-center">
                <span>Encomenda ID</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1.5 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">
                  <ClipboardCopy className="h-3.5 w-3.5 text-slate-400" />
                  {orderId}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Cliente</span>
                <span className="text-slate-800 dark:text-white">{form.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Pago (com IVA)</span>
                <span className="font-mono text-slate-800 dark:text-white">
                  {cartTotal.toLocaleString(language === "pt" ? "pt-PT" : "en-US", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </span>
              </div>
            </div>

            {/* Continue Shopping button */}
            <button
              onClick={closeSuccessModal}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all"
            >
              {t("btnContinue")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
