import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/client";
import LenisProvider from "@/components/LenisProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SWRegister from "@/components/SWRegister";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "DIKOR · Custom 3D-Printed Keepsakes", template: "%s · DIKOR" },
  description:
    "DIKOR crafts custom 3D-printed figurines from your photos — pet replicas, couple miniatures, idols & decor. Made with precision, shipped pan-India.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "DIKOR" },
  icons: { icon: "/icon", apple: "/apple-icon" },
  openGraph: {
    title: "DIKOR · Custom 3D-Printed Keepsakes",
    description: "Turn your favourite photo into a hand-finished keepsake. Made with precision.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF5EC",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body bg-cream text-charcoal antialiased">
        <AuthProvider>
          <LenisProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </LenisProvider>
        </AuthProvider>
        <SWRegister />
      </body>
    </html>
  );
}
