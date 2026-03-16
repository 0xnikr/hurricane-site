import type { Metadata } from "next";
import { Inter, Bebas_Neue, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import CartDrawer from "@/components/CartDrawer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hurricane Extracts — Premium Natural Supplements",
  description:
    "Fuel your body with nature's best. Hurricane Extracts offers lab-tested, 100% natural supplement extracts for energy, recovery, and immunity.",
  keywords: ["supplements", "natural extracts", "hurricane extracts", "health", "wellness"],
  openGraph: {
    title: "Hurricane Extracts — Premium Natural Supplements",
    description: "Fuel your body with nature's best. Lab-tested, 100% natural supplement extracts.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${bebasNeue.variable} ${playfairDisplay.variable}`}
      >
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
