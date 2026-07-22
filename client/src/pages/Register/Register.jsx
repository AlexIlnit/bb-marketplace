import { useState } from "react";
import { registerUser } from "../../api/authApi";
import { useNavigate, Link } from "react-router-dom";


export default function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
  score: 0,
  text: "",
});

  const [agree, setAgree] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const formatPhone = (value) => {

  let digits = value.replace(/\D/g,"");


  if(digits.startsWith("375")){
    digits = digits.slice(3);
  }


  digits = digits.slice(0,9);


  let result = "+375 ";


  if(digits.length > 0){
    result += "(" + digits.slice(0,2);
  }


  if(digits.length >= 2){
    result += ")";
  }


  if(digits.length > 2){
    result += " " + digits.slice(2,5);
  }


  if(digits.length > 5){
    result += "-" + digits.slice(5,7);
  }


  if(digits.length > 7){
    result += "-" + digits.slice(7,9);
  }


  return result;
};

const checkPasswordStrength = (password) => {

  let score = 0;


  if(password.length >= 8){
    score++;
  }

  if(/[a-z]/.test(password)){
    score++;
  }

  if(/[A-Z]/.test(password)){
    score++;
  }

  if(/\d/.test(password)){
    score++;
  }

  if(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)){
    score++;
  }



  let text = "";


  if(score <= 2){
    text = "Слабый пароль";
  }
  else if(score <= 4){
    text = "Средний пароль";
  }
  else{
    text = "Надёжный пароль";
  }


  return {
    score,
    text
  };

};

const validatePassword = (password) => {

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;


  return passwordRegex.test(password);

};

  const submit = async (e) => {

    e.preventDefault();

    if (!agree) {
      setError("Необходимо принять условия соглашения");
      return;
    }

    const phoneDigits =
phone.replace(/\D/g,"");


if(phoneDigits.length !== 12){
  setError(
    "Введите полный номер телефона"
  );
  return;
}



const emailRegex =
/^[^\s@]+@[^\s@]+\.[^\s@]+$/;


if(!emailRegex.test(email)){
  setError(
    "Введите корректный email"
  );
  return;
}
if(!validatePassword(password)){

  setError(
    "Пароль должен содержать минимум 8 символов, цифру, заглавную и строчную букву, а также специальный символ"
  );

  return;

}

    setError("");
    setLoading(true);


    try {

  await registerUser({
    name,
    email,
    phone,
    password,
    acceptedTerms: agree,
    acceptedTermsVersion: "1.0"
  });


  setSuccess(
    "Регистрация успешна. Проверьте вашу почту и подтвердите email."
  );


  setTimeout(() => {
    navigate("/login?verify=email");
  }, 2500);


}


     catch(err){

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
        {success && (

<div className="
  bg-green-50
  border
  border-green-200
  text-green-700
  text-sm
  p-3
  rounded-xl
  mb-5
">
  {success}
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
maxLength={19}
onChange={(e)=>
 setPhone(
  formatPhone(e.target.value)
 )
}
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



          <div>

<input
  type="password"
  placeholder="Пароль"
  value={password}
  required
  onChange={(e)=>{

    const value = e.target.value;

    setPassword(value);

    setPasswordStrength(
      checkPasswordStrength(value)
    );

  }}

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



{password && (

<div className="mt-3">


<div className="
 flex
 gap-1
 h-2
 mb-2
">


{[1,2,3,4,5].map((item)=>(

<div

key={item}

className={`
 flex-1
 rounded-full

 ${
 item <= passwordStrength.score
 ?
 passwordStrength.score <=2
 ?
 "bg-red-500"
 :
 passwordStrength.score <=4
 ?
 "bg-yellow-400"
 :
 "bg-green-500"

 :
 "bg-gray-200"
 }

`}

/>

))}


</div>



<p
className={`
text-sm
font-medium

${
passwordStrength.score <=2
?
"text-red-500"
:
passwordStrength.score <=4
?
"text-yellow-600"
:
"text-green-600"

}

`}
>

{passwordStrength.text}

</p>


<div className="
text-xs
text-gray-500
mt-2
space-y-1
">

<p className={
password.length>=8
?
"text-green-600"
:
""
}>
✓ Минимум 8 символов
</p>


<p className={
/[A-Z]/.test(password)
?
"text-green-600"
:
""
}>
✓ Заглавная буква
</p>


<p className={
/[a-z]/.test(password)
?
"text-green-600"
:
""
}>
✓ Строчная буква
</p>


<p className={
/\d/.test(password)
?
"text-green-600"
:
""
}>
✓ Цифра
</p>


<p className={
/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
?
"text-green-600"
:
""
}>
✓ Специальный символ
</p>


</div>


</div>

)}

</div>



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