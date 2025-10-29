"use client";

import { useState, FormEvent } from "react";
import styles from "./openAbroad.module.css";
import Header from "../../../components/Header";

interface TaxInfo {
  vat: string;
  profit_tax: string;
  payroll_tax: string;
  other_taxes: string;
}

interface BusinessResponse {
  country: string;
  business_type: string;
  currency: string;
  registration_cost_local: string;
  registration_cost_rub: string;
  required_documents: string[];
  remote_registration: string;
  taxes: TaxInfo;
  tax_authority_url: string;
  licensing_required: string;
  registration_period_days: string;
  average_rent_office_per_sqm: string;
  average_rent_retail_per_sqm: string;
  average_rent_warehouse_per_sqm: string;
  commercial_loan_rate: string;
  deposit_rate: string;
  central_bank_rate: string;
  major_bank_name: string;
  major_bank_url: string;
  economic_freedom_index: string;
}

interface ValidationResponse {
  is_valid: boolean;
  corrected_business_type: string | null;
  message: string;
}

// Always use real API in production
const USE_MOCK_DATA = false;

// Страны без индекса экономической свободы
const COUNTRIES_WITHOUT_INDEX = [
  "Андорра", "Антигуа и Барбуда", "Гренада", "Гонконг", "Ирак", "Ливия",
  "Лихтенштейн", "Макао", "Маршалловы Острова", "Монако", "Науру", "Палау",
  "Сент-Китс и Невис", "Сан-Марино", "Сомали", "Южный Судан", "Сирия",
  "Тувалу", "Ватикан", "Йемен"
];

// Список всех стран для выбора
const ALL_COUNTRIES = [
  "Австралия", "Австрия", "Азербайджан", "Албания", "Алжир", "Аргентина",
  "Армения", "Афганистан", "Багамы", "Бангладеш", "Барбадос", "Бахрейн",
  "Беларусь", "Белиз", "Бельгия", "Бенин", "Болгария", "Боливия",
  "Босния и Герцеговина", "Ботсвана", "Бразилия", "Бруней", "Буркина-Фасо",
  "Бурundi", "Бутан", "Вануату", "Великобритания", "Венгрия", "Венесуэла",
  "Вьетнам", "Габон", "Гаити", "Гайана", "Гамбия", "Гана", "Гватемала",
  "Гвинея", "Гвинея-Бисау", "Германия", "Гондурас", "Греция", "Грузия",
  "Дания", "Джибути", "Доминика", "Доминиканская Республика", "Египет",
  "Замбия", "Зимбабве", "Израиль", "Индия", "Индонезия", "Иордания", "Иран",
  "Ирландия", "Исландия", "Испания", "Италия", "Кабо-Верде", "Казахстан",
  "Камбоджа", "Камерун", "Канада", "Катар", "Кения", "Кипр", "Киргизия",
  "Кирибати", "Китай", "Колумбия", "Коморы", "Конго", "Корея Северная",
  "Корея Южная", "Коста-Рика", "Кот-д'Ивуар", "Куба", "Кувейт", "Лаос",
  "Латвия", "Лесото", "Либерия", "Ливан", "Литва", "Люксембург",
  "Маврикий", "Мавритания", "Мадагаскар", "Малави", "Малайзия", "Мали",
  "Мальдивы", "Мальта", "Марокко", "Мексика", "Мозамбик", "Молдова",
  "Монголия", "Мьянма", "Намибия", "Непал", "Нигер", "Нигерия",
  "Нидерланды", "Никарагуа", "Новая Зеландия", "Норвегия", "ОАЭ", "Оман",
  "Пакистан", "Панама", "Папуа — Новая Гвинея", "Парагвай", "Перу",
  "Польша", "Португалия", "Россия", "Руанда", "Румыния", "Сальвадор",
  "Самоа", "Саудовская Аравия", "Северная Македония", "Сейшелы", "Сенегал",
  "Сербия", "Сингапур", "Словакия", "Словения", "Соломоновы Острова",
  "Судан", "Суринам", "США", "Сьерра-Леоне", "Таджикистан", "Таиланд",
  "Танзания", "Того", "Тонга", "Тринидад и Тобаго", "Тунис", "Туркменистан",
  "Турция", "Уганда", "Узбекистан", "Украина", "Уругвай", "Фиджи",
  "Филиппины", "Финляндия", "Франция", "Хорватия", "ЦАР", "Чад", "Черногория",
  "Чехия", "Чили", "Швейцария", "Швеция", "Шри-Ланка", "Эквадор",
  "Экваториальная Гвинея", "Эритрея", "Эсватини", "Эстония", "Эфиопия",
  "ЮАР", "Ямайка", "Япония"
];

// 🎬 Mock данные для тестирования
const getMockData = (
  country: string,
  businessType: string
): BusinessResponse => {
  return {
    country: country,
    business_type: businessType,
    currency: "EUR",
    registration_cost_local: "500-1500",
    registration_cost_rub: "50000-150000",
    required_documents: [
      "Паспорт гражданина",
      "Бизнес-план проекта",
      "Справка о несудимости",
      "Подтверждение адреса регистрации",
      "Устав компании",
      "Финансовая отчетность (при наличии)",
    ],
    remote_registration:
      "Частично: первичные документы можно подать онлайн, но для финальной регистрации требуется личное присутствие",
    taxes: {
      vat: "21%",
      profit_tax: "19%",
      payroll_tax: "33.8%",
      other_taxes: "Местные налоги 2-3%, туристический сбор",
    },
    tax_authority_url: "https://www.financnisprava.cz",
    licensing_required:
      "Требуется: санитарная лицензия, сертификат соответствия помещения нормам пожарной безопасности, медицинские книжки для персонала",
    registration_period_days: "5-10",
    average_rent_office_per_sqm: "15-25",
    average_rent_retail_per_sqm: "30-50",
    average_rent_warehouse_per_sqm: "8-15",
    commercial_loan_rate: "5-8%",
    deposit_rate: "2-3%",
    central_bank_rate: "4.5%",
    major_bank_name: "Deutsche Bank",
    major_bank_url: "https://www.deutschebank.de",
    economic_freedom_index: "74.8",
  };
};

export default function OpenAbroadPage() {
  const [country, setCountry] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BusinessResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLocalCurrency, setShowLocalCurrency] = useState(true);

  // API URL from environment variables
  // Development: uses http://localhost:8001 (local backend without prefix)
  // Production: uses Heroku URL with /openabroad prefix
  const API_URL = process.env.NEXT_PUBLIC_OPENABROAD_API_URL || "http://localhost:8001";
  const API_PREFIX = process.env.NEXT_PUBLIC_OPENABROAD_API_URL ? "/openabroad" : "";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!country.trim() || !businessType.trim()) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    // AI-валидация типа бизнеса через OpenAI
    try {
      const validationResponse = await fetch(`${API_URL}${API_PREFIX}/api/validate-business-type`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          business_type: businessType.trim(),
        }),
      });

      if (validationResponse.ok) {
        const validationData: ValidationResponse = await validationResponse.json();

        if (!validationData.is_valid) {
          setError(`Некорректный вид бизнеса. ${validationData.message}`);
          setLoading(false);
          return;
        }

        // Если есть исправленное название, используем его
        if (validationData.corrected_business_type) {
          setBusinessType(validationData.corrected_business_type);
        }
      }
      // Если валидация не удалась, продолжаем без неё
    } catch (validationError) {
      console.warn("Валидация недоступна, продолжаем без неё");
    }

    // 🎭 MOCK MODE - используем заглушку
    if (USE_MOCK_DATA) {
      // Имитация задержки сети
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockData = getMockData(country.trim(), businessType.trim());
      setResult(mockData);
      setLoading(false);
      return;
    }

    // 🔌 REAL API MODE - реальный запрос к бэкенду
    try {
      const response = await fetch(`${API_URL}${API_PREFIX}/api/business-info`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          country: country.trim(),
          business_type: businessType.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          detail: "Ошибка сервера",
        }));
        throw new Error(
          errorData.detail || `Ошибка получения данных (код ${response.status})`
        );
      }

      const data: BusinessResponse = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Ошибка запроса:", err);

      let errorMessage = "Произошла ошибка при получении данных";

      if (err instanceof TypeError && err.message.includes("fetch")) {
        errorMessage = "Не удалось подключиться к серверу. Проверьте подключение к интернету.";
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCountry("");
    setBusinessType("");
    setResult(null);
    setError(null);
  };

  return (
    <main className={styles.container}>
      <Header />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className="text-brand">Открыть бизнес за рубежом</h1>
          <p className={styles.heroDescription}>
            Получите точную информацию об открытии бизнеса в любой стране мира
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className={styles.formSection}>
        <div className={styles.card}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="country" className={styles.label}>
                  Страна
                </label>
                <select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={styles.input}
                  required
                >
                  <option value="">Выберите страну</option>
                  {ALL_COUNTRIES.map((countryName) => (
                    <option key={countryName} value={countryName}>
                      {countryName}
                    </option>
                  ))}
                </select>
                <small className={styles.helpText}>
                  Выберите страну из списка
                </small>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="businessType" className={styles.label}>
                  Вид бизнеса
                </label>
                <input
                  type="text"
                  id="businessType"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  placeholder="Например: Пекарня, IT-компания"
                  className={styles.input}
                  required
                />
                <small className={styles.helpText}>
                  Укажите подробно тип вашего бизнеса, например онлайн-школа английского языка
                </small>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? (
                <>
                  <span className={styles.spinner}></span>
                  Анализируем данные...
                </>
              ) : (
                <>✈️ Получить информацию</>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <section className={styles.errorSection}>
          <div className={styles.errorAlert}>
            <div className={styles.errorIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className={styles.errorContent}>
              <h3 className={styles.errorTitle}>Не удалось получить данные</h3>
              <p className={styles.errorMessage}>{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  handleSubmit(new Event('submit') as any);
                }}
                className={styles.retryButton}
              >
                Попробовать снова
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Results Section */}
      {result && (
        <section className={styles.resultsSection}>
          <div className={styles.resultsCard}>
            <div className={styles.resultsHeader}>
              <h2>
                Открытие бизнеса &quot;{result.business_type}&quot; в стране
                &quot;{result.country}&quot;
              </h2>
            </div>

            <div className={styles.resultsBody}>
              {/* Main Info Section */}
              <div className={styles.section}>
                <h3>Основная информация</h3>
                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Стоимость регистрации:</span>
                    <div className={styles.infoValueContainer}>
                      <div className={styles.currencyToggle}>
                        <button
                          onClick={() => setShowLocalCurrency(true)}
                          className={showLocalCurrency ? styles.active : ""}
                        >
                          {result.currency}
                        </button>
                        <button
                          onClick={() => setShowLocalCurrency(false)}
                          className={!showLocalCurrency ? styles.active : ""}
                        >
                          RUB
                        </button>
                      </div>
                      <span className={styles.infoValue}>
                        {showLocalCurrency
                          ? `${result.registration_cost_local} ${result.currency}`
                          : `${result.registration_cost_rub} ₽`}
                      </span>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Срок регистрации:</span>
                    <span className={styles.infoValue}>
                      {result.registration_period_days} рабочих дней
                    </span>
                  </div>

                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Дистанционная регистрация:</span>
                    <span>{result.remote_registration}</span>
                  </div>
                </div>
              </div>

              {/* Documents and Licensing */}
              <div className={styles.section}>
                <h3>Требуемые документы и лицензирование</h3>
                <ul className={styles.documentsList}>
                  {result.required_documents.map((doc, index) => (
                    <li key={index} className={styles.documentItem}>
                      {doc}
                    </li>
                  ))}
                  <li className={styles.documentItem}>
                    <strong>Лицензирование:</strong> {result.licensing_required}
                  </li>
                </ul>
              </div>

              {/* Taxes */}
              <div className={styles.section}>
                <h3>Налоги (%)</h3>
                <div className={styles.taxesGrid}>
                  <div className={styles.taxItem}>
                    <small>НДС</small>
                    <strong>{result.taxes.vat.replace('%', '')}</strong>
                  </div>
                  <div className={styles.taxItem}>
                    <small>Налог на прибыль</small>
                    <strong>{result.taxes.profit_tax.replace('%', '')}</strong>
                  </div>
                  <div className={styles.taxItem}>
                    <small>Налог на ФОТ</small>
                    <strong>{result.taxes.payroll_tax.replace('%', '')}</strong>
                  </div>
                  <div className={styles.taxItem}>
                    <small>Прочие налоги</small>
                    <strong>{result.taxes.other_taxes}</strong>
                  </div>
                </div>
                {result.tax_authority_url && (
                  <p className={styles.taxLinkBottom}>
                    <a
                      href={result.tax_authority_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.taxLink}
                    >
                      Официальный сайт налоговой службы страны →
                    </a>
                  </p>
                )}
              </div>

              {/* Rent */}
              <div className={styles.section}>
                <h3>Средняя аренда (за 1 м² в месяц, {result.currency})</h3>
                <div className={styles.rentGrid}>
                  <div className={styles.rentItem}>
                    <h4>Офис</h4>
                    <p className={styles.rentValue}>
                      {result.average_rent_office_per_sqm}
                    </p>
                  </div>
                  <div className={styles.rentItem}>
                    <h4>Торговая площадь</h4>
                    <p className={styles.rentValue}>
                      {result.average_rent_retail_per_sqm}
                    </p>
                  </div>
                  <div className={styles.rentItem}>
                    <h4>Склад</h4>
                    <p className={styles.rentValue}>
                      {result.average_rent_warehouse_per_sqm}
                    </p>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div className={styles.section}>
                <h3>Финансовая информация (% годовых)</h3>
                <div className={styles.financialGrid}>
                  <div className={styles.financialItem}>
                    <small>Коммерческие кредиты</small>
                    <strong>{result.commercial_loan_rate.replace('%', '').trim()}</strong>
                    {result.major_bank_url && (
                      <a
                        href={result.major_bank_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.financialLink}
                      >
                        {result.major_bank_name} →
                      </a>
                    )}
                  </div>
                  <div className={styles.financialItem}>
                    <small>Ставка по депозитам</small>
                    <strong>{result.deposit_rate ? result.deposit_rate.replace('%', '').trim() : 'Нет данных'}</strong>
                  </div>
                  <div className={styles.financialItem}>
                    <small>Учетная ставка центробанка</small>
                    <strong>{result.central_bank_rate ? result.central_bank_rate.replace('%', '').trim() : 'Нет данных'}</strong>
                  </div>
                </div>
              </div>

              {/* Economic Freedom Index */}
              <div className={styles.section}>
                <h3>
                  Индекс экономической свободы{" "}
                  <a
                    href="https://ru.wikipedia.org/wiki/%D0%98%D0%BD%D0%B4%D0%B5%D0%BA%D1%81_%D1%8D%D0%BA%D0%BE%D0%BD%D0%BE%D0%BC%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B9_%D1%81%D0%B2%D0%BE%D0%B1%D0%BE%D0%B4%D1%8B"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.infoLink}
                  >
                    ?
                  </a>
                </h3>
                <p className={styles.infoValue}>
                  {COUNTRIES_WITHOUT_INDEX.includes(result.country)
                    ? "Нет данных"
                    : `${result.economic_freedom_index} из 100`}
                </p>
                <small className={styles.indexNote}>
                  Рейтинг Heritage Foundation (диапазон 0-100)
                </small>
              </div>
            </div>

            {/* Reset Button */}
            <div className={styles.resetSection}>
              <button onClick={handleReset} className={styles.resetButton}>
                Новый поиск
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Disclaimer */}
      {result && (
        <section className={styles.disclaimer}>
          <p>
            <strong>Внимание:</strong> Данные собраны из открытых источников и могут не отражать последние изменения в законодательстве.
            Рекомендуем проконсультироваться с профессиональными юристами и бухгалтерами перед принятием решений.
          </p>
        </section>
      )}

      {/* Footer Info */}
      <section className={styles.footerInfo}>
        <p>
          Powered by AI • Все данные проходят верификацию •
          <a href="https://upgrowplan.com" className="nav-link-custom">
            {" "}
            Upgrowplan
          </a>
        </p>
      </section>
    </main>
  );
}
