'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'aos/dist/aos.css';  // <-- добавили
import { useEffect } from "react";
import AOS from "aos";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "UpGrowPlan — Бизнес‑планы, Финансовые модели и Аналитика",
  description:
    "UpGrowPlan — профессиональные бизнес‑планы, финансовые модели и маркетинговые исследования. 16+ лет опыта, более 230 реализованных проектов и 2,45 млн $ привлеченных инвестиций. Помогаем запускать и развивать бизнес грамотно.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
