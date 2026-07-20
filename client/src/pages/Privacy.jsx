import MainLayout from "../layouts/MainLayout";
export default function Privacy() {
  return (
     <MainLayout>
    <div className="max-w-4xl mx-auto px-4 py-10">

      <h1 className="text-3xl font-bold mb-6">
        Политика обработки персональных данных
      </h1>

      <div className="space-y-4 text-gray-700">

        <p>
          Настоящая политика обработки персональных данных регулирует
          порядок сбора, хранения и использования персональных данных
          пользователей сервиса BB Market.
        </p>

        <h2 className="text-xl font-semibold">
          1. Общие положения
        </h2>

        <p>
          Используя сайт BB Market, пользователь подтверждает свое
          согласие с условиями настоящей политики.
        </p>

        <h2 className="text-xl font-semibold">
          2. Какие данные мы собираем
        </h2>

        <p>
          Мы можем обрабатывать следующие данные:
        </p>

        <ul className="list-disc ml-6">
          <li>имя пользователя;</li>
          <li>адрес электронной почты;</li>
          <li>номер телефона;</li>
          <li>информацию об объявлениях;</li>
          <li>данные, необходимые для работы сервиса.</li>
        </ul>


        <h2 className="text-xl font-semibold">
          3. Использование данных
        </h2>

        <p>
          Персональные данные используются для регистрации,
          связи пользователей, размещения объявлений и улучшения
          работы сервиса.
        </p>


        <h2 className="text-xl font-semibold">
          4. Защита данных
        </h2>

        <p>
          BB Market принимает необходимые меры для защиты
          персональной информации пользователей.
        </p>


      </div>

    </div>
    </MainLayout>
  );
}