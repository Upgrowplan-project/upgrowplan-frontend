"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CSSTransition } from "react-transition-group";
import styles from "./auth.module.css";
import { registerByEmail, login, JwtResponse } from "./authService"; // импорт JwtResponse

export default function EmailRegisterForm({
  showEmailForm = true,
  mode = "register",
}: {
  showEmailForm?: boolean;
  mode?: "register" | "login";
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordHint, setPasswordHint] = useState("");
  const router = useRouter();

  function handlePasswordChange(value: string) {
    setPassword(value);

    let strength = 0;
    if (value.length >= 8) strength++;
    if (/[A-Z]/.test(value)) strength++;
    if (/[0-9]/.test(value)) strength++;
    if (/[^A-Za-z0-9]/.test(value)) strength++;

    setPasswordStrength(strength);

    if (strength <= 1) setPasswordHint("Пароль слабый");
    else if (strength === 2) setPasswordHint("Пароль средний");
    else setPasswordHint("Пароль сильный");
  }

  // регистрация
  async function onRegister(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    // Проверка пароля
    const passwordRules = [
      { regex: /.{8,}/, message: "Пароль должен содержать минимум 8 символов" },
      {
        regex: /[A-Z]/,
        message: "Пароль должен содержать хотя бы одну заглавную букву",
      },
      {
        regex: /[a-z]/,
        message: "Пароль должен содержать хотя бы одну строчную букву",
      },
      { regex: /[0-9]/, message: "Пароль должен содержать хотя бы одну цифру" },
      {
        regex: /[^A-Za-z0-9]/,
        message: "Пароль должен содержать хотя бы один спецсимвол",
      },
    ];

    const failedRule = passwordRules.find((rule) => !rule.regex.test(password));
    if (failedRule) {
      setErrors({ password: failedRule.message });
      setSubmitting(false);
      return;
    }

    try {
      const res: JwtResponse = await registerByEmail(email, password);
      localStorage.setItem("token", res.token);
      localStorage.setItem("email", res.email);
      router.push("/account");
    } catch (err: any) {
      setErrors({
        email: err.message || "Ошибка регистрации",
        password: undefined,
      });
    } finally {
      setSubmitting(false);
    }
  }

  // вход
  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      const res: JwtResponse = await login(email, password);
      localStorage.setItem("token", res.token);
      localStorage.setItem("email", res.email);
      router.push("/account");
    } catch (err: any) {
      console.error("Login error response:", err.response?.data); // <- добавлено
      setErrors({
        email: err.message || "Ошибка входа",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function renderPasswordStrength() {
    const score = passwordStrength;
    const strengthText =
      score <= 2 ? "Слабый" : score === 3 ? "Средний" : "Сильный";

    return (
      <div className="mt-2">
        <div className="d-flex gap-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{ height: "6px" }}
              className={`flex-grow-1 rounded ${
                i <= score ? "bg-success" : "bg-light"
              }`}
            />
          ))}
        </div>
        {password && <p className="mt-1 small text-muted">{passwordHint}</p>}
        <div className="d-flex align-items-center gap-1 mt-1">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} style={{ color: i < score ? "#0683f5" : "#ddd" }}>
              ★
            </span>
          ))}
          <span className="ms-2">{strengthText}</span>
        </div>
      </div>
    );
  }

  return (
    <>
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
          <div className={styles.formCard}>
            {mode === "login" ? (
              <form onSubmit={onLogin} noValidate>
                <div className="mb-3">
                  <label htmlFor="login-email" className="form-label">
                    Email
                  </label>
                  <input
                    id="login-email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="login-password" className="form-label">
                    Пароль
                  </label>
                  <div className={styles.passwordWrapper}>
                    <input
                      id="login-password"
                      className={`form-control ${
                        errors.password ? "is-invalid" : ""
                      } ${styles.passwordInput}`}
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
                        src={
                          showPassword ? "/images/eye1.png" : "/images/eye.png"
                        }
                        alt="Показать пароль"
                        width={32}
                        height={32}
                      />
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`${styles.mainBtn} ${styles.loginBtn} w-100`}
                  disabled={submitting}
                >
                  {submitting ? "Входим…" : "Войти"}
                </button>
              </form>
            ) : (
              <form onSubmit={onRegister} noValidate>
                <div className="mb-3">
                  <label htmlFor="reg-email" className="form-label">
                    Email
                  </label>
                  <input
                    id="reg-email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="reg-password" className="form-label">
                    Пароль
                  </label>
                  <div className={styles.passwordWrapper}>
                    <input
                      id="reg-password"
                      className={`form-control ${
                        errors.password ? "is-invalid" : ""
                      } ${styles.passwordInput}`}
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      required
                    />
                    <span
                      className={styles.showPassIcon}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <Image
                        src={
                          showPassword ? "/images/eye1.png" : "/images/eye.png"
                        }
                        alt="Показать пароль"
                        width={32}
                        height={32}
                      />
                    </span>
                  </div>
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}

                  <div
                    className="mt-2"
                    style={{ fontSize: "0.85rem", color: "#666" }}
                  >
                    Пароль должен содержать минимум 8 символов, заглавные и
                    строчные буквы, цифры и спецсимволы.
                  </div>

                  {renderPasswordStrength()}
                </div>

                <button
                  type="submit"
                  className={`${styles.mainBtn} ${styles.registerBtn} w-100`}
                  disabled={submitting}
                >
                  {submitting ? "Регистрируем…" : "Зарегистрироваться"}
                </button>
              </form>
            )}
          </div>
        </CSSTransition>
      )}
    </>
  );
}
