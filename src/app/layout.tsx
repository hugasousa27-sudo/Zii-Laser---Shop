import type { Metadata } from "next";
import { AppProvider } from "../context/AppContext";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import "./globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Vanguard Store | Loja Online Premium",
  description: "Descubra a melhor seleção de roupa, calçado, tecnologia, gaming e muito mais na Vanguard Store. Design moderno, qualidade premium e envios rápidos.",
  keywords: "loja online, e-commerce, roupa, calçado, tecnologia, portugal, comprar online, vanguard store",
  authors: [{ name: "Vanguard Team" }],
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-300">
        <AppProvider>
          <Header />
          <main className="flex-grow flex flex-col">
            {children}
          </main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
