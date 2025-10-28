"use client";

import { useState, useEffect, useRef, ChangeEvent, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
  Spinner,
} from "react-bootstrap";
import {
  FiUpload,
  FiSend,
  FiX,
  FiCheckCircle,
  FiDownload,
  FiMessageCircle,
  FiEdit2,
} from "react-icons/fi";
import Header from "../../../components/Header";
import Grade from "../../../components/Grade";
import styles from "./plan.module.css";

interface ChatMessage {
  type: "user" | "system" | "question" | "greeting";
  text: string;
  options?: string[];
  files?: string[];
  multiple?: boolean;
  questionId?: string;
  messageId?: string;
}

const ALLOWED_FILE_TYPES = [
  "doc",
  "docx",
  "xls",
  "xlsx",
  "txt",
  "pdf",
  "png",
  "jpg",
  "jpeg",
];
const MAX_FILES = 5;

export default function PlanPage() {
  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), []);

  const [chatStarted, setChatStarted] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [surveyComplete, setSurveyComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState("ru");
  const [sessionId, setSessionId] = useState("");

  // Множественный выбор
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [currentMultipleQuestion, setCurrentMultipleQuestion] = useState<
    string | null
  >(null);

  // Редактирование
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const ws = useRef<WebSocket | null>(null);
  const lastQuestionId = useRef<string | null>(null);
  const chatBodyRef = useRef<HTMLDivElement | null>(null);
  const answersRef = useRef<Record<string, any>>({});

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatMessages]);

  const initWebSocket = () => {
    ws.current = new WebSocket("ws://localhost:8000/ws/survey");

    ws.current.onopen = () => {
      console.log("✅ WebSocket подключён");
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleServerMessage(data);
      } catch (e) {
        console.error("Ошибка парсинга:", e);
      }
    };

    ws.current.onerror = (e) => console.error("Ошибка WebSocket:", e);
    ws.current.onclose = () => console.log("WebSocket отключён");
  };

  const handleServerMessage = (data: any) => {
    setIsTyping(false);

    switch (data.type) {
      case "greeting":
        setChatMessages((prev) => [
          ...prev,
          {
            type: "greeting",
            text: data.data.message,
            messageId: `msg_${Date.now()}`,
          },
        ]);
        break;

      case "question":
        if (data.data?.progress) {
          setProgressPercent(data.data.progress.percentage);
        }
        const isMultiple =
          data.data.multiple ||
          (data.data.id &&
            ["has_team", "sales_channels", "target_audience_type"].includes(
              data.data.id
            ));

        if (isMultiple) {
          setCurrentMultipleQuestion(data.data.id);
          setSelectedOptions([]);
        }

        setChatMessages((prev) => [
          ...prev,
          {
            type: "question",
            text: data.data.text,
            options: data.data.options,
            multiple: isMultiple,
            questionId: data.data.id,
            messageId: `msg_${Date.now()}`,
          },
        ]);
        if (data.data?.id) {
          lastQuestionId.current = data.data.id;
        }
        break;

      case "answer_accepted":
        const qid = data.data.question_id;
        const ans = data.data.answer;
        answersRef.current[qid] = {
          answer: ans,
          timestamp: new Date().toISOString(),
          files: data.data.files ?? [],
        };
        setCurrentMultipleQuestion(null);
        setSelectedOptions([]);
        forceUpdate();
        break;

      case "system_message":
      case "extraction_summary":
        setChatMessages((prev) => [
          ...prev,
          {
            type: "system",
            text: data.data.message,
            messageId: `msg_${Date.now()}`,
          },
        ]);
        break;

      case "validation_error":
      case "error":
        setChatMessages((prev) => [
          ...prev,
          {
            type: "system",
            text: data.data.message,
            messageId: `msg_${Date.now()}`,
          },
        ]);
        break;

      case "survey_complete":
        setSurveyComplete(true);
        setProgressPercent(100);
        setChatMessages((prev) => [
          ...prev,
          {
            type: "system",
            text: data.data.message,
            messageId: `msg_${Date.now()}`,
          },
        ]);
        break;
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);

    if (filesArray.length + selectedFiles.length > MAX_FILES) {
      alert(`Можно загрузить максимум ${MAX_FILES} файлов`);
      return;
    }

    const invalidFiles = filesArray.filter(
      (f) =>
        !ALLOWED_FILE_TYPES.includes(
          f.name.split(".").pop()?.toLowerCase() ?? ""
        )
    );
    if (invalidFiles.length > 0) {
      alert(
        `Недопустимый формат файла: ${invalidFiles
          .map((f) => f.name)
          .join(", ")}`
      );
      return;
    }

    setSelectedFiles((prev) => [...prev, ...filesArray]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const sendAnswer = async (answer: string) => {
    if (!answer.trim() && selectedFiles.length === 0) return;

    setChatMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: answer,
        files: selectedFiles.map((f) => f.name),
        messageId: `msg_${Date.now()}`,
      },
    ]);

    const filesPayload = await Promise.all(
      selectedFiles.map(async (f) => {
        const buffer = await f.arrayBuffer();
        const base64 = btoa(
          new Uint8Array(buffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        return {
          filename: f.name,
          content: base64,
        };
      })
    );

    ws.current?.send(
      JSON.stringify({
        type: "answer",
        data: {
          question_id: lastQuestionId.current || "start",
          answer,
          files: filesPayload,
        },
      })
    );

    setIsTyping(true);
    setUserInput("");
    setSelectedFiles([]);
  };

  const handleSend = () => {
    if (!userInput.trim() && selectedFiles.length === 0) return;

    if (
      userInput.trim().endsWith("?") ||
      userInput.toLowerCase().includes("как") ||
      userInput.toLowerCase().includes("что") ||
      userInput.toLowerCase().includes("почему") ||
      userInput.toLowerCase().includes("зачем")
    ) {
      handleUserQuestion(userInput);
    } else {
      sendAnswer(userInput);
    }
  };

  const handleUserQuestion = async (question: string) => {
    setChatMessages((prev) => [
      ...prev,
      { type: "user", text: question, messageId: `msg_${Date.now()}` },
    ]);

    setIsTyping(true);
    setUserInput("");

    try {
      const response = await fetch(
        "http://localhost:8000/api/handle_question",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
        }
      );

      const result = await response.json();

      setIsTyping(false);
      setChatMessages((prev) => [
        ...prev,
        {
          type: "system",
          text:
            result.answer ||
            "Понял ваш вопрос! Давайте вернемся к основному опросу. 😊",
          messageId: `msg_${Date.now()}`,
        },
      ]);
    } catch (error) {
      setIsTyping(false);
      setChatMessages((prev) => [
        ...prev,
        {
          type: "system",
          text: "Понял ваш вопрос! Давайте вернемся к основному опросу. 😊",
          messageId: `msg_${Date.now()}`,
        },
      ]);
    }
  };

  const handleMultipleOptionToggle = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const sendMultipleOptions = () => {
    if (selectedOptions.length === 0) return;
    sendAnswer(selectedOptions.join(", "));
  };

  const handleEditMessage = (messageId: string, currentText: string) => {
    setEditingMessageId(messageId);
    setEditText(currentText);
  };

  const saveEditedMessage = () => {
    if (editText.trim()) {
      sendAnswer(editText);
    }
    setEditingMessageId(null);
    setEditText("");
  };

  const handleStartChat = () => {
    setChatStarted(true);
    setSessionId(
      `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    );
    initWebSocket();
  };

  const handleStartFromChat = () => {
    sendAnswer("Начать");
  };

  const exportData = async () => {
    try {
      const structuredData = {
        session_id: sessionId,
        timestamp: new Date().toISOString(),
        completion_percentage: progressPercent,
        answers: answersRef.current,
        context: {
          language: language,
          collection_mode: "standard",
          total_questions_answered: Object.keys(answersRef.current).length,
        },
      };

      const dataStr = JSON.stringify(structuredData, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `planmaster_survey_${
        new Date().toISOString().split("T")[0]
      }.json`;
      link.click();
      URL.revokeObjectURL(url);

      alert("✅ Данные успешно скачаны!");
    } catch (error) {
      console.error("Ошибка экспорта:", error);
      alert("❌ Ошибка экспорта данных");
    }
  };

  const renderUserMessagePopover = (msg: ChatMessage) => (
    <Popover id={`popover-${msg.messageId}`}>
      <Popover.Body>
        <div className="d-grid gap-2">
          <Button
            size="sm"
            variant="outline-primary"
            onClick={() => {
              handleEditMessage(msg.messageId || "", msg.text);
              document.body.click();
            }}
          >
            <FiEdit2 className="me-2" /> Изменить
          </Button>
          <Button
            size="sm"
            variant="outline-secondary"
            onClick={() => {
              setUserInput(
                `Я хотел уточнить про "${msg.text.substring(0, 30)}..."`
              );
              document.body.click();
            }}
          >
            <FiMessageCircle className="me-2" /> Ответить
          </Button>
        </div>
      </Popover.Body>
    </Popover>
  );

  // СТАРТОВЫЙ ЭКРАН
  if (!chatStarted) {
    return (
      <div className={styles.planPage}>
        <Header />
        <Container className="mt-5">
          <Row className="mb-5 text-center">
            <Col>
              <h1 className="display-4 mb-3 text-brand">PlanMaster AI</h1>
              <p className="lead text-muted">
                Интеллектуальный сервис для создания профессиональных
                бизнес-планов на основе современной экономической методологии,
                использует живой онлайн поиск и проверку источников, критический
                анализ данных, гибридные финансовые модели
              </p>
            </Col>
          </Row>

          <Row className="g-4">
            <Col md={6}>
              <Card className={`shadow-sm h-100 ${styles.modeCard}`}>
                <Card.Body className={styles.modeCardBody}>
                  <div className={styles.modeCardContent}>
                    <h5 className="mb-3 text-brand">Начать работу</h5>
                    <p className="mb-4">
                      Я помогу вам собрать всю необходимую информацию о вашем
                      проекте и создам экспертный бизнес-план, готовый для
                      презентации инвесторам, банкам или фондам.
                    </p>

                    <div className="mb-4 w-100">
                      <Badge bg="success" className="me-2">
                        ✓ Интеллектуальный диалог
                      </Badge>

                      <Badge bg="success" className="me-2">
                        ✓ Автосохранение
                      </Badge>
                      <Badge bg="success">✓ Аналитика</Badge>
                    </div>

                    <Form.Group className="mb-4 w-100">
                      <Form.Label className="w-100">
                        Выберите язык / Choose language
                      </Form.Label>
                      <Form.Select
                        className="w-100"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                      >
                        <option value="ru">🇷🇺 Русский</option>
                        <option value="en">🇬🇧 English</option>
                        <option value="es">🇪🇸 Español</option>
                        <option value="fr">🇫🇷 Français</option>
                        <option value="de">🇩🇪 Deutsch</option>
                        <option value="zh">🇨🇳 中文</option>
                      </Form.Select>
                    </Form.Group>

                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleStartChat}
                      className="w-100 mb-3"
                    >
                      Начать работу
                    </Button>

                    <p className="text-muted text-center small mb-0 w-100">
                      ⏱️ Займет 10-20 минут
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className={`shadow-sm h-100 ${styles.modeCard}`}>
                <Card.Body className={styles.modeCardBody}>
                  <div className={styles.modeCardContent}>
                    <h5 className="mb-3 text-brand">О сервисе</h5>
                    <p className="w-100">
                      PlanMaster AI - это инновационный инструмент, который
                      использует искусственный интеллект для создания
                      профессиональных бизнес-планов за минимальное время.
                    </p>

                    <h6 className="mt-4 text-brand">Как это работает?</h6>
                    <ol className="mb-4 w-100">
                      <li>Отвечайте на вопросы в удобном формате диалога</li>
                      <li>
                        Система собирает и структурирует информацию о вашем
                        проекте
                      </li>
                      <li>Получите готовый бизнес-план за 15-20 минут</li>
                      <li>Экспортируйте документ в нужном формате</li>
                    </ol>

                    <div className="alert alert-info mb-0 w-100">
                      <h6>🎁 Бесплатный тестовый период</h6>
                      <p className="mb-2">
                        Сервис запущен в тестовом режиме и полностью бесплатен!
                      </p>
                      <p className="mb-0 small">
                        Пожалуйста, оцените дизайн и функционал после
                        использования - это поможет нам улучшить продукт и сделать
                        его еще лучше для вас. Спасибо! 🙏
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  // ОСНОВНОЙ ЧАТ
  return (
    <div className={styles.planPage}>
      <Header />
      <Container className="mt-4 mb-5">
        <Row>
          <Col md={8}>
            <Card
              className="shadow-sm"
              style={{
                height: "700px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Card.Header
                style={{
                  backgroundColor: "#1e6078",
                  color: "white",
                  borderTopLeftRadius: "16px",
                  borderTopRightRadius: "16px",
                }}
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>💬 Чат с PlanMaster AI</strong>
                </div>
                <div>
                  <Badge bg="light" text="dark">
                    Прогресс: {progressPercent}%
                  </Badge>
                </div>
              </Card.Header>

              <Card.Body
                ref={chatBodyRef}
                className={styles.chatBody}
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "20px",
                  backgroundColor: "#e0f7ff",
                }}
              >
                {chatMessages.length === 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginBottom: "1rem",
                    }}
                  >
                    <Button
                      variant="primary"
                      onClick={handleStartFromChat}
                      style={{
                        backgroundColor: "#ffffff",
                        color: "#171717",
                        border: "none",
                        borderRadius: "16px",
                        padding: "0.6rem 1.5rem",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      Начать 🚀
                    </Button>
                  </div>
                )}

                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`chat-message ${msg.type}`}
                    style={{
                      alignSelf:
                        msg.type === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    {msg.type === "user" ? (
                      <OverlayTrigger
                        trigger="click"
                        placement="left"
                        overlay={renderUserMessagePopover(msg)}
                        rootClose
                      >
                        <div
                          style={{
                            padding: "0.6rem 1rem",
                            borderRadius: "16px",
                            backgroundColor: "#ffffff",
                            color: "#171717",
                            wordBreak: "break-word",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            cursor: "pointer",
                          }}
                        >
                          {editingMessageId === msg.messageId ? (
                            <div className="d-flex gap-2">
                              <Form.Control
                                size="sm"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                autoFocus
                              />
                              <Button
                                size="sm"
                                variant="success"
                                onClick={saveEditedMessage}
                              >
                                <FiSend />
                              </Button>
                            </div>
                          ) : (
                            msg.text
                          )}
                        </div>
                      </OverlayTrigger>
                    ) : (
                      <div
                        style={{
                          padding: "0.6rem 1rem",
                          borderRadius: "16px",
                          backgroundColor: "#ffffff",
                          color: "#171717",
                          wordBreak: "break-word",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        }}
                      >
                        {msg.text}

                        {msg.options && msg.options.length > 0 && (
                          <div
                            className="mt-3"
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "0.5rem",
                            }}
                          >
                            {msg.options.map((opt, idx) => (
                              <Button
                                key={idx}
                                size="sm"
                                style={{
                                  backgroundColor:
                                    msg.multiple &&
                                    selectedOptions.includes(opt)
                                      ? "#0056b3"
                                      : "#0785f6",
                                  border: "none",
                                  borderRadius: "12px",
                                  padding: "0.4rem 1rem",
                                }}
                                onClick={() => {
                                  if (msg.multiple) {
                                    handleMultipleOptionToggle(opt);
                                  } else {
                                    sendAnswer(opt);
                                  }
                                }}
                              >
                                {msg.multiple &&
                                  selectedOptions.includes(opt) &&
                                  "✓ "}
                                {opt}
                              </Button>
                            ))}
                            {msg.multiple && (
                              <Button
                                size="sm"
                                variant="success"
                                onClick={sendMultipleOptions}
                                disabled={selectedOptions.length === 0}
                                style={{ borderRadius: "12px" }}
                              >
                                <FiSend />
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div
                    className="chat-message system"
                    style={{ alignSelf: "flex-start" }}
                  >
                    <div
                      style={{
                        padding: "0.6rem 1rem",
                        borderRadius: "16px",
                        backgroundColor: "#ffffff",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <Spinner
                        animation="grow"
                        size="sm"
                        style={{ width: "8px", height: "8px" }}
                      />
                      <Spinner
                        animation="grow"
                        size="sm"
                        style={{ width: "8px", height: "8px" }}
                      />
                      <Spinner
                        animation="grow"
                        size="sm"
                        style={{ width: "8px", height: "8px" }}
                      />
                    </div>
                  </div>
                )}
              </Card.Body>

              <Card.Footer className="bg-white">
                {!surveyComplete ? (
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSend();
                    }}
                  >
                    {selectedFiles.length > 0 && (
                      <div className="d-flex flex-wrap gap-2 mb-2">
                        {selectedFiles.map((file, i) => (
                          <Badge key={i} bg="secondary" className="p-2">
                            📎 {file.name}
                            <FiX
                              className="ms-2"
                              style={{ cursor: "pointer" }}
                              onClick={() => removeFile(i)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="d-flex gap-2">
                      <Form.Control
                        type="text"
                        placeholder="Введите ответ или задайте вопрос..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        disabled={isTyping}
                      />

                      <Form.Label
                        className="btn btn-outline-secondary mb-0"
                        style={{ cursor: "pointer" }}
                      >
                        <FiUpload />
                        <Form.Control
                          type="file"
                          multiple
                          onChange={handleFileSelect}
                          style={{ display: "none" }}
                        />
                      </Form.Label>

                      <Button
                        variant="primary"
                        type="submit"
                        disabled={
                          isTyping ||
                          (!userInput.trim() && selectedFiles.length === 0)
                        }
                      >
                        <FiSend />
                      </Button>
                    </div>
                  </Form>
                ) : (
                  <div className="text-center py-3">
                    <FiCheckCircle size={32} className="text-success mb-3" />
                    <p className="mb-3">
                      <strong>Сбор данных завершен!</strong>
                    </p>
                    <div className="d-flex gap-2 justify-content-center">
                      <Button variant="outline-primary" onClick={exportData}>
                        <FiDownload className="me-2" /> Скачать результаты
                      </Button>
                      <Button variant="success">
                        Начать генерацию бизнес-плана 🚀
                      </Button>
                    </div>
                  </div>
                )}

                <div className="progress mt-2" style={{ height: "5px" }}>
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </Card.Footer>
            </Card>
          </Col>

          {/* ПРАВАЯ ПАНЕЛЬ - ОЦЕНКА */}
          <Col md={4}>
            <Grade sessionId={sessionId} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
