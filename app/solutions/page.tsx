"use client";

import { useState } from "react";
import { Card } from "react-bootstrap";
import Link from "next/link";
import { FiCpu, FiBarChart2, FiUsers, FiFileText, FiMapPin } from "react-icons/fi";
import { useClickAnalytics } from "../../hooks/useClickAnalytics";
import { FaHourglassHalf } from "react-icons/fa";
import Header from "../../components/Header";

export default function SolutionsPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const solutions = [
    {
      title: "FinPilot Free",
      description:
        "Готовые финансовые моделеи. Открывай, меняй параметры, смотри прогнозы — всё бесплатно.",
      icon: <FiBarChart2 className="me-2 text-success" />,
      link: "/fin-model/model1/",
    },
    {
      title: "MarketSense AI Agent",
      description:
        "AI-агент, который ищет и анализирует инфу по твоему запросу. Данные, тренды, инсайты — в одном месте.",
      icon: <FiCpu className="me-2 text-primary" />,
      release: "осень 2025",
    },
    {
      title: "Сompetitors Research AI Agent",
      description:
        "Версия Research Agent, но с фокусом на разборе твоих конкурентов. Локальный и точный анализ ниши.",
      icon: <FiUsers className="me-2 text-warning" />,
      release: "осень 2025",
    },
    {
      title: "PlanMaster AI",
      description:
        "Мгновенно генерирует бизнес-планы на основе шаблонов и твоих данных. Готово к презентации инвесторам.",
      icon: <FiFileText className="me-2 text-danger" />,
      release: "осень 2025",
    },
    {
      title: "Relocation Service",
      description:
        "Сервис предоставляет условия открытия/релокации бизнеса в любой стране",
      icon: <FiMapPin className="me-2 text-info" />,
      link: "/solutions/openAbroad",
      elementId: "relocation-service-card",
    },
  ];
  const { trackClick } = useClickAnalytics();

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Header />

      <main className="container py-5">
        <h1 className="mb-4" style={{ color: "#1e6078" }}>
          Автоматические финтех инструменты
        </h1>
        <p style={{ color: "#0785f6", fontSize: "1.1rem" }}>
          Решения для тех, кто ценит свое время и готов использовать новые
          технологии.
        </p>
        <div className="row g-4">
          {solutions.map((solution, index) => (
            <div className="col-12 col-md-6" key={index}>
              <Card
                className="h-100 border-0"
                style={{
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                  backgroundColor: "#fff",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.backgroundColor = "#d9ebf5";
                  el.style.boxShadow = "0 6px 20px rgba(0,0,0,0.2)";
                  el.style.transform = "scale(1.03)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.backgroundColor = "#fff";
                  el.style.boxShadow = "none";
                  el.style.transform = "scale(1)";
                }}
              >
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title
                      style={{
                        color: "#1e6078",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {solution.icon} {solution.title}
                    </Card.Title>
                    <Card.Text>{solution.description}</Card.Text>
                  </div>
                  <div
                    className="mt-3 text-muted small d-flex align-items-center"
                    style={{ gap: "6px" }}
                  >
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
                        style={{ minWidth: "150px" }}
                        onClick={() =>
                          trackClick(
                            solution.elementId || (solution.title ?? "unknown"),
                            "card"
                          )
                        }
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
    </div>
  );
}
