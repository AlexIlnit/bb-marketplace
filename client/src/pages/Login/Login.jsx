import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  loginUser,
  verifyLoginCode,
} from "../../api/authApi";

import { useAuthStore } from "../../store/authStore";


export default function Login() {

  const navigate = useNavigate();

  const setUser =
    useAuthStore((s) => s.setUser);


  const [step, setStep] =
    useState("login");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [code, setCode] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const submitLogin = async (e) => {

    e.preventDefault();

    setError("");

    setLoading(true);

    try {

      const { data } =
        await loginUser({
          email,
          password,
        });


      if (
        data.requiresPhoneCode
      ) {

        setStep("code");

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


  const submitCode = async (e) => {

    e.preventDefault();

    setError("");

    setLoading(true);

    try {

      const { data } =
        await verifyLoginCode({
          email,
          code,
        });


      setUser(
        data,
        data.token
      );


      if (
        data.role === "admin"
      ) {

        navigate("/admin");

      } else {

        navigate("/profile");

      }

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Неверный код"
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">


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
                  setEmail(
                    e.target.value
                  )
                }
                required
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
              />


              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
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
                  : "Продолжить"
                }

              </button>

            </form>


            <p className="text-center text-sm text-gray-500 mt-6">

              Нет аккаунта?{" "}

              <Link
                to="/register"
                className="text-green-600"
              >

                Регистрация

              </Link>

            </p>

          </>

        )}


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
                    e.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
                required
                className="w-full p-4 text-center text-2xl tracking-[0.5em] border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
              />


              <button
                type="submit"
                disabled={
                  loading ||
                  code.length !== 6
                }
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-60"
              >

                {loading
                  ? "Проверка..."
                  : "Подтвердить"
                }

              </button>

            </form>


            <button
              onClick={() => {

                setStep("login");

                setCode("");

                setError("");

              }}
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