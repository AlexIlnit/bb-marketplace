import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Filter,
  MapPin,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import MainLayout from "../../layouts/MainLayout";
import ListingCard from "../../components/listing/ListingCard";
import { useListingStore } from "../../store/listingStore";

const categoryData = {
  avto: {
    title: "Авто",
    description:
      "Автомобили, мотоциклы, запчасти и аксессуары. Найдите транспорт рядом с вами.",
    icon: "🚗",
    gradient: "from-blue-600 via-indigo-600 to-violet-600",
    subcategories: [
      "Легковые автомобили",
      "Мотоциклы",
      "Грузовики",
      "Запчасти",
      "Аксессуары",
    ],
  },

  nedvizhimost: {
    title: "Недвижимость",
    description:
      "Квартиры, дома, комнаты, участки и коммерческая недвижимость.",
    icon: "🏠",
    gradient: "from-emerald-600 via-teal-600 to-cyan-600",
    subcategories: [
      "Квартиры",
      "Дома",
      "Комнаты",
      "Участки",
      "Коммерческая недвижимость",
    ],
  },

  elektronika: {
    title: "Электроника",
    description:
      "Смартфоны, компьютеры, бытовая техника, гаджеты и электроника.",
    icon: "📱",
    gradient: "from-violet-600 via-purple-600 to-fuchsia-600",
    subcategories: [
      "Телефоны",
      "Ноутбуки",
      "Компьютеры",
      "Телевизоры",
      "Бытовая техника",
    ],
  },

  rabota: {
    title: "Работа",
    description:
      "Вакансии и предложения работы от компаний и частных работодателей.",
    icon: "💼",
    gradient: "from-amber-500 via-orange-600 to-red-500",
    subcategories: [
      "Вакансии",
      "Подработка",
      "Удалённая работа",
      "Для студентов",
      "Без опыта",
    ],
  },

  zhivotnye: {
    title: "Животные",
    description:
      "Домашние животные, питомцы, товары и услуги для животных.",
    icon: "🐾",
    gradient: "from-pink-500 via-rose-600 to-red-500",
    subcategories: [
      "Собаки",
      "Кошки",
      "Птицы",
      "Грызуны",
      "Товары для животных",
    ],
  },

  odezhda: {
    title: "Одежда",
    description:
      "Одежда, обувь, аксессуары и стильные вещи для всей семьи.",
    icon: "👕",
    gradient: "from-rose-500 via-pink-600 to-fuchsia-600",
    subcategories: [
      "Женская одежда",
      "Мужская одежда",
      "Детская одежда",
      "Обувь",
      "Аксессуары",
    ],
  },

  "dom-i-sad": {
    title: "Дом и сад",
    description:
      "Мебель, инструменты, товары для дома, ремонта, дачи и сада.",
    icon: "🛋️",
    gradient: "from-orange-500 via-amber-600 to-yellow-500",
    subcategories: [
      "Мебель",
      "Инструменты",
      "Ремонт",
      "Сад и огород",
      "Товары для дома",
    ],
  },

  uslugi: {
    title: "Услуги",
    description:
      "Найдите специалистов для ремонта, перевозок, обучения и других задач.",
    icon: "🔧",
    gradient: "from-cyan-600 via-blue-600 to-indigo-600",
    subcategories: [
      "Ремонт",
      "Перевозки",
      "Красота",
      "Обучение",
      "IT-услуги",
    ],
  },
};

export default function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [sort, setSort] = useState("new");
  const [categorySearch, setCategorySearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const {
    listings,
    fetchListings,
    totalPages,
    setCategory,
    category,
  } = useListingStore();

  const currentCategory = categoryData[slug];

  useEffect(() => {
    if (!currentCategory) return;

    /*
      Пока передаём slug категории.
      Если backend использует ObjectId категории,
      здесь заменим slug на соответствующий ID.
    */
    setCategory(slug);

    fetchListings(1);
  }, [slug]);

  const filteredListings = useMemo(() => {
    let result = [...listings];

    if (categorySearch.trim()) {
      const query = categorySearch.toLowerCase();

      result = result.filter((listing) =>
        listing.title?.toLowerCase().includes(query)
      );
    }

    if (sort === "priceAsc") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sort === "priceDesc") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return result;
  }, [listings, categorySearch, sort]);

  if (!currentCategory) {
    return (
      <MainLayout>
        <div className="py-20 text-center">
          <div className="text-6xl">🔎</div>

          <h1 className="mt-5 text-3xl font-bold text-slate-800">
            Категория не найдена
          </h1>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-blue-600
              px-5
              py-3
              font-semibold
              text-white
              hover:bg-blue-700
            "
          >
            <ArrowLeft size={18} />
            Вернуться на главную
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>

      {/* Верхняя навигация */}

      <div className="flex items-center gap-2 mt-4 mb-4 text-sm">

        <button
          type="button"
          onClick={() => navigate("/")}
          className="
            text-slate-500
            hover:text-blue-600
            transition
          "
        >
          Главная
        </button>

        <span className="text-slate-300">/</span>

        <span className="font-medium text-slate-800">
          {currentCategory.title}
        </span>

      </div>


      {/* HERO CATEGORY */}

      <section className={`
        relative
        overflow-hidden
        rounded-3xl
        bg-linear-to-br
        ${currentCategory.gradient}
        px-6
        py-8
        md:px-10
        md:py-10
        text-white
      `}>

        <div className="
          absolute
          -right-20
          -top-24
          w-80
          h-80
          rounded-full
          bg-white/10
          blur-3xl
        />

        <div className="
          absolute
          left-20
          bottom-32
          w-72
          h-72
          rounded-full
          bg-white-10
          blur-3xl
        />


        <div className="
          relative
          z-10
          flex
          flex-col
          md:flex-row
          items-start
          md:items-center
          justify-between
          gap-8
        ">

          <div className="max-w-2xl">

            <div className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-white/15
              backdrop-blur
              px-3
              py-1.5
              text-sm
              font-medium
            ">
              <span>{currentCategory.icon}</span>
              Категория
            </div>


            <h1 className="
              mt-4
              text-3xl
              md:text-5xl
              font-extrabold
              tracking-tight
            ">
              {currentCategory.title}
            </h1>


            <p className="
              mt-3
              max-w-xl
              text-sm
              md:text-base
              leading-6
              text-white/80
            ">
              {currentCategory.description}
            </p>


            <div className="
              mt-5
              flex
              flex-wrap
              items-center
              gap-3
            ">

              <div className="
                rounded-xl
                bg-white/10
                backdrop-blur
                px-4
                py-2
                text-sm
              ">
                📍 Рядом с вами
              </div>

              <div className="
                rounded-xl
                bg-white/10
                backdrop-blur
                px-4
                py-2
                text-sm
              ">
                🔥 Новые объявления
              </div>

            </div>

          </div>


          <div className="
            hidden
            md:flex
            w-36
            h-36
            lg:w-44
            lg:h-44
            shrink-0
            items-center
            justify-center
            rounded-3xl
            bg-white/10
            backdrop-blur
            text-7xl
            lg:text-8xl
          ">
            {currentCategory.icon}
          </div>

        </div>

      </section>


      {/* ПОДКАТЕГОРИИ */}

      <section className="mt-6">

        <div className="
          flex
          items-center
          justify-between
          mb-4
        ">

          <div>
            <h2 className="
              text-xl
              md:text-2xl
              font-bold
              text-slate-800
            ">
              Популярные разделы
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Быстро найдите нужный раздел
            </p>
          </div>

        </div>


        <div className="
          grid
          grid-cols-2
          sm:grid-cols-3
          lg:grid-cols-5
          gap-3
        ">

          {currentCategory.subcategories.map((subcategory, index) => (

            <button
              key={subcategory}
              type="button"
              className="
                group
                flex
                items-center
                justify-between
                gap-2
                rounded-2xl
                border
                border-slate-100
                bg-white
                px-4
                py-4
                text-left
                shadow-sm
                hover:-translate-y-1
                hover:border-blue-200
                hover:shadow-md
                transition-all
              "
            >

              <div>

                <div className="
                  text-xs
                  text-slate-400
                  mb-1
                ">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="
                  text-sm
                  font-semibold
                  text-slate-700
                  group-hover:text-blue-600
                  transition
                ">
                  {subcategory}
                </div>

              </div>

              <ArrowRight
                size={17}
                className="
                  shrink-0
                  text-slate-300
                  group-hover:text-blue-500
                  group-hover:translate-x-1
                  transition
                "
              />

            </button>

          ))}

        </div>

      </section>


      {/* ПОИСК В КАТЕГОРИИ */}

      <section className="
        mt-6
        rounded-2xl
        border
        border-slate-100
        bg-white
        p-3
        shadow-sm
      ">

        <div className="
          flex
          flex-col
          lg:flex-row
          gap-3
        ">

          <div className="
            relative
            flex-1
          ">

            <Search
              size={20}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              id="category-search"
              name="categorySearch"
              type="search"
              autoComplete="off"
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              placeholder={`Поиск в категории «${currentCategory.title}»`}
              className="
                w-full
                h-12
                rounded-xl
                bg-slate-50
                border
                border-slate-200
                pl-11
                pr-4
                outline-none
                focus:bg-white
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-500/10
              "
            />

          </div>


          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="
              lg:hidden
              h-12
              px-4
              rounded-xl
              border
              border-slate-200
              bg-white
              flex
              items-center
              justify-center
              gap-2
              font-semibold
              text-slate-700
            "
          >
            <SlidersHorizontal size={18} />
            Фильтры
          </button>


          <button
            type="button"
            onClick={() => navigate("/create-listing")}
            className="
              h-12
              px-5
              rounded-xl
              bg-blue-600
              text-white
              font-bold
              flex
              items-center
              justify-center
              gap-2
              hover:bg-blue-700
              hover:-translate-y-0.5
              transition
            "
          >
            <Plus size={19} />
            Разместить
          </button>

        </div>

      </section>


      {/* КОНТЕНТ */}

      <section className="mt-8">

        <div className="
          flex
          flex-col
          sm:flex-row
          sm:items-end
          justify-between
          gap-4
          mb-5
        ">

          <div>

            <div className="
              flex
              items-center
              gap-2
            ">

              <h2 className="
                text-2xl
                md:text-3xl
                font-bold
                text-slate-800
              ">
                Объявления
              </h2>

              <span className="
                rounded-full
                bg-blue-50
                px-3
                py-1
                text-xs
                font-semibold
                text-blue-600
              ">
                {listings.length}
              </span>

            </div>

            <p className="
              mt-1
              text-sm
              text-slate-500
            ">
              Свежие предложения в категории
            </p>

          </div>


          <div className="relative">

            <select
              id="category-sort"
              name="categorySort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="
                h-11
                appearance-none
                rounded-xl
                border
                border-slate-200
                bg-white
                pl-4
                pr-10
                text-sm
                font-medium
                text-slate-700
                outline-none
                focus:border-blue-500
              "
            >
              <option value="new">
                Сначала новые
              </option>

              <option value="priceAsc">
                Сначала дешёвые
              </option>

              <option value="priceDesc">
                Сначала дорогие
              </option>
            </select>

            <ChevronDown
              size={17}
              className="
                pointer-events-none
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

          </div>

        </div>


        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          gap-5
        ">

          {filteredListings.map((listing, index) => (

            <ListingCard
              key={listing._id}
              listing={listing}
              priority={index === 0}
            />

          ))}

        </div>


        {filteredListings.length === 0 && (

          <div className="
            mt-6
            rounded-3xl
            border
            border-dashed
            border-slate-200
            bg-white
            py-16
            px-6
            text-center
          ">

            <div className="text-6xl">
              🔎
            </div>

            <h3 className="
              mt-5
              text-xl
              font-bold
              text-slate-800
            ">
              Объявлений пока нет
            </h3>

            <p className="
              mt-2
              text-sm
              text-slate-500
            ">
              Попробуйте изменить параметры поиска
              или станьте первым продавцом.
            </p>

            <button
              type="button"
              onClick={() => navigate("/create-listing")}
              className="
                mt-5
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-blue-600
                px-5
                py-3
                font-semibold
                text-white
                hover:bg-blue-700
              "
            >
              <Plus size={18} />
              Разместить объявление
            </button>

          </div>

        )}

      </section>


      {/* НИЖНИЙ CTA */}

      <section className="
        mt-10
        mb-6
        overflow-hidden
        rounded-3xl
        bg-slate-900
        px-6
        py-7
        md:px-8
      ">

        <div className="
          flex
          flex-col
          md:flex-row
          md:items-center
          justify-between
          gap-5
        ">

          <div>

            <div className="
              text-blue-400
              text-sm
              font-semibold
            ">
              BB доска объявлений
            </div>

            <h2 className="
              mt-1
              text-xl
              md:text-2xl
              font-bold
              text-white
            ">
              Не нашли то, что искали?
            </h2>

            <p className="
              mt-1
              text-sm
              text-slate-400
            ">
              Разместите объявление и найдите покупателя.
            </p>

          </div>


          <button
            type="button"
            onClick={() => navigate("/create-listing")}
            className="
              shrink-0
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-white
              px-5
              py-3
              font-bold
              text-slate-900
              hover:bg-blue-50
              transition
            "
          >
            <Plus size={18} />
            Создать объявление
          </button>

        </div>

      </section>

    </MainLayout>
  );
}