"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { FaGoogle, FaFacebookF, FaEnvelope } from "react-icons/fa";
import { CSSTransition } from "react-transition-group";

import styles from "./register.module.css";

type Errors = Partial<Record<"email" | "password" | "confirmPassword" | "form", string>>;

export default function RegisterPage() {
  const router = useRouter();
  const [showEmailForm, setShowEmailForm] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [okMsg, setOkMsg] = useState("");

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8080";

  const validate = (): boolean => {
    const e: Errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Неверный email";
    if (password.length < 8) e.password = "Минимум 8 символов";
    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      e.password = (e.password ? e.password + ". " : "") + "Пароль должен содержать буквы и цифры";
    }
    if (password !== confirm) e.confirmPassword = "Пароли не совпадают";
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
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        setOkMsg("Регистрация успешна. Перенаправляю на вход…");
        setTimeout(() => router.push("/login"), 800);
      } else {
        let msg = "Ошибка регистрации";
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
        <h1 className="h3 mb-4 text-center text-brand">Регистрация</h1>

        {errors.form && <div className="alert alert-danger">{errors.form}</div>}
        {okMsg && <div className="alert alert-success">{okMsg}</div>}

        <div className="d-flex flex-column align-items-center gap-3">
          {/* Email кнопка */}
          <button
            className={`${styles.registerBtn} ${styles.emailBtn}`}
            onClick={() => setShowEmailForm((prev) => !prev)}
          >
            <FaEnvelope /> Регистрация по Email
          </button>

          {/* Форма Email с анимацией */}
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
            <div className={styles.registerCard}>
              <form onSubmit={onSubmit} noValidate>
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
                  <input
                    id="password"
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
                  <label htmlFor="confirm" className="form-label">Подтверждение пароля</label>
                  <input
                    id="confirm"
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

          {/* Google и Facebook */}
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
        </div>

        <p className="mt-4 text-center">
          Уже есть аккаунт? <a className={styles.loginLink} href="/login">Войти</a>
        </p>
      </div>
      <Footer />
    </>
  );
}
