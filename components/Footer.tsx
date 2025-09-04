"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-light py-4">
      <div className="container d-flex justify-content-between align-items-center small flex-wrap">
        <div className="text-muted">
          © {new Date().getFullYear()} Upgrowplan. Все права защищены.
        </div>
        <ul className="list-inline mb-0" style={{ marginBottom: 0 }}>
          <li className="list-inline-item">
            <Link href="/" style={{ textDecoration: "none", color: "#0785f6" }}>
              Главная
            </Link>
          </li>
          <li className="list-inline-item">
            <Link
              href="/products"
              style={{ textDecoration: "none", color: "#0785f6" }}
            >
              Продукты
            </Link>
          </li>
          <li className="list-inline-item">
            <Link
              href="/solutions"
              style={{ textDecoration: "none", color: "#0785f6" }}
            >
              Решения
            </Link>
          </li>
          <li className="list-inline-item">
            <Link
              href="/about"
              style={{ textDecoration: "none", color: "#0785f6" }}
            >
              О нас
            </Link>
          </li>
          <li className="list-inline-item">
            <Link
              href="/blog"
              style={{ textDecoration: "none", color: "#0785f6" }}
            >
              Блог
            </Link>
          </li>
          <li className="list-inline-item">
            <Link
              href="/contacts"
              style={{ textDecoration: "none", color: "#0785f6" }}
            >
              Контакты
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
