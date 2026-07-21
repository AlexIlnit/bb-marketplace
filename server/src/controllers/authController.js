import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateToken } from "../utils/jwt.js";


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



    // здесь позже подключим Nodemailer

    const verifyUrl =
      `http://localhost:5173/verify-email/${emailToken}`;


    console.log(
      "VERIFY URL:",
      verifyUrl
    );



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

export const login = async(req,res)=>{

try {


const {
 email,
 password
}=req.body;



const user =
await User.findOne({email});



if(!user){

return res.status(400).json({
message:"Пользователь не найден"
});

}



const isMatch =
await bcrypt.compare(
 password,
 user.password
);



if(!isMatch){

return res.status(400).json({
message:"Неверный пароль"
});

}



// проверка email

if(user.emailVerified !== true){

return res.status(403).json({

message:
"Подтвердите email перед входом"

});

}




res.json({

_id:user._id,

name:user.name,

email:user.email,

phone:user.phone,

token:
generateToken(user._id),

role:user.role,

isBlocked:user.isBlocked

});



}catch(err){

res.status(500).json({
message:err.message
});

}

};






// VERIFY EMAIL

export const verifyEmail =
async(req,res)=>{

try{


const user =
await User.findOne({

emailVerifyToken:
req.params.token

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



user.emailVerified=true;

user.emailVerifyToken=null;

user.emailVerifyExpires=null;



await user.save();



res.redirect(
"http://localhost:5173/login?verified=true"
);



}catch(err){

res.status(500).send(
"Ошибка подтверждения email"
);

}

};