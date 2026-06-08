import { useState, useEffect } from "react";
import { loginUser } from "../../api/authApi";
import { useAuthStore } from "../../store/authStore";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";



export default function Login() {
  const setUser = useAuthStore((s) => s.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  

const submit = async (e) => {
  e.preventDefault();

  setError("");
  setLoading(true);

  try {
    const { data } = await loginUser({
      email,
      password
    });

    setUser(
      {
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role
      },
      data.token
    );

    if (data.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/profile");
    }

  } catch (err) {
    setError(
      err.response?.data?.message ||
      "Ошибка входа"
    );
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-6">
          Вход в аккаунт
        </h1>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Пароль"
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Нет аккаунта?{" "}
          <Link to="/register" className="text-green-600 cursor-pointer">
            Регистрация
        </Link>
        </p>
      </div>
    </div>
  );
 
}