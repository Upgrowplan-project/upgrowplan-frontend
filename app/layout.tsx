// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'aos/dist/aos.css';

import AOSWrapper from './AOSWrapper';

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
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AOSWrapper />
      <html lang="ru">
        <body className={`${inter.variable} antialiased`}>{children}</body>
      </html>
    </>
  );
}
