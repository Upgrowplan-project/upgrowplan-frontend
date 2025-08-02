"use client";

export default function Hero() {
  return (
    <section
      className="bg-[#D8ECF4] flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-20 rounded-lg"
      aria-label="Hero section"
    >
      {/* Текстовая часть */}
      <div className="md:w-1/2 mb-10 md:mb-0">
        <h1 className="text-4xl font-extrabold text-sky-700 mb-4 leading-tight">
          Создаём бизнес-планы нового поколения
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          AI‑модели для быстрого и точного старта бизнеса.
          Продвинутые сервисы генерации и аналитики для вашего успеха.
        </p>
        <div className="flex gap-4">
          <button className="bg-sky-700 text-white px-6 py-3 rounded-md font-semibold hover:bg-sky-800 transition">
            Попробовать бесплатно
          </button>
          <button className="border border-sky-700 text-sky-700 px-6 py-3 rounded-md font-semibold hover:bg-sky-100 transition">
            Узнать больше
          </button>
        </div>
      </div>

      {/* Иллюстрация (заглушка) */}
      <div className="md:w-1/2 flex justify-center">
        <div className="w-64 h-64 bg-sky-300 rounded-xl shadow-lg flex items-center justify-center text-white font-bold text-xl select-none">
          AI Illustration
        </div>
      </div>
    </section>
  );
}
