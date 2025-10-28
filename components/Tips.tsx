import { useEffect, useRef } from "react";
import { Card } from "react-bootstrap";
import { FiInfo } from "react-icons/fi";

interface TipsProps {
  hint: string;
}

export default function Tips({ hint }: TipsProps) {
  const tipsRef = useRef<HTMLDivElement | null>(null);

  // Автоматический скролл наверх при изменении подсказки
  useEffect(() => {
    if (tipsRef.current) {
      tipsRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [hint]);

  return (
    <Card
      className="shadow-sm"
      style={{
        width: "100%",
        height: "calc(100vh - 200px)",
        borderRadius: "16px",
        border: "1px solid #e0e0e0",
      }}
    >
      <Card.Header
        className="bg-white"
        style={{
          width: "100%",
          borderBottom: "2px solid #0785f6",
          padding: "1.5rem",
          boxSizing: "border-box",
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <FiInfo size={24} style={{ color: "#0785f6" }} />
          <h5 className="mb-0" style={{ fontWeight: 600, color: "#171717" }}>
            Подсказка эксперта
          </h5>
        </div>
        <p
          className="mb-0 mt-2"
          style={{
            fontSize: "0.875rem",
            color: "#6b7280",
            lineHeight: "1.5",
          }}
        >
          Здесь вы получаете пояснения и советы по каждому вопросу. Подсказка
          объясняет, зачем этот пункт нужен и как на него лучше ответить, чтобы
          бизнес-план получился полным и убедительным.
        </p>
      </Card.Header>

      <Card.Body
        ref={tipsRef}
        style={{
          overflowY: "auto",
          padding: "1.5rem",
          backgroundColor: "#f9fafb",
          width: "100%",
        }}
      >
        {hint ? (
          <div
            style={{
              width: "100%",
              padding: "1.5rem",
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              lineHeight: "1.6",
              color: "#374151",
              boxSizing: "border-box",
            }}
          >
            {hint}
          </div>
        ) : (
          <div
            className="text-center"
            style={{
              width: "100%",
              padding: "3rem 1rem",
              color: "#9ca3af",
              boxSizing: "border-box",
            }}
          >
            <FiInfo size={48} style={{ opacity: 0.3, marginBottom: "1rem" }} />
            <p style={{ fontSize: "0.875rem" }}>
              Подсказки появятся, когда вы начнете отвечать на вопросы
            </p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
