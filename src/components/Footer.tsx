"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "../context/AppContext";
import { Phone, Mail, MapPin, HelpCircle, Shield, FileText } from "lucide-react";

export const Footer: React.FC = () => {
  const { t } = useApp();
  const [logoError, setLogoError] = useState(false);

  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: "#5e3023" }} className="text-white border-t border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Socials */}
          <div className="space-y-4">
            <div className="h-10 flex items-center">
              {!logoError ? (
                <img
                  src="/newlogo.png"
                  alt="Vanguard Logo"
                  className="h-10 w-auto object-contain brightness-0 invert"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <h3 className="text-xl font-black tracking-wider text-white">
                  VANGUARD
                </h3>
              )}
            </div>
            <p className="text-sm text-white">
              {t("footerDesc")}
            </p>
            <div className="flex space-x-4">
              {/* Facebook Custom SVG */}
              <a href="#" className="hover:text-indigo-300 text-white transition-colors" aria-label="Facebook">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z"/>
                </svg>
              </a>
              {/* Instagram Custom SVG */}
              <a href="#" className="hover:text-indigo-300 text-white transition-colors" aria-label="Instagram">
                <svg className="h-5 w-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              {/* YouTube Custom SVG */}
              <a href="#" className="hover:text-indigo-300 text-white transition-colors" aria-label="YouTube">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.524 3.545 12 3.545 12 3.545s-7.525 0-9.388.51a3.003 3.003 0 0 0-2.11 2.108C0 8.026 0 12 0 12s0 3.974.502 5.837a3.003 3.003 0 0 0 2.11 2.108c1.863.51 9.388.51 9.388.51s7.525 0 9.388-.51a3.003 3.003 0 0 0 2.11-2.108c.502-1.863.502-5.837.502-5.837s0-3.974-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              {/* TikTok Custom SVG */}
              <a href="#" className="hover:text-indigo-300 text-white transition-colors" aria-label="TikTok">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.01 1.7 4.14 1.13 1.1 2.67 1.7 4.27 1.8v3.9c-1.78-.02-3.53-.55-5.01-1.5v6.52c-.05 3.3-2.02 6.32-5.11 7.42-3.1 1.11-6.66.42-9.06-1.76C.68 18.25-.4 14.8.1 11.66c.5-3.12 2.82-5.74 5.92-6.59 1.1-.3 2.24-.36 3.37-.17V8.9c-.83-.17-1.7-.12-2.5.15-1.63.53-2.85 2.02-3 3.73-.18 2.06 1.15 3.98 3.16 4.47 2.02.5 4.17-.6 4.78-2.54.19-.62.24-1.28.2-1.93V.02z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Contacts */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm tracking-widest uppercase">
              {t("footerContacts")}
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-indigo-300 flex-shrink-0" />
                <span>+351 210 000 000</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-indigo-300 flex-shrink-0" />
                <a href="mailto:suporte@vanguard.com" className="hover:text-indigo-200 transition-colors">
                  suporte@vanguard.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-indigo-300 flex-shrink-0 mt-0.5" />
                <span>Av. da Liberdade 123, 1250-140 Lisboa, Portugal</span>
              </li>
            </ul>
          </div>

          {/* Info Pages */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm tracking-widest uppercase">
              {t("footerInfo")}
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-indigo-300" />
                <Link href="#" className="hover:text-indigo-200 transition-colors">
                  {t("footerPrivacy")}
                </Link>
              </li>
              <li className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-indigo-300" />
                <Link href="#" className="hover:text-indigo-200 transition-colors">
                  {t("footerTerms")}
                </Link>
              </li>
              <li className="flex items-center space-x-2">
                <HelpCircle className="h-4 w-4 text-indigo-300" />
                <Link href="#" className="hover:text-indigo-200 transition-colors">
                  {t("footerFAQ")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Payments */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm tracking-widest uppercase">
              {t("footerPayments")}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold font-mono">
              <div className="bg-slate-800 p-2.5 rounded hover:bg-slate-700 text-white transition-colors flex items-center justify-center">
                <span>VISA</span>
              </div>
              <div className="bg-slate-800 p-2.5 rounded hover:bg-slate-700 text-white transition-colors flex items-center justify-center">
                <span>MASTERCARD</span>
              </div>
              <div className="bg-slate-800 p-2.5 rounded hover:bg-slate-700 text-white transition-colors flex items-center justify-center">
                <span>PAYPAL</span>
              </div>
              <div className="bg-slate-800 p-2.5 rounded hover:bg-slate-700 text-white transition-colors flex items-center justify-center">
                <span>MB WAY</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-white/10 my-8" />

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-white">
          <p>&copy; {currentYear} Vanguard Store. Todos os direitos reservados.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <span>Desenvolvido com Next.js & Tailwind</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
