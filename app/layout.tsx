import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Inter_Tight } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LenisProvider from "@/components/LenisProvider";
import SWRegister from "@/components/SWRegister";
import { AuthProvider } from "@/lib/client";
import "./globals.css";

/* Fraunces: the editorial display serif for subheads and quotes.
   Upright-only weights 400-700: Next 14 crashes on the Fraunces italic axis. */
const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

/* Heavy grotesque for the monumental hero wordmark (premium-editorial-design step 1). */
const grotesk = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-grotesk",
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "DIKOR · Custom 3D Miniatures Studio", template: "%s · DIKOR" },
  description:
    "DIKOR crafts custom 3D miniatures from your photos: dogs, cats, and human portraits. Hand-sculpted in resin, hand-painted in acrylic, delivered across India.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "DIKOR" },
  icons: { icon: "/icon", apple: "/apple-icon" },
  openGraph: {
    title: "DIKOR · Custom 3D Miniatures Studio",
    description: "Turn your favourite photo into a hand-finished 3D miniature. Crafted with precision in Jalandhar.",
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
    <html lang="en" className={`${display.variable} ${body.variable} ${grotesk.variable}`}>
      <body className="min-h-screen font-body bg-cream text-charcoal antialiased">
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
