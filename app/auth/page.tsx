"use client";

import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { CSSTransition } from "react-transition-group";
import styles from "./auth.module.css";
import EmailRegisterForm from "./EmailRegisterForm";

export default function AuthPage() {
  const [scenario, setScenario] = useState<"none" | "login" | "register">(
    "none"
  );

  return (
    <>
      <Header />
      <div className={`container py-5 ${styles.authPage}`}>
        {/* Экран выбора сценария */}
        {scenario === "none" && (
          <div className="d-flex flex-column align-items-center gap-3">
            <h1 className="h3 text-center mb-4">
              Присоединяйтесь к Upgrowplan
            </h1>
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
            onClick={() => setScenario("none")}
            aria-label="Вернуться к выбору"
          >
            &lt;
          </button>
        )}

        {/* Сценарий Входа */}
        {scenario === "login" && (
          <div className={`${styles.scenarioWrapper} login`}>
            <h2 className="text-center mb-3">
              Снова с нами? Добро пожаловать!
            </h2>
            <CSSTransition
              in={scenario === "login"}
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
              </div>
            </CSSTransition>
          </div>
        )}

        {/* Сценарий Регистрации */}
        {scenario === "register" && (
          <div className={styles.scenarioWrapper}>
            <h2 className="text-center mb-3">
              Создайте аккаунт за пару кликов
            </h2>
            <CSSTransition
              in={scenario === "register"}
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
                <EmailRegisterForm mode="register" />
              </div>
            </CSSTransition>
          </div>
        )}
      </div>
    </>
  );
}
