'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Card } from 'react-bootstrap';
import Link from 'next/link';
import { FaClock, FaDollarSign, FaChartLine } from 'react-icons/fa';

export default function ProductsPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const products = [
    {
      title: 'AgroPack. Типовой бизнес-план',
      description:
        'Комплект документов (бизнес-план, приложения, презентация) для подачи заявки на субсидии/гранты Минсельхоза. Работа ведется по нормативной документации. Возможна коммуникация с грантодателем.',
      price: 'от 15 000 рублей / 200$',
      time: 'Срок выполнения от 1 недели',
      stats: '119 проектов в аграрной сфере',
    },
    {
      title: 'Lean Canvas. Бизнес-предложение для стартапов',
      description:
        'Для инновационных проектов и технологических стартапов. Итеративность, фокус на проблеме и ценности. Подготовка pitch deck.',
      price: 'от 10 000 рублей / 150$',
      time: 'Срок выполнения от 3 дней',
      stats: '35 финансовых моделей и 28 маркетинговых исследований',
    },
    {
      title: 'Core Plan. Базовый проект',
      description:
        'Разработка всех основных разделов бизнес-плана: маркетинг, производственный план, оценка рисков, расширенный финансовый раздел. Есть опция динамического расчета рентабельности.',
      price: 'от 30 000 рублей / 400$',
      time: 'Срок выполнения от 1 недели',
      stats: '236 бизнес‑планов в разных сферах',
    },
    {
      title: 'Pitch Pro. Детальный бизнес-план',
      description:
        'Подробный бизнес‑план для поиска инвестиций: стратегия маркетинга, SWOT-анализ, финансовая модель UNIDO/EBRD с дисконтированием доходов.',
      price: 'от 80 000 рублей / 1000$',
      time: 'Срок выполнения 1–2 месяца',
      stats: 'Привлечено более 2,45 млн $ инвестиций',
    },
    {
      title: 'StartUp Zoom. Консультация',
      description:
        'Онлайн консультация: знакомство, обсуждение задачи, выбор формата сотрудничества, условий и сроков.',
      price: 'бесплатно',
      time: '30 минут',
      stats: 'Более 50 успешных консультаций',
    },
    {
      title: 'Smart Numbers. Финансовый расчет',
      description:
        'Финансовая аналитика проекта: сценарии, Cash-flows, расчет рентабельности.',
      price: 'от 7000 рублей / 80$',
      time: 'Срок выполнения от 2 дней',
      stats: '35 финансовых моделей',
    },
    {
      title: 'Pure Analyze. Маркетинговый/финансовый анализ',
      description:
        'Анализ маркетинга, рынка и рисков проекта. Независимый взгляд на ваш бизнес.',
      price: 'от 5000 рублей / 50$',
      time: 'Срок выполнения от 3 дней',
      stats: '28 маркетинговых исследований',
    },
    {
      title: 'Partner Track. Постоянное сотрудничество',
      description:
        'Регулярное обновление бизнес-планов, онлайн-анализ новых сценариев и поддержание отношений с инвесторами и банками.',
      price: 'от 5000 рублей / 50$ в месяц',
      time: 'Постоянное сотрудничество',
      stats: 'Более 10 долгосрочных клиентов',
    },
    {
      title: 'Site Onboard. Разработка сайта',
      description:
        'Лэндинг или многостраничный сайт для представления проекта. Современное решение для инвесторов и клиентов.',
      price: 'от 5000 рублей / 50$',
      time: 'Срок выполнения от 2 дней',
      stats: '6 выполненных сайтов',
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
              <li className="nav-item"><a className="nav-link" href="/products" style={{ color: '#0785f6' }}>Продукты</a></li>
              <li className="nav-item"><a className="nav-link" href="/solutions" style={{ color: '#0785f6' }}>Решения</a></li>
              <li className="nav-item"><a className="nav-link" href="/blog" style={{ color: '#0785f6' }}>Блог</a></li>
              <li className="nav-item"><a className="nav-link" href="/about" style={{ color: '#0785f6' }}>О нас</a></li>
              <li className="nav-item"><a className="nav-link" href="/contacts" style={{ color: '#0785f6' }}>Контакты</a></li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main className="container py-5">
        <h1 className="mb-4" style={{ color: '#1e6078' }}>
          Продукты платформы
        </h1>
        <p style={{ color: '#0785f6', fontSize: '1.1rem' }}>
          Индивидуальные бизнес‑решения, которые выполняются лично экспертом под конкретную задачу. 
        </p>
        <div className="row g-4">
          {products.map((product, index) => (
            <div className="col-12 col-sm-6 col-lg-4" key={index}>
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
                <Card.Body>
                  <Card.Title style={{ color: '#1e6078' }}>
                    {product.title}
                  </Card.Title>
                  <Card.Text>{product.description}</Card.Text>
                  <ul className="list-unstyled mt-3 mb-4">
                    <li>
                      <FaDollarSign className="me-2 text-success" />
                      {product.price}
                    </li>
                    <li>
                      <FaClock className="me-2 text-primary" />
                      {product.time}
                    </li>
                    <li>
                      <FaChartLine className="me-2 text-secondary" />
                      {product.stats}
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-light py-4">
        <div className="container d-flex justify-content-between align-items-center small flex-wrap">
          <div className="text-muted">© {new Date().getFullYear()} Up & Grow. Все права защищены.</div>
          <ul className="list-inline mb-0">
            <li className="list-inline-item"><Link href="/">Главная</Link></li>
            <li className="list-inline-item"><Link href="/about">О нас</Link></li>
            <li className="list-inline-item"><Link href="/tools">Инструменты</Link></li>
            <li className="list-inline-item"><Link href="/blog">Блог</Link></li>
            <li className="list-inline-item"><Link href="/contact">Контакты</Link></li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
