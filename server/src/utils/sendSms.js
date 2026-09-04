export const sendSms = async (phone, code) => {
  try {
    console.log("=================================");
    console.log("SMS CODE");
    console.log("PHONE:", phone);
    console.log("CODE:", code);
    console.log("=================================");

    // Здесь позже подключим SMS API
    // Например:
    // await smsProvider.send({
    //   to: phone,
    //   message: `Ваш код входа BB: ${code}`
    // });

    return true;
  } catch (error) {
    console.error("SMS ERROR:", error);

    throw new Error("Не удалось отправить SMS");
  }
};