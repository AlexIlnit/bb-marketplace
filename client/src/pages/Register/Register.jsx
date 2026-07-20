import { useState } from "react";
import { registerUser } from "../../api/authApi";
import { useAuthStore } from "../../store/authStore";
import { useNavigate, Link } from "react-router-dom";


export default function Register() {

  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [agree, setAgree] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const submit = async (e) => {

    e.preventDefault();

    if (!agree) {
      setError("Необходимо принять условия соглашения");
      return;
    }

    setError("");
    setLoading(true);


    try {

      const { data } = await registerUser({
        name,
        email,
        phone,
        password,
        acceptedTerms:agree,
        acceptedTermsVersion: "1.0"
      });


      setUser(
        {
          id:data._id,
          name:data.name,
          email:data.email,
          phone:data.phone,
          avatar:data.avatar,
          role:data.role,
          isBlocked:data.isBlocked,
          createdAt:data.createdAt,
          acceptedTerms: data.acceptedTerms,
          acceptedTermsVersion: data.acceptedTermsVersion,
          acceptedTermsDate: data.acceptedTermsDate
        },
        data.token
      );


      navigate("/");


    } catch(err){

      setError(
        err.response?.data?.message ||
        "Ошибка регистрации"
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="
      min-h-screen 
      flex 
      items-center 
      justify-center 
      bg-gray-100 
      px-4
    ">


      <div className="
        w-full 
        max-w-md 
        bg-white 
        rounded-3xl 
        shadow-xl 
        p-8
      ">


        <div className="text-center mb-8">

          <h1 className="
            text-3xl 
            font-bold 
            text-gray-900
          ">
            Создать аккаунт
          </h1>

          <p className="
            text-gray-500 
            mt-2 
            text-sm
          ">
            Присоединяйтесь к BB Market
          </p>

        </div>



        {error && (

          <div className="
            bg-red-50 
            border 
            border-red-200
            text-red-600 
            text-sm 
            p-3 
            rounded-xl 
            mb-5
          ">
            {error}
          </div>

        )}



        <form 
          onSubmit={submit}
          className="space-y-4"
        >


          <input
            placeholder="Ваше имя"
            value={name}
            required
            onChange={(e)=>setName(e.target.value)}
            className="
              w-full
              p-3.5
              border
              rounded-xl
              outline-none
              focus:ring-2
              focus:ring-green-500
            "
          />



          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e)=>setEmail(e.target.value)}
            className="
              w-full
              p-3.5
              border
              rounded-xl
              outline-none
              focus:ring-2
              focus:ring-green-500
            "
          />



          <input
            type="tel"
            placeholder="+375 (29) 123-45-67"
            value={phone}
            required
            onChange={(e)=>setPhone(e.target.value)}
            className="
              w-full
              p-3.5
              border
              rounded-xl
              outline-none
              focus:ring-2
              focus:ring-green-500
            "
          />



          <input
            type="password"
            placeholder="Пароль"
            value={password}
            required
            onChange={(e)=>setPassword(e.target.value)}
            className="
              w-full
              p-3.5
              border
              rounded-xl
              outline-none
              focus:ring-2
              focus:ring-green-500
            "
          />




          <label className="
            flex 
            items-start 
            gap-3 
            mt-5
            cursor-pointer
          ">


            <input
              type="checkbox"
              checked={agree}
              onChange={(e)=>setAgree(e.target.checked)}
              className="
                mt-1
                w-4
                h-4
                accent-green-600
              "
            />



            <span className="
              text-sm 
              text-gray-600
              leading-5
            ">

              Я принимаю

              <Link
                to="/terms"
                className="
                  text-green-600
                  hover:underline
                  mx-1
                "
              >
                пользовательское соглашение
              </Link>

              и согласен на обработку

              <Link
                to="/personal-data"
                className="
                  text-green-600
                  hover:underline
                  ml-1
                "
              >
                персональных данных
              </Link>

            </span>


          </label>





          <button
            type="submit"
            disabled={!agree || loading}
            className="
              w-full
              py-3.5
              rounded-xl
              bg-green-600
              text-white
              font-semibold
              transition
              hover:bg-green-700
              disabled:bg-gray-300
              disabled:cursor-not-allowed
            "
          >

            {
              loading 
              ? "Создание аккаунта..."
              : "Зарегистрироваться"
            }

          </button>



        </form>




        <p className="
          text-center 
          text-sm 
          text-gray-500 
          mt-6
        ">

          Уже есть аккаунт?

          <Link
            to="/login"
            className="
              text-green-600
              font-medium
              ml-1
              hover:underline
            "
          >
            Войти
          </Link>

        </p>


      </div>


    </div>

  );

}