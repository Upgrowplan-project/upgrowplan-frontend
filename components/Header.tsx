"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 1000, margin: 0 }}>
      <nav
        className="navbar navbar-expand-md navbar-light"
        style={{ backgroundColor: "#d7ecf6", margin: 0, padding: "0.5rem 0" }}
      >
        <div className="container">
          <Link href="/" className="navbar-brand d-flex align-items-center">
            <Image
              src="/LogoUpGrowSmall2.png"
              alt="Up&Grow Logo"
              width={40}
              height={40}
              style={{ maxWidth: "100%", height: "auto" }}
            />
            <span
              className="ms-2"
              style={{ color: "#1e6078", fontWeight: "bold" }}
            >
              Upgrowplan
            </span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-controls="navbarNav"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}
            id="navbarNav"
          >
            <ul className="navbar-nav ms-auto mb-2 mb-md-0">
              <li className="nav-item">
                <Link
                  href="/products"
                  className="nav-link"
                  style={{ color: "#0785f6" }}
                >
                  Продукты
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/solutions"
                  className="nav-link"
                  style={{ color: "#0785f6" }}
                >
                  Решения
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/blog"
                  className="nav-link"
                  style={{ color: "#0785f6" }}
                >
                  Блог
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/about"
                  className="nav-link"
                  style={{ color: "#0785f6" }}
                >
                  О нас
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/contacts"
                  className="nav-link"
                  style={{ color: "#0785f6" }}
                >
                  Контакты
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href={isLoggedIn ? "/account" : "/auth"}
                  className="nav-link"
                  style={{ color: "#0785f6" }}
                >
                  {isLoggedIn ? "Аккаунт" : "Войти"}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
