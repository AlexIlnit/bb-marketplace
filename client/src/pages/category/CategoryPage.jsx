import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";


import MainLayout from "../../layouts/MainLayout";
import ListingCard from "../../components/listing/ListingCard";
import { useListingStore } from "../../store/listingStore";
import { useCategoryStore } from "../../store/categoryStore";
import { categoryData } from "../../data/categoryData";
import { categoryImages } from "../../data/categoryImages";

export default function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [sort, setSort] = useState("new");
  const [categorySearch, setCategorySearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const listingSectionRef = useRef(null);

  const {
    categories,
    fetchCategories,
    loading: categoriesLoading,
  } = useCategoryStore();

  const {
    listings,
    fetchListings,
    setCategory,
  } = useListingStore();

  /*
   * ==========================================
   * ЗАГРУЗКА КАТЕГОРИЙ ИЗ MONGODB
   * ==========================================
   */

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  /*
   * ==========================================
   * СТАТИЧЕСКИЕ ДАННЫЕ
   *
   * Используются для старых категорий:
   * SEO, описание, советы, FAQ и т.д.
   * ==========================================
   */

  const staticCategory = categoryData[slug] || null;

  /*
   * ==========================================
   * ТЕКУЩАЯ КАТЕГОРИЯ ИЗ MONGODB
   * ==========================================
   */

  const mongoCategory = useMemo(() => {
    return categories.find(
      (category) =>
        String(category.slug || "").toLowerCase() ===
        String(slug || "").toLowerCase()
    );
  }, [categories, slug]);

  /*
   * ==========================================
   * ПОДКАТЕГОРИИ ИЗ MONGODB
   * ==========================================
   */

  const mongoSubcategories = useMemo(() => {
    if (!mongoCategory?._id) return [];

    return categories.filter((category) => {
      const parentId =
        category.parent?._id ||
        category.parent;

      return (
        parentId &&
        String(parentId) === String(mongoCategory._id)
      );
    });
  }, [categories, mongoCategory]);

  /*
   * ==========================================
   * ФИНАЛЬНАЯ КАТЕГОРИЯ
   *
   * MongoDB имеет приоритет.
   * categoryData используется как дополнение
   * для старых категорий.
   * ==========================================
   */

  const currentCategory = useMemo(() => {
    /*
     * Если категории нет ни в MongoDB,
     * ни в categoryData — действительно не существует.
     */
    if (!mongoCategory && !staticCategory) {
      return null;
    }

    /*
     * Если категория есть в MongoDB —
     * берём её как основную.
     */
    if (mongoCategory) {
      return {
        ...staticCategory,

        /*
         * Данные MongoDB
         */
        ...mongoCategory,

        /*
         * Унифицированные названия
         */
        title:
          mongoCategory.name ||
          staticCategory?.title ||
          slug,

        shortTitle:
          staticCategory?.shortTitle ||
          mongoCategory.name ||
          slug,

        description:
          staticCategory?.description ||
          `Объявления в категории «${mongoCategory.name}».`,

        seoTitle:
          staticCategory?.seoTitle ||
          `${mongoCategory.name} — объявления на BB`,

        seoDescription:
          staticCategory?.seoDescription ||
          `Объявления в категории «${mongoCategory.name}» на BB. Покупайте и продавайте товары и услуги.`,

        
seoText:
  mongoCategory.seoText?.trim() ||
  staticCategory?.seoText ||
  `На BB вы можете найти объявления в категории «${mongoCategory.name}». Просматривайте предложения, сравнивайте цены и связывайтесь с продавцами напрямую.`,


        gradient:
          staticCategory?.gradient ||
          "from-blue-600 via-indigo-600 to-violet-700",

        icon:
          mongoCategory.icon ||
          staticCategory?.icon ||
          "📦",

        /*
         * Картинка MongoDB имеет приоритет.
         */
        image:
          mongoCategory.image ||
          categoryImages[slug] ||
          null,

        /*
         * Для старых категорий сохраняем советы и FAQ.
         */
        tips:
          staticCategory?.tips || [],

        sellerTips:
          staticCategory?.sellerTips || [],

        faq:
          staticCategory?.faq || [],

        /*
         * Подкатегории теперь берём из MongoDB.
         */
        subcategories:
          mongoSubcategories.length > 0
            ? mongoSubcategories
            : staticCategory?.subcategories || [],
      };
    }

    /*
     * ==========================================
     * FALLBACK ДЛЯ СТАРЫХ СТАТИЧЕСКИХ КАТЕГОРИЙ
     * ==========================================
     */

    return {
      ...staticCategory,
      title:
        staticCategory.title || slug,

      shortTitle:
        staticCategory.shortTitle ||
        staticCategory.title ||
        slug,

      description:
        staticCategory.description ||
        `Объявления в категории «${slug}».`,

      seoTitle:
        staticCategory.seoTitle ||
        `${staticCategory.title || slug} — BB`,

      seoDescription:
        staticCategory.seoDescription ||
        `Объявления в категории «${staticCategory.title || slug}» на BB.`,

      seoText:
        staticCategory.seoText ||
        `Объявления в категории «${staticCategory.title || slug}» на BB.`,

      gradient:
        staticCategory.gradient ||
        "from-blue-600 via-indigo-600 to-violet-700",

      icon:
        staticCategory.icon ||
        "📦",

      image:
        categoryImages[slug] ||
        null,

      subcategories:
        staticCategory.subcategories || [],

      tips:
        staticCategory.tips || [],

      sellerTips:
        staticCategory.sellerTips || [],

      faq:
        staticCategory.faq || [],
    };
  }, [
    mongoCategory,
    staticCategory,
    mongoSubcategories,
    slug,
  ]);

  /*
   * ==========================================
   * КАРТИНКА КАТЕГОРИИ
   * ==========================================
   */

  const categoryImage =
    currentCategory?.image ||
    categoryImages[slug] ||
    null;

  /*
   * ==========================================
   * ЗАГРУЗКА ОБЪЯВЛЕНИЙ
   * ==========================================
   */

  useEffect(() => {
    if (!currentCategory) return;

    setCategory(slug);
    fetchListings(1);
  }, [
    slug,
    currentCategory,
    setCategory,
    fetchListings,
  ]);

  /*
   * ==========================================
   * ФИЛЬТРАЦИЯ И СОРТИРОВКА
   * ==========================================
   */

  const filteredListings = useMemo(() => {
    let result = [...listings];

    if (categorySearch.trim()) {
      const query =
        categorySearch.trim().toLowerCase();

      result = result.filter((listing) =>
        listing.title
          ?.toLowerCase()
          .includes(query)
      );
    }

    if (sort === "priceAsc") {
      result.sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      );
    }

    if (sort === "priceDesc") {
      result.sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      );
    }

    return result;
  }, [
    listings,
    categorySearch,
    sort,
  ]);

  /*
   * ==========================================
   * ЗАГРУЗКА
   * ==========================================
   */

  if (
    categoriesLoading &&
    categories.length === 0
  ) {
    return (
      <MainLayout>
        <div className="py-20 text-center">
          <div className="text-4xl animate-pulse">
            📂
          </div>

          <h1 className="mt-4 text-xl font-bold text-slate-800">
            Загружаем категорию...
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Подготавливаем объявления и разделы
          </p>
        </div>
      </MainLayout>
    );
  }

  /*
   * ==========================================
   * КАТЕГОРИЯ НЕ НАЙДЕНА
   * ==========================================
   */

  if (!currentCategory) {
    const canonicalUrl =
      `https://bb.by/category/${slug}`;

    return (
      <>
        <Helmet>
          <title>
            Категория не найдена — BB
          </title>

          <meta
            name="description"
            content="Запрашиваемая категория не найдена. Перейдите на главную страницу BB и найдите нужные объявления."
          />

          <meta
            name="robots"
            content="noindex, follow"
          />

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
            content="Запрашиваемая категория не найдена."
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
                transition
                hover:bg-blue-700
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
   * SEO
   * ==========================================
   */

  const canonicalUrl =
    `https://bb.by/category/${slug}`;

  return (
    <>
      <Helmet>

        <title>
          {currentCategory.seoTitle}
        </title>

        <meta
          name="description"
          content={currentCategory.seoDescription}
        />

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

        <div className="mt-4 mb-4 flex items-center gap-2 text-sm">

          <button
            type="button"
            onClick={() => navigate("/")}
            className="
              text-slate-500
              transition
              hover:text-blue-600
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
          className="
            relative
            min-h-105
            overflow-hidden
            rounded-3xl
            bg-slate-900
            text-white
            shadow-xl
            md:min-h-115
          "
        >

          {/* ФОТО */}

          {categoryImage ? (
            <img
              src={categoryImage}
              alt=""
              aria-hidden="true"
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
                scale-105
                transition-transform
                duration-700
              "
              loading="eager"
            />
          ) : (
            <div
              className={`
                absolute
                inset-0
                bg-linear-to-br
                ${currentCategory.gradient}
              `}
            />
          )}

          {/* ГРАДИЕНТ */}

          <div
            className="
              absolute
              inset-0
              bg-linear-to-r
              from-slate-950/65
              via-slate-950/35
              to-transparent
            "
          />

          {/* НИЖНЕЕ ЗАТЕМНЕНИЕ */}

          <div
            className="
              absolute
              inset-x-0
              bottom-0
              h-56
              bg-linear-to-t
              from-slate-950/45
              to-transparent
            "
          />

          {/* ДЕКОР */}

          <div
            className="
              absolute
              -right-24
              -top-24
              h-80
              w-80
              rounded-full
              bg-white/10
              blur-3xl
            "
          />

          <div
            className="
              absolute
              bottom-0
              left-1/3
              h-64
              w-64
              rounded-full
              bg-blue-400/10
              blur-3xl
            "
          />

          {/* КОНТЕНТ */}

          <div
            className="
              relative
              z-10
              flex
              min-h-105
              flex-col
              justify-center
              px-6
              py-10
              md:min-h-115
              md:px-10
              md:py-12
            "
          >

            <div className="max-w-3xl">

              {/* БЕЙДЖ */}

              <div
                className="
                  inline-flex
                  items-center
                  gap-3
                  rounded-full
                  border
                  border-white/20
                  bg-white/10
                  px-3
                  py-2
                  text-sm
                  font-medium
                  shadow-lg
                  backdrop-blur-md
                "
              >

                {/* <span
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-white/20
                    bg-white/15
                    text-2xl
                    shadow-inner
                    backdrop-blur
                  "
                >
                  {currentCategory.icon}
                </span> */}

                <span className="pr-2">
                  Категория
                </span>

              </div>


              {/* ЗАГОЛОВОК */}

              <h1
                className="
                  mt-5
                  text-4xl
                  font-extrabold
                  leading-tight
                  tracking-tight
                  drop-shadow-xl
                  sm:text-5xl
                  md:text-6xl
                "
              >
                {currentCategory.title}
              </h1>


              {/* ОПИСАНИЕ */}

              <p
                className="
                  mt-4
                  max-w-2xl
                  text-sm
                  leading-6
                  text-white/85
                  drop-shadow-md
                  sm:text-base
                  md:text-lg
                  md:leading-7
                "
              >
                {currentCategory.description}
              </p>


              {/* СТАТИСТИКА */}

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
                    inline-flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-white/15
                    bg-black/25
                    px-4
                    py-2.5
                    backdrop-blur-md
                  "
                >

                  <span
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-lg
                      bg-white/15
                      text-sm
                    "
                  >
                    📋
                  </span>

                  <div>

                    <div className="text-sm font-bold">
                      {filteredListings.length}
                    </div>

                    <div className="text-[11px] text-white/60">
                      объявлений
                    </div>

                  </div>

                </div>


                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-white/15
                    bg-black/20
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    backdrop-blur-md
                  "
                >
                  📍 Рядом с вами
                </div>


                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-white/15
                    bg-black/20
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    backdrop-blur-md
                  "
                >
                  🔥 Новые объявления
                </div>

              </div>


              {/* КНОПКИ */}

              <div
                className="
                  mt-7
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                "
              >

                <button
                  type="button"
                  onClick={() => {
                    listingSectionRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                  className="
                    inline-flex
                    h-12
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-white
                    px-6
                    font-bold
                    text-slate-900
                    shadow-xl
                    transition-all
                    hover:-translate-y-0.5
                    hover:bg-blue-50
                    hover:shadow-2xl
                  "
                >
                  Смотреть объявления

                  <ArrowRight size={18} />
                </button>


                <button
                  type="button"
                  onClick={() =>
                    navigate("/create-listing")
                  }
                  className="
                    inline-flex
                    h-12
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-white/25
                    bg-white/10
                    px-6
                    font-bold
                    text-white
                    backdrop-blur-md
                    transition-all
                    hover:-translate-y-0.5
                    hover:bg-white/20
                  "
                >
                  <Plus size={18} />
                  Разместить объявление
                </button>

              </div>

            </div>

          </div>

        </section>


        {/* ==========================================
            ПОДКАТЕГОРИИ
        ========================================== */}

        {currentCategory.subcategories?.length > 0 && (
          <section className="mt-6">

            <div className="mb-4">

              <h2
                className="
                  text-xl
                  font-bold
                  text-slate-800
                  md:text-2xl
                "
              >
                Популярные разделы
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Быстро найдите нужный раздел
              </p>

            </div>


            <div
              className="
                grid
                grid-cols-2
                gap-3
                sm:grid-cols-3
                lg:grid-cols-5
              "
            >

              {currentCategory.subcategories.map(
                (subcategory, index) => {

                  /*
                   * Сначала картинка из MongoDB,
                   * потом локальная картинка.
                   */

                  const subcategoryImage =
                    subcategory.image ||
                    categoryImages[subcategory.slug] ||
                    null;

                  return (
                    <button
                      key={
                        subcategory._id ||
                        subcategory.slug
                      }
                      type="button"
                      onClick={() =>
                        navigate(
                          `/category/${slug}/${subcategory.slug}`
                        )
                      }
                      className="
                        group
                        relative
                        min-h-36
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-100
                        bg-slate-900
                        text-left
                        shadow-sm
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:shadow-lg
                      "
                    >

                      {/* ФОТО */}

                      {subcategoryImage ? (
                        <img
                          src={subcategoryImage}
                          alt={subcategory.name}
                          className="
                            absolute
                            inset-0
                            h-full
                            w-full
                            object-cover
                            transition-transform
                            duration-500
                            group-hover:scale-110
                          "
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="
                            absolute
                            inset-0
                            bg-linear-to-br
                            from-blue-600
                            to-indigo-700
                          "
                        />
                      )}


                      {/* ЗАТЕМНЕНИЕ */}

                      <div
                        className="
                          absolute
                          inset-0
                          bg-linear-to-t
                          from-black/75
                          via-black/30
                          to-black/10
                        "
                      />


                      {/* КОНТЕНТ */}

                      <div
                        className="
                          relative
                          z-10
                          flex
                          min-h-36
                          flex-col
                          justify-between
                          p-4
                        "
                      >

                        <div
                          className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-lg
                            bg-white/15
                            text-xs
                            font-bold
                            text-white
                            backdrop-blur-md
                            ring-1
                            ring-white/20
                          "
                        >
                          {String(index + 1).padStart(2, "0")}
                        </div>


                        <div
                          className="
                            flex
                            items-end
                            justify-between
                            gap-2
                          "
                        >

                          <div
                            className="
                              text-sm
                              font-bold
                              leading-5
                              text-white
                              drop-shadow-lg
                            "
                          >
                            {subcategory.name}
                          </div>

                          <div
                            className="
                              flex
                              h-8
                              w-8
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              bg-white/15
                              text-white
                              backdrop-blur-md
                              transition-all
                              duration-300
                              group-hover:bg-white/25
                            "
                          >
                            <ArrowRight
                              size={16}
                              className="
                                transition-transform
                                duration-300
                                group-hover:translate-x-1
                              "
                            />
                          </div>

                        </div>

                      </div>

                    </button>
                  );
                }
              )}

            </div>

          </section>
        )}


        {/* ==========================================
            ПОЛЕЗНАЯ ИНФОРМАЦИЯ
        ========================================== */}

        {(currentCategory.tips?.length > 0 ||
          currentCategory.sellerTips?.length > 0) && (

          <section className="mt-8">

            <div
              className="
                grid
                grid-cols-1
                gap-5
                lg:grid-cols-2
              "
            >

              {/* ПОКУПАТЕЛЮ */}

              {currentCategory.tips?.length > 0 && (
                <div
                  className="
                    rounded-3xl
                    border
                    border-slate-100
                    bg-white
                    p-6
                    shadow-sm
                  "
                >

                  <div className="flex items-center gap-3">

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-50
                        text-xl
                        text-blue-600
                      "
                    >
                      🛡️
                    </div>

                    <div>

                      <h2 className="text-lg font-bold text-slate-800">
                        Советы покупателю
                      </h2>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Как сделать покупку безопаснее
                      </p>

                    </div>

                  </div>


                  <div className="mt-5 space-y-3">

                    {currentCategory.tips.map(
                      (tip, index) => (
                        <div
                          key={`${tip}-${index}`}
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
                              flex
                              h-6
                              w-6
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-blue-50
                              text-xs
                              font-bold
                              text-blue-600
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
              )}


              {/* ПРОДАВЦУ */}

              {currentCategory.sellerTips?.length > 0 && (
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
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-white/10
                        text-xl
                      "
                    >
                      🚀
                    </div>

                    <div>

                      <h2 className="text-lg font-bold">
                        Советы продавцу
                      </h2>

                      <p className="mt-0.5 text-xs text-slate-400">
                        Как получить больше откликов
                      </p>

                    </div>

                  </div>


                  <div className="mt-5 space-y-3">

                    {currentCategory.sellerTips.map(
                      (tip, index) => (
                        <div
                          key={`${tip}-${index}`}
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
                              flex
                              h-6
                              w-6
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-white/10
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
              )}

            </div>

          </section>
        )}


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
              gap-3
              lg:flex-row
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
                placeholder={
                  `Поиск в категории «${currentCategory.title}»`
                }
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  pl-11
                  pr-4
                  outline-none
                  focus:border-blue-500
                  focus:bg-white
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
                flex
                h-12
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                font-semibold
                text-slate-700
                lg:hidden
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
                flex
                h-12
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-blue-600
                px-5
                font-bold
                text-white
                transition
                hover:-translate-y-0.5
                hover:bg-blue-700
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

        <section
          ref={listingSectionRef}
          className="mt-8 scroll-mt-6"
        >

          <div
            className="
              mb-5
              flex
              flex-col
              justify-between
              gap-4
              sm:flex-row
              sm:items-end
            "
          >

            <div>

              <div className="flex items-center gap-2">

                <h2
                  className="
                    text-2xl
                    font-bold
                    text-slate-800
                    md:text-3xl
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
                  {filteredListings.length}
                </span>

              </div>

              <p className="mt-1 text-sm text-slate-500">
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
              gap-5
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
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
                px-6
                py-16
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

          <div className="mb-6 text-center">

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
                font-bold
                text-slate-800
                md:text-3xl
              "
            >
              Покупать и продавать проще
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Всё необходимое для удобных сделок в одном месте
            </p>

          </div>


          <div
            className="
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              lg:grid-cols-4
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
                  border
                  border-slate-100
                  bg-white
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
              justify-between
              gap-5
              md:flex-row
              md:items-center
            "
          >

            <div>

              <div
                className="
                  text-sm
                  font-semibold
                  text-blue-400
                "
              >
                BB доска объявлений
              </div>

              <h2
                className="
                  mt-1
                  text-xl
                  font-bold
                  text-white
                  md:text-2xl
                "
              >
                Не нашли то, что искали?
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Разместите объявление и найдите покупателя.
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                navigate("/create-listing")
              }
              className="
                inline-flex
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-white
                px-5
                py-3
                font-bold
                text-slate-900
                transition
                hover:bg-blue-50
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

        {(currentCategory.seoText ||
          currentCategory.faq?.length > 0) && (

          <section
            className="
              mt-10
              rounded-3xl
              border
              border-slate-100
              bg-slate-50
              p-6
              md:p-8
            "
          >

            <div className="max-w-4xl">

              <h2
                className="
                  text-xl
                  font-bold
                  text-slate-800
                  md:text-2xl
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


            {/* FAQ */}

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
                    gap-3
                    md:grid-cols-2
                  "
                >

                  {currentCategory.faq.map(
                    (item) => (

                      <details
                        key={item.question}
                        className="
                          group
                          overflow-hidden
                          rounded-2xl
                          border
                          border-slate-100
                          bg-white
                        "
                      >

                        <summary
                          className="
                            flex
                            cursor-pointer
                            list-none
                            items-center
                            justify-between
                            gap-4
                            p-5
                            text-sm
                            font-semibold
                            text-slate-800
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
                              transition
                              group-open:rotate-180
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

        )}

        
        

      </MainLayout>
    </>
  );
}

