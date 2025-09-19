"use client";

import { useEffect, useState, ChangeEvent } from "react";
import Image from "next/image";
import Header from "../../components/Header";
import {
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  UserProfile,
} from "../auth/authService";
import AdvancedSettings from "./AdvancedSettings";
import AccountActions from "./AccountActions";

// маппинг типов пользователя
const mapUserType = (type: string): string => {
  switch (type) {
    case "INDIVIDUAL":
      return "Физическое лицо";
    case "LEGAL":
      return "Юридическое лицо";
    default:
      return "Физическое лицо";
  }
};

const mapUserTypeBack = (type: string): "INDIVIDUAL" | "LEGAL" => {
  switch (type) {
    case "Физическое лицо":
      return "INDIVIDUAL";
    case "Юридическое лицо":
      return "LEGAL";
    default:
      return "INDIVIDUAL";
  }
};

export default function AccountPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [fullname, setFullname] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [userType, setUserType] = useState("Физическое лицо");
  const [companyName, setCompanyName] = useState("");
  const [companyTaxId, setCompanyTaxId] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile: UserProfile = await getUserProfile();

        setFullname(profile.fullname || "");
        setAvatarPreview(profile.avatarUrl || "/images/user-icon.png");
        setUserType(mapUserType(profile.userType || "INDIVIDUAL"));
        setCompanyName(profile.companyName || "");
        setCompanyTaxId(profile.companyTaxId || "");
        setPhone(profile.phone || "");
        setCountry(profile.country || "");
        setUser(profile);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      let avatarUrl = avatarPreview || user.avatarUrl;
      if (avatarFile) {
        const res = await uploadAvatar(avatarFile);
        avatarUrl = res.avatarUrl;
      }

      const updatedProfile: Partial<UserProfile> = {
        fullname: fullname,
        avatarUrl,
        userType: mapUserTypeBack(userType),
        companyName,
        companyTaxId,
        phone,
        country,
      };

      await updateUserProfile(updatedProfile);
      setUser({ ...user, ...updatedProfile });
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (!user) return <p className="text-center mt-5">Пользователь не найден</p>;

  return (
    <>
      <Header />
      <main className="container mt-5">
        <h2 className="mb-4">Мой аккаунт</h2>

        <div className="card shadow-sm p-4">
          <div className="row flex-column flex-md-row">
            {/* Аватар */}
            <div className="col-12 col-md-3 text-center text-md-start mb-3 mb-md-0">
              <Image
                src={avatarPreview || "/images/user.png"}
                alt="Аватар"
                width={100}
                height={100}
                className="rounded-circle"
              />
              {editing && (
                <input
                  type="file"
                  accept="image/*"
                  className="form-control mt-2"
                  onChange={handleAvatarChange}
                />
              )}
            </div>

            {/* Основные поля */}
            <div className="col-12 col-md-9">
              {[
                { label: "Полное имя", value: fullname, setter: setFullname },
                { label: "Email", value: user.email, setter: undefined },
                { label: "Телефон", value: phone, setter: setPhone },
                { label: "Страна", value: country, setter: setCountry },
              ].map((field, idx) => (
                <div className="row mb-3 align-items-center" key={idx}>
                  <div className="col-5 col-md-3">{field.label}</div>
                  <div className="col-7 col-md-9">
                    {editing && field.setter ? (
                      <input
                        type="text"
                        className="form-control"
                        value={field.value || ""}
                        onChange={(e) => field.setter!(e.target.value)}
                      />
                    ) : (
                      <span className="text-primary">{field.value || "—"}</span>
                    )}
                  </div>
                </div>
              ))}

              <div className="d-flex gap-2 mt-3 flex-wrap">
                {editing ? (
                  <>
                    <button className="btn btn-success" onClick={handleSave}>
                      Сохранить
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setEditing(false)}
                    >
                      Отмена
                    </button>
                  </>
                ) : (
                  <>
                    {/* Кнопка редактирования профиля */}
                    <button
                      className="btn btn-primary"
                      onClick={() => setEditing(true)}
                    >
                      Редактировать профиль
                    </button>

                    {/* Кнопки выхода и настроек */}
                    <AccountActions />
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setShowAdvanced((prev) => !prev)}
                    >
                      {showAdvanced
                        ? "Скрыть расширенные настройки"
                        : "Расширенные настройки"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {showAdvanced && (
          <div className="mt-4">
            <AdvancedSettings editing={editing} user={user} setUser={setUser} />
          </div>
        )}
      </main>
    </>
  );
}
