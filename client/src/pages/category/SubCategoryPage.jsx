import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  ChevronRight,
  Search,
} from "lucide-react";

import MainLayout from "../../layouts/MainLayout";
import ListingCard from "../../components/listing/ListingCard";

import { useListingStore } from "../../store/listingStore";
import { useCategoryStore } from "../../store/categoryStore";

import { categoryData } from "../../data/categoryData";
import { categoryImages } from "../../data/categoryImages";

import CategoryFilters from "../../components/listing/CategoryFilters";

export default function SubCategoryPage() {
  const { slug, subcategorySlug } = useParams();
  const navigate = useNavigate();

  const {
    categories,
    fetchCategories,
    loading: categoriesLoading,
  } = useCategoryStore();

  const {
    listings,
    loading,
    totalPages,
    fetchListings,
  } = useListingStore();

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});

  /*
   * ==========================================
   * ЗАГРУЗКА КАТЕГОРИЙ
   * ==========================================
   */

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  /*
   * ==========================================
   * СТАТИЧЕСКАЯ КАТЕГОРИЯ
   *
   * Нужна для старых SEO-данных:
   * title, description, tips и т.д.
   * ==========================================
   */

  const staticCategory = categoryData[slug] || null;

  /*
   * ==========================================
   * ОСНОВНАЯ КАТЕГОРИЯ ИЗ MONGODB
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
   * ФИНАЛЬНАЯ ОСНОВНАЯ КАТЕГОРИЯ
   * ==========================================
   */

  const category = useMemo(() => {
    if (!mongoCategory && !staticCategory) {
      return null;
    }

    /*
     * Если категория есть в MongoDB —
     * используем MongoDB как основной источник.
     */

    if (mongoCategory) {
      return {
        ...staticCategory,

        ...mongoCategory,

        title:
          mongoCategory.name ||
          staticCategory?.title ||
          slug,

        name:
          mongoCategory.name ||
          staticCategory?.name ||
          slug,

        icon:
          mongoCategory.icon ||
          staticCategory?.icon ||
          "📦",

        image:
          mongoCategory.image ||
          categoryImages[slug] ||
          null,
      };
    }

    /*
     * Старые категории из categoryData.js
     */

    return {
      ...staticCategory,

      title:
        staticCategory.title ||
        staticCategory.name ||
        slug,

      icon:
        staticCategory.icon ||
        "📦",

      image:
        categoryImages[slug] ||
        null,
    };
  }, [
    mongoCategory,
    staticCategory,
    slug,
  ]);

  /*
   * ==========================================
   * ПОДКАТЕГОРИЯ ИЗ MONGODB
   * ==========================================
   */

  const mongoSubcategory = useMemo(() => {
    if (!mongoCategory?._id) {
      return null;
    }

    return categories.find((item) => {
      const parentId =
        item.parent?._id ||
        item.parent;

      return (
        String(item.slug || "").toLowerCase() ===
          String(subcategorySlug || "").toLowerCase() &&
        parentId &&
        String(parentId) ===
          String(mongoCategory._id)
      );
    });
  }, [
    categories,
    mongoCategory,
    subcategorySlug,
  ]);

  /*
   * ==========================================
   * СТАТИЧЕСКАЯ ПОДКАТЕГОРИЯ
   *
   * Используется для старых категорий.
   * ==========================================
   */

  const staticSubcategory = useMemo(() => {
    if (!staticCategory?.subcategories) {
      return null;
    }

    return staticCategory.subcategories.find(
      (item) =>
        String(item.slug) ===
        String(subcategorySlug)
    );
  }, [
    staticCategory,
    subcategorySlug,
  ]);

  /*
   * ==========================================
   * ФИНАЛЬНАЯ ПОДКАТЕГОРИЯ
   * ==========================================
   */

  const subcategory = useMemo(() => {
    if (!mongoSubcategory && !staticSubcategory) {
      return null;
    }

    /*
     * MongoDB имеет приоритет.
     */

    if (mongoSubcategory) {
      return {
        ...staticSubcategory,

        ...mongoSubcategory,

        name:
          mongoSubcategory.name ||
          staticSubcategory?.name ||
          subcategorySlug,

        image:
          mongoSubcategory.image ||
          categoryImages[subcategorySlug] ||
          null,
      };
    }

    /*
     * Старая подкатегория
     */

    return {
      ...staticSubcategory,

      name:
        staticSubcategory.name ||
        subcategorySlug,

      image:
        categoryImages[subcategorySlug] ||
        null,
    };
  }, [
    mongoSubcategory,
    staticSubcategory,
    subcategorySlug,
  ]);

  /*
   * ==========================================
   * КАРТИНКА ПОДКАТЕГОРИИ
   *
   * Приоритет:
   *
   * 1. MongoDB
   * 2. categoryImages.js
   * 3. градиент
   * ==========================================
   */

  const subcategoryImage =
    subcategory?.image ||
    categoryImages[subcategorySlug] ||
    null;

  /*
   * ==========================================
   * ЗАГРУЗКА ОБЪЯВЛЕНИЙ
   * ==========================================
   */

  useEffect(() => {
    if (!category || !subcategory) {
      return;
    }

    setFilters({});
    setSearch("");

    fetchListings(1, {
      category: subcategorySlug,
      characteristics: {},
    });
  }, [
    slug,
    subcategorySlug,
    category,
    subcategory,
    fetchListings,
  ]);

  /*
   * ==========================================
   * ПРИМЕНЕНИЕ ФИЛЬТРОВ
   * ==========================================
   */

  const applyFilters = () => {
    fetchListings(1, {
      category: subcategorySlug,
      characteristics: filters,
    });
  };

  /*
   * ==========================================
   * СБРОС ФИЛЬТРОВ
   * ==========================================
   */

  const resetFilters = () => {
    setFilters({});

    fetchListings(1, {
      category: subcategorySlug,
      characteristics: {},
    });
  };

  /*
   * ==========================================
   * ПОИСК ПО НАЗВАНИЮ
   * ==========================================
   */

  const filteredListings = useMemo(() => {
    if (!search.trim()) {
      return listings;
    }

    const value =
      search.trim().toLowerCase();

    return listings.filter((listing) =>
      listing.title
        ?.toLowerCase()
        .includes(value)
    );
  }, [
    listings,
    search,
  ]);

  /*
   * ==========================================
   * ЗАГРУЗКА КАТЕГОРИЙ
   * ==========================================
   */

  if (
    categoriesLoading &&
    categories.length === 0
  ) {
    return (
      <MainLayout>

        <div className="py-20 text-center">

          <div className="text-5xl animate-pulse">
            📂
          </div>

          <h1 className="mt-5 text-xl font-bold text-slate-800">
            Загружаем раздел...
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Подготавливаем категорию и объявления
          </p>

        </div>

      </MainLayout>
    );
  }

  /*
   * ==========================================
   * ПОДКАТЕГОРИЯ НЕ НАЙДЕНА
   * ==========================================
   */

  if (!category || !subcategory) {
    return (
      <MainLayout>

        <div className="mx-auto max-w-7xl px-4 py-16 text-center">

          <div className="text-6xl">
            🔎
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Подкатегория не найдена
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Возможно, ссылка устарела или такой подкатегории больше нет.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(`/category/${slug}`)
            }
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-black
              px-5
              py-3
              text-sm
              font-medium
              text-white
              transition
              hover:bg-gray-800
            "
          >
            <ArrowLeft size={17} />
            Вернуться в категорию
          </button>

        </div>

      </MainLayout>
    );
  }

  /*
   * ==========================================
   * SEO
   * ==========================================
   */

  const canonicalUrl =
    `https://bb.by/category/${slug}/${subcategorySlug}`;

  const seoTitle =
    `${subcategory.name} — объявления в Беларуси | BB`;

  const seoDescription =
    `${subcategory.name}: объявления о продаже и услугах в Беларуси на BB.`;

  return (
    <MainLayout>

      <Helmet>

        <title>
          {seoTitle}
        </title>

        <meta
          name="description"
          content={seoDescription}
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
          content={seoTitle}
        />

        <meta
          property="og:description"
          content={seoDescription}
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

      </Helmet>


      <div className="mx-auto max-w-7xl px-4 py-6">

        {/* ==========================================
            BREADCRUMBS
        ========================================== */}

        <nav
          className="
            mb-6
            flex
            flex-wrap
            items-center
            gap-2
            text-sm
            text-gray-500
          "
        >

          <Link
            to="/"
            className="
              transition
              hover:text-gray-900
            "
          >
            Главная
          </Link>

          <ChevronRight size={15} />

          <Link
            to={`/category/${slug}`}
            className="
              transition
              hover:text-gray-900
            "
          >
            {category.title}
          </Link>

          <ChevronRight size={15} />

          <span className="font-medium text-gray-900">
            {subcategory.name}
          </span>

        </nav>


        {/* ==========================================
            HERO ПОДКАТЕГОРИИ
        ========================================== */}

        <section
          className="
            relative
            mb-8
            min-h-90
            overflow-hidden
            rounded-3xl
            bg-slate-900
            text-white
            shadow-xl
            md:min-h-100
          "
        >

          {subcategoryImage ? (
            <img
              src={subcategoryImage}
              alt=""
              aria-hidden="true"
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
                transition-transform
                duration-700
              "
              loading="eager"
            />
          ) : (
            <div
              className="
                absolute
                inset-0
                bg-linear-to-br
                from-blue-600
                via-indigo-600
                to-violet-600
              "
            />
          )}


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


          <div
            className="
              absolute
              inset-x-0
              bottom-0
              h-40
              bg-linear-to-t
              from-slate-950/45
              to-transparent
            "
          />


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


          <div
            className="
              relative
              z-10
              flex
              min-h-90
              flex-col
              justify-center
              px-6
              py-10
              md:min-h-100
              md:px-10
              md:py-12
            "
          >

            <div className="max-w-3xl">

              {/* КАТЕГОРИЯ */}

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
{/* 
                <span
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-white/20
                    bg-white/15
                    text-xl
                    shadow-inner
                  "
                >
                  {category.icon}
                </span> */}

                <span className="pr-2">
                  {category.title}
                </span>

              </div>


              {/* НАЗВАНИЕ */}

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
                {subcategory.name}
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
                Объявления в категории «{subcategory.name}»
                на BB. Найдите нужный товар или услугу рядом
                с вами.
              </p>


              {/* ПЛАШКИ */}

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
                    document
                      .getElementById(
                        "subcategory-listings"
                      )
                      ?.scrollIntoView({
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

                  <ChevronRight size={18} />

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
                  Разместить объявление
                </button>

              </div>

            </div>

          </div>

        </section>


        {/* ==========================================
            SEARCH
        ========================================== */}

        <div className="mb-5">

          <div className="relative">

            <Search
              size={19}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              id="subcategory-search"
              name="subcategorySearch"
              type="search"
              autoComplete="off"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder={
                `Поиск в категории «${subcategory.name}»`
              }
              className="
                w-full
                rounded-2xl
                border
                border-gray-200
                bg-white
                py-3.5
                pl-11
                pr-4
                text-sm
                outline-none
                transition
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-500/10
              "
            />

          </div>

        </div>


        {/* ==========================================
            FILTERS
        ========================================== */}

        <div className="mb-8">

          <CategoryFilters
            categorySlug={subcategorySlug}
            filters={filters}
            onChange={setFilters}
            onApply={applyFilters}
            onReset={resetFilters}
          />

        </div>


        {/* ==========================================
            LISTINGS HEADER
        ========================================== */}

        <div
          id="subcategory-listings"
          className="
            scroll-mt-6
            mb-5
            flex
            items-center
            justify-between
          "
        >

          <div>

            <h2
              className="
                text-xl
                font-semibold
                text-gray-900
              "
            >
              Объявления
            </h2>

            {!loading && (
              <p className="mt-1 text-sm text-gray-500">

                {filteredListings.length > 0
                  ? `${filteredListings.length} объявлений`
                  : "Объявлений пока нет"}

              </p>
            )}

          </div>

        </div>


        {/* ==========================================
            LOADING
        ========================================== */}

        {loading && (

          <div
            className="
              grid
              grid-cols-2
              gap-4
              md:grid-cols-3
              lg:grid-cols-4
            "
          >

            {Array.from({ length: 8 }).map(
              (_, index) => (

                <div
                  key={index}
                  className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-gray-100
                    bg-white
                  "
                >

                  <div
                    className="
                      aspect-square
                      animate-pulse
                      bg-gray-100
                    "
                  />

                  <div className="space-y-3 p-4">

                    <div
                      className="
                        h-4
                        animate-pulse
                        rounded
                        bg-gray-100
                      "
                    />

                    <div
                      className="
                        h-5
                        w-1/2
                        animate-pulse
                        rounded
                        bg-gray-100
                      "
                    />

                    <div
                      className="
                        h-3
                        w-2/3
                        animate-pulse
                        rounded
                        bg-gray-100
                      "
                    />

                  </div>

                </div>

              )
            )}

          </div>

        )}


        {/* ==========================================
            LISTINGS
        ========================================== */}

        {!loading &&
          filteredListings.length > 0 && (

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
                (listing) => (

                  <ListingCard
                    key={listing._id}
                    listing={listing}
                  />

                )
              )}

            </div>

          )}


        {/* ==========================================
            EMPTY
        ========================================== */}

        {!loading &&
          filteredListings.length === 0 && (

            <div
              className="
                rounded-3xl
                border
                border-dashed
                border-gray-300
                bg-gray-50
                px-6
                py-16
                text-center
              "
            >

              <div className="text-6xl">
                🔎
              </div>

              <div className="mx-auto max-w-md">

                <h3
                  className="
                    mt-5
                    text-xl
                    font-semibold
                    text-gray-900
                  "
                >
                  Объявлений пока нет
                </h3>

                <p
                  className="
                    mt-2
                    text-sm
                    leading-6
                    text-gray-500
                  "
                >
                  В категории «{subcategory.name}»
                  пока нет опубликованных объявлений.
                </p>

                <Link
                  to="/create-listing"
                  className="
                    mt-6
                    inline-flex
                    rounded-xl
                    bg-black
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-gray-800
                  "
                >
                  Подать первое объявление
                </Link>

              </div>

            </div>

          )}


        {/* ==========================================
            PAGINATION
        ========================================== */}

        {!loading &&
          totalPages > 1 && (

            <div
              className="
                mt-10
                flex
                flex-wrap
                justify-center
                gap-2
              "
            >

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (

                <button
                  key={page}
                  type="button"
                  onClick={() =>
                    fetchListings(page, {
                      category: subcategorySlug,
                      characteristics: filters,
                    })
                  }
                  className="
                    flex
                    h-10
                    min-w-10
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    px-3
                    text-sm
                    font-medium
                    transition
                    hover:border-blue-400
                    hover:text-blue-600
                  "
                >
                  {page}
                </button>

              ))}

            </div>

          )}

{/* ==========================================
    SEO / ИНФОРМАЦИОННЫЙ ТЕКСТ
========================================== */}

{subcategory.seoText?.trim() && (
  <section
    className="
      mt-14
      overflow-hidden
      rounded-3xl
      border
      border-gray-200
      bg-white
      shadow-sm
    "
  >

    {/* HEADER */}

    <div
      className="
        border-b
        border-gray-100
        bg-gray-50
        px-6
        py-5
        md:px-10
      "
    >
      <h2
        className="
          text-xl
          font-bold
          text-gray-900
          md:text-2xl
        "
      >
        {subcategory.name}
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Полезно знать
      </p>
    </div>


    {/* SEO CONTENT */}

    <div
      className="
        px-6
        py-8
        md:px-10
        md:py-10
      "
    >

      <div
        className="
          max-w-none
          text-[15px]
          leading-7
          text-gray-700

          [&_h1]:mb-5
          [&_h1]:mt-8
          [&_h1]:text-3xl
          [&_h1]:font-bold
          [&_h1]:leading-tight
          [&_h1]:text-gray-900

          [&_h2]:mb-4
          [&_h2]:mt-8
          [&_h2]:text-2xl
          [&_h2]:font-bold
          [&_h2]:leading-tight
          [&_h2]:text-gray-900

          [&_h3]:mb-3
          [&_h3]:mt-7
          [&_h3]:text-xl
          [&_h3]:font-bold
          [&_h3]:leading-tight
          [&_h3]:text-gray-900

          [&_h4]:mb-2
          [&_h4]:mt-5
          [&_h4]:text-lg
          [&_h4]:font-bold
          [&_h4]:text-gray-900

          [&_p]:mb-4

          [&_strong]:font-bold
          [&_b]:font-bold

          [&_em]:italic
          [&_i]:italic

          [&_u]:underline

          [&_s]:line-through
          [&_strike]:line-through

          [&_ul]:my-5
          [&_ul]:list-disc
          [&_ul]:pl-6

          [&_ol]:my-5
          [&_ol]:list-decimal
          [&_ol]:pl-6

          [&_li]:mb-2

          [&_a]:font-medium
          [&_a]:text-blue-600
          [&_a]:underline
          [&_a]:underline-offset-2
          [&_a]:transition
          hover:[&_a]:text-blue-800

          [&_blockquote]:my-6
          [&_blockquote]:border-l-4
          [&_blockquote]:border-blue-300
          [&_blockquote]:bg-blue-50
          [&_blockquote]:px-5
          [&_blockquote]:py-4
          [&_blockquote]:italic
          [&_blockquote]:text-gray-700

          [&_hr]:my-8
          [&_hr]:border-gray-200

          [&_table]:my-6
          [&_table]:w-full
          [&_table]:border-collapse
          [&_table]:overflow-hidden

          [&_thead]:bg-gray-50

          [&_th]:border
          [&_th]:border-gray-200
          [&_th]:px-4
          [&_th]:py-3
          [&_th]:text-left
          [&_th]:font-semibold
          [&_th]:text-gray-900

          [&_td]:border
          [&_td]:border-gray-200
          [&_td]:px-4
          [&_td]:py-3

          [&_img]:my-6
          [&_img]:max-w-full
          [&_img]:rounded-xl

          [&_code]:rounded
          [&_code]:bg-gray-100
          [&_code]:px-1.5
          [&_code]:py-0.5
          [&_code]:font-mono
          [&_code]:text-sm

          [&_pre]:my-6
          [&_pre]:overflow-x-auto
          [&_pre]:rounded-xl
          [&_pre]:bg-gray-900
          [&_pre]:p-5
          [&_pre]:font-mono
          [&_pre]:text-sm
          [&_pre]:text-gray-100
        "
        dangerouslySetInnerHTML={{
          __html: subcategory.seoText,
        }}
      />

    </div>

  </section>
)}

      </div>

    </MainLayout>
  );
}

