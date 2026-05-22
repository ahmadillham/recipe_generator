import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

// Load the Outfit font from Google Fonts for a modern, clean aesthetic
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fridge Recipe Generator — Cook With What You Have",
  description:
    "Enter the ingredients in your fridge and discover delicious recipes you can cook right now. No more food waste, no more meal planning stress.",
  keywords: ["recipe generator", "fridge ingredients", "cooking", "meal ideas"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="font-sans antialiased bg-gray-50 text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
