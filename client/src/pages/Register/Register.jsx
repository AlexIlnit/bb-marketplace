import { useState } from "react";
import { registerUser } from "../../api/authApi";
import { useAuthStore } from "../../store/authStore";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await registerUser({
        name,
        email,
        password
      });

      setUser(
        {
          id: data._id,
          name: data.name,
          email: data.email
        },
        data.token
      );

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-2xl font-bold text-center mb-6">
          Регистрация
        </h1>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">

          <input
            placeholder="Имя"
            className="w-full p-3 border rounded-xl"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Email"
            className="w-full p-3 border rounded-xl"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Пароль"
            className="w-full p-3 border rounded-xl"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-xl"
          >
            {loading ? "Создание..." : "Создать аккаунт"}
          </button>

        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Уже есть аккаунт?{" "}
          <Link to="/login" className="text-green-600">
            Войти
          </Link>
        </p>

      </div>
    </div>
  );
}