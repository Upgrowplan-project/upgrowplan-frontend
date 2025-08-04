'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      {/* Header */}
      <header className="shadow-sm" style={{ backgroundColor: '#d7ecf6' }}>
        <nav className="navbar navbar-expand-md navbar-light container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <Image src="/LogoUpGrowSmall2.png" alt="Up&Grow Logo" width={40} height={40} />
            <span className="ms-2 fw-bold" style={{ color: '#1e6078' }}>
              UpGrowPlan
            </span>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}>
            <ul className="navbar-nav ms-auto mb-2 mb-md-0">
              <li className="nav-item"><a className="nav-link" href="/products" style={{ color: '#0785f6' }}>Продукты</a></li>
              <li className="nav-item"><a className="nav-link" href="#" style={{ color: '#0785f6' }}>Сервисы</a></li>
              <li className="nav-item"><a className="nav-link" href="#" style={{ color: '#0785f6' }}>Блог</a></li>
              <li className="nav-item"><a className="nav-link" href="#" style={{ color: '#0785f6' }}>О нас</a></li>
              <li className="nav-item"><a className="nav-link" href="/contacts" style={{ color: '#0785f6' }}>Контакты</a></li>
            </ul>
          </div>
        </nav>
      </header>

      <main>
{/* Hero Section с видео / картинкой */}
<section
  className="position-relative text-center d-flex flex-column justify-content-center align-items-center"
  style={{ minHeight: '60vh', color: '#fff', overflow: 'hidden' }}
  data-aos="fade-up"
>
  {/* Видео только для desktop */}
  <video
    className="position-absolute top-50 start-50 translate-middle d-none d-md-block"
    src="/video/hero.mp4"
    autoPlay
    muted
    loop
    playsInline
    style={{
      minWidth: '100%',
      minHeight: '100%',
      objectFit: 'cover',
      zIndex: -1
    }}
  />

  {/* Фоновая картинка только для мобильных */}
  <Image
    src="/images/hero-mobile.jpg"
    alt="Hero mobile"
    fill
    className="d-block d-md-none"
    style={{ objectFit: 'cover', zIndex: -1 }}
  />

  {/* Overlay только для desktop (чтобы не затемнять мобильную картинку) */}
  <div
    className="position-absolute top-0 start-0 w-100 h-100 d-none d-md-block"
    style={{ backgroundColor: 'rgba(30, 96, 120, 0.55)', zIndex: 0 }}
  />

  {/* Контент */}
  <div className="container position-relative" style={{ zIndex: 1 }}>
    <h1 className="fw-bold mb-3 px-3">
      От идеи до готового бизнес-плана и финансовой модели с AI и экспертной поддержкой
    </h1>
    <p className="lead mb-4 px-3" style={{ maxWidth: '800px', margin: '0 auto' }}>
      Вы занимаетесь тем, что зажигает вас — печёте хлеб, шьёте платье, преподаёте английский.
      Мы берём на себя расчёты и финансы. Non‑Excel люди не тратят время на скучные таблицы —
      мы, профессиональные экономисты и программисты, делаем это за вас.
    </p>
    <div className="d-flex gap-3 flex-wrap justify-content-center" data-aos="zoom-in">
      <a href="/brif" className="btn btn-primary btn-lg">Начать расчет →</a>
      <a href="#" className="btn btn-outline-light btn-lg">Посмотреть пример бизнес‑плана</a>
    </div>
  </div>
</section>


        {/* Что мы делаем */}
        <section className="container py-5" data-aos="fade-up">
          <h2 className="text-center mb-4" style={{ color: '#1e6078' }}>Что мы делаем</h2>
          <div className="row g-4">
            {[
              { src: '/images/tool1.jpg', title: 'Бизнес‑планы от эксперта', desc: 'Документы, которые убедят инвесторов и банки. Модели UNIDO/EBRD, Lean Canvas' },
              { src: '/images/tool2.jpg', title: 'Финансовые расчёты', desc: 'Точные и полные расчёты вашего проекта.' },
              { src: '/images/tool3.jpg', title: 'AI‑инструменты', desc: 'Быстрый результат с помощью натренированного искуственного интеллекта.' },
            ].map((tool, i) => (
              <div key={i} className="col-12 col-md-4 text-center" data-aos="zoom-in" data-aos-delay={i * 100}>
                <Image src={tool.src} alt={tool.title} width={600} height={400} className="img-fluid rounded shadow mb-3" />
                <h5>{tool.title}</h5>
                <p className="text-muted">{tool.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Почему нам доверяют */}
        <section className="py-5" style={{ backgroundColor: '#f8f9fa' }} data-aos="fade-up">
          <div className="container">
            <h2 className="text-center mb-4" style={{ color: '#1e6078' }}>Почему нам доверяют</h2>
            <div className="row text-center g-4">
              <div className="col-md-4" data-aos="fade-right">
                <h4 className="fw-bold">14+ лет опыта</h4>
                <p className="text-muted">Проверенные методики и реальные результаты.</p>
              </div>
              <div className="col-md-4" data-aos="fade-up">
                <h4 className="fw-bold">260+ проектов</h4>
                <p className="text-muted">Опыт и успешные кейсы.</p>
              </div>
              <div className="col-md-4" data-aos="fade-left">
                <h4 className="fw-bold">AI‑решения</h4>
                <p className="text-muted">Сложное делаем простым и быстро.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Почему это важно */}
        <section className="container py-5" data-aos="fade-up">
          <div className="row align-items-center g-4">
            <div className="col-md-6" data-aos="zoom-in">
              <Image src="/images/why-important.jpg" alt="Предприниматели" width={600} height={400} className="img-fluid rounded shadow" />
            </div>
            <div className="col-md-6">
              <h2 className="mb-3" style={{ color: '#1e6078' }}>Почему это важно?</h2>
              <p>
                Вы занимаетесь любимым делом, а мы берём на себя финансами, расчетами и
                бизнес-планированием. Не нужно разбираться в сложных таблицах — мы сделаем всё профессионально и быстро.
              </p>
            </div>
          </div>
        </section>

{/* AI-инструменты */}
<section className="py-5" style={{ backgroundColor: '#f8f9fa' }} data-aos="fade-up">
  <div className="container">
    <h2 className="text-center mb-4" style={{ color: '#1e6078' }}>Наши AI‑инструменты</h2>
    <div className="row g-4">

      {[
        {
          img: "/images/tool5.png",
          title: "FinPilot free",
          desc: "Автоматические финансовые модели. Получите бесплатный и мгновенный расчет прибыли / ипотеки / акции. Вариативность сценариев / стран"
        },
        {
          img: "/images/tool6.png",
          title: "PlanMaster AI",
          desc: "AI-генератор бизнес планов. Используются LLM-модели, натренированные по экономическому стеку + агенты, обеспечивающие модель актуальными данными о состоянии рынка и налогообложении. Технологии RAG, fine-tuning"
        },
        {
          img: "/images/tool7.png",
          title: "MarketSense AI",
          desc: "AI-консультант в Web / Telegram. Формирование стратегии, анализ рынка, гибридная финансовая модель"
        }
      ].map((tool, i) => (
        <div
          key={i}
          className="col-12 col-md-4 text-center d-flex flex-column align-items-center"
          data-aos="zoom-in"
          data-aos-delay={i * 100}
        >
          {/* Картинка фиксированной высоты */}
          <div
            className="d-flex align-items-center justify-content-center mb-3"
            style={{ height: "250px" }}
          >
            <Image
              src={tool.img}
              alt={tool.title}
              width={300}
              height={200}
              className="img-fluid rounded shadow"
              style={{ objectFit: "contain", maxHeight: "100%" }}
            />
          </div>

          <h5>{tool.title}</h5>
          <p className="text-muted">{tool.desc}</p>

          {/* Иконка "Скоро релиз" с Bootstrap Icon */}
          <div className="mt-auto d-flex flex-column align-items-center text-secondary">
            <i className="bi bi-hourglass-split" style={{ fontSize: "1.5rem" }}></i>
            <span className="small">Скоро релиз</span>
          </div>
        </div>
      ))}

    </div>
  </div>
</section>


        {/* Призыв к действию */}
        <section className="text-center py-5" data-aos="fade-up">
          <h2 className="mb-3" style={{ color: '#1e6078' }}>
            Сфокусируйтесь на любимом деле — остальное мы сделаем за вас
          </h2>
          <a href="/brif" className="btn btn-primary btn-lg">Получить расчет →</a>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-3 mt-5" style={{ backgroundColor: '#A8F000', color: '#000' }}>
        <div className="container d-flex justify-content-between flex-wrap">
          <div>© 2025 UpGrowPlan. Все права защищены.</div>
          <div>
            <a href="/policy" className="text-dark me-3">Политика конфиденциальности</a>
            <a href="/policy" className="text-dark">Пользовательское соглашение</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
