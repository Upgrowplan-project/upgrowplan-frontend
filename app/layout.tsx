// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "aos/dist/aos.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import AOSWrapper from "./AOSWrapper";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title:
    "Upgrowplan | Бизнес-планы, Финансовые модели, Аналитика | Business-plans, Financial mdels, Analytics, Market research",
  description: "Upgrowplan: future planning service",
  icons: {
    icon: "/favicon.ico",
  },
  other: {
    "google-site-verification": "VC2der9heI-3B_vfBFC91po9GzPr3_j5iK5B-zjmVLs",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <AOSWrapper />
      <body className={`${inter.variable} antialiased`}>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
