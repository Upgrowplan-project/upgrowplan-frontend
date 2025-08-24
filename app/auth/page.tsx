"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { FaGoogle, FaFacebookF, FaEnvelope } from "react-icons/fa";
import { CSSTransition } from "react-transition-group";
import styles from "./auth.module.css";
import Image from "next/image";

type Errors = Partial<Record<"email" | "password" | "form", string>>;

export default function AuthPage() {
  const router = useRouter();
  const [scenario, setScenario] = useState<"none" | "login" | "register">("none");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showLoginEmailForm, setShowLoginEmailForm] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [okMsg, setOkMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8080";

  const validate = (): boolean => {
    const e: Errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Неверный email";
    if (password.length < 8) e.password = "Минимум 8 символов";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setOkMsg("");
    setErrors({});
    if (!validate()) return;

    setSubmitting(true);
    try {
      const endpoint = scenario === "login" ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        setOkMsg(scenario === "login" ? "Вход выполнен" : "Регистрация успешна");
        setTimeout(() => router.push("/"), 800);
      } else {
        const data = await res.json().catch(() => ({}));
        setErrors({ form: data?.message || "Ошибка сервера" });
      }
    } catch {
      setErrors({ form: "Сервер недоступен" });
    } finally {
      setSubmitting(false);
    }
  };

  const renderPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[\W_]/.test(password)) score++;

    const strengthText =
      score <= 2 ? "Слабый" : score === 3 ? "Средний" : "Сильный";

    return (
      <div className="d-flex align-items-center gap-1 mt-1">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} style={{ color: i < score ? "#0683f5" : "#ddd" }}>★</span>
        ))}
        <span className="ms-2">{strengthText}</span>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className={`container py-5 ${styles.authPage}`}>
        {/* Экран выбора сценария */}
        {scenario === "none" && (
          <div className="d-flex flex-column align-items-center gap-3">
            <h1 className="h3 text-center mb-4">Привет!</h1>
            <button
              className={`${styles.mainBtn} ${styles.loginBtn}`}
              onClick={() => setScenario("login")}
            >
              Войти
            </button>
            <button
              className={`${styles.mainBtn} ${styles.registerBtn}`}
              onClick={() => setScenario("register")}
            >
              Создать аккаунт
            </button>
          </div>
        )}

        {/* Общая кнопка назад для всех сценариев */}
        {scenario !== "none" && (
          <button
            className={styles.backBtn}
            onClick={() => {
              if (scenario === "register" && showEmailForm) {
                setShowEmailForm(false);
              } else if (scenario === "login" && showLoginEmailForm) {
                setShowLoginEmailForm(false);
              } else {
                setScenario("none");
              }
            }}
            aria-label="Вернуться к выбору"
          >
            &lt;
          </button>
        )}

        {/* Сценарий Входа */}
        {scenario === "login" && (
          <div className={`${styles.scenarioWrapper} login`}>
            <h2 className="text-center mb-3">Войти</h2>
            {errors.form && <div className="alert alert-danger">{errors.form}</div>}
            {okMsg && <div className="alert alert-success">{okMsg}</div>}

            {!showLoginEmailForm && (
              <div className="d-flex flex-column align-items-center gap-3">
                <button
                  className={`${styles.mainBtn} ${styles.emailBtn}`}
                  onClick={() => setShowLoginEmailForm(true)}
                >
                  <FaEnvelope /> Войти по Email
                </button>

                <a
                  className={`${styles.mainBtn} ${styles.googleBtn}`}
                  href={`${API_BASE}/oauth2/authorization/google`}
                >
                  <FaGoogle /> Войти через Google
                </a>

                <a
                  className={`${styles.mainBtn} ${styles.facebookBtn}`}
                  href={`${API_BASE}/oauth2/authorization/facebook`}
                >
                  <FaFacebookF /> Войти через Facebook
                </a>
              </div>
            )}

            {showLoginEmailForm && (
              <CSSTransition
                in={showLoginEmailForm}
                timeout={300}
                classNames={{
                  enter: styles.fadeSlideEnter,
                  enterActive: styles.fadeSlideEnterActive,
                  exit: styles.fadeSlideExit,
                  exitActive: styles.fadeSlideExitActive,
                }}
                unmountOnExit
              >
                <div>
                  <form className={styles.formCard} onSubmit={onSubmit} noValidate>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input
                        id="email"
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Пароль</label>
                      <div className={styles.passwordWrapper}>
                        <input
                          id="password"
                          className={`form-control ${errors.password ? "is-invalid" : ""} ${styles.passwordInput}`}
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <span
                          className={styles.showPassIcon}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <Image
                            src={showPassword ? "/images/eye1.png" : "/images/eye.png"}
                            alt="Показать пароль"
                            width={32}
                            height={32}
                          />
                        </span>
                      </div>
                      {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>

                    <p className={styles.forgotPass}>Забыли пароль?</p>

                    <button
                      type="submit"
                      className={`${styles.mainBtn} ${styles.loginBtn} w-100`}
                      disabled={submitting}
                    >
                      {submitting ? "Входим…" : "Войти"}
                    </button>
                  </form>

                  <div className="d-flex flex-column align-items-center gap-3 mt-3">
                    <a
                      className={`${styles.mainBtn} ${styles.googleBtn}`}
                      href={`${API_BASE}/oauth2/authorization/google`}
                    >
                      <FaGoogle /> Войти через Google
                    </a>

                    <a
                      className={`${styles.mainBtn} ${styles.facebookBtn}`}
                      href={`${API_BASE}/oauth2/authorization/facebook`}
                    >
                      <FaFacebookF /> Войти через Facebook
                    </a>
                  </div>
                </div>
              </CSSTransition>
            )}
          </div>
        )}

        {/* Сценарий Регистрации */}
        {scenario === "register" && (
          <div className={styles.scenarioWrapper}>
            <h2 className="text-center mb-3">Создать аккаунт</h2>

            {!showEmailForm && (
              <div className="d-flex flex-column align-items-center gap-3">
                <button
                  className={`${styles.mainBtn} ${styles.emailBtn}`}
                  onClick={() => setShowEmailForm(true)}
                >
                  <FaEnvelope /> Создать по Email
                </button>

                <a
                  className={`${styles.mainBtn} ${styles.googleBtn}`}
                  href={`${API_BASE}/oauth2/authorization/google`}
                >
                  <FaGoogle /> Создать через Google
                </a>

                <a
                  className={`${styles.mainBtn} ${styles.facebookBtn}`}
                  href={`${API_BASE}/oauth2/authorization/facebook`}
                >
                  <FaFacebookF /> Создать через Facebook
                </a>
              </div>
            )}

            {/* Сценарий Регистрация по Email */}
            {showEmailForm && (
              <CSSTransition
                in={showEmailForm}
                timeout={300}
                classNames={{
                  enter: styles.fadeSlideEnter,
                  enterActive: styles.fadeSlideEnterActive,
                  exit: styles.fadeSlideExit,
                  exitActive: styles.fadeSlideExitActive,
                }}
                unmountOnExit
              >
                <form className={`${styles.formCard} register`} onSubmit={onSubmit} noValidate>
                  <div className="mb-3">
                    <label htmlFor="reg-email" className="form-label">Email</label>
                    <input
                      id="reg-email"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="reg-password" className="form-label">Пароль</label>
                    <div className={styles.passwordWrapper}>
                      <input
                        id="reg-password"
                        className={`form-control ${errors.password ? "is-invalid" : ""} ${styles.passwordInput}`}
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <span
                        className={styles.showPassIcon}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <Image
                          src={showPassword ? "/images/eye1.png" : "/images/eye.png"}
                          alt="Показать пароль"
                          width={32}
                          height={32}
                        />
                      </span>
                    </div>
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}

                    <div className="mt-2" style={{ fontSize: "0.85rem", color: "#666" }}>
                      Пароль должен содержать минимум 8 символов, заглавные и строчные буквы,
                      цифры и спецсимволы.
                    </div>

                    {renderPasswordStrength(password)}
                  </div>

                  <button
                    type="submit"
                    className={`${styles.mainBtn} ${styles.registerBtn} w-100`}
                    disabled={submitting}
                  >
                    {submitting ? "Регистрируем…" : "Зарегистрироваться"}
                  </button>
                </form>
              </CSSTransition>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}