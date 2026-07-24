"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Phone, Mail, MapPin, CheckCircle, MessageCircle } from "lucide-react";

const IconWhatsApp = (props: any) => <img src="/wpp.png" alt="WhatsApp" {...props} />;
const IconInstagram = (props: any) => <img src="/instagram.png" alt="Instagram" {...props} />;
const IconFacebook = (props: any) => <img src="/facebook.png" alt="Facebook" {...props} />;
const IconEmail = (props: any) => <img src="/email.png" alt="Email" {...props} />;

interface FormFields {
  name: string;
  subject: string;
  message: string;
  contactPreference: string;
  contactHandle: string;
}

interface FormErrors {
  name?: string;
  subject?: string;
  message?: string;
  contactPreference?: string;
  contactHandle?: string;
}

export default function Contact() {
  const { t, language } = useApp();
  const [form, setForm] = useState<FormFields>({
    name: "",
    subject: "",
    message: "",
    contactPreference: "",
    contactHandle: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === "contactHandle" && form.contactPreference === "whatsapp") {
      newValue = value.replace(/[^\d+]/g, "");
    }
    setForm((prev) => ({ ...prev, [name]: newValue }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const tempErrors: FormErrors = {};
    let isValid = true;

    if (!form.name.trim()) { tempErrors.name = t("inputRequired"); isValid = false; }
    if (!form.subject.trim()) { tempErrors.subject = t("inputRequired"); isValid = false; }
    if (!form.contactPreference) { tempErrors.contactPreference = t("inputRequired"); isValid = false; }
    if (!form.contactHandle.trim()) {
      tempErrors.contactHandle = t("inputRequired"); isValid = false;
    } else if (form.contactPreference === "email" && !/\S+@\S+\.\S+/.test(form.contactHandle)) {
      tempErrors.contactHandle = t("invalidEmail"); isValid = false;
    }
    if (!form.message.trim()) { tempErrors.message = t("inputRequired"); isValid = false; }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("https://formsubmit.co/ajax/ziilaserloja@gmail.com", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
          _subject: `Novo Contacto Loja Online: ${form.subject}`,
          "Nome": form.name,
          "Assunto": form.subject,
          "Preferência de Contacto": form.contactPreference,
          "Identificação do Contacto": form.contactHandle,
          "Mensagem": form.message
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setForm({ name: "", subject: "", message: "", contactPreference: "", contactHandle: "" });
        setTimeout(() => setSuccess(false), 8000);
      } else {
        alert("Erro ao enviar a mensagem.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar ao servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-grow space-y-12 animate-fade-in">

      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight" style={{ color: 'var(--foreground)' }}>
          {t("contactTitle")}
        </h1>
        <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
          {t("contactSub")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Contact Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold capitalize tracking-wide mb-1.5" style={{ color: 'var(--foreground)' }}>
                {t("contactFormName")}
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-700 transition-colors ${errors.name ? "border-red-500" : "border-slate-200 dark:border-slate-850"}`}
              />
              {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold capitalize tracking-wide mb-1.5" style={{ color: 'var(--foreground)' }}>
                {t("contactFormSubject")}
              </label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleInputChange}
                className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-700 transition-colors ${errors.subject ? "border-red-500" : "border-slate-200 dark:border-slate-850"}`}
              />
              {errors.subject && <span className="text-red-500 text-xs mt-1 block">{errors.subject}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold capitalize tracking-wide mb-1.5" style={{ color: 'var(--foreground)' }}>
                {t("contactFormMsg")}
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleInputChange}
                placeholder={t("contactFormMsgPlaceholder")}
                rows={5}
                className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-700 transition-colors ${errors.message ? "border-red-500" : "border-slate-200 dark:border-slate-850"}`}
              />
              {errors.message && <span className="text-red-500 text-xs mt-1 block">{errors.message}</span>}
            </div>

            {/* Preferred Contact Method area */}
            <div className="grid grid-cols-1 gap-4 border-t border-slate-100 dark:border-slate-800/60 pt-4">
              <div>
                <label className="flex items-center gap-2 text-xs font-bold capitalize tracking-wide mb-2" style={{ color: 'var(--foreground)' }}>
                  <span className="bg-[#F2C879]/10 text-[#F2C879] p-1.5 rounded-lg flex-shrink-0 shadow-inner">
                    <MessageCircle className="h-3.5 w-3.5" />
                  </span>
                  {t("labelContactPreference")}
                </label>

                <style dangerouslySetInnerHTML={{ __html: `
                  .radio-tile-group {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.75rem;
                    margin-bottom: 0.75rem;
                  }
                  .radio-tile-group .input-container {
                    position: relative;
                    height: 85px;
                    width: 85px;
                    margin: 0;
                    min-width: unset;
                    max-width: unset;
                  }
                  .radio-tile-group .input-container .radio-button {
                    opacity: 0;
                    position: absolute;
                    top: 0; left: 0;
                    height: 100%; width: 100%;
                    margin: 0;
                    cursor: pointer;
                    z-index: 2;
                  }
                  .radio-tile-group .input-container .radio-tile {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    width: 100%; height: 100%;
                    border: 2px solid var(--border);
                    background-color: var(--card);
                    border-radius: 16px;
                    padding: 0.5rem;
                    transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
                  }
                  .radio-tile-group .input-container .icon img {
                    width: 1.75rem; height: 1.75rem;
                    transition: all 200ms ease;
                    object-fit: contain;
                    filter: grayscale(0%) opacity(100%);
                  }
                  .radio-tile-group .input-container .radio-tile-label {
                    text-align: center;
                    font-size: 0.65rem; font-weight: 700;
                    text-transform: uppercase; letter-spacing: 0.5px;
                    color: var(--muted); margin-top: 0.35rem;
                    transition: all 200ms ease;
                  }
                  .radio-tile-group .input-container .radio-button:hover + .radio-tile .icon img {
                    filter: grayscale(0%) opacity(100%);
                  }
                  
                  /* WhatsApp Branded Checked State */
                  .radio-tile-group .input-container #whatsapp:checked + .radio-tile {
                    background-color: rgba(37, 211, 102, 0.1);
                    border-color: #25D366;
                    box-shadow: 0 4px 12px rgba(37, 211, 102, 0.15);
                    transform: scale(1.05);
                  }
                  .radio-tile-group .input-container #whatsapp:checked + .radio-tile .icon img {
                    filter: grayscale(0%) opacity(100%);
                  }
                  .radio-tile-group .input-container #whatsapp:checked + .radio-tile .radio-tile-label {
                    color: #128C7E;
                  }
                  .dark .radio-tile-group .input-container #whatsapp:checked + .radio-tile .radio-tile-label {
                    color: #25D366;
                  }

                  /* Instagram Branded Checked State */
                  .radio-tile-group .input-container #instagram:checked + .radio-tile {
                    background-color: rgba(225, 48, 108, 0.1);
                    border-color: #E1306C;
                    box-shadow: 0 4px 12px rgba(225, 48, 108, 0.15);
                    transform: scale(1.05);
                  }
                  .radio-tile-group .input-container #instagram:checked + .radio-tile .icon img {
                    filter: grayscale(0%) opacity(100%);
                  }
                  .radio-tile-group .input-container #instagram:checked + .radio-tile .radio-tile-label {
                    color: #C13584;
                  }
                  .dark .radio-tile-group .input-container #instagram:checked + .radio-tile .radio-tile-label {
                    color: #fd5c63;
                  }

                  /* Facebook Branded Checked State */
                  .radio-tile-group .input-container #facebook:checked + .radio-tile {
                    background-color: rgba(24, 119, 242, 0.15);
                    border-color: #1877F2;
                    box-shadow: 0 4px 12px rgba(24, 119, 242, 0.15);
                    transform: scale(1.05);
                  }
                  .radio-tile-group .input-container #facebook:checked + .radio-tile .icon img {
                    filter: grayscale(0%) opacity(100%);
                  }
                  .radio-tile-group .input-container #facebook:checked + .radio-tile .radio-tile-label {
                    color: #0d47a1;
                  }
                  .dark .radio-tile-group .input-container #facebook:checked + .radio-tile .radio-tile-label {
                    color: #1877F2;
                  }

                  /* Email Branded Checked State */
                  .radio-tile-group .input-container #email:checked + .radio-tile {
                    background-color: rgba(234, 67, 53, 0.1);
                    border-color: #EA4335;
                    box-shadow: 0 4px 12px rgba(234, 67, 53, 0.15);
                    transform: scale(1.05);
                  }
                  .radio-tile-group .input-container #email:checked + .radio-tile .icon img {
                    filter: grayscale(0%) opacity(100%);
                  }
                  .radio-tile-group .input-container #email:checked + .radio-tile .radio-tile-label {
                    color: #c62828;
                  }
                  .dark .radio-tile-group .input-container #email:checked + .radio-tile .radio-tile-label {
                    color: #ef5350;
                  }
                `}} />

                <div className="radio-tile-group">
                  {[
                    { id: "whatsapp", label: "WhatsApp", icon: IconWhatsApp },
                    { id: "instagram", label: "Instagram", icon: IconInstagram },
                    { id: "facebook", label: "Facebook", icon: IconFacebook },
                    { id: "email", label: "Email", icon: IconEmail },
                  ].map((option) => {
                    const Icon = option.icon;
                    return (
                      <div className="input-container" key={option.id}>
                        <input
                          id={option.id}
                          className="radio-button"
                          type="radio"
                          name="contactPreference"
                          checked={form.contactPreference === option.id}
                          onChange={() => {
                            setForm((prev) => {
                              const nextHandle = option.id === "whatsapp" ? prev.contactHandle.replace(/[^\d+]/g, "") : prev.contactHandle;
                              return { ...prev, contactPreference: option.id, contactHandle: nextHandle };
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
                          <label htmlFor={option.id} className="radio-tile-label">{option.label}</label>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {errors.contactPreference && <span className="text-red-500 text-xs mt-1 block mb-4">{errors.contactPreference}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: 'var(--foreground)' }}>
                  {t("labelContactHandle")} *
                </label>
                <input
                  type="text"
                  name="contactHandle"
                  value={form.contactHandle}
                  onChange={handleInputChange}
                  placeholder={
                    form.contactPreference === "whatsapp" ? "910 000 000"
                      : form.contactPreference === "instagram" ? "@username"
                      : form.contactPreference === "facebook" ? "facebook.com/username"
                      : "email@exemplo.com"
                  }
                  className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-700 transition-colors ${errors.contactHandle ? "border-red-500" : "border-slate-200 dark:border-slate-850"}`}
                />
                {errors.contactHandle && <span className="text-red-500 text-xs mt-1 block">{errors.contactHandle}</span>}
              </div>
            </div>

            {/* Send Button (Uiverse.io by adamgiebl - adapted) */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn-send-msg ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <div className="svg-wrapper-1">
                <div className="svg-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22">
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path fill="currentColor" d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z" />
                  </svg>
                </div>
              </div>
              <span>
                {isSubmitting ? (language === "pt" ? "A enviar..." : "Sending...") : t("btnSendMessage")}
              </span>
            </button>
          </form>
        </div>

        {/* Right Side: Contact Details & Image */}
        <div className="lg:col-span-5 space-y-6" style={{ color: 'var(--foreground)' }}>
          {/* Contact Details Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h2 className="font-extrabold text-lg border-b border-slate-100 dark:border-slate-800 pb-3" style={{ color: 'var(--foreground)' }}>
              {t("contactInfoTitle")}
            </h2>

            <ul className="space-y-4 text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
              <li className="flex items-start space-x-3">
                <div className="bg-[#F2C879]/10 text-[#F2C879] p-2 rounded-lg flex-shrink-0 shadow-inner">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold tracking-wider mb-0.5" style={{ color: 'var(--foreground)' }}>Telefone</span>
                  <span>+351 913 625 082</span>
                </div>
              </li>

              <li className="flex items-start space-x-3">
                <div className="bg-[#F2C879]/10 text-[#F2C879] p-2 rounded-lg flex-shrink-0 shadow-inner">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold tracking-wider mb-0.5" style={{ color: 'var(--foreground)' }}>Email</span>
                  <a href="mailto:ziilaserloja@gmail.com" className="hover:text-[#F2C879] transition-colors" style={{ color: 'var(--foreground)' }}>
                    ziilaserloja@gmail.com
                  </a>
                </div>
              </li>

              <li className="flex items-start space-x-3">
                <div className="bg-[#F2C879]/10 text-[#F2C879] p-2 rounded-lg flex-shrink-0 shadow-inner">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold tracking-wider mb-0.5" style={{ color: 'var(--foreground)' }}>Morada</span>
                  <span>Coimbra, Portugal</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Decorative Brand Image */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm">
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden relative shadow-inner">
              <img
                src="/teamwork.jpeg"
                alt="Zii Laser Teamwork"
                className="w-full h-full object-cover object-center scale-105 blur-[2px]"
              />
              <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] flex items-center justify-center p-6">
                <span className="text-white text-lg font-bold text-center tracking-wide leading-relaxed drop-shadow-md">
                  Respondo em qualquer hora assim que possível, obrigado!
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal Overlay */}
      {success && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-lg w-full rounded-3xl p-8 shadow-2xl space-y-6 text-center animate-scale-up relative">
            <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="h-8 w-8 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-950 dark:text-slate-50">
                {language === "pt" ? "Mensagem Enviada com Sucesso!" : "Message Sent Successfully!"}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-450 font-medium">
                {t("contactSuccess")}
              </p>
            </div>
            <button
              onClick={() => setSuccess(false)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all"
            >
              {language === "pt" ? "Fechar" : "Close"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
