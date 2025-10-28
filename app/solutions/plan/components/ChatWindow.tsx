"use client";

import { useRef, useEffect } from "react";
import { Card, Button, Spinner, Dropdown, Badge } from "react-bootstrap";
import { ChatMessage, REACTIONS } from "../types";

interface ChatWindowProps {
  messages: ChatMessage[];
  isTyping: boolean;
  progressPercent: number;
  onSendAnswer: (answer: string) => void;
  onAddReaction: (messageIndex: number, reaction: string) => void;
}

export default function ChatWindow({
  messages,
  isTyping,
  progressPercent,
  onSendAnswer,
  onAddReaction,
}: ChatWindowProps) {
  const chatBodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
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
          <Badge
            style={{
              backgroundColor: "white",
              color: "#1e6078",
              fontWeight: "600",
            }}
          >
            {progressPercent}% завершено
          </Badge>
        </div>
      </Card.Header>

      <Card.Body
        ref={chatBodyRef}
        className="chat-body"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          backgroundColor: "#e0f7ff",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-message ${msg.type}`}
            style={{
              alignSelf: msg.type === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                padding: "0.6rem 1rem",
                borderRadius: "16px",
                backgroundColor: "#ffffff",
                color: "#171717",
                wordBreak: "break-word",
                boxShadow:
                  msg.type === "user"
                    ? "0 2px 8px rgba(0,0,0,0.1)"
                    : "0 2px 8px rgba(0,0,0,0.08)",
                position: "relative",
              }}
            >
              {msg.text}

              {msg.files && msg.files.length > 0 && (
                <div className="mt-2">
                  {msg.files.map((file, idx) => (
                    <div key={idx} className="file-preview">
                      📎 {file}
                    </div>
                  ))}
                </div>
              )}

              {msg.options && msg.options.length > 0 && (
                <div
                  className="mt-3"
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                >
                  {msg.options.map((opt, idx) => (
                    <Button
                      key={idx}
                      size="sm"
                      style={{
                        backgroundColor: "#0785f6",
                        border: "none",
                        borderRadius: "12px",
                        padding: "0.4rem 1rem",
                      }}
                      onClick={() => onSendAnswer(opt)}
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              )}

              {msg.reaction && (
                <span
                  style={{
                    position: "absolute",
                    bottom: "-8px",
                    right: "4px",
                    fontSize: "1.2rem",
                    background: "white",
                    borderRadius: "50%",
                    padding: "2px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  {msg.reaction}
                </span>
              )}
            </div>

            {msg.type !== "user" && !msg.reaction && (
              <div className="mt-1">
                <Dropdown>
                  <Dropdown.Toggle
                    variant="link"
                    size="sm"
                    className="text-muted p-0"
                    style={{ fontSize: "0.75rem", textDecoration: "none" }}
                  >
                    👍 Реакция
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {REACTIONS.map((reaction) => (
                      <Dropdown.Item
                        key={reaction}
                        onClick={() => onAddReaction(i, reaction)}
                        style={{ fontSize: "1.2rem" }}
                      >
                        {reaction}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
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
    </Card>
  );
}
