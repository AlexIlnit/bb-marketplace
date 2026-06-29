import { useState } from "react";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";
import AdminAvatar from "./AdminAvatar";

export default function AdminSettings() {
  const user = useAuthStore((s) => s.user);

  const [email, setEmail] = useState(user?.email || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const changePassword = async () => {
    if (!email || !oldPassword || !newPassword) {
      alert("Заполните все поля");
      return;
    }

    setLoading(true);

    try {
      await axios.put(
        "http://localhost:5000/api/admin/change-password",
        {
          email,
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setOldPassword("");
      setNewPassword("");

      alert("Пароль успешно изменён");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Ошибка смены пароля");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl space-y-6 max-w-xl">

      <h2 className="text-xl font-bold">
        Настройки администратора
      </h2>

      <AdminAvatar />

      {/* EMAIL */}
      <div className="space-y-2">
        <p className="font-medium">Email</p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded-xl"
        />
      </div>

      {/* OLD PASSWORD */}
      <div className="space-y-2">
        <p className="font-medium">Старый пароль</p>

        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="Введите старый пароль"
          className="w-full border p-3 rounded-xl"
        />
      </div>

      {/* NEW PASSWORD */}
      <div className="space-y-2">
        <p className="font-medium">Новый пароль</p>

        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Введите новый пароль"
          className="w-full border p-3 rounded-xl"
        />
      </div>

      <button
        onClick={changePassword}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl w-full"
      >
        {loading ? "Сохранение..." : "Сменить пароль"}
      </button>

    </div>
  );
}