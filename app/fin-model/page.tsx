'use client';
import Header from '../../components/Header';
import Footer from '../../components/Footer';


import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaUser, FaEnvelope, FaBriefcase, FaBuilding, FaPercent, FaCalendar, FaChartLine, FaArrowUp, FaClock, FaSlidersH, FaRubleSign, FaSpinner } from 'react-icons/fa';

export default function FinModelPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [resultHtml, setResultHtml] = useState('<i class="fa fa-spinner fa-spin"></i> Ваш результат появится здесь после расчета.');
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    businessName: '',
    form: '',
    taxSystem: '',
    horizon: '',
    revenue: '',
    revenueGrowthPercent: '',
    revenueGrowthPeriod: '',
    otherIncome: '',
    variableExpensesIsPercent: 'true',
    variableExpensesValue: '',
    suppliesExpense: '',
    salaryExpense: '',
    rentExpense: '',
    otherExpense: '',
    investment: '',
    loanPercent: '',
    loanHoliday: '',
    loanTerm: '',
  });
  const [hintsVisible, setHintsVisible] = useState({
    'hint-growth': true,
    'hint-growth-period': true,
    'hint-other-income': true,
    'hint-variable': true,
    'hint-invest': true,
    'hint-loan-percent': true,
    'hint-loan-holiday': true,
    'hint-loan-term': true,
  });

  // Хендлер для переключения подсказок
  function hideTooltip(id: keyof typeof hintsVisible) {
    setHintsVisible(prev => ({ ...prev, [id]: false }));
  }

  // Обновление полей формы
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  // Отправка формы
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Преобразуем числовые поля
    const numericFields = [
      "investment",
      "loanPercent",
      "loanTerm",
      "loanHoliday",
      "revenue",
      "revenueGrowthPercent",
      "salaryExpense",
      "rentExpense",
      "suppliesExpense",
      "otherExpense",
      "horizon",
      "variableExpensesValue",
    ];

    const dataRaw: Record<string, any> = { ...formData };
    numericFields.forEach((key) => {
      const val = dataRaw[key];
      dataRaw[key] = val === '' || val === null ? null : Number(val);
    });

    dataRaw.variableExpensesIsPercent = dataRaw.variableExpensesIsPercent === 'true';

    setResultHtml('<div><FaSpinner className="spin" /> Выполняется расчет...</div>');

    try {
      const resp = await fetch("https://exotic-ainslee-upgrow-0577c1d4.koyeb.app/api/finance/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataRaw),
      });
      if (!resp.ok) throw new Error("Ошибка сервера");
      const result = await resp.json();

      setResultHtml(`
        <div><b>Чистая прибыль (NP):</b> ${result.totalNetProfit.toFixed(2)} тыс ₽</div>
        <div><b>Рентабельность инвестиций (ROI):</b> ${result.roi.toFixed(2)}%</div>
        <div><b>Срок окупаемости (PP):</b> ${
          result.paybackMonth > 0 ? result.paybackMonth + " месяцев" : "Не достигнута"
        }</div>
        <div><b>EBITDA:</b> ${result.ebitda.toFixed(2)} тыс ₽</div>
        <div><b>Cash Flow:</b> ${result.cashFlow.toFixed(2)} тыс ₽</div>
        <div><b>Точка безубыточности:</b> ${
          result.breakEvenMonth > 0 ? result.breakEvenMonth + " месяцев" : "Не достигнута"
        }</div>
      `);
    } catch (err: any) {
      setResultHtml("Ошибка при расчёте: " + err.message);
    }
  }

  return (
    <div>
      {/* Header как на Home */}
<Header />

      <main>
        <h1>Генератор финансовой модели для малого бизнеса. Ver. R.003</h1>

        <div className="details-toggle">
          <a href="#" onClick={(e) => { e.preventDefault(); setDetailsOpen(!detailsOpen); }}>
            {detailsOpen ? 'Скрыть ▲' : 'Подробнее о сервисе финансовой модели ▼'}
          </a>
          {detailsOpen && (
            <div id="details-content">
              <p>Заполните форму для получения расчета. Чем больше данных, тем точнее результат...</p>
            </div>
          )}
        </div>

        <form id="financeForm" className="form-container" onSubmit={handleSubmit}>

          {/* Общие данные */}
          <fieldset>
            <legend>Общие данные</legend>
            <div className="row">
              <div className="input-with-icon">
                <FaUser className="icon" />
                <input
                  type="text"
                  name="fullname"
                  placeholder="Имя"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input-with-icon">
                <FaEnvelope className="icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input-with-icon">
                <FaBriefcase className="icon" />
                <input
                  type="text"
                  name="businessName"
                  placeholder="Название проекта"
                  value={formData.businessName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="input-with-icon">
                <FaBuilding className="icon" />
                <select
                  name="form"
                  value={formData.form}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Тип предприятия</option>
                  <option value="ИП">ИП</option>
                  <option value="ООО">ООО</option>
                </select>
              </div>
              <div className="input-with-icon">
                <FaPercent className="icon" />
                <select
                  name="taxSystem"
                  value={formData.taxSystem}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Налоговая система</option>
                  <option value="usn_6">УСН 6%</option>
                  <option value="usn_15">УСН 15%</option>
                  <option value="osno">ОСНО</option>
                  <option value="patent">Патент</option>
                </select>
              </div>
              <div className="input-with-icon">
                <FaCalendar className="icon" />
                <input
                  type="number"
                  name="horizon"
                  placeholder="Срок планирования, лет"
                  min={1}
                  max={20}
                  value={formData.horizon}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </fieldset>

          {/* Доходы */}
          <fieldset>
            <legend>Доходы ежемесячные, тыс ₽</legend>
            <div className="row">
              <div className="input-with-icon">
                <FaChartLine className="icon" />
                <input
                  type="number"
                  name="revenue"
                  placeholder="Выручка"
                  value={formData.revenue}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input-with-icon">
                <FaArrowUp className="icon" />
                <input
                  type="number"
                  name="revenueGrowthPercent"
                  placeholder="Рост, %"
                  value={formData.revenueGrowthPercent}
                  onChange={(e) => {
                    handleInputChange(e);
                    if (hintsVisible['hint-growth']) hideTooltip('hint-growth');
                  }}
                />
                {hintsVisible['hint-growth'] && (
                  <div className="input-hint" id="hint-growth">
                    <span className="close-tooltip" onClick={() => hideTooltip('hint-growth')}>×</span>
                    Запланируйте рост выручки, например 2 % от начального значения ежемесячной выручки
                  </div>
                )}
              </div>
              <div className="input-with-icon">
                <FaClock className="icon" />
                <select
                  name="revenueGrowthPeriod"
                  value={formData.revenueGrowthPeriod}
                  onChange={(e) => {
                    handleInputChange(e);
                    if (hintsVisible['hint-growth-period']) hideTooltip('hint-growth-period');
                  }}
                >
                  <option value="">Период роста</option>
                  <option value="monthly">Каждый месяц</option>
                  <option value="2months">Каждые 2 мес</option>
                  <option value="quarter">Ежеквартально</option>
                  <option value="halfyear">Раз в полгода</option>
                </select>
                {hintsVisible['hint-growth-period'] && (
                  <div className="input-hint" id="hint-growth-period">
                    <span className="close-tooltip" onClick={() => hideTooltip('hint-growth-period')}>×</span>
                    Запланируйте, как часто растет выручка, например рост 2 % каждый месяц
                  </div>
                )}
              </div>
              <div className="input-with-icon">
                <FaChartLine className="icon" />
                <input
                  type="number"
                  name="otherIncome"
                  placeholder="Прочие доходы"
                  value={formData.otherIncome}
                  onChange={(e) => {
                    handleInputChange(e);
                    if (hintsVisible['hint-other-income']) hideTooltip('hint-other-income');
                  }}
                />
                {hintsVisible['hint-other-income'] && (
                  <div className="input-hint" id="hint-other-income">
                    <span className="close-tooltip" onClick={() => hideTooltip('hint-other-income')}>×</span>
                    Денежные поступления кроме выручки, например доходы от акций или другого бизнеса
                  </div>
                )}
              </div>
            </div>
          </fieldset>

          {/* Переменные */}
          <fieldset>
            <legend>Переменные расходы ежемесячные, тыс ₽</legend>
            <div className="row">
              <div className="input-with-icon">
                <FaSlidersH className="icon" />
                <select
                  name="variableExpensesIsPercent"
                  value={formData.variableExpensesIsPercent}
                  onChange={(e) => {
                    handleInputChange(e);
                    if (hintsVisible['hint-variable']) hideTooltip('hint-variable');
                  }}
                >
                  <option value="true">в % от выручки</option>
                  <option value="false">в рублях</option>
                </select>
                {hintsVisible['hint-variable'] && (
                  <div className="input-hint" id="hint-variable">
                    <span className="close-tooltip" onClick={() => hideTooltip('hint-variable')}>×</span>
                    Выберите, как учесть переменные расходы - сумма в месяц или % от выручки
                  </div>
                )}
              </div>
              <div className="input-with-icon">
                <FaRubleSign className="icon" />
                <input
                  type="number"
                  name="variableExpensesValue"
                  placeholder="Переменные расходы"
                  value={formData.variableExpensesValue}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </fieldset>

          {/* Постоянные */}
          <fieldset>
            <legend>Постоянные расходы ежемесячные, тыс ₽</legend>
            <div className="row row-four">
              <input
                type="number"
                name="suppliesExpense"
                placeholder="Закупки"
                value={formData.suppliesExpense}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="salaryExpense"
                placeholder="Зарплата"
                value={formData.salaryExpense}
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="rentExpense"
                placeholder="Аренда"
                value={formData.rentExpense}
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="otherExpense"
                placeholder="Прочие"
                value={formData.otherExpense}
                onChange={handleInputChange}
              />
            </div>
          </fieldset>

          {/* Инвестиции */}
          <fieldset>
            <legend>Инвестиционные данные</legend>
            <div className="row row-four">
              <div className="input-with-icon">
                <input
                  type="number"
                  name="investment"
                  placeholder="Инвестиции, тыс ₽"
                  value={formData.investment}
                  onChange={(e) => {
                    handleInputChange(e);
                    if (hintsVisible['hint-invest']) hideTooltip('hint-invest');
                  }}
                />
                {hintsVisible['hint-invest'] && (
                  <div className="input-hint" id="hint-invest">
                    <span className="close-tooltip" onClick={() => hideTooltip('hint-invest')}>×</span>
                    Сумма инвестиций, необходимая на старте проекта
                  </div>
                )}
              </div>
              <div className="input-with-icon">
                <input
                  type="number"
                  name="loanPercent"
                  placeholder="% по кредиту"
                  value={formData.loanPercent}
                  onChange={(e) => {
                    handleInputChange(e);
                    if (hintsVisible['hint-loan-percent']) hideTooltip('hint-loan-percent');
                  }}
                />
                {hintsVisible['hint-loan-percent'] && (
                  <div className="input-hint" id="hint-loan-percent">
                    <span className="close-tooltip" onClick={() => hideTooltip('hint-loan-percent')}>×</span>
                    Годовая процентная ставка по кредиту
                  </div>
                )}
              </div>
              <div className="input-with-icon">
                <input
                  type="number"
                  name="loanHoliday"
                  placeholder="Кредит. каникулы, мес"
                  value={formData.loanHoliday}
                  onChange={(e) => {
                    handleInputChange(e);
                    if (hintsVisible['hint-loan-holiday']) hideTooltip('hint-loan-holiday');
                  }}
                />
                {hintsVisible['hint-loan-holiday'] && (
                  <div className="input-hint" id="hint-loan-holiday">
                    <span className="close-tooltip" onClick={() => hideTooltip('hint-loan-holiday')}>×</span>
                    Период, когда тело кредита не погашается
                  </div>
                )}
              </div>
              <div className="input-with-icon">
                <input
                  type="number"
                  name="loanTerm"
                  placeholder="Срок кредита, лет"
                  value={formData.loanTerm}
                  onChange={(e) => {
                    handleInputChange(e);
                    if (hintsVisible['hint-loan-term']) hideTooltip('hint-loan-term');
                  }}
                />
                {hintsVisible['hint-loan-term'] && (
                  <div className="input-hint" id="hint-loan-term">
                    <span className="close-tooltip" onClick={() => hideTooltip('hint-loan-term')}>×</span>
                    Общий срок возврата кредита
                  </div>
                )}
              </div>
            </div>
          </fieldset>

          <p className="privacy">
            Отправляя форму, вы соглашаетесь с&nbsp;
            <a href="https://naletov.org/privacy-policies/" target="_blank" rel="noreferrer">Политикой конфиденциальности</a>.
          </p>

          <div style={{ textAlign: 'center' }}>
            <button type="submit">Рассчитать</button>
          </div>
        </form>

        <div id="result" className="result-box" dangerouslySetInnerHTML={{ __html: resultHtml }} />

        <div className="after-result">
          <p>
            Спасибо, что воспользовались нашим планером! Больше возможностей —&nbsp;
            <a href="https://naletov.org/products" target="_blank" rel="noreferrer">по ссылке</a>.
          </p>
          <a className="home-button alt" href="https://naletov.org">На главную</a>
        </div>
      </main>

      {/* Footer как на Home */}
      <Footer />

      <style jsx>{`
        /* Стилизация как в твоём CSS, адаптированная под jsx */
        * {
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', sans-serif;
          line-height: 1.6;
          background: #f7f9fc;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #D8ECF4;
          color: #0073e6;
          padding: 10px 20px;
          flex-wrap: wrap;
        }
        .logo-section {
          display: flex;
          align-items: center;
        }
        .logo-section img {
          height: 45px;
          margin-right: 10px;
        }
        .logo-section span {
          font-weight: bold;
          font-size: 1.4rem;
        }
        main {
          max-width: 980px;
          margin: 20px auto;
          padding: 10px 20px;
        }
        h1 {
          color: #002244;
          font-size: 1.8rem;
          margin-bottom: 10px;
        }
        .details-toggle a {
          color: #0073e6;
          cursor: pointer;
          text-decoration: underline;
          user-select: none;
        }
        .form-container {
          background: #fff;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        fieldset {
          border: none;
          margin-bottom: 20px;
        }
        legend {
          font-weight: bold;
          margin-bottom: 10px;
          color: #003366;
        }
        .row {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 15px;
        }
        .row input,
        .row select {
          flex: 1 1 calc(33.333% - 10px);
          min-width: 200px;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #ccc;
          background: #fff;
          font-size: 0.95rem;
        }
        .input-with-icon {
          position: relative;
          flex: 1 1 calc(33.333% - 10px);
          min-width: 200px;
        }
        .input-with-icon .icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
          font-size: 0.9rem;
          pointer-events: none;
        }
        .input-with-icon input,
        .input-with-icon select {
          padding-left: 36px;
          width: 100%;
          padding-top: 10px;
          padding-bottom: 10px;
          border-radius: 8px;
          border: 1px solid #ccc;
          background: #fff;
          font-size: 0.95rem;
          appearance: none;
          background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23666' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 12px;
        }
        button[type='submit'] {
          background-color: #0073e6;
          color: white;
          border: none;
          padding: 12px 20px;
          font-size: 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.2s ease;
          width: 100%;
          max-width: 240px;
        }
        button[type='submit']:hover {
          background-color: #005bb5;
        }
        .privacy {
          font-size: 0.9rem;
          color: #555;
          margin-top: 10px;
          margin-bottom: 20px;
        }
        .privacy a {
          color: #0056b3;
          text-decoration: underline;
        }
        .result-box {
          background: #e6f2ff;
          border: 1px solid #cce0ff;
          padding: 15px 20px;
          margin-top: 30px;
          border-radius: 8px;
          font-size: 1rem;
          line-height: 1.6;
          color: #003355;
          min-height: 60px;
        }
        .after-result {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
        }
        .after-result p {
          font-size: 0.95rem;
          color: #555;
        }
        .after-result .home-button.alt {
          background-color: #44a574;
          padding: 8px 16px;
          text-decoration: none;
          border-radius: 6px;
          font-size: 0.95rem;
          color: white;
          transition: background-color 0.2s;
        }
        .after-result .home-button.alt:hover {
          background-color: #31825a;
        }
        .home-button {
          background-color: #0073e6;
          color: white;
          padding: 8px 16px;
          text-decoration: none;
          border-radius: 6px;
          font-size: 0.95rem;
          transition: background-color 0.2s;
        }
        .row-four input,
        .row-four select {
          flex: 1 1 calc(25% - 15px);
          min-width: 180px;
        }
        @media (max-width: 768px) {
          .row-four input,
          .row-four select {
            flex: 1 1 100%;
            min-width: unset;
          }
          .row input,
          .row select,
          .input-with-icon,
          .input-with-icon input,
          .input-with-icon select {
            flex: 1 1 100%;
            min-width: unset;
          }
          .header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
        /* Подсказки с крестиком */
        .input-hint {
          position: relative;
          display: block;
          margin-top: 5px;
          background: #ffffff;
          border: 1px solid #cce0ff;
          color: #333;
          font-size: 0.85rem;
          padding: 8px 25px 8px 10px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 115, 230, 0.1);
          z-index: 10;
          animation: slideFadeIn 0.25s ease;
        }
        .close-tooltip {
          position: absolute;
          top: 4px;
          right: 6px;
          font-size: 16px;
          font-weight: bold;
          color: #666;
          cursor: pointer;
          line-height: 1;
          user-select: none;
        }
        @keyframes slideFadeIn {
          0% {
            opacity: 0;
            transform: translateY(-4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media screen and (max-width: 768px) {
          .input-hint {
            font-size: 15px;
            max-width: 90vw;
          }
          .close-tooltip {
            top: 4px;
            right: 6px;
          }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
