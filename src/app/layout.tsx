import type { Metadata } from "next";
import { AppProvider } from "../context/AppContext";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ScrollToTop } from "../components/ScrollToTop";
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
  icons: {
    icon: [
      { url: "/favicon_io/favicon.ico" },
      { url: "/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/favicon_io/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "android-chrome-192x192", url: "/favicon_io/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/favicon_io/android-chrome-512x512.png" },
    ],
  },
  openGraph: {
    type: "website",
    title: "Zii Laser | Online Shop",
    description: "Loja especializada em corte e gravação a laser em madeira, criando produtos personalizados com foco na qualidade, sustentabilidade e respeito pelo ambiente.",
    images: [
      {
        url: "/florest_com_logo.jpg",
        width: 1200,
        height: 630,
        alt: "Zii Laser Logo",
      },
    ],
    locale: "pt_PT",
    siteName: "Zii Laser",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zii Laser | Online Shop",
    description: "Loja especializada em corte e gravação a laser em madeira, criando produtos personalizados com foco na qualidade, sustentabilidade e respeito pelo ambiente.",
    images: ["/florest_com_logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className="h-full">
      <body className="min-h-full flex flex-col antialiased selection:bg-amber-700 selection:text-white transition-colors duration-300" style={{ color: 'var(--foreground)' }}>
        <AppProvider>
          <ScrollToTop />
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
