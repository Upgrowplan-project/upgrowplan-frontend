import { useState } from "react";
import { Card, Button, Form, Alert } from "react-bootstrap";

interface Rating {
  clarity?: number;
  usefulness?: number;
  accuracy?: number;
  usability?: number;
  speed?: number;
  design?: number;
  recommend?: number;
  price?: number;
}

interface GradeProps {
  sessionId: string;
}

export default function Grade({ sessionId }: GradeProps) {
  const [rating, setRating] = useState<Rating>({});
  const [feedback, setFeedback] = useState("");

  // Автоматический расчет общей оценки
  const calculateOverallRating = () => {
    const ratings = [
      rating.clarity,
      rating.usefulness,
      rating.accuracy,
      rating.usability,
      rating.speed,
      rating.design,
    ].filter((r) => r !== undefined);

    if (ratings.length === 0) return 0;
    return Math.round(
      ratings.reduce((sum, r) => sum + (r || 0), 0) / ratings.length
    );
  };

  const submitRatingAndFeedback = async () => {
    try {
      const overallRating = calculateOverallRating();
      const response = await fetch("http://localhost:8000/api/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...rating,
          overall: overallRating,
          feedback,
          session_id: sessionId,
        }),
      });

      if (response.ok) {
        alert("✅ Спасибо за вашу оценку и отзыв!");
        setRating({});
        setFeedback("");
      }
    } catch (error) {
      console.error("Ошибка отправки рейтинга:", error);
    }
  };

  const renderStars = (
    category: keyof Rating,
    currentValue: number | undefined
  ) => (
    <div className="d-flex w-100 justify-content-between">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{ cursor: "pointer", fontSize: "1.5rem" }}
          onClick={() => setRating({ ...rating, [category]: star })}
        >
          {star <= (currentValue || 0) ? "⭐" : "☆"}
        </span>
      ))}
    </div>
  );

  return (
    <Card className="shadow-sm h-100" style={{ borderRadius: "16px" }}>
      <Card.Header
        style={{
          backgroundColor: "transparent",
          border: "none",
          padding: "1.5rem 1.5rem 0",
        }}
      >
        <h5 className="text-brand mb-0">⭐ Оцените сервис</h5>
      </Card.Header>
      <Card.Body
        style={{ maxHeight: "650px", overflowY: "auto", padding: "1.5rem" }}
      >
        <div style={{ width: "100%" }}>
          {/* Текст о конфиденциальности */}
          <Alert variant="light" className="mb-4" style={{ width: "100%" }}>
            <p className="small mb-2">
              🎁 Сервис запущен в тестовом режиме и полностью бесплатен!
            </p>
            <p className="small mb-0">
              Мы собираем отзывы - это анонимно и конфиденциально. Вы можете
              оценить сервис по окончании ознакомления с результатом. Спасибо,
              это помогает проекту улучшать свою работу и лучше помогать
              предпринимателям! 🙏
            </p>
          </Alert>

          {/* Понятность результата */}
          <div className="mb-4" style={{ width: "100%" }}>
            <h6 className="small mb-2">Понятность результата</h6>
            {renderStars("clarity", rating.clarity)}
          </div>

          {/* Полезность */}
          <div className="mb-4" style={{ width: "100%" }}>
            <h6 className="small mb-2">Полезность сервиса</h6>
            {renderStars("usefulness", rating.usefulness)}
          </div>

          {/* Точность и логика */}
          <div className="mb-4" style={{ width: "100%" }}>
            <h6 className="small mb-2">Точность и логика</h6>
            {renderStars("accuracy", rating.accuracy)}
          </div>

          {/* Удобство использования */}
          <div className="mb-4" style={{ width: "100%" }}>
            <h6 className="small mb-2">Удобство использования</h6>
            {renderStars("usability", rating.usability)}
          </div>

          {/* Скорость */}
          <div className="mb-4" style={{ width: "100%" }}>
            <h6 className="small mb-2">Скорость генерации</h6>
            {renderStars("speed", rating.speed)}
          </div>

          {/* Оформление */}
          <div className="mb-4" style={{ width: "100%" }}>
            <h6 className="small mb-2">Оформление и структура</h6>
            {renderStars("design", rating.design)}
          </div>

          {/* Общая оценка */}
          <div className="mb-4 p-3 bg-light rounded" style={{ width: "100%" }}>
            <h6 className="small mb-2 text-center">
              <strong>Общая оценка</strong>
            </h6>
            <div className="d-flex w-100 justify-content-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{ fontSize: "1.8rem", color: "#ffd700" }}
                >
                  {star <= calculateOverallRating() ? "⭐" : "☆"}
                </span>
              ))}
            </div>
          </div>

          {/* Рекомендация друзьям */}
          <div className="mb-4" style={{ width: "100%" }}>
            <h6 className="small mb-2">
              Насколько вероятно, что вы порекомендуете наш сервис друзьям?
            </h6>
            {renderStars("recommend", rating.recommend)}
          </div>

          {/* Цена */}
          <div className="mb-4" style={{ width: "100%" }}>
            <h6 className="small mb-2">
              Сколько может по вашему стоить такая услуга при разовой оплате?
            </h6>
            <div className="d-flex flex-wrap gap-2" style={{ width: "100%" }}>
              {[5, 10, 15, 20, 25].map((price) => (
                <Button
                  key={price}
                  size="sm"
                  style={{ flex: "1 1 calc(33.333% - 0.5rem)" }}
                  variant={
                    rating.price === price ? "primary" : "outline-secondary"
                  }
                  onClick={() => setRating({ ...rating, price })}
                >
                  ${price}
                </Button>
              ))}
            </div>
          </div>

          {/* Поле отзыва */}
          <div className="mb-4" style={{ width: "100%" }}>
            <h6 className="small mb-2">Ваш отзыв (по желанию)</h6>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Поделитесь своими впечатлениями..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>

          {/* Кнопка отправки */}
          <Button
            variant="success"
            onClick={submitRatingAndFeedback}
            disabled={!rating.clarity && !feedback}
            style={{ width: "100%" }}
          >
            Отправить оценку и отзыв
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
