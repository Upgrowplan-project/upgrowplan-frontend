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

export default function AccountPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [fullname, setFullname] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [userType, setUserType] = useState<
    "Физическое лицо" | "Юридическое лицо"
  >("Физическое лицо");
  const [companyName, setCompanyName] = useState("");
  const [companyTaxId, setCompanyTaxId] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const mapUserType = (value: string): "Физическое лицо" | "Юридическое лицо" =>
    value === "LEGAL" ? "Юридическое лицо" : "Физическое лицо";

  const mapUserTypeBack = (value: "Физическое лицо" | "Юридическое лицо") =>
    value === "Юридическое лицо" ? "LEGAL" : "INDIVIDUAL";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await getUserProfile();
        setUser(profile);
        setFullname(profile.name || "");
        setAvatarPreview(profile.avatarUrl || "/images/user-icon.png");

        setUserType(mapUserType(profile.userType || "INDIVIDUAL"));
        setCompanyName(profile.companyName || "");
        setCompanyTaxId(profile.companyTaxId || "");
        setPhone(profile.phone || "");
        setAddress(profile.address || "");
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
      if (avatarFile) {
        const res = await uploadAvatar(avatarFile);
        setAvatarPreview(res.avatarUrl);
      }
      await updateUserProfile({
        fullname,
        avatarUrl: avatarPreview || user.avatarUrl,
        userType: mapUserTypeBack(userType),
        companyName: userType === "Юридическое лицо" ? companyName : undefined,
        companyTaxId:
          userType === "Юридическое лицо" ? companyTaxId : undefined,
        phone,
        address,
      });
      setUser({
        ...user,
        name: fullname,
        avatarUrl: avatarPreview || user.avatarUrl,
        userType: mapUserTypeBack(userType),
        companyName,
        companyTaxId,
        phone,
        address,
      });
      setEditing(false);
      alert("Профиль обновлён");
    } catch (err) {
      console.error(err);
      alert("Ошибка при обновлении профиля");
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

            {/* Поля */}
            <div className="col-12 col-md-9">
              {[
                { label: "Полное имя", value: fullname, setter: setFullname },
                { label: "Email", value: user.email, setter: undefined },
                { label: "Телефон", value: phone, setter: setPhone },
                { label: "Адрес", value: address, setter: setAddress },
                {
                  label: "Тип пользователя",
                  value: userType,
                  setter: setUserType,
                  options: ["Физическое лицо", "Юридическое лицо"],
                },
                {
                  label: "Название компании",
                  value: companyName,
                  setter: setCompanyName,
                  show: userType === "Юридическое лицо",
                },
                {
                  label: "ИНН / налоговый ID",
                  value: companyTaxId,
                  setter: setCompanyTaxId,
                  show: userType === "Юридическое лицо",
                },
                { label: "Статус", value: user.role, setter: undefined },
              ].map((field, idx) => {
                if (field.show === false) return null;
                return (
                  <div className="row mb-3 align-items-center" key={idx}>
                    <div className="col-5 col-md-3">{field.label}</div>
                    <div className="col-7 col-md-9">
                      {editing && field.setter ? (
                        field.options ? (
                          <select
                            className="form-select"
                            value={field.value}
                            onChange={(e) => field.setter!(e.target.value)}
                          >
                            {field.options.map((opt) => (
                              <option key={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            className="form-control"
                            value={field.value || ""}
                            onChange={(e) => field.setter!(e.target.value)}
                          />
                        )
                      ) : (
                        <span className="text-primary">
                          {field.value || ""}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

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
                  <button
                    className="btn btn-primary"
                    onClick={() => setEditing(true)}
                  >
                    Редактировать профиль
                  </button>
                )}
                {!editing && (
                  <>
                    <button className="btn btn-warning">Сменить аккаунт</button>
                    <button className="btn btn-danger">Удалить аккаунт</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
