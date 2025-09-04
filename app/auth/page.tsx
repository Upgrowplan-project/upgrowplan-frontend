"use client";

import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { FaGoogle, FaFacebookF, FaEnvelope, FaPhone } from "react-icons/fa";
import { CSSTransition } from "react-transition-group";
import styles from "./auth.module.css";
import EmailRegisterForm from "./EmailRegisterForm";
import PhoneRegisterForm from "./PhoneRegisterForm";
import { API_BASE } from "./../apiConfig";

export default function AuthPage() {
  const [scenario, setScenario] = useState<"none" | "login" | "register">(
    "none"
  );
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showLoginEmailForm, setShowLoginEmailForm] = useState(false);
  const [showPhoneForm, setShowPhoneForm] = useState(false);

  const handleSocialLogin = (provider: "google" | "facebook") => {
    window.location.href = `${API_BASE}/oauth2/authorization/${provider}`;
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

        {/* Общая кнопка назад */}
        {scenario !== "none" && (
          <button
            className={styles.backBtn}
            onClick={() => {
              if (scenario === "register" && (showEmailForm || showPhoneForm)) {
                setShowEmailForm(false);
                setShowPhoneForm(false);
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

            {!showLoginEmailForm && (
              <div className="d-flex flex-column align-items-center gap-3">
                <button
                  className={`${styles.mainBtn} ${styles.emailBtn}`}
                  onClick={() => setShowLoginEmailForm(true)}
                >
                  <FaEnvelope /> Email
                </button>

                <a
                  className={`${styles.mainBtn} ${styles.googleBtn}`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSocialLogin("google");
                  }}
                >
                  <FaGoogle /> Google
                </a>

                <a
                  className={`${styles.mainBtn} ${styles.facebookBtn}`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSocialLogin("facebook");
                  }}
                >
                  <FaFacebookF /> Facebook
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
                  <EmailRegisterForm mode="login" />
                  <div className="d-flex flex-column align-items-center gap-3 mt-3">
                    <a
                      className={`${styles.mainBtn} ${styles.googleBtn}`}
                      href={`${API_BASE}/oauth2/authorization/google`}
                    >
                      <FaGoogle /> Google
                    </a>

                    <a
                      className={`${styles.mainBtn} ${styles.facebookBtn}`}
                      href={`${API_BASE}/oauth2/authorization/facebook`}
                    >
                      <FaFacebookF /> Facebook
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
            <h2 className="text-center mb-3">Создаем новый аккаунт</h2>

            {!showEmailForm && !showPhoneForm && (
              <div className="d-flex flex-column align-items-center gap-3">
                <button
                  className={`${styles.mainBtn} ${styles.emailBtn}`}
                  onClick={() => setShowEmailForm(true)}
                >
                  <FaEnvelope /> Email
                </button>

                <button
                  className={`${styles.mainBtn} ${styles.phoneBtn}`}
                  onClick={() => setShowPhoneForm(true)}
                >
                  <FaPhone style={{ marginRight: "8px" }} /> Телефон
                </button>

                <a
                  className={`${styles.mainBtn} ${styles.googleBtn}`}
                  href={`${API_BASE}/oauth2/authorization/google`}
                >
                  <FaGoogle /> Google
                </a>

                <a
                  className={`${styles.mainBtn} ${styles.facebookBtn}`}
                  href={`${API_BASE}/oauth2/authorization/facebook`}
                >
                  <FaFacebookF /> Facebook
                </a>
              </div>
            )}

            {showEmailForm && <EmailRegisterForm mode="register" />}
            {showPhoneForm && <PhoneRegisterForm />}
          </div>
        )}
      </div>
    </>
  );
}
