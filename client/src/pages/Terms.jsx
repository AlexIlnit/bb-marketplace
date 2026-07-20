import MainLayout from "../layouts/MainLayout";
export default function Terms() {
  return (
     <MainLayout>
    <div className="max-w-4xl mx-auto px-4 py-10">

      <h1 className="text-3xl font-bold mb-6">
        Пользовательское соглашение
      </h1>


      <div className="space-y-4 text-gray-700">

        <p>
          Настоящее Пользовательское соглашение определяет правила
          использования сервиса BB Market.
        </p>


        <h2 className="text-xl font-semibold">
          1. Регистрация пользователя
        </h2>

        <p>
          Пользователь обязан предоставлять достоверную информацию
          при создании учетной записи.
        </p>


        <h2 className="text-xl font-semibold">
          2. Размещение объявлений
        </h2>

        <p>
          Пользователь самостоятельно несет ответственность за
          содержание размещенных объявлений.
        </p>


        <h2 className="text-xl font-semibold">
          3. Запрещенные действия
        </h2>

        <ul className="list-disc ml-6">
          <li>
            размещение запрещенных товаров;
          </li>

          <li>
            мошеннические действия;
          </li>

          <li>
            использование сервиса для нарушения законодательства.
          </li>
        </ul>


        <h2 className="text-xl font-semibold">
          4. Ответственность
        </h2>

        <p>
          Администрация BB Market оставляет за собой право
          удалять объявления, нарушающие правила сервиса.
        </p>


      </div>

    </div>
    </MainLayout>
  );
}