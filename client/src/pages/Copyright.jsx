import MainLayout from "../layouts/MainLayout";
import { Copyright, Mail, FileText, ShieldAlert } from "lucide-react";

const CopyrightPage = () => {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">

          {/* Заголовок */}
          <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm md:p-10">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gray-100">
                <Copyright className="h-7 w-7 text-gray-700" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                  Для правообладателей
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Информация о защите авторских и иных прав
                </p>
              </div>
            </div>
          </div>

          {/* Основной текст */}
          <div className="space-y-6">

            <section className="rounded-3xl bg-white p-6 shadow-sm md:p-10">
              <h2 className="text-xl font-bold text-gray-900">
                Защита прав правообладателей
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                Администрация сайта BB уважает права авторов и иных
                правообладателей и не поддерживает размещение материалов,
                нарушающих авторские, смежные и иные исключительные права.
              </p>

              <p className="mt-4 leading-7 text-gray-600">
                Если вы считаете, что объявление или размещённый в нём
                материал нарушает принадлежащие вам права, вы можете
                направить администрации сайта уведомление о нарушении.
              </p>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm md:p-10">
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-6 w-6 text-gray-700" />

                <h2 className="text-xl font-bold text-gray-900">
                  Что должно содержать обращение
                </h2>
              </div>

              <p className="mt-4 leading-7 text-gray-600">
                Для рассмотрения обращения рекомендуем указать:
              </p>

              <ul className="mt-4 list-disc space-y-3 pl-6 leading-7 text-gray-600">
                <li>
                  ваши ФИО или наименование правообладателя;
                </li>

                <li>
                  контактные данные для обратной связи;
                </li>

                <li>
                  описание произведения, фотографии, текста или другого
                  материала, права на который нарушены;
                </li>

                <li>
                  ссылку на объявление или страницу, содержащую спорный
                  материал;
                </li>

                <li>
                  описание обстоятельств предполагаемого нарушения;
                </li>

                <li>
                  документы или иные сведения, подтверждающие ваши права,
                  если это необходимо.
                </li>
              </ul>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm md:p-10">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-gray-700" />

                <h2 className="text-xl font-bold text-gray-900">
                  Рассмотрение обращения
                </h2>
              </div>

              <p className="mt-4 leading-7 text-gray-600">
                После получения обращения администрация BB рассмотрит
                предоставленную информацию и при наличии оснований примет
                соответствующие меры в отношении спорного материала.
              </p>

              <p className="mt-4 leading-7 text-gray-600">
                В отдельных случаях администрация может запросить
                дополнительные сведения, необходимые для подтверждения
                заявленных прав или обстоятельств нарушения.
              </p>
            </section>

            {/* Контакты */}
            <section className="rounded-3xl bg-gray-900 p-6 text-white shadow-sm md:p-10">
              <div className="flex items-center gap-3">
                <Mail className="h-6 w-6" />

                <h2 className="text-xl font-bold">
                  Связаться с администрацией
                </h2>
              </div>

              <p className="mt-4 leading-7 text-gray-300">
                Направить обращение по вопросу нарушения авторских и иных
                прав можно по электронной почте:
              </p>

              <a
                href="mailto:copyright@bb.by"
                className="mt-4 inline-block text-lg font-semibold text-white underline underline-offset-4 hover:text-gray-300"
              >
                copyright@bb.by
              </a>

              <p className="mt-4 text-sm leading-6 text-gray-400">
                В теме письма рекомендуется указать:
                «Нарушение прав правообладателя».
              </p>
            </section>

            {/* Дисклеймер */}
            <section className="px-2 text-sm leading-6 text-gray-500">
              <p>
                Обращение должно содержать достоверную информацию.
                Администрация оставляет за собой право запросить
                дополнительные сведения для рассмотрения заявления.
              </p>
            </section>

          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CopyrightPage;