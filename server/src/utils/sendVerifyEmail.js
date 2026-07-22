import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerifyEmail = async (email, token) => {

  const url =
    `http://localhost:5000/api/auth/verify/${token}`;

  await transporter.sendMail({

    from: `"BB Market" <${process.env.EMAIL_USER}>`,

    to: email,

    subject: "Подтверждение Email",

    html: `
      <h2>Добро пожаловать в BB Market</h2>

      <p>Для подтверждения Email нажмите кнопку ниже.</p>

      <a
        href="${url}"
        style="
          display:inline-block;
          padding:12px 20px;
          background:#16a34a;
          color:white;
          text-decoration:none;
          border-radius:8px;
        "
      >
        Подтвердить Email
      </a>

      <p>Если вы не регистрировались — просто проигнорируйте письмо.</p>
    `

  });

};