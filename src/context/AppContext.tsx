"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import localesData from "../data/locales.json";

// Type definitions
export interface CartItem {
  cartItemId: string; // Unique string generated from id-size-color-custom
  id: string;
  namePt: string;
  nameEn: string;
  price: number;
  image: string;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  customText: string;
  uploadedImageFile?: File | null;  // The actual File object (not serializable to localStorage)
  uploadedImageName?: string;       // Name of the uploaded file for display
}

export interface CartItemInput {
  id: string;
  namePt: string;
  nameEn: string;
  price: number;
  image: string;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  customText: string;
  uploadedImageFile?: File | null;
  uploadedImageName?: string;
}

type Language = "pt" | "en";
type Theme = "light" | "dark";

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  cart: CartItem[];
  addToCart: (item: CartItemInput) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const locales = localesData as Record<Language, Record<string, string>>;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("pt");
  const [theme, setThemeState] = useState<Theme>("light");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load configuration from localStorage on mount (hydration safety)
  useEffect(() => {
    // 1. Theme Setup
    const storedTheme = localStorage.getItem("theme") as Theme;
    if (storedTheme) {
      setThemeState(storedTheme);
      if (storedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      // Default to system preference
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (systemPrefersDark) {
        setThemeState("dark");
        document.documentElement.classList.add("dark");
      }
    }

    // 2. Language Setup
    const storedLang = localStorage.getItem("language") as Language;
    if (storedLang) {
      setLanguageState(storedLang);
    }

    // 3. Cart Setup
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        console.error("Error parsing cart storage:", e);
      }
    }

    setMounted(true);
  }, []);

  // Sync state to localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setThemeState(nextTheme);
    localStorage.setItem("theme", nextTheme);

    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const addToCart = (input: CartItemInput) => {
    const cartItemId = `${input.id}-${input.selectedSize}-${input.selectedColor}-${input.customText.trim()}`;

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.cartItemId === cartItemId);
      let updatedCart: CartItem[];

      if (existingItemIndex > -1) {
        updatedCart = prevCart.map((item, idx) =>
          idx === existingItemIndex
            ? { ...item, quantity: item.quantity + input.quantity }
            : item
        );
      } else {
        updatedCart = [...prevCart, { ...input, cartItemId }];
      }

      // Note: File objects are not JSON-serializable; we omit them from localStorage
      // They are kept in memory only for the current session.
      const serializableCart = updatedCart.map(({ uploadedImageFile, ...rest }) => rest);
      localStorage.setItem("cart", JSON.stringify(serializableCart));
      return updatedCart;
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.cartItemId !== cartItemId);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  // Translation function
  const t = (key: string): string => {
    const translation = locales[language]?.[key];
    if (!translation) {
      return key;
    }
    return translation;
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        toggleTheme,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
