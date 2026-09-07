import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  loginUser,
  verifyLoginCode,
  resendLoginCode,
} from "../../api/authApi";

import { useAuthStore } from "../../store/authStore";

export default function Login() {
  const navigate = useNavigate();

  const setUser = useAuthStore((s) => s.setUser);

  // =========================
  // STATE
  // =========================

  const [step, setStep] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [resendTimer, setResendTimer] = useState(60);

  // =========================
  // RESEND TIMER
  // =========================

  useEffect(() => {
    if (step !== "code") return;

    if (resendTimer <= 0) return;

    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, resendTimer]);

  // =========================
  // LOGIN
  // =========================

  const submitLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const { data } = await loginUser({
        email,
        password,
      });

      // Если требуется код телефона
      if (data.requiresPhoneCode) {
        setStep("code");
        setResendTimer(data.retryAfter || 60);
        return;
      }

      // Если код не требуется и сервер сразу вернул пользователя
      if (data.token) {
        setUser(data, data.token);

        if (data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/profile");
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Ошибка входа"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // VERIFY CODE
  // =========================

  const submitCode = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const { data } = await verifyLoginCode({
        email,
        code,
      });

      setUser(data, data.token);

      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Неверный код"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RESEND CODE
  // =========================

  const handleResendCode = async () => {
    if (resendTimer > 0 || loading) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const { data } = await resendLoginCode({
        email,
      });

      setResendTimer(data.retryAfter || 60);
    } catch (err) {
      const retryAfter =
        err.response?.data?.retryAfter;

      if (retryAfter) {
        setResendTimer(retryAfter);
      }

      setError(
        err.response?.data?.message ||
          "Не удалось отправить код"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // BACK TO LOGIN
  // =========================

  const handleBack = () => {
    setStep("login");
    setCode("");
    setError("");
    setResendTimer(60);
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* =========================
            LOGIN STEP
        ========================= */}

        {step === "login" && (
          <>
            <h1 className="text-2xl font-bold text-center mb-6">
              Вход в аккаунт
            </h1>

            {error && (
              <div className="bg-red-100 text-red-600 text-sm p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form
              onSubmit={submitLogin}
              className="space-y-4"
            >
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
              />

              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-60"
              >
                {loading
                  ? "Проверка..."
                  : "Продолжить"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Нет аккаунта?{" "}

              <Link
                to="/register"
                className="text-green-600 hover:text-green-700"
              >
                Регистрация
              </Link>
            </p>
          </>
        )}

        {/* =========================
            CODE STEP
        ========================= */}

        {step === "code" && (
          <>
            <h1 className="text-2xl font-bold text-center mb-3">
              Подтверждение входа
            </h1>

            <p className="text-center text-gray-500 text-sm mb-6">
              Мы отправили код на ваш номер телефона
            </p>

            {error && (
              <div className="bg-red-100 text-red-600 text-sm p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form
              onSubmit={submitCode}
              className="space-y-4"
            >
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Введите код"
                value={code}
                onChange={(e) =>
                  setCode(
                    e.target.value.replace(/\D/g, "")
                  )
                }
                required
                className="w-full p-4 text-center text-2xl tracking-[0.5em] border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
              />

              <button
                type="submit"
                disabled={
                  loading || code.length !== 6
                }
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-60"
              >
                {loading
                  ? "Проверка..."
                  : "Подтвердить"}
              </button>

              {/* RESEND */}

              <div className="mt-4 text-center">
                {resendTimer > 0 ? (
                  <p className="text-sm text-gray-500">
                    Отправить код повторно через{" "}

                    <span className="font-semibold text-gray-700">
                      {resendTimer} сек.
                    </span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={loading}
                    className="text-sm font-medium text-green-600 hover:text-green-700 disabled:opacity-50"
                  >
                    Отправить код повторно
                  </button>
                )}
              </div>
            </form>

            {/* BACK */}

            <button
              type="button"
              onClick={handleBack}
              className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700"
            >
              ← Вернуться назад
            </button>
          </>
        )}
      </div>
    </div>
  );
}

