"use client";
import { useState } from "react";
import Link from "next/link";

const menuItems = [
  { name: "Продукты", sub: ["Генерация бизнес-плана", "Аналитика", "Отчёты"] },
  { name: "Сервисы", sub: ["Консалтинг", "Поддержка стартапов"] },
  { name: "Блог", sub: [] },
  { name: "О нас", sub: [] },
  { name: "Контакты", sub: [] },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        {/* Логотип */}
        <Link href="/" className="text-2xl font-bold text-sky-700">
          Up&Grow
        </Link>

        {/* Десктоп-меню */}
        <nav className="hidden md:flex space-x-6">
          {menuItems.map((item) => (
            <div
              key={item.name}
              className="relative group"
              onMouseEnter={() => setOpenDropdown(item.name)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className="text-gray-700 hover:text-sky-700 font-medium">
                {item.name}
              </button>
              {item.sub.length > 0 && openDropdown === item.name && (
                <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-md py-2 w-56 z-10">
                  {item.sub.map((subItem) => (
                    <Link
                      key={subItem}
                      href="#"
                      className="block px-4 py-2 text-gray-600 hover:bg-sky-50 hover:text-sky-700"
                    >
                      {subItem}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Мобильное меню */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          ☰
        </button>
      </div>

      {/* Выпадающее мобильное меню */}
      {mobileOpen && (
        <div className="md:hidden bg-white shadow-md px-4 py-4 space-y-2">
          {menuItems.map((item) => (
            <div key={item.name}>
              <div className="font-medium text-gray-700">{item.name}</div>
              {item.sub.length > 0 && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.sub.map((subItem) => (
                    <Link
                      key={subItem}
                      href="#"
                      className="block text-gray-600 hover:text-sky-700"
                    >
                      {subItem}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
