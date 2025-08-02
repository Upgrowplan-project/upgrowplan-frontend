export default function Footer() {
  return (
    <footer className="bg-white border-t mt-20 py-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm">
        <div>© 2025 Up&Grow. Все права защищены.</div>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-sky-700">
            Политика конфиденциальности
          </a>
          <a href="#" className="hover:text-sky-700">
            Пользовательское соглашение
          </a>
          <a href="#" className="hover:text-sky-700">
            Контакты
          </a>
        </div>
      </div>
    </footer>
  );
}
