import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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
import { categoryData } from "../../data/categoryData";



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
  } = useListingStore();

  const currentCategory = categoryData[slug] || null;

  /*
   * Загружаем объявления при смене категории.
   *
   * Важно:
   * не используем currentCategory в dependencies,
   * потому что объект категории может создаваться заново.
   */
  useEffect(() => {
    if (!currentCategory) return;

    setCategory(slug);
    fetchListings(1);
  }, [slug]);

  /*
   * Фильтрация и сортировка объявлений
   */
  const filteredListings = useMemo(() => {
    let result = [...listings];

    if (categorySearch.trim()) {
      const query = categorySearch.trim().toLowerCase();

      result = result.filter((listing) =>
        listing.title?.toLowerCase().includes(query)
      );
    }

    if (sort === "priceAsc") {
      result.sort(
        (a, b) => Number(a.price || 0) - Number(b.price || 0)
      );
    }

    if (sort === "priceDesc") {
      result.sort(
        (a, b) => Number(b.price || 0) - Number(a.price || 0)
      );
    }

    return result;
  }, [listings, categorySearch, sort]);

  /*
   * ==========================================
   * КАТЕГОРИЯ НЕ НАЙДЕНА
   * ==========================================
   */

  if (!currentCategory) {
    const canonicalUrl = `https://bb.by/category/${slug}`;

    return (
      <>
        <Helmet>
          <title>Категория не найдена — BB</title>

          <meta
            name="description"
            content="Запрашиваемая категория не найдена. Перейдите на главную страницу BB и найдите нужные объявления."
          />

          <meta name="robots" content="noindex, follow" />

          <link
            rel="canonical"
            href={canonicalUrl}
          />

          <meta
            property="og:type"
            content="website"
          />

          <meta
            property="og:title"
            content="Категория не найдена — BB"
          />

          <meta
            property="og:description"
            content="Запрашиваемая категория не найдена. Перейдите на главную страницу BB."
          />

          <meta
            property="og:url"
            content={canonicalUrl}
          />

          <meta
            property="og:site_name"
            content="BB доска объявлений"
          />

          <meta
            property="og:locale"
            content="ru_RU"
          />

          <meta
            name="twitter:card"
            content="summary"
          />

          <meta
            name="twitter:title"
            content="Категория не найдена — BB"
          />

          <meta
            name="twitter:description"
            content="Запрашиваемая категория не найдена. Перейдите на главную страницу BB."
          />
        </Helmet>

        <MainLayout>
          <div className="py-20 text-center">
            <div className="text-6xl">
              🔎
            </div>

            <h1 className="mt-5 text-3xl font-bold text-slate-800">
              Категория не найдена
            </h1>

            <p className="mt-2 text-slate-500">
              Возможно, ссылка устарела или такой категории больше нет.
            </p>

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
                transition
              "
            >
              <ArrowLeft size={18} />
              Вернуться на главную
            </button>
          </div>
        </MainLayout>
      </>
    );
  }

  /*
   * ==========================================
   * SEO КАТЕГОРИИ
   * ==========================================
   */

  const canonicalUrl = `https://bb.by/category/${slug}`;

  return (
    <>
      <Helmet>
        {/* Основной SEO title */}
        <title>{currentCategory.seoTitle}</title>

        {/* Meta description */}
        <meta
          name="description"
          content={currentCategory.seoDescription}
        />

        {/* Canonical */}
        <link
          rel="canonical"
          href={canonicalUrl}
        />

        {/* Open Graph */}
        <meta
          property="og:type"
          content="website"
        />

        <meta
          property="og:title"
          content={currentCategory.seoTitle}
        />

        <meta
          property="og:description"
          content={currentCategory.seoDescription}
        />

        <meta
          property="og:url"
          content={canonicalUrl}
        />

        <meta
          property="og:site_name"
          content="BB доска объявлений"
        />

        <meta
          property="og:locale"
          content="ru_RU"
        />

        {/* Twitter */}
        <meta
          name="twitter:card"
          content="summary"
        />

        <meta
          name="twitter:title"
          content={currentCategory.seoTitle}
        />

        <meta
          name="twitter:description"
          content={currentCategory.seoDescription}
        />
      </Helmet>

      <MainLayout>

        {/* ==========================================
            ХЛЕБНЫЕ КРОШКИ
        ========================================== */}

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

          <span className="text-slate-300">
            /
          </span>

          <span className="font-medium text-slate-800">
            {currentCategory.title}
          </span>

        </div>


        {/* ==========================================
            HERO CATEGORY
        ========================================== */}

        <section
          className={`
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
          `}
        >

          <div
            className="
              absolute
              -right-20
              -top-24
              w-80
              h-80
              rounded-full
              bg-white/10
              blur-3xl
            "
          />

          <div
            className="
              absolute
              left-20
              bottom-32
              w-72
              h-72
              rounded-full
              bg-white/10
              blur-3xl
            "
          />

          <div
            className="
              relative
              z-10
              flex
              flex-col
              md:flex-row
              items-start
              md:items-center
              justify-between
              gap-8
            "
          >

            <div className="max-w-2xl">

              <div
                className="
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
                "
              >
                <span>
                  {currentCategory.icon}
                </span>

                Категория
              </div>

              <h1
                className="
                  mt-4
                  text-3xl
                  md:text-5xl
                  font-extrabold
                  tracking-tight
                "
              >
                {currentCategory.title}
              </h1>

              <p
                className="
                  mt-3
                  max-w-xl
                  text-sm
                  md:text-base
                  leading-6
                  text-white/80
                "
              >
                {currentCategory.description}
              </p>

              <div
                className="
                  mt-5
                  flex
                  flex-wrap
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    rounded-xl
                    bg-white/10
                    backdrop-blur
                    px-4
                    py-2
                    text-sm
                  "
                >
                  📍 Рядом с вами
                </div>

                <div
                  className="
                    rounded-xl
                    bg-white/10
                    backdrop-blur
                    px-4
                    py-2
                    text-sm
                  "
                >
                  🔥 Новые объявления
                </div>

              </div>

            </div>

            <div
              className="
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
              "
            >
              {currentCategory.icon}
            </div>

          </div>

        </section>


        {/* ==========================================
            ПОДКАТЕГОРИИ
        ========================================== */}

        <section className="mt-6">

          <div
            className="
              flex
              items-center
              justify-between
              mb-4
            "
          >

            <div>

              <h2
                className="
                  text-xl
                  md:text-2xl
                  font-bold
                  text-slate-800
                "
              >
                Популярные разделы
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Быстро найдите нужный раздел
              </p>

            </div>

          </div>


          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-3
              lg:grid-cols-5
              gap-3
            "
          >

            {currentCategory.subcategories.map((subcategory, index) => (
  <button
    key={subcategory.slug}
    type="button"
    onClick={() =>
      navigate(
        `/category/${slug}/${subcategory.slug}`
      )
    }
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
      <div
        className="
          text-xs
          text-slate-400
          mb-1
        "
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      <div
        className="
          text-sm
          font-semibold
          text-slate-700
          group-hover:text-blue-600
          transition
        "
      >
        {subcategory.name}
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


        {/* ==========================================
            ПОЛЕЗНАЯ ИНФОРМАЦИЯ
        ========================================== */}

        <section className="mt-8">

          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-2
              gap-5
            "
          >

            {/* Покупателю */}

            <div
              className="
                rounded-3xl
                bg-white
                border
                border-slate-100
                p-6
                shadow-sm
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    w-11
                    h-11
                    rounded-xl
                    bg-blue-50
                    text-blue-600
                    flex
                    items-center
                    justify-center
                    text-xl
                  "
                >
                  🛡️
                </div>

                <div>

                  <h2
                    className="
                      font-bold
                      text-lg
                      text-slate-800
                    "
                  >
                    Советы покупателю
                  </h2>

                  <p
                    className="
                      text-xs
                      text-slate-500
                      mt-0.5
                    "
                  >
                    Как сделать покупку безопаснее
                  </p>

                </div>

              </div>


              <div className="mt-5 space-y-3">

                {currentCategory.tips.map(
                  (tip, index) => (
                    <div
                      key={tip}
                      className="
                        flex
                        items-start
                        gap-3
                        text-sm
                        text-slate-600
                      "
                    >

                      <span
                        className="
                          mt-0.5
                          shrink-0
                          w-6
                          h-6
                          rounded-full
                          bg-blue-50
                          text-blue-600
                          flex
                          items-center
                          justify-center
                          text-xs
                          font-bold
                        "
                      >
                        {index + 1}
                      </span>

                      <span>
                        {tip}
                      </span>

                    </div>
                  )
                )}

              </div>

            </div>


            {/* Продавцу */}

            <div
              className="
                rounded-3xl
                bg-slate-900
                p-6
                text-white
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    w-11
                    h-11
                    rounded-xl
                    bg-white/10
                    flex
                    items-center
                    justify-center
                    text-xl
                  "
                >
                  🚀
                </div>

                <div>

                  <h2 className="font-bold text-lg">
                    Советы продавцу
                  </h2>

                  <p
                    className="
                      text-xs
                      text-slate-400
                      mt-0.5
                    "
                  >
                    Как получить больше откликов
                  </p>

                </div>

              </div>


              <div className="mt-5 space-y-3">

                {currentCategory.sellerTips.map(
                  (tip, index) => (
                    <div
                      key={tip}
                      className="
                        flex
                        items-start
                        gap-3
                        text-sm
                        text-slate-300
                      "
                    >

                      <span
                        className="
                          mt-0.5
                          shrink-0
                          w-6
                          h-6
                          rounded-full
                          bg-white/10
                          flex
                          items-center
                          justify-center
                          text-xs
                          font-bold
                        "
                      >
                        {index + 1}
                      </span>

                      <span>
                        {tip}
                      </span>

                    </div>
                  )
                )}

              </div>

            </div>

          </div>

        </section>


        {/* ==========================================
            ПОИСК В КАТЕГОРИИ
        ========================================== */}

        <section
          className="
            mt-6
            rounded-2xl
            border
            border-slate-100
            bg-white
            p-3
            shadow-sm
          "
        >

          <div
            className="
              flex
              flex-col
              lg:flex-row
              gap-3
            "
          >

            <div className="relative flex-1">

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
                onChange={(e) =>
                  setCategorySearch(e.target.value)
                }
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
              onClick={() =>
                setShowFilters(!showFilters)
              }
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
              onClick={() =>
                navigate("/create-listing")
              }
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


        {/* ==========================================
            ОБЪЯВЛЕНИЯ
        ========================================== */}

        <section className="mt-8">

          <div
            className="
              flex
              flex-col
              sm:flex-row
              sm:items-end
              justify-between
              gap-4
              mb-5
            "
          >

            <div>

              <div className="flex items-center gap-2">

                <h2
                  className="
                    text-2xl
                    md:text-3xl
                    font-bold
                    text-slate-800
                  "
                >
                  Объявления
                </h2>

                <span
                  className="
                    rounded-full
                    bg-blue-50
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    text-blue-600
                  "
                >
                  {listings.length}
                </span>

              </div>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Свежие предложения в категории
              </p>

            </div>


            <div className="relative">

              <select
                id="category-sort"
                name="categorySort"
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value)
                }
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


          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              gap-5
            "
          >

            {filteredListings.map(
              (listing, index) => (
                <ListingCard
                  key={listing._id}
                  listing={listing}
                  priority={index === 0}
                />
              )
            )}

          </div>


          {filteredListings.length === 0 && (

            <div
              className="
                mt-6
                rounded-3xl
                border
                border-dashed
                border-slate-200
                bg-white
                py-16
                px-6
                text-center
              "
            >

              <div className="text-6xl">
                🔎
              </div>

              <h3
                className="
                  mt-5
                  text-xl
                  font-bold
                  text-slate-800
                "
              >
                Объявлений пока нет
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  text-slate-500
                "
              >
                Попробуйте изменить параметры поиска
                или станьте первым продавцом.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/create-listing")
                }
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


        {/* ==========================================
            ПОЧЕМУ BB
        ========================================== */}

        <section className="mt-10">

          <div className="text-center mb-6">

            <span
              className="
                text-sm
                font-semibold
                text-blue-600
              "
            >
              ПОЧЕМУ BB
            </span>

            <h2
              className="
                mt-1
                text-2xl
                md:text-3xl
                font-bold
                text-slate-800
              "
            >
              Покупать и продавать проще
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-slate-500
              "
            >
              Всё необходимое для удобных сделок в одном месте
            </p>

          </div>


          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-4
            "
          >

            {[
              {
                icon: "📍",
                title: "Рядом с вами",
                text: "Находите товары и услуги в своём городе",
              },
              {
                icon: "💬",
                title: "Прямой контакт",
                text: "Общайтесь с продавцами напрямую",
              },
              {
                icon: "🔎",
                title: "Удобный поиск",
                text: "Фильтры помогают быстро найти нужное",
              },
              {
                icon: "⚡",
                title: "Быстрые сделки",
                text: "Договаривайтесь о покупке напрямую",
              },
            ].map((item) => (

              <div
                key={item.title}
                className="
                  rounded-2xl
                  bg-white
                  border
                  border-slate-100
                  p-5
                  text-center
                "
              >

                <div className="text-3xl">
                  {item.icon}
                </div>

                <h3
                  className="
                    mt-3
                    font-bold
                    text-slate-800
                  "
                >
                  {item.title}
                </h3>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-5
                    text-slate-500
                  "
                >
                  {item.text}
                </p>

              </div>

            ))}

          </div>

        </section>


        {/* ==========================================
            CTA
        ========================================== */}

        <section
          className="
            mt-10
            mb-6
            overflow-hidden
            rounded-3xl
            bg-slate-900
            px-6
            py-7
            md:px-8
          "
        >

          <div
            className="
              flex
              flex-col
              md:flex-row
              md:items-center
              justify-between
              gap-5
            "
          >

            <div>

              <div
                className="
                  text-blue-400
                  text-sm
                  font-semibold
                "
              >
                BB доска объявлений
              </div>

              <h2
                className="
                  mt-1
                  text-xl
                  md:text-2xl
                  font-bold
                  text-white
                "
              >
                Не нашли то, что искали?
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-400
                "
              >
                Разместите объявление и найдите покупателя.
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                navigate("/create-listing")
              }
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


        {/* ==========================================
            SEO-КОНТЕНТ
        ========================================== */}

        <section
          className="
            mt-10
            rounded-3xl
            bg-slate-50
            border
            border-slate-100
            p-6
            md:p-8
          "
        >

          <div className="max-w-4xl">

            <h2
              className="
                text-xl
                md:text-2xl
                font-bold
                text-slate-800
              "
            >
              {currentCategory.shortTitle}
            </h2>

            <p
              className="
                mt-4
                text-sm
                leading-7
                text-slate-600
              "
            >
              {currentCategory.seoText}
            </p>

          </div>


          {/* ==========================================
              FAQ
          ========================================== */}

          {currentCategory.faq?.length > 0 && (

            <div className="mt-8">

              <h2
                className="
                  text-xl
                  font-bold
                  text-slate-800
                "
              >
                Частые вопросы
              </h2>


              <div
                className="
                  mt-4
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-3
                "
              >

                {currentCategory.faq.map(
                  (item) => (

                    <details
                      key={item.question}
                      className="
                        group
                        rounded-2xl
                        bg-white
                        border
                        border-slate-100
                        overflow-hidden
                      "
                    >

                      <summary
                        className="
                          cursor-pointer
                          list-none
                          p-5
                          font-semibold
                          text-sm
                          text-slate-800
                          flex
                          items-center
                          justify-between
                          gap-4
                        "
                      >

                        <span>
                          {item.question}
                        </span>

                        <ChevronDown
                          size={18}
                          className="
                            shrink-0
                            text-slate-400
                            group-open:rotate-180
                            transition
                          "
                        />

                      </summary>


                      <div
                        className="
                          px-5
                          pb-5
                          text-sm
                          leading-6
                          text-slate-500
                        "
                      >
                        {item.answer}
                      </div>

                    </details>

                  )
                )}

              </div>

            </div>

          )}

        </section>

      </MainLayout>
    </>
  );
}
