"use client";
import { logout, deleteAccount } from "../auth/authService";
import { useRouter } from "next/navigation";

export default function AccountActions() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth");
    } catch (err) {
      console.error("Ошибка при выходе", err);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Вы уверены, что хотите удалить аккаунт?")) return;
    try {
      await deleteAccount();
      router.push("/register");
    } catch (err) {
      console.error("Ошибка при удалении аккаунта", err);
    }
  };

  return (
    <>
      <button className="btn btn-warning" onClick={handleLogout}>
        Сменить аккаунт
      </button>
      <button className="btn btn-danger" onClick={handleDelete}>
        Удалить аккаунт
      </button>
    </>
  );
}
