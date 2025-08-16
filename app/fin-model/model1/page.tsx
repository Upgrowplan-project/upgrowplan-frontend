'use client';

import { useState } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import styles from '../form-styles.module.css';

export default function FinModelPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [resultHtml, setResultHtml] = useState(
    '<i class="fa fa-spinner fa-spin"></i> Ваш результат появится здесь после расчета.'
  );

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const hideTooltip = (id: keyof typeof hintsVisible) => {
    setHintsVisible(prev => ({ ...prev, [id]: false }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numericFields = [
      'investment',
      'loanPercent',
      'loanTerm',
      'loanHoliday',
      'revenue',
      'revenueGrowthPercent',
      'salaryExpense',
      'rentExpense',
      'suppliesExpense',
      'otherExpense',
      'horizon',
      'variableExpensesValue',
    ];

    const dataRaw: Record<string, any> = { ...formData };
    numericFields.forEach(key => {
      const val = dataRaw[key];
      dataRaw[key] = val === '' || val === null ? null : Number(val);
    });
    dataRaw.variableExpensesIsPercent = dataRaw.variableExpensesIsPercent === 'true';

    setResultHtml('<i class="fa fa-spinner fa-spin"></i> Выполняется расчет...');

 try {
  const resp = await fetch(
    'https://upgrowplan-backend-9736a5b5c447.herokuapp.com/api/finance/calculate',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataRaw),
    }
  );

      if (!resp.ok) throw new Error('Ошибка сервера');
      const result = await resp.json();

      setResultHtml(`
        <div><b>Чистая прибыль (NP):</b> ${result.totalNetProfit.toFixed(2)} тыс ₽</div>
        <div><b>Рентабельность инвестиций (ROI):</b> ${result.roi.toFixed(2)}%</div>
        <div><b>Срок окупаемости (PP):</b> ${
          result.paybackMonth > 0 ? result.paybackMonth + ' месяцев' : 'Не достигнута'
        }</div>
        <div><b>EBITDA:</b> ${result.ebitda.toFixed(2)} тыс ₽</div>
        <div><b>Cash Flow:</b> ${result.cashFlow.toFixed(2)} тыс ₽</div>
        <div><b>Точка безубыточности:</b> ${
          result.breakEvenMonth > 0 ? result.breakEvenMonth + ' месяцев' : 'Не достигнута'
        }</div>
      `);
    } catch (err: any) {
      setResultHtml('Ошибка при расчёте: ' + err.message);
    }
  };

  return (
    <div>
      <Header />

      <main className={styles.pageContainer}>
        <h1>Генератор финансовой модели для малого бизнеса. Ver. R.003</h1>

        <div className="details-toggle">
          <a
            href="#"
            onClick={e => {
              e.preventDefault();
              setDetailsOpen(!detailsOpen);
            }}
          >
            {detailsOpen ? 'Скрыть ▲' : 'Подробнее о сервисе финансовой модели ▼'}
          </a>
          {detailsOpen && (
            <div id="details-content">
              <p>Заполните форму для получения расчета. Чем больше данных, тем точнее результат...</p>
            </div>
          )}
        </div>

        {/* ==== Форма ==== */}
        <form id="financeForm" className={styles.formContainer} onSubmit={handleSubmit}>
  {/* Общие данные */}
  <fieldset className={styles.fieldset}>
    <legend className={styles.legend}>Общие данные</legend>
    <div className={styles.row}>
      <div className={styles.inputWithIcon}>
        <i className="fa fa-user"></i>
        <input
          type="text"
          name="fullname"
          placeholder="Имя"
          value={formData.fullname}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className={styles.inputWithIcon}>
        <i className="fa fa-envelope"></i>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className={styles.inputWithIcon}>
        <i className="fa fa-briefcase"></i>
        <input
          type="text"
          name="businessName"
          placeholder="Название проекта"
          value={formData.businessName}
          onChange={handleInputChange}
        />
      </div>
    </div>
    <div className={styles.row}>
      <div className={styles.inputWithIcon}>
        <i className="fa fa-building"></i>
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
      <div className={styles.inputWithIcon}>
        <i className="fa fa-percent"></i>
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
      <div className={styles.inputWithIcon}>
        <i className="fa fa-calendar"></i>
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
  <fieldset className={styles.fieldset}>
    <legend className={styles.legend}>Доходы ежемесячные, тыс ₽</legend>
    <div className={styles.row}>
      <div className={styles.inputWithIcon}>
        <i className="fa fa-chart-line"></i>
        <input
          type="number"
          name="revenue"
          placeholder="Выручка"
          value={formData.revenue}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className={styles.inputWithIcon}>
        <i className="fa fa-arrow-up"></i>
        <input
          type="number"
          name="revenueGrowthPercent"
          placeholder="Рост, %"
          value={formData.revenueGrowthPercent}
          onChange={handleInputChange}
        />
        {hintsVisible['hint-growth'] && (
          <div className={styles.inputHint} id="hint-growth">
            <span className={styles.closeTooltip} onClick={() => hideTooltip('hint-growth')}>×</span>
            Запланируйте рост выручки, например 2 % от начального значения ежемесячной выручки
          </div>
        )}
      </div>
      <div className={styles.inputWithIcon}>
        <i className="fa fa-clock"></i>
        <select
          name="revenueGrowthPeriod"
          value={formData.revenueGrowthPeriod}
          onChange={handleInputChange}
        >
          <option value="">Период роста</option>
          <option value="monthly">Каждый месяц</option>
          <option value="2months">Каждые 2 мес</option>
          <option value="quarter">Ежеквартально</option>
          <option value="halfyear">Раз в полгода</option>
        </select>
        {hintsVisible['hint-growth-period'] && (
          <div className={styles.inputHint} id="hint-growth-period">
            <span className={styles.closeTooltip} onClick={() => hideTooltip('hint-growth-period')}>×</span>
            Запланируйте, как часто растет выручка, например рост 2 % каждый месяц
          </div>
        )}
      </div>
      <div className={styles.inputWithIcon}>
        <i className="fa fa-chart-line"></i>
        <input
          type="number"
          name="otherIncome"
          placeholder="Прочие доходы"
          value={formData.otherIncome}
          onChange={handleInputChange}
        />
        {hintsVisible['hint-other-income'] && (
          <div className={styles.inputHint} id="hint-other-income">
            <span className={styles.closeTooltip} onClick={() => hideTooltip('hint-other-income')}>×</span>
            Денежные поступления кроме выручки, например доходы от акций или другого бизнеса
          </div>
        )}
      </div>
    </div>
  </fieldset>

  {/* Переменные расходы */}
  <fieldset className={styles.fieldset}>
    <legend className={styles.legend}>Переменные расходы ежемесячные, тыс ₽</legend>
    <div className={styles.row}>
      <div className={styles.inputWithIcon}>
        <i className="fa fa-sliders-h"></i>
        <select
          name="variableExpensesIsPercent"
          value={formData.variableExpensesIsPercent}
          onChange={handleInputChange}
        >
          <option value="true">в % от выручки</option>
          <option value="false">в рублях</option>
        </select>
      </div>
      <div className={styles.inputWithIcon}>
        <i className="fa fa-ruble-sign"></i>
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

  {/* Постоянные расходы */}
  <fieldset className={styles.fieldset}>
    <legend className={styles.legend}>Постоянные расходы ежемесячные, тыс ₽</legend>
    <div className={`${styles.row} ${styles.rowFour}`}>
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
  <fieldset className={styles.fieldset}>
    <legend className={styles.legend}>Инвестиционные данные</legend>
    <div className={`${styles.row} ${styles.rowFour}`}>
      <div className={styles.inputWithIcon}>
        <input
          type="number"
          name="investment"
          placeholder="Инвестиции, тыс ₽"
          value={formData.investment}
          onChange={handleInputChange}
        />
        {hintsVisible['hint-invest'] && (
          <div className={styles.inputHint} id="hint-invest">
            <span className={styles.closeTooltip} onClick={() => hideTooltip('hint-invest')}>×</span>
            Сумма инвестиций, необходимая на старте проекта
          </div>
        )}
      </div>
      <div className={styles.inputWithIcon}>
        <input
          type="number"
          name="loanPercent"
          placeholder="% по кредиту"
          value={formData.loanPercent}
          onChange={handleInputChange}
        />
        {hintsVisible['hint-loan-percent'] && (
          <div className={styles.inputHint} id="hint-loan-percent">
            <span className={styles.closeTooltip} onClick={() => hideTooltip('hint-loan-percent')}>×</span>
            Годовая процентная ставка по кредиту
          </div>
        )}
      </div>
      <div className={styles.inputWithIcon}>
        <input
          type="number"
          name="loanHoliday"
          placeholder="Кредит. каникулы, мес"
          value={formData.loanHoliday}
          onChange={handleInputChange}
        />
        {hintsVisible['hint-loan-holiday'] && (
          <div className={styles.inputHint} id="hint-loan-holiday">
            <span className={styles.closeTooltip} onClick={() => hideTooltip('hint-loan-holiday')}>×</span>
            Период, когда тело кредита не погашается
          </div>
        )}
      </div>
      <div className={styles.inputWithIcon}>
        <input
          type="number"
          name="loanTerm"
          placeholder="Срок кредита, лет"
          value={formData.loanTerm}
          onChange={handleInputChange}
        />
        {hintsVisible['hint-loan-term'] && (
          <div className={styles.inputHint} id="hint-loan-term">
            <span className={styles.closeTooltip} onClick={() => hideTooltip('hint-loan-term')}>×</span>
            Общий срок возврата кредита
          </div>
        )}
      </div>
    </div>
  </fieldset>

  <p className="privacy">
    Отправляя форму, вы соглашаетесь с&nbsp;
    <a href="https://upgrowplan.com/privacy/" target="_blank" rel="noreferrer">Политикой конфиденциальности</a>.
  </p>

  <div style={{ textAlign: 'center' }}>
    <button type="submit" className={styles.submitButton}>Рассчитать</button>
  </div>
</form>

<div
          className={styles.resultBox}
          dangerouslySetInnerHTML={{ __html: resultHtml }}
        />
      </main>

      <Footer />
    </div>
  );
}
