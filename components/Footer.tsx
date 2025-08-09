'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-light py-4">
      <div className="container d-flex justify-content-between align-items-center small flex-wrap">
        <div className="text-muted">© {new Date().getFullYear()} Up & Grow. Все права защищены.</div>
        <ul className="list-inline mb-0" style={{ marginBottom: 0 }}>
          <li className="list-inline-item">
            <Link href="/" style={{ textDecoration: 'none', color: '#0785f6' }}>
              Главная
            </Link>
          </li>
          <li className="list-inline-item">
            <Link href="/about" style={{ textDecoration: 'none', color: '#0785f6' }}>
              О нас
            </Link>
          </li>
          <li className="list-inline-item">
            <Link href="/tools" style={{ textDecoration: 'none', color: '#0785f6' }}>
              Инструменты
            </Link>
          </li>
          <li className="list-inline-item">
            <Link href="/blog" style={{ textDecoration: 'none', color: '#0785f6' }}>
              Блог
            </Link>
          </li>
          <li className="list-inline-item">
            <Link href="/contact" style={{ textDecoration: 'none', color: '#0785f6' }}>
              Контакты
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
