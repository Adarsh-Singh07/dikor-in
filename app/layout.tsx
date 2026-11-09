import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LenisProvider from "@/components/LenisProvider";
import SWRegister from "@/components/SWRegister";
import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "DIKOR · Custom 3D Miniatures Studio", template: "%s · DIKOR" },
  description:
    "DIKOR crafts custom 3D miniatures from your photos: dogs, cats, and human portraits. Hand-sculpted in resin, hand-painted in acrylic, delivered across India.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "DIKOR" },
  icons: { icon: "/favicon.svg", apple: "/favicon.svg" },
  openGraph: {
    title: "DIKOR · Custom 3D Miniatures Studio",
    description: "Turn your favourite photo into a hand-finished 3D miniature. Crafted with precision in Jalandhar.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF7F2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen bg-[#FAF7F2] font-sans text-charcoal antialiased selection:bg-rosegold selection:text-white">
        <LenisProvider>
          <SWRegister />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
