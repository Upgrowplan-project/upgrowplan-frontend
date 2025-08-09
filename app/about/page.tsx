'use client';

import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function AboutPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const Card = ({ children }: { children: React.ReactNode }) => (
    <div className="col-md-6 mb-4 d-flex justify-content-center">
      <div
        className="card p-4 h-100 w-100 text-dark border-0"
        style={{ 
          backgroundColor: '#fff', 
          borderRadius: '12px',
          transition: 'all 0.3s ease'
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
        {children}
      </div>
    </div>
  );

  // Компонент для блоков на полную ширину (без hover-эффекта)
  const FullWidthCard = ({ children }: { children: React.ReactNode }) => (
    <div className="col-12 mb-4">
      <div
        className="card p-4 text-dark border-0 full-width-block"
        style={{ 
          backgroundColor: '#fff', 
          borderRadius: '12px'
        }}
      >
        {children}
      </div>
    </div>
  );

  // Компонент для карточки члена команды
  const TeamMemberCard = ({ name, role, description, photoSrc }: { 
    name: string; 
    role: string; 
    description: string; 
    photoSrc: string;
  }) => (
    <div className="col-md-4 mb-4">
      <div className="text-center p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', height: '100%' }}>
        <div className="mx-auto mb-3" style={{ width: '80px', height: '80px' }}>
          <Image
            src={photoSrc}
            alt={`${name} фото`}
            width={80}
            height={80}
            className="rounded-circle"
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            onError={(e) => {

              const target = e.target as HTMLImageElement;
              target.style.display = 'none';

            }}
          />

        </div>
        <h5 className="mb-2" style={{ color: '#1e6078' }}>{name}</h5>
        <p className="text-muted small mb-3">{role}</p>
        <p className="mb-0 small">{description}</p>
      </div>
    </div>
  );


  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <header>
        <nav className="navbar navbar-expand-md navbar-light" style={{ backgroundColor: '#d7ecf6' }}>
          <div className="container">
            <a className="navbar-brand d-flex align-items-center" href="/">
              <Image src="/LogoUpGrowSmall2.png" alt="Up&Grow Logo" width={40} height={40} style={{ maxWidth: '100%', height: 'auto' }} />
              <span className="ms-2" style={{ color: '#1e6078', fontWeight: 'bold' }}>
                Upgrowplan
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
            <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navbarNav">
              <ul className="navbar-nav ms-auto mb-2 mb-md-0">
                <li className="nav-item"><a className="nav-link" href="/products" style={{ color: '#0785f6' }}>Продукты</a></li>
                <li className="nav-item"><a className="nav-link" href="#" style={{ color: '#0785f6' }}>Сервисы</a></li>
                <li className="nav-item"><a className="nav-link" href="#" style={{ color: '#0785f6' }}>Блог</a></li>
                <li className="nav-item"><a className="nav-link" href="/about" style={{ color: '#0785f6' }}>О нас</a></li>
                <li className="nav-item"><a className="nav-link" href="/contacts" style={{ color: '#0785f6' }}>Контакты</a></li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {/* КОНТЕНТ СТРАНИЦЫ */}
      <main className="container py-5">
        <h1 className="mb-4" style={{ color: '#1e6078' }}>О проекте Upgrowplan</h1>
        <p style={{ color: '#0785f6', fontSize: '1.1rem', marginBottom: '2rem' }}>
          Upgrowplan — это небольшая независимая команда экспертов, которая сочетает глубокие знания в области экономики с современными технологиями для создания инструментов планирования и развития бизнеса.
        </p>

{/* Блок "Кто мы" - на полную ширину */}
<div className="row justify-content-center">
  <FullWidthCard>
    <h2 className="text-center mb-4" style={{ color: '#1e6078' }}>🧠 Кто мы</h2>
    <p className="mb-4 text-center">
      Upgrowplan — это небольшая, независимая команда, сочетающая экономическую экспертизу, аналитику и разработку.
    </p>
    
    <div className="row">
      <TeamMemberCard 
        name="Денис Налетов"
        role="Основатель, экономист, full-stack разработчик"
        description="Более 15 лет опыта в бизнес-планировании и консалтинге. Специализируется на финансовом моделировании, интеграции ИИ в бизнес-процессы и разработке цифровых решений для малого и среднего бизнеса."
        photoSrc="/images/denis.jpg"
        /* Добавить пропс для отключения инициалов, если есть */
        
      />
      <TeamMemberCard 
        name="Анна Соколова"
        role="Экономист, бизнес-аналитик"
        description="Высококвалифицированный специалист в области экономического анализа и маркетинговых исследований. Отвечает за подготовку аналитических отчетов и проведение исследований рынка для клиентов компании."
        photoSrc="/images/anna.jpg"
        
      />
      <TeamMemberCard 
        name="Максим Петров"
        role="Веб-разработчик, технический специалист"
        description="Опытный разработчик с широким техническим стеком и 5+ годами практического опыта. Занимается созданием пользовательских интерфейсов, интеграцией API и оптимизацией производительности веб-приложений."
        photoSrc="/images/dima.jpg"
        
      />
    </div>
  </FullWidthCard>
</div>


        <div className="row">
          <Card>
            <h2 className="text-center" style={{ color: '#1e6078' }}>🚀 Что мы делаем:</h2>
            <p>Мы создаём инструменты, которые помогают запускать и развивать бизнес. <br />Upgrowplan — это индивидуальные персонализированные решения и цифровые сервисы, которые объединяют бизнес-экспертизу и современные технологии. Мы автоматизируем расчёты, визуализируем данные, подсказываем, как двигаться, и помогаем принимать обоснованные решения.</p>
            <p><em>Основано на опыте. Улучшается вместе с вами.</em></p>
            <p><strong>🖼️ Место для иллюстрации:</strong> пользовательский интерфейс/скриншот сервиса, примеры шаблонов или дашборда</p>
          </Card>

          <Card>
            <h2 className="text-center" style={{ color: '#1e6078' }}>🔍 Наш подход</h2>
            <ul>
              <li>💡 Практика, а не теория. Всё основано на реальных задачах клиентов.</li>
              <li>⚙️ Экономика + технологии. Мы объединяем классический консалтинг с возможностями автоматизации, визуализации и аналитики.</li>
              <li>🤖 ИИ не ради ИИ. Используем LLM, API, RAG и настройку параметров модели. Готовим данные, обучаем модели и встраиваем в реальные процессы — чтобы они действительно помогали.</li>
              <li>📈 Результат важнее процесса. Протестировали, улучшили, оставили. Если не помогает — убрали.</li>
            </ul>
          </Card>
        </div>

        {/* Блок "Кратко о нас" - на полную ширину */}
        <div className="row justify-content-center">
          <FullWidthCard>
            <h2 className="text-center" style={{ color: '#1e6078' }}>📊 Кратко о нас</h2>
            <div className="table-responsive">
              <table className="table table-striped">
                <tbody>
                  <tr><td>🧾 Бизнес-планов</td><td>230+</td></tr>
                  <tr><td>📉 Финансовых моделей</td><td>35+</td></tr>
                  <tr><td>📚 Маркетинговых исследований</td><td>28</td></tr>
                  <tr><td>💰 Привлечено инвестиций и кредитов</td><td>$2,45 млн+</td></tr>
                  <tr><td>👨‍💼 Опыт в бизнесе и технологиях</td><td>15+ лет</td></tr>
                  <tr><td>🤖 Интеграция ИИ</td><td>LLM + RAG + API + Custom datasets</td></tr>
                </tbody>
              </table>
            </div>
          </FullWidthCard>
        </div>

        <div className="row">
          <Card>
            <h2 className="text-center" style={{ color: '#1e6078' }}>🌍 Отрасли, с которыми мы работали</h2>
            <ul>
              <li>Фермерские хозяйства и агротуризм — 119 проектов</li>
              <li>Строительство (дома, отели) — 6 проектов</li>
              <li>Кафе и рестораны — 7 проектов</li>
              <li>Логистика и дистрибуция — 12 проектов</li>
              <li>Производственные компании - 5 проектов</li>
              <li>Технологические и сервисные стартапы - 6 проектов</li>
              <li>Прочие направления — от агротуризма до международной логистики</li>
            </ul>
          </Card>

          <Card>
            <h2 className="text-center" style={{ color: '#1e6078' }}>🛠️ Компетенции</h2>
            <ul>
              <li>экономический и финансовый анализ</li>
              <li>математический анализ и экономические модели</li>
              <li>классическая и цифровая маркетинговая экспертиза</li>
              <li>налоговое и финансовое право</li>
              <li>управление ресурсами, проектами, кадрами</li>
              <li>системы учета данных 1С, SAP, Power BI</li>
              <li>обработка данных Excel, SQL, Mongo DB</li>
            </ul>
          </Card>
        </div>

        {/* Блок "Новый блок" - на полную ширину */}
        <div className="row justify-content-center">
          <FullWidthCard>
            <h2 className="text-center" style={{ color: '#1e6078' }}>🆕 Новый блок</h2>
            <p className="text-center">(позже будет контент)</p>
          </FullWidthCard>
        </div>

        <div className="row">
          <Card>
            <h2 className="text-center" style={{ color: '#1e6078' }}>🔭 Куда мы движемся:</h2>
            <ul>
              <li>✍️ Конструктор бизнес-планов — с гибкой структурой и актуальными данными</li>
              <li>💸 Финансовая модель нового поколения — с визуализацией, ИИ и API-интеграцией</li>
              <li>🧠 Интеллектуальная поддержка — LLM с RAG, параметризацией и дополнением контекста через живой поиск</li>
              <li>📂 Централизованный доступ к шаблонам, дашбордам и инструментам</li>
            </ul>
          </Card>

<Card>
  <h2 className="text-center" style={{ color: '#1e6078' }}>⚙️ Стэк технологий</h2>
  <p><strong>🧠 Для продвинутых пользователей:</strong></p>
  <ul>
    <li>используем LLM API</li>
    <li>RAG</li>
    <li>интеграции через OpenAPI</li>
    <li>тонкую настройку промптов и параметров</li>
    <li>обогащение моделей собственными датасетами</li>
    <li>CI/CD пайплайны</li>
    <li>Стек: Java, Spring Boot, Node.js, SQL, MongoDB, RabbitMQ, Power BI, LLM tools (OpenAI, LangChain и др.)</li>
  </ul>
</Card>


        </div>

        {/* Блок "Мы открыты" - на полную ширину */}
        <div className="row justify-content-center">
          <FullWidthCard>
            <h2 className="text-center" style={{ color: '#1e6078' }}>🤝 Мы открыты</h2>
            <p className="text-center">Upgrowplan развивается вместе с сообществом. Мы ценим обратную связь, любим эксперименты и открыты к партнёрствам.<br />📬 Если вы хотите предложить идею, протестировать бета-функции или просто поговорить — <Link href="/contact">оставьте заявку</Link> или напишите нам напрямую.</p>
          </FullWidthCard>
        </div>
      </main>

      {/* ФУТЕР */}
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