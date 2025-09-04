"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerByPhone, verifySmsCode } from "@/app/auth/authService";

export default function PhoneRegisterForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"register" | "verify">("register");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function handleSendCode() {
    if (!phone || !password) {
      setError("Введите телефон и пароль");
      return;
    }
    try {
      setSending(true);
      await registerByPhone(phone, password);
      setStep("verify");
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка при отправке кода");
    } finally {
      setSending(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    try {
      await verifySmsCode(phone, code);
      router.push("/account");
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка при подтверждении кода");
    }
  }

  return (
    <div className="registerCard">
      {step === "register" && (
        <div>
          <p className="mb-3">
            Введите ваш номер телефона в формате +7... <br />
          </p>
          <input
            type="tel"
            placeholder="Телефон"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="form-control mb-3"
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control mb-3"
            required
          />
          <p className="mb-3">
            Мы отправим вам 6-значный код подтверждения по СМС. <br />
            Код действителен в течение 5 минут
          </p>
          <div className="d-grid gap-2">
            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={handleSendCode}
              disabled={sending}
            >
              Отправить код
            </button>
          </div>

          {error && <p className="text-danger mt-2">{error}</p>}
        </div>
      )}

      {step === "verify" && (
        <form onSubmit={handleVerify}>
          <h2 className="h5 fw-bold mb-3">Подтвердите SMS-код</h2>
          <input
            type="text"
            placeholder="Код из SMS"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="form-control mb-3"
            required
          />
          <button type="submit" className="btn btn-success w-100 mb-3">
            Подтвердить
          </button>

          <div className="text-center">
            <p className="mb-2">Не получили СМС?</p>
            <button
              type="button"
              className="btn btn-link"
              onClick={handleSendCode}
              disabled={sending}
            >
              Отправить снова
            </button>
          </div>

          {error && <p className="text-danger">{error}</p>}
        </form>
      )}
    </div>
  );
}
