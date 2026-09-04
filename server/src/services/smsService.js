export const sendSms = async (phone, message) => {
  /*
    Здесь подключим реального SMS-провайдера.

    Например:

    await provider.send({
      to: phone,
      message,
    });
  */

  if (process.env.NODE_ENV !== "production") {
    console.log("SMS:", phone, message);
    return;
  }

  throw new Error(
    "SMS provider is not configured"
  );
};