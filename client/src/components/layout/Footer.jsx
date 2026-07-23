import { Link } from "react-router-dom";


export default function Footer() {

  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10">

        <div className="grid md:grid-cols-4 gap-8">

          <div>
            
            <h3 className="text-white font-bold text-xl mb-4">
              BB Market
            </h3>

            <p className="text-sm text-gray-300">
              Площадка для покупки и продажи товаров,
              автомобилей, недвижимости и услуг.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">
              Навигация
            </h4>

            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                className="text-gray-300 hover:text-white"
                to="/">
                  Главная
                </Link>
              </li>

              <li>
                <Link
                className="text-gray-300 hover:text-white" 
                to="/favorites">
                  Избранное
                </Link>
              </li>

              <li>
                <Link 
                className="text-gray-300 hover:text-white"
                to="/profile">
                  Профиль
                </Link>
              </li>

              <li>
                <Link 
                className="text-gray-300 hover:text-white"
                to="/create-listing">
                  Подать объявление
                </Link>
              </li>
            </ul>
          </div>

<div>
  <h4 className="text-white font-semibold mb-4">
    Документы
  </h4>

  <ul className="space-y-2 text-sm">

    <li>
      <Link 
        to="/privacy"
        className="text-gray-300 hover:text-white transition"
      >
        Политика обработки данных
      </Link>
    </li>

    <li>
      <Link 
        to="/personal-data"
        className="text-gray-300 hover:text-white transition"
      >
        Согласие на обработку данных
      </Link>
    </li>

    <li>
      <Link 
        to="/terms"
        className="text-gray-300 hover:text-white transition"
      >
        Пользовательское соглашение
      </Link>
    </li>

    <li>
      <Link 
        to="/offer"
        className="text-gray-300 hover:text-white transition"
      >
        Публичная оферта
      </Link>
    </li>

    <li>
      <Link 
        to="/rules"
        className="text-gray-300 hover:text-white transition"
      >
        Правила размещения объявлений
      </Link>
    </li>

  </ul>
</div>

          <div>
            <h4 className="text-white font-semibold mb-4">
              Контакты
            </h4>

            <ul className="space-y-2 text-sm text-gray-300">
              <li className="text-gray-300">support@bbmarket.by</li>
              <li>+375 (29) 123-45-67</li>
              <li>Минск, Беларусь</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} BB Market. Все права защищены.
        </div>

      </div>
    </footer>
  );
}