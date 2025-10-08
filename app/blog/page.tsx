"use client";

import { useState, useEffect } from "react";
import Header from "../../components/Header";
import * as StompJS from "@stomp/stompjs";

interface Post {
  id: number;
  message: string;
  createdAt: string;
  mediaUrl?: string;
  forwardAuthor?: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BLOG_URL}/api/posts`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error("Ответ API не массив:", data);
        }
      })
      .catch((err) => console.error("Error fetching posts:", err));

    const socket = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_BLOG_URL}/ws/posts/info`
    );

    const stompClient = StompJS.Stomp.over(socket);

    stompClient.connect({}, () => {
      console.log("Connected to WebSocket");
      stompClient.subscribe("/topic/posts", (msg) => {
        const newPost: Post = JSON.parse(msg.body);
        setPosts((prev) => [newPost, ...prev]);
      });
    });

    return () => {
      stompClient.disconnect(() => console.log("Disconnected"));
    };
  }, []);

  return (
    <div className="blog-page d-flex flex-column min-vh-100">
      <Header />

      <main className="blog-page py-5">
        <h1 className="text-brand mb-4">Блог</h1>

        <p
          className="mt-3 mb-5 lead"
          style={{ maxWidth: "800px", lineHeight: "1.7", fontSize: "1.125rem" }}
        >
          Привет 👋 тут мы делимся реальным опытом: бизнес-идеи, кейсы,
          чек-листы, аналитика и инсайты. Хотите быть в курсе? Подписывайтесь:
        </p>

        <div className="d-flex align-items-center mb-5">
          <a
            href="https://t.me/UpAndGrow"
            target="_blank"
            rel="noopener noreferrer"
            className="me-4"
          >
            <img
              src="/icons/telegram.svg"
              alt="Telegram"
              width={32}
              height={32}
            />
          </a>
          <a
            href="https://vk.com/upandgrow"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/icons/vk.svg" alt="VK" width={32} height={32} />
          </a>
        </div>

        {posts.length === 0 ? (
          <p className="release-soon">Посты ещё не опубликованы 😄</p>
        ) : (
          <div className="row g-4">
            {posts.map((post) => (
              <div key={post.id} className="col-12">
                <div
                  className="card blog-post border-0 my-5"
                  style={{
                    borderRadius: "18px",
                    overflow: "hidden",
                    background: "#ffffff",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 28px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 24px rgba(0,0,0,0.06)";
                  }}
                >
                  <div className="d-flex flex-column flex-md-row align-items-start">
                    {post.mediaUrl && (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BLOG_URL}/api/posts/proxy-image?fileId=${post.mediaUrl}`}
                        alt="Post media"
                        className="post-image"
                        style={{
                          width: "100%",
                          maxHeight: "300px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <div className="card-body flex-grow-1 p-4">
                      <p
                        className="card-text mb-3"
                        style={{ fontSize: "1.05rem", lineHeight: "1.6" }}
                      >
                        {post.message}
                      </p>
                      {post.forwardAuthor && (
                        <small className="text-muted d-block mb-1">
                          Автор: {post.forwardAuthor}
                        </small>
                      )}
                      <small className="text-muted d-block">
                        {new Date(post.createdAt).toLocaleString("ru-RU")}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
