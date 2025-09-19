"use client";

import { ChangeEvent } from "react";
import { UserProfile } from "../auth/authService";

interface AdvancedSettingsProps {
  user: UserProfile;
  editing: boolean;
  setUser: (user: UserProfile) => void;
}

export default function AdvancedSettings({
  user,
  editing,
  setUser,
}: AdvancedSettingsProps) {
  // маппинг статуса и типа пользователя
  const statusMap: Record<string, string> = {
    USER: "Пользователь",
    ADMIN: "Админ",
  };

  const userTypeMap: Record<string, string> = {
    INDIVIDUAL: "Физическое лицо",
    LEGAL: "Юридическое лицо",
  };

  // функция форматирования даты
  const formatDate = (dateStr?: string) =>
    dateStr ? new Date(dateStr).toLocaleString("ru-RU") : "—";

  const fields = [
    { label: "Баланс (₽)", value: user.balance?.toString(), key: "balance" },
    { label: "Токены", value: user.tokens?.toString(), key: "tokens" },
    { label: "Активен", value: user.isActive ? "Да" : "Нет", key: "isActive" },
    {
      label: "Дата регистрации",
      value: formatDate(user.createdAt),
      key: "createdAt",
    },
    {
      label: "Тип пользователя",
      value: userTypeMap[user.userType || "INDIVIDUAL"],
      key: "userType",
    },
    {
      label: "Статус",
      value: statusMap[user.role || "USER"],
      key: "role",
    },
  ];

  return (
    <div className="card shadow-sm p-4">
      <h4 className="mb-3">Расширенные настройки</h4>

      {fields.map((field, idx) => {
        if (!field.value && !editing) return null;
        return (
          <div className="row mb-3 align-items-center" key={idx}>
            <div className="col-5 col-md-3">{field.label}</div>
            <div className="col-7 col-md-9">
              {!editing ? (
                <span className="text-primary">{field.value || "—"}</span>
              ) : (
                <input
                  type="text"
                  className="form-control"
                  value={field.value || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const updatedUser = {
                      ...user,
                      [field.key]: e.target.value,
                    };
                    setUser(updatedUser);
                  }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
