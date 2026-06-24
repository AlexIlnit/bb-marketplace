import { useState } from "react";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";
import AdminAvatar from "./AdminAvatar";

export default function AdminSettings() {
  const user = useAuthStore((s) => s.user);

  const [avatar, setAvatar] = useState(null);
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const uploadAvatar = async () => {
    if (!avatar) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", avatar);

      const { data } = await axios.post(
        "http://localhost:5000/api/upload",
        formData
      );

      await axios.put(
        "http://localhost:5000/api/admin/update-avatar",
        { avatar: data.url },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Аватар обновлён");
    } catch (err) {
      console.log(err);
      alert("Ошибка загрузки аватара");
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    if (!password) return;

    try {
      await axios.put(
        "http://localhost:5000/api/admin/change-password",
        { password },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPassword("");
      alert("Пароль обновлён");
    } catch (err) {
      console.log(err);
      alert("Ошибка смены пароля");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl space-y-6 max-w-xl">

      <h2 className="text-xl font-bold">Настройки администратора</h2>

      <AdminAvatar />

      {/* PASSWORD */}
      {/* <div className="space-y-3">
        <p className="font-medium">Новый пароль</p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Введите новый пароль"
          className="w-full border p-3 rounded-xl"
        />

        <button
          onClick={changePassword}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl"
        >
          Сменить пароль
        </button>
      </div> */}

    </div>
  );
}