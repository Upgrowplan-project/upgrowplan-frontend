"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { FaGoogle, FaFacebookF, FaEnvelope } from "react-icons/fa";
import { CSSTransition } from "react-transition-group";

import styles from "./auth.module.css";

type Errors = Partial<Record<"email" | "password" | "confirmPassword" | "form", string>>;

export default function AuthPage() {
  const router = useRouter();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [okMsg, setOkMsg] = useState("");

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8080";

  // --- Валидация регистрации ---
  const validate = (): boolean => {
    const e: Errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Неверный email";
    if (password.length < 8) e.password = "Минимум 8 символов";
    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      e.password = (e.password ? e.password + ". " : "") + "Пароль должен содержать буквы и цифры";
    }
    if (showRegisterForm && password !== confirm) e.confirmPassword = "Пароли не совпадают";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // --- Отправка формы ---
  const onSubmit = async (ev: React.FormEvent, type: "login" | "register") => {
    ev.preventDefault();
    setOkMsg("");
    setErrors({});
    if (!validate()) return;

    setSubmitting(true);
    try {
      const url =
        type === "login" ? `${API_BASE}/api/auth/login` : `${API_BASE}/api/auth/register`;
      const body =
        type === "login" ? { email, password } : { email, password };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        if (type === "register") {
          setOkMsg("Регистрация успешна. Перенаправляю на вход…");
          setTimeout(() => setShowLoginForm(true), 800);
        } else {
          setOkMsg("Вход успешен. Перенаправляю…");
          setTimeout(() => router.push("/"), 800);
        }
      } else {
        let msg = type === "login" ? "Ошибка входа" : "Ошибка регистрации";
        try {
          const data = await res.json();
          msg = data?.message || msg;
        } catch {}
        setErrors({ form: msg });
      }
    } catch (e) {
      setErrors({ form: "Сервер недоступен или CORS заблокирован" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className={`container py-5 ${styles.registerPage}`}>
        <h1 className="h2 mb-4 text-center text-brand">Привет!</h1>

        {errors.form && <div className="alert alert-danger">{errors.form}</div>}
        {okMsg && <div className="alert alert-success">{okMsg}</div>}

        <div className="d-flex flex-column align-items-center gap-3">
          {/* Кнопка Войти */}
          {!showLoginForm && (
            <button
              className={`${styles.registerBtn} ${styles.emailBtn}`}
              onClick={() => setShowLoginForm(true)}
            >
              Войти
            </button>
          )}

          {/* Форма Входа */}
          <CSSTransition
            in={showLoginForm}
            timeout={300}
            classNames={{
              enter: styles.fadeSlideEnter,
              enterActive: styles.fadeSlideEnterActive,
              exit: styles.fadeSlideExit,
              exitActive: styles.fadeSlideExitActive,
            }}
            unmountOnExit
          >
            <div className={styles.registerCard}>
              <form onSubmit={(e) => onSubmit(e, "login")} noValidate>
                <div className="mb-3">
                  <label htmlFor="loginEmail" className="form-label">Email</label>
                  <input
                    id="loginEmail"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="loginPassword" className="form-label">Пароль</label>
                  <input
                    id="loginPassword"
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                <p className="text-end mb-3">
                  <a href="/auth/forgot" className={styles.loginLink}>Забыли пароль?</a>
                </p>

                <button
                  className={`${styles.registerBtn} ${styles.submitBtn} w-100`}
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Входим…
                    </>
                  ) : (
                    "Войти"
                  )}
                </button>
              </form>
            </div>
          </CSSTransition>

          {/* Раздел Создать аккаунт */}
          {!showLoginForm && (
            <p className="mt-2 text-center">Создать аккаунт</p>
          )}

          {(!showLoginForm || showRegisterForm) && (
            <>
              {/* Кнопка Email регистрации */}
              <button
                className={`${styles.registerBtn} ${styles.emailBtn}`}
                onClick={() => setShowRegisterForm((prev) => !prev)}
              >
                <FaEnvelope /> Регистрация по Email
              </button>

              <CSSTransition
                in={showRegisterForm}
                timeout={300}
                classNames={{
                  enter: styles.fadeSlideEnter,
                  enterActive: styles.fadeSlideEnterActive,
                  exit: styles.fadeSlideExit,
                  exitActive: styles.fadeSlideExitActive,
                }}
                unmountOnExit
              >
                <div className={styles.registerCard}>
                  <form onSubmit={(e) => onSubmit(e, "register")} noValidate>
                    <div className="mb-3">
                      <label htmlFor="regEmail" className="form-label">Email</label>
                      <input
                        id="regEmail"
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="regPassword" className="form-label">Пароль</label>
                      <input
                        id="regPassword"
                        className={`form-control ${errors.password ? "is-invalid" : ""}`}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                      />
                      <div className="form-text">Минимум 8 символов, буквы и цифры.</div>
                      {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>

                    <div className="mb-4">
                      <label htmlFor="regConfirm" className="form-label">Подтверждение пароля</label>
                      <input
                        id="regConfirm"
                        className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                        type="password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                      />
                      {errors.confirmPassword && (
                        <div className="invalid-feedback">{errors.confirmPassword}</div>
                      )}
                    </div>

                    <button
                      className={`${styles.registerBtn} ${styles.submitBtn} w-100`}
                      type="submit"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Регистрируем…
                        </>
                      ) : (
                        "Зарегистрироваться"
                      )}
                    </button>
                  </form>
                </div>
              </CSSTransition>

              {/* Социальные кнопки */}
              <a
                className={`${styles.registerBtn} ${styles.googleBtn}`}
                href={`${API_BASE}/oauth2/authorization/google`}
              >
                <FaGoogle /> Войти через Google
              </a>

              <a
                className={`${styles.registerBtn} ${styles.facebookBtn}`}
                href={`${API_BASE}/oauth2/authorization/facebook`}
              >
                <FaFacebookF /> Войти через Facebook
              </a>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
