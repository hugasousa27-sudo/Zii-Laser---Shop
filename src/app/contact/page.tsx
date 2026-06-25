"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, Navigation, Map } from "lucide-react";

interface FormFields {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  contactPreference: string;
  contactHandle: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  contactPreference?: string;
  contactHandle?: string;
}

export default function Contact() {
  const { t, language } = useApp();
  const [form, setForm] = useState<FormFields>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    contactPreference: "",
    contactHandle: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
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
    if (!form.subject.trim()) {
      tempErrors.subject = t("inputRequired");
      isValid = false;
    }
    if (!form.contactPreference) {
      tempErrors.contactPreference = t("inputRequired");
      isValid = false;
    }
    if (!form.contactHandle.trim()) {
      tempErrors.contactHandle = t("inputRequired");
      isValid = false;
    }
    if (!form.message.trim()) {
      tempErrors.message = t("inputRequired");
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSuccess(true);
    setForm({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      contactPreference: "",
      contactHandle: "",
    });

    setTimeout(() => {
      setSuccess(false);
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-grow space-y-12 animate-fade-in">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
          {t("contactTitle")}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          {t("contactSub")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Contact Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
          {success && (
            <div className="mb-6 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-4 flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
              <CheckCircle className="h-5 w-5 flex-shrink-0 animate-bounce" />
              <span>{t("contactSuccess")}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  {t("contactFormName")} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-700 transition-colors ${errors.name ? "border-red-500" : "border-slate-200 dark:border-slate-850"
                    }`}
                />
                {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  {t("contactFormPhone")} *
                </label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-700 transition-colors ${errors.phone ? "border-red-500" : "border-slate-200 dark:border-slate-850"
                    }`}
                />
                {errors.phone && <span className="text-red-500 text-xs mt-1 block">{errors.phone}</span>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                {t("contactFormEmail")} *
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-700 transition-colors ${errors.email ? "border-red-500" : "border-slate-200 dark:border-slate-850"
                  }`}
              />
              {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email}</span>}
            </div>

            {/* Preferred Contact Method */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800/60 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  {t("labelContactPreference")} *
                </label>
                <select
                  name="contactPreference"
                  value={form.contactPreference}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-700 transition-colors ${errors.contactPreference ? "border-red-500" : "border-slate-200 dark:border-slate-850"
                    }`}
                >
                  <option value="">{language === "pt" ? "Selecione..." : "Select..."}</option>
                  <option value="whatsapp">{t("optWhatsapp")}</option>
                  <option value="instagram">{t("optInstagram")}</option>
                  <option value="facebook">{t("optFacebook")}</option>
                  <option value="email">{t("optEmail")}</option>
                </select>
                {errors.contactPreference && <span className="text-red-500 text-xs mt-1 block">{errors.contactPreference}</span>}
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
                  className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-700 transition-colors ${errors.contactHandle ? "border-red-500" : "border-slate-200 dark:border-slate-850"
                    }`}
                />
                {errors.contactHandle && <span className="text-red-500 text-xs mt-1 block">{errors.contactHandle}</span>}
              </div>
            </div>

            {/* Warning Alert */}
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 text-amber-800 dark:text-amber-300 text-xs leading-relaxed font-semibold">
              {t("contactAlert")}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                {t("contactFormSubject")} *
              </label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleInputChange}
                className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-700 transition-colors ${errors.subject ? "border-red-500" : "border-slate-200 dark:border-slate-850"
                  }`}
              />
              {errors.subject && <span className="text-red-500 text-xs mt-1 block">{errors.subject}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                {t("contactFormMsg")} *
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleInputChange}
                placeholder={t("contactFormMsgPlaceholder")}
                rows={5}
                className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-700 transition-colors ${errors.message ? "border-red-500" : "border-slate-200 dark:border-slate-850"
                  }`}
              />
              {errors.message && <span className="text-red-500 text-xs mt-1 block">{errors.message}</span>}
            </div>

            <button
              type="submit"
              className="w-full bg-amber-700 hover:bg-amber-800 text-white font-black py-4 px-6 rounded-xl shadow-lg hover:shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center space-x-2 text-sm"
            >
              <Send className="h-4 w-4" />
              <span>{t("btnSendMessage")}</span>
            </button>
          </form>
        </div>

        {/* Right Side: Contact Details & Mock Map */}
        <div className="lg:col-span-5 space-y-6">
          {/* Contact Details Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h2 className="font-extrabold text-lg text-slate-950 dark:text-slate-50 border-b border-slate-100 dark:border-slate-800 pb-3">
              {t("contactInfoTitle")}
            </h2>

            <ul className="space-y-4 text-sm font-medium text-slate-650 dark:text-slate-350">
              <li className="flex items-start space-x-3">
                <div className="bg-amber-50 dark:bg-slate-950 text-amber-700 dark:text-amber-400 p-2 rounded-lg flex-shrink-0 shadow-inner">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Telefone</span>
                  <span>+351 913 625 082</span>
                </div>
              </li>

              <li className="flex items-start space-x-3">
                <div className="bg-amber-50 dark:bg-slate-950 text-amber-700 dark:text-amber-400 p-2 rounded-lg flex-shrink-0 shadow-inner">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Email</span>
                  <a href="mailto:ziilaserloja@gmail.com" className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
                    ziilaserloja@gmail.com
                  </a>
                </div>
              </li>

              <li className="flex items-start space-x-3">
                <div className="bg-amber-50 dark:bg-slate-950 text-amber-700 dark:text-amber-400 p-2 rounded-lg flex-shrink-0 shadow-inner">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Morada</span>
                  <span>Taveiro, 3045-482 Coimbra, Portugal</span>
                </div>
              </li>

              <li className="flex items-start space-x-3 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                <div className="bg-amber-50 dark:bg-slate-950 text-amber-700 dark:text-amber-400 p-2 rounded-lg flex-shrink-0 shadow-inner">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">{t("contactInfoHours")}</span>
                  <p className="whitespace-pre-line text-xs font-semibold leading-relaxed">
                    {t("contactInfoHoursText")}
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Decorative Brand Image */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm">
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden relative shadow-inner">
              <img 
                src="/images/florest.jpg" 
                alt="Zii Laser Workshop" 
                className="w-full h-full object-cover object-center scale-105"
              />
              <div className="absolute inset-0 bg-black/35 flex items-center justify-center p-6">
                <span className="text-white text-lg font-bold text-center tracking-wide leading-relaxed drop-shadow-md">
                  Criamos peças únicas e personalizadas com amor e dedicação ao ambiente.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
