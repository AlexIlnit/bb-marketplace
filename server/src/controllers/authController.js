import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateToken } from "../utils/jwt.js";
import { sendVerifyEmail } from "../utils/sendVerifyEmail.js";
import { sendSms } from "../utils/sendSms.js";


// REGISTER
export const register = async (req, res) => {

  try {

    const {
      name,
      email,
      phone,
      password,
      acceptedTerms,
      acceptedTermsVersion
    } = req.body;



    const exists = await User.findOne({ email });


    if (exists) {

      return res.status(400).json({
        message:"Пользователь уже существует"
      });

    }



    if (acceptedTerms !== true) {

      return res.status(400).json({
        message:
        "Необходимо принять пользовательское соглашение"
      });

    }



    const hashedPassword =
      await bcrypt.hash(password,10);



    const emailToken =
      crypto.randomBytes(32).toString("hex");



    const user = await User.create({

      name,

      email,

      phone,

      password:hashedPassword,


      acceptedTerms:true,

      acceptedTermsVersion:
        acceptedTermsVersion || "1.0",

      acceptedTermsDate:
        new Date(),


      emailVerified:false,

      emailVerifyToken:emailToken,

      emailVerifyExpires:
        Date.now() + 
        24 * 60 * 60 * 1000

    });

await sendVerifyEmail(
  user.email,
  emailToken
);

    // здесь позже подключим Nodemailer

    const verifyUrl =
`http://localhost:5000/api/auth/verify/${emailToken}`;

    res.json({

      message:
      "Регистрация успешна. Проверьте email",

      email:user.email

    });



  } catch(err){

    res.status(500).json({
      message:err.message
    });

  }

};





// LOGIN
export const login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Введите email и пароль",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Неверный email или пароль",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        message: "Аккаунт заблокирован",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Неверный email или пароль",
      });
    }

    if (user.emailVerified !== true) {
      return res.status(403).json({
        message: "Подтвердите email перед входом",
      });
    }

    if (!user.phone) {
      return res.status(400).json({
        message:
          "Для входа необходимо добавить номер телефона",
      });
    }

    const code = crypto
      .randomInt(100000, 1000000)
      .toString();

    const loginCodeHash = crypto
      .createHash("sha256")
      .update(code)
      .digest("hex");

    user.loginCodeHash = loginCodeHash;

    user.loginCodeExpires =
      new Date(Date.now() + 5 * 60 * 1000);

    user.loginCodeAttempts = 0;

    await user.save();

    await sendSms(
      user.phone,
      code
    );

    return res.json({
      success: true,
      requiresPhoneCode: true,
      email: user.email,
      message:
        "Код подтверждения отправлен на телефон",
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);

    res.status(500).json({
      message: "Ошибка входа",
    });
  }
};

export const verifyLoginCode = async (req, res) => {
  try {
    const {
      email,
      code,
    } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        message: "Введите код подтверждения",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(400).json({
        message: "Пользователь не найден",
      });
    }

    if (!user.loginCodeHash) {
      return res.status(400).json({
        message:
          "Сначала необходимо запросить код",
      });
    }

    if (
      !user.loginCodeExpires ||
      user.loginCodeExpires < new Date()
    ) {
      user.loginCodeHash = null;
      user.loginCodeExpires = null;
      user.loginCodeAttempts = 0;

      await user.save();

      return res.status(400).json({
        message:
          "Срок действия кода истёк",
      });
    }

    if (user.loginCodeAttempts >= 5) {
      user.loginCodeHash = null;
      user.loginCodeExpires = null;
      user.loginCodeAttempts = 0;

      await user.save();

      return res.status(429).json({
        message:
          "Слишком много попыток. Запросите новый код",
      });
    }

    const codeHash = crypto
      .createHash("sha256")
      .update(String(code))
      .digest("hex");

    if (codeHash !== user.loginCodeHash) {
      user.loginCodeAttempts += 1;

      await user.save();

      return res.status(400).json({
        message:
          "Неверный код",
      });
    }

    user.loginCodeHash = null;
    user.loginCodeExpires = null;
    user.loginCodeAttempts = 0;

    await user.save();

    return res.json({
      _id: user._id,

      name: user.name,

      email: user.email,

      phone: user.phone,

      avatar: user.avatar,

      role: user.role,

      isBlocked: user.isBlocked,

      token: generateToken(
        user._id
      ),
    });

  } catch (err) {
    console.error(
      "VERIFY LOGIN CODE ERROR:",
      err
    );

    res.status(500).json({
      message:
        "Ошибка подтверждения кода",
    });
  }
};



// VERIFY EMAIL

export const verifyEmail = async(req,res)=>{

try {

const user = await User.findOne({

emailVerifyToken:req.params.token

});

if(!user){

return res.status(400).send(
"Ссылка недействительна"
);

}



if(
user.emailVerifyExpires < Date.now()
){

return res.status(400).send(
"Срок действия ссылки истёк"
);

}



user.emailVerified = true;

user.emailVerifyToken = null;

user.emailVerifyExpires = null;


await user.save();


console.log(
"EMAIL VERIFIED SUCCESS"
);



res.redirect(
"http://localhost:5173/login?verified=true"
);



}catch(err){

console.error(
"VERIFY ERROR:",
err
);


res.status(500).send(
"Ошибка подтверждения email"
);

}

};