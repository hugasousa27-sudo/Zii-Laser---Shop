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
    <footer style={{ backgroundColor: "#272727", color: "#F5EDE3" }} className="border-t border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* Brand & Socials */}
          <div className="flex flex-col items-center space-y-4">
            <div className="h-10 flex items-center justify-center">
              {!logoError ? (
                <img
                  src="/newlogo.png"
                  alt="Zii Laser Logo"
                  className="h-10 w-auto object-contain brightness-0 invert"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <h3 className="text-xl font-black tracking-wider text-white">
                  ZII LASER
                </h3>
              )}
            </div>
            <p className="text-sm max-w-sm" style={{ color: "#F5EDE3" }}>
              Artesanato, precisão e criatividade combinados em peças personalizadas feitas a pensar em si.
            </p>
            <div className="flex space-x-5 justify-center">
              {/* WhatsApp */}
              <a href="#" className="transition-opacity hover:opacity-70" aria-label="WhatsApp" style={{ color: "#F5EDE3" }}>
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              {/* Facebook */}
              <a href="#" className="transition-opacity hover:opacity-70" aria-label="Facebook" style={{ color: "#F5EDE3" }}>
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" className="transition-opacity hover:opacity-70" aria-label="Instagram" style={{ color: "#F5EDE3" }}>
                <svg className="h-5 w-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Contacts */}
          <div className="flex flex-col items-center space-y-4">
            <h4 className="font-semibold text-sm tracking-widest uppercase" style={{ color: "#F5EDE3" }}>
              {t("footerContacts")}
            </h4>
            <ul className="space-y-3 text-sm flex flex-col items-center" style={{ color: "#F5EDE3" }}>
              <li className="flex items-center space-x-3 justify-center">
                <Phone className="h-4 w-4 flex-shrink-0" style={{ color: "#F5EDE3" }} />
                <span>+351 913 625 082</span>
              </li>
              <li className="flex items-center space-x-3 justify-center">
                <Mail className="h-4 w-4 flex-shrink-0" style={{ color: "#F5EDE3" }} />
                <a href="mailto:ziilaserloja@gmail.com" className="transition-opacity hover:opacity-70" style={{ color: "#F5EDE3" }}>
                  ziilaserloja@gmail.com
                </a>
              </li>
              <li className="flex items-start space-x-3 justify-center">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "#F5EDE3" }} />
                <span className="max-w-xs">Coimbra, Portugal</span>
              </li>
            </ul>
          </div>

          {/* Info Pages */}
          <div className="flex flex-col items-center space-y-4">
            <h4 className="font-semibold text-sm tracking-widest uppercase" style={{ color: "#F5EDE3" }}>
              {t("footerInfo")}
            </h4>
            <ul className="space-y-3 text-sm flex flex-col items-center" style={{ color: "#F5EDE3" }}>
              <li className="flex items-center space-x-2 justify-center">
                <Shield className="h-4 w-4" style={{ color: "#F5EDE3" }} />
                <Link href="#" className="transition-opacity hover:opacity-70" style={{ color: "#F5EDE3" }}>
                  {t("footerPrivacy")}
                </Link>
              </li>
              <li className="flex items-center space-x-2 justify-center">
                <FileText className="h-4 w-4" style={{ color: "#F5EDE3" }} />
                <Link href="#" className="transition-opacity hover:opacity-70" style={{ color: "#F5EDE3" }}>
                  {t("footerTerms")}
                </Link>
              </li>
              <li className="flex items-center space-x-2 justify-center">
                <HelpCircle className="h-4 w-4" style={{ color: "#F5EDE3" }} />
                <Link href="#" className="transition-opacity hover:opacity-70" style={{ color: "#F5EDE3" }}>
                  {t("footerFAQ")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-white/10 my-8" />

        {/* Copyright */}
        <div className="flex flex-col items-center justify-center text-center text-xs space-y-2" style={{ color: "#F5EDE3" }}>
          <p>&copy; {currentYear} Zii Laser. Todos os direitos reservados.</p>
          <div className="flex space-x-4">
            <span>Desenvolvido com Next.js &amp; Tailwind</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
