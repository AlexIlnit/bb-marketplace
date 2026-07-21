import { Helmet } from "react-helmet-async";
import MainLayout from "../layouts/MainLayout";

export default function Offer() {
  return (
    <MainLayout>
    <>
      <Helmet>
        <title>Публичная оферта | BB Market</title>
        <meta
          name="description"
          content="Публичная оферта сервиса BB Market."
        />
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 py-10">

        <h1 className="text-3xl font-bold mb-8">
          Публичная оферта
        </h1>

        <div className="bg-white rounded-2xl shadow-sm border p-8 space-y-6 text-gray-700 leading-7">

          <section>
            <h2 className="text-xl font-semibold mb-3">
              1. Общие положения
            </h2>

            <p>
              Настоящая публичная оферта определяет условия использования
              интернет-площадки <strong>BB Market</strong>. Используя сервис,
              пользователь подтверждает своё согласие с настоящей офертой.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              2. Предмет оферты
            </h2>

            <p>
              BB Market предоставляет пользователям техническую возможность
              размещать объявления о продаже товаров, недвижимости,
              транспортных средств и услуг, а также взаимодействовать
              с другими пользователями посредством встроенных инструментов
              сервиса.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              3. Статус сервиса
            </h2>

            <p>
              BB Market не является продавцом, покупателем,
              производителем либо посредником при заключении сделок.
              Все договорённости, расчёты и передача товара осуществляются
              непосредственно между пользователями.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              4. Права и обязанности пользователей
            </h2>

            <ul className="list-disc pl-6 space-y-2">
              <li>указывать достоверную информацию;</li>
              <li>не нарушать законодательство;</li>
              <li>не размещать запрещённые товары и услуги;</li>
              <li>уважительно общаться с другими пользователями;</li>
              <li>соблюдать правила сервиса.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              5. Ограничение ответственности
            </h2>

            <p>
              Администрация BB Market не несёт ответственности за качество,
              безопасность, законность товаров и услуг, достоверность
              объявлений, а также за исполнение обязательств между
              пользователями.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              6. Модерация
            </h2>

            <p>
              Администрация вправе проверять объявления, отклонять,
              редактировать либо удалять материалы, нарушающие правила
              сервиса или требования законодательства.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              7. Изменение условий оферты
            </h2>

            <p>
              Администрация вправе в любое время изменять настоящую оферту.
              Новая редакция вступает в силу с момента её публикации
              на сайте BB Market, если иное не указано в документе.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              8. Контактная информация
            </h2>

            <p>
              По вопросам, связанным с настоящей офертой, пользователь
              может обратиться в службу поддержки BB Market через форму
              обратной связи или по адресу электронной почты, указанному
              в разделе «Контакты».
            </p>
          </section>

        </div>

      </div>
    </>
    </MainLayout>
  );
}