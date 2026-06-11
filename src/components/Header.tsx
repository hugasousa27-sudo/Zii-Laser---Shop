"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "../context/AppContext";
import { ShoppingCart, Sun, Moon, Menu, X, Globe } from "lucide-react";

export const Header: React.FC = () => {
  const { language, setLanguage, theme, toggleTheme, cart, t } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const pathname = usePathname();

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { href: "/", labelKey: "navHome" },
    { href: "/categories", labelKey: "navCategories" },
    { href: "/about", labelKey: "navAbout" },
    { href: "/contact", labelKey: "navContact" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          {!logoError ? (
            <img
              src="/logo.png"
              alt="Vanguard Logo"
              className="h-10 sm:h-12 w-auto object-contain dark:brightness-200 dark:contrast-200"
              onError={() => setLogoError(true)}
            />
          ) : (
            <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
              VANGUARD
            </span>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-colors duration-200 ${
                isActive(link.href)
                  ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                  : "text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
              }`}
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Language Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-full space-x-1">
            <button
              onClick={() => setLanguage("pt")}
              className={`px-2 py-1 rounded-full text-xs transition-all ${
                language === "pt"
                  ? "bg-white dark:bg-slate-700 shadow-sm scale-105"
                  : "hover:bg-white/50 dark:hover:bg-slate-700/50"
              }`}
              title="Português"
              aria-label="Português"
            >
              🇵🇹 <span className="sr-only">PT</span>
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-2 py-1 rounded-full text-xs transition-all ${
                language === "en"
                  ? "bg-white dark:bg-slate-700 shadow-sm scale-105"
                  : "hover:bg-white/50 dark:hover:bg-slate-700/50"
              }`}
              title="English"
              aria-label="English"
            >
              🇬🇧 <span className="sr-only">EN</span>
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Alternar tema"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Carrinho"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 dark:bg-indigo-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center animate-pulse">
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
            className="relative p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Carrinho"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 dark:bg-indigo-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-all duration-300">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400"
                    : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                {t(link.labelKey)}
              </Link>
            ))}

            <hr className="border-slate-200 dark:border-slate-800 my-2" />

            {/* Mobile Actions */}
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm text-slate-500 dark:text-slate-400">{t("labelColor")} / Theme</span>
              <button
                onClick={toggleTheme}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm"
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
              <span className="text-sm text-slate-500 dark:text-slate-400">Idioma / Language</span>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md">
                <button
                  onClick={() => setLanguage("pt")}
                  className={`px-3 py-1 rounded-md text-xs font-semibold ${
                    language === "pt" ? "bg-white dark:bg-slate-700 shadow-sm" : ""
                  }`}
                >
                  🇵🇹 Português
                </button>
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-1 rounded-md text-xs font-semibold ${
                    language === "en" ? "bg-white dark:bg-slate-700 shadow-sm" : ""
                  }`}
                >
                  🇬🇧 English
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
