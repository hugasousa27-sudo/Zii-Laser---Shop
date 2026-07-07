"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "../context/AppContext";
import { ShoppingCart, Sun, Moon, Menu, X, Globe, ChevronDown, Key, Heart, Briefcase, Home as HomeIcon, Gift, PawPrint, Package, Trees, Ghost } from "lucide-react";

const FlagPT: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 12" className={className} width="16" height="12">
    <rect width="6.4" height="12" fill="#048243" />
    <rect x="6.4" width="9.6" height="12" fill="#e21c1a" />
    <circle cx="6.4" cy="6" r="2.5" fill="#f8d117" />
    <path d="M 6.4 4.5 C 5.3 4.5 5.3 7.5 6.4 7.5 C 7.5 7.5 7.5 4.5 6.4 4.5 Z" fill="#ffffff" stroke="#e21c1a" strokeWidth="0.5" />
  </svg>
);

const FlagEN: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className={className} width="16" height="12">
    <rect width="60" height="30" fill="#012169" />
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
    <path d="M0,0 L30,15 L0,15 M60,30 L30,15 L60,15 M60,0 L30,15 L60,0 M0,30 L30,15 L0,30" stroke="#c8102e" strokeWidth="2" />
    <path d="M30,0 L30,30 M0,15 L60,15" stroke="#fff" strokeWidth="10" />
    <path d="M30,0 L30,30 M0,15 L60,15" stroke="#c8102e" strokeWidth="6" />
  </svg>
);

export const Header: React.FC = () => {
  const { language, setLanguage, theme, toggleTheme, cart, t } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [isCategoriesHovered, setIsCategoriesHovered] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { href: "/", labelKey: "navHome" },
    { href: "/categories", labelKey: "navCategories", isDropdown: true },
    { href: "/about", labelKey: "navAbout" },
    { href: "/contact", labelKey: "navContact" },
  ];

  const categories = [
    { id: "1", nameKey: "catPortaChaves", slug: "Porta chaves", icon: Key },
    { id: "2", nameKey: "catDiaNamorados", slug: "Dia dos Namorados", icon: Heart },
    { id: "3", nameKey: "catProdEscritorio", slug: "Produtos de escritório", icon: Briefcase },
    { id: "4", nameKey: "catDecoracaoCasa", slug: "Decoração Casa", icon: HomeIcon },
    { id: "5", nameKey: "catLembrancas", slug: "Lembranças", icon: Gift },
    { id: "6", nameKey: "catParaAnimais", slug: "Para animais", icon: PawPrint },
    { id: "7", nameKey: "catCaixas", slug: "Caixas", icon: Package },
    { id: "8", nameKey: "catNatal", slug: "Natal", icon: Trees }
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-md transition-colors duration-300" style={{ borderColor: '#272727', backgroundColor: theme === 'dark' ? 'rgba(28,14,7,0.88)' : 'rgba(245,237,227,0.88)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          {!logoError ? (
            <img
              src="/newlogo.png"
              alt="Zii Laser Logo"
              className="h-10 sm:h-12 w-auto object-contain dark:brightness-0 dark:invert"
              onError={() => setLogoError(true)}
            />
          ) : (
            <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-amber-700 to-amber-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-amber-300">
              Zii Laser
            </span>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 h-full items-center">
          {navLinks.map((link) => (
            link.isDropdown ? (
              <div
                key={link.href}
                className="relative h-full flex items-center"
                onMouseEnter={() => setIsCategoriesHovered(true)}
                onMouseLeave={() => setIsCategoriesHovered(false)}
              >
                <Link
                  href={link.href}
                  className={`flex items-center gap-1 text-sm font-bold tracking-wide transition-colors duration-200 ${isActive(link.href) || isCategoriesHovered
                    ? "font-semibold"
                    : ""
                    }`}
                  style={{ color: isActive(link.href) || isCategoriesHovered ? '#B9844F' : '#272727' }}
                >
                  {t(link.labelKey)}
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isCategoriesHovered ? "rotate-180" : ""}`} />
                </Link>

                {/* Dropdown Menu */}
                {isCategoriesHovered && (
                  <div className="absolute top-full left-0 w-64 rounded-2xl shadow-xl py-4 z-50 animate-fade-in-up" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                    <div className="grid grid-cols-1 gap-1 px-3">
                      {categories.map((cat) => {
                        const Icon = cat.icon;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => {
                              setIsCategoriesHovered(false);
                              router.push(`/categories?category=${encodeURIComponent(cat.slug)}`);
                            }}
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-colors group"
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--accent)')}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}
                          >
                            <div className="p-2 rounded-lg transition-colors" style={{ backgroundColor: 'var(--accent)' }}>
                               <Icon className="h-4 w-4" style={{ color: 'var(--primary)' }} />
                            </div>
                             <span className="text-sm font-bold transition-colors" style={{ color: 'var(--foreground)' }}>
                              {t(cat.nameKey)}
                            </span>
                          </button>
                        );
                      })}
                      <div className="border-t border-slate-100 dark:border-slate-800 mt-2 pt-2">
                        <button
                          onClick={() => {
                            setIsCategoriesHovered(false);
                            router.push('/categories');
                          }}
                          className="w-full text-center text-xs font-bold py-2" style={{ color: 'var(--primary)' }}
                        >
                          Ver todas as categorias
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-bold tracking-wide transition-colors duration-200 h-full flex items-center ${isActive(link.href) ? 'font-semibold' : ''}`}
                style={{ color: isActive(link.href) ? '#B9844F' : '#272727' }}
              >
                {t(link.labelKey)}
              </Link>
            )
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Language Selector */}
          <div className="flex items-center p-1 rounded-full space-x-1" style={{ backgroundColor: 'var(--accent)' }}>
            <button
              onClick={() => setLanguage("pt")}
              className={`p-1.5 rounded-full text-xs transition-all flex items-center justify-center ${language === "pt"
                ? "shadow-sm scale-105"
                : ""
                }`}
              style={{ backgroundColor: language === 'pt' ? 'var(--card)' : 'transparent' }}
              title="Português"
              aria-label="Português"
            >
              <FlagPT className="w-5 h-4 rounded-sm shadow-sm" />
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`p-1.5 rounded-full text-xs transition-all flex items-center justify-center ${language === "en"
                ? "shadow-sm scale-105"
                : ""
                }`}
              style={{ backgroundColor: language === 'en' ? 'var(--card)' : 'transparent' }}
              title="English"
              aria-label="English"
            >
              <FlagEN className="w-5 h-4 rounded-sm shadow-sm" />
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition-colors" style={{ color: 'var(--foreground)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}
            aria-label="Alternar tema"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative p-2 rounded-full transition-colors" style={{ color: 'var(--foreground)' }}
            aria-label="Carrinho"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center animate-pulse" style={{ backgroundColor: '#048243' }}>
                {cartItemsCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-3">
          {/* Cart Link for Mobile */}
          <Link
            href="/cart"
            className="relative p-2 rounded-full" style={{ color: 'var(--foreground)' }}
            aria-label="Carrinho"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#048243' }}>
                {cartItemsCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full" style={{ color: 'var(--foreground)' }}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden transition-all duration-300" style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--card)' }}>
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors`}
                style={{ color: isActive(link.href) ? '#B9844F' : 'var(--foreground)', backgroundColor: isActive(link.href) ? 'var(--accent)' : 'transparent' }}
              >
                {t(link.labelKey)}
              </Link>
            ))}

            <hr className="border-slate-200 dark:border-slate-800 my-2" />

            {/* Mobile Actions */}
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm" style={{ color: 'var(--muted)' }}>{t("labelColor")} / Theme</span>
              <button
                onClick={toggleTheme}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm" style={{ backgroundColor: 'var(--accent)', color: 'var(--foreground)' }}
              >
                {theme === "light" ? (
                  <>
                    <Moon className="h-4 w-4" />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun className="h-4 w-4" />
                    <span>Light Mode</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm" style={{ color: 'var(--muted)' }}>Idioma / Language</span>
              <div className="flex p-0.5 rounded-md gap-1" style={{ backgroundColor: 'var(--accent)' }}>
                <button
                  onClick={() => setLanguage("pt")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold ${language === "pt" ? "shadow-sm" : ""}`}
                  style={{ backgroundColor: language === 'pt' ? 'var(--card)' : 'transparent', color: 'var(--foreground)' }}
                >
                  <FlagPT className="w-5 h-4 rounded-sm shadow-sm" /> Português
                </button>
                <button
                  onClick={() => setLanguage("en")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold ${language === "en" ? "shadow-sm" : ""}`}
                  style={{ backgroundColor: language === 'en' ? 'var(--card)' : 'transparent', color: 'var(--foreground)' }}
                >
                  <FlagEN className="w-5 h-4 rounded-sm shadow-sm" /> English
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
