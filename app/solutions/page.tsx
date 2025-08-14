'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Card } from 'react-bootstrap';
import Link from 'next/link';
import { FiCpu, FiBarChart2, FiUsers, FiFileText } from 'react-icons/fi';
import { FaHourglassHalf } from 'react-icons/fa';

export default function SolutionsPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const solutions = [
    {
      title: 'FinPilot Free',
      description:
        'Готовые финансовые моделеи. Открывай, меняй параметры, смотри прогнозы — всё бесплатно.',
      icon: <FiBarChart2 className="me-2 text-success" />,
      link: '/fin-model/model1/',
    },
    {
      title: 'MarketSense AI Agent',
      description:
        'AI-агент, который ищет и анализирует инфу по твоему запросу. Данные, тренды, инсайты — в одном месте.',
      icon: <FiCpu className="me-2 text-primary" />,
      release: 'осень 2025',
    },
    {
      title: 'Сompetitors Research AI Agent',
      description:
        'Версия Research Agent, но с фокусом на разборе твоих конкурентов. Локальный и точный анализ ниши.',
      icon: <FiUsers className="me-2 text-warning" />,
      release: 'осень 2025',
    },
    {
      title: 'PlanMaster AI',
      description:
        'Мгновенно генерирует бизнес-планы на основе шаблонов и твоих данных. Готово к презентации инвесторам.',
      icon: <FiFileText className="me-2 text-danger" />,
      release: 'осень 2025',
    },
  ];

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <header>
        <nav
          className="navbar navbar-expand-md navbar-light"
          style={{ backgroundColor: '#d7ecf6' }}
        >
          <div className="container">
            <a className="navbar-brand d-flex align-items-center" href="/">
              <Image
                src="/LogoUpGrowSmall2.png"
                alt="Up&Grow Logo"
                width={40}
                height={40}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
              <span
                className="ms-2"
                style={{ color: '#1e6078', fontWeight: 'bold' }}
              >
                UpGrowPlan
              </span>
            </a>
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
              className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}
              id="navbarNav"
            >
              <ul className="navbar-nav ms-auto mb-2 mb-md-0">
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="/products"
                    style={{ color: '#0785f6' }}
                  >
                    Продукты
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="/solutions"
                    style={{ color: '#0785f6' }}
                  >
                    Решения
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#"
                    style={{ color: '#0785f6' }}
                  >
                    Блог
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="/about"
                    style={{ color: '#0785f6' }}
                  >
                    О нас
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="/contacts"
                    style={{ color: '#0785f6' }}
                  >
                    Контакты
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main className="container py-5">
        <h1 className="mb-4" style={{ color: '#1e6078' }}>
          Автоматические финтех инструменты
        </h1>
        <p style={{ color: '#0785f6', fontSize: '1.1rem' }}>
          Решения для тех, кто ценит свое время и готов использовать новые технологии.
        </p>
        <div className="row g-4">
          {solutions.map((solution, index) => (
            <div className="col-12 col-md-6" key={index}>
              <Card
                className="h-100 border-0"
                style={{
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  backgroundColor: '#fff',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.backgroundColor = '#d9ebf5';
                  el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
                  el.style.transform = 'scale(1.03)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.backgroundColor = '#fff';
                  el.style.boxShadow = 'none';
                  el.style.transform = 'scale(1)';
                }}
              >
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title style={{ color: '#1e6078', display: 'flex', alignItems: 'center' }}>
                      {solution.icon} {solution.title}
                    </Card.Title>
                    <Card.Text>{solution.description}</Card.Text>
                  </div>
                  <div className="mt-3 text-muted small d-flex align-items-center" style={{ gap: '6px' }}>
                    {solution.release && (
                      <>
                        <FaHourglassHalf /> Релиз {solution.release}
                      </>
                    )}
                  </div>
                  {solution.link && (
                    <div className="mt-3">
                      <Link
                        href={solution.link}
                        className="btn btn-primary w-100"
                        style={{ minWidth: '150px' }}
                      >
                        Открыть
                      </Link>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-light py-4">
        <div className="container d-flex justify-content-between align-items-center small flex-wrap">
          <div className="text-muted">
            © {new Date().getFullYear()} Up & Grow. Все права защищены.
          </div>
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
    </div>
  );
}
