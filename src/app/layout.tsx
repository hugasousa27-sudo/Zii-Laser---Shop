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
  title: "Zii Laser | Online Shop",
  description: "Loja especializada em corte e gravação a laser em madeira, criando produtos personalizados com foco na qualidade, sustentabilidade e respeito pelo ambiente.",
  keywords: "loja online, e-commerce, madeira, portugal, comprar online, zii laser, madeira, corte a laser",
  authors: [{ name: "Zii Laser Team" }],
  robots: "index, follow",
  icons: "/favicon.jpg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-300">
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
