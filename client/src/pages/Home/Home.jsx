import { useEffect, useState } from "react";
import { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";
import ListingCard from "../../components/listing/ListingCard";

import { useListingStore } from "../../store/listingStore";

import { useFavoriteStore } from "../../store/favoriteStore";
import { Helmet } from "react-helmet-async";
import {
  Plus,
  ShieldCheck,
  MessageCircle,
  MapPin,
  ArrowRight,
  Car,
  Home as HomeIcon,
  Smartphone,
  BriefcaseBusiness,
  PawPrint,
  Shirt,
  Sofa,
  Wrench,
} from "lucide-react";
import { useCategoryStore } from "../../store/categoryStore";
import { categoryImages } from "../../data/categoryImages";

import SearchBox from "../../components/search/SearchBox";

const CategoriesBar = lazy(() => import("../../components/categories/CategoriesBar"));
const FilterSidebar = lazy(() => import("../../components/filters/FilterSidebar"));

export default function Home() {
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  // =====================================================
  // КАТЕГОРИИ
  // =====================================================

  const {
    categories,
    fetchCategories,
  } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Иконки стандартных категорий
  const categoryIcons = {
    avto: Car,
    nedvizhimost: HomeIcon,
    elektronika: Smartphone,
    rabota: BriefcaseBusiness,
    zhivotnye: PawPrint,
    odezhda: Shirt,
    "dom-i-sad": Sofa,
    uslugi: Wrench,
  };

  // Цвета стандартных категорий
  const categoryColors = {
    avto: "bg-blue-50 text-blue-600",
    nedvizhimost:
      "bg-emerald-50 text-emerald-600",
    elektronika:
      "bg-violet-50 text-violet-600",
    rabota:
      "bg-amber-50 text-amber-600",
    zhivotnye:
      "bg-pink-50 text-pink-600",
    odezhda:
      "bg-rose-50 text-rose-600",
    "dom-i-sad":
      "bg-orange-50 text-orange-600",
    uslugi:
      "bg-cyan-50 text-cyan-600",
  };

  // Описания стандартных категорий
  const categoryDescriptions = {
    avto:
      "Машины, запчасти и аксессуары",

    nedvizhimost:
      "Квартиры, дома и участки",

    elektronika:
      "Телефоны, техника и гаджеты",

    rabota:
      "Вакансии и предложения",

    zhivotnye:
      "Питомцы и всё для них",

    odezhda:
      "Одежда, обувь и аксессуары",

    "dom-i-sad":
      "Мебель, ремонт и дача",

    uslugi:
      "Помощь специалистов рядом",
  };

  // =====================================================
  // ДИНАМИЧЕСКИЕ ГЛАВНЫЕ КАТЕГОРИИ
  // =====================================================

  const featuredCategories = categories
    .filter((category) => !category.parent)
    .map((category) => {
      const Icon =
        categoryIcons[category.slug] || Sofa;

      return {
        ...category,

        title: category.name,

        description:
          categoryDescriptions[category.slug] ||
          "Товары и услуги в этом разделе",

        icon: Icon,

        image:
          category.image ||
          categoryImages[category.slug] ||
          null,

        color:
          categoryColors[category.slug] ||
          "bg-slate-50 text-slate-600",
      };
    });

  // =====================================================
  // ОБЪЯВЛЕНИЯ
  // =====================================================

  const {
    listings,
    fetchListings,
    search,
    category,
    priceFrom,
    priceTo,
    condition,
    sellerType,
    city,
    totalPages,
  } = useListingStore();

  useEffect(() => {
    fetchListings(page);
  }, [
    page,
    search,
    category,
    city,
    priceFrom,
    priceTo,
    condition,
    sellerType,
  ]);


    
return (
  <MainLayout>

    <Helmet>
      <title>Главная | BB доска объявлений</title>
      <meta
        name="description"
        content="Покупайте и продавайте товары быстро и безопасно. Объявления, авто, недвижимость и услуги."
      />
    </Helmet>


    <div className="
  relative
  overflow-hidden
  rounded-3xl
  mt-3
  mb-3
  bg-linear-to-br
  from-slate-900
  via-blue-900
  to-indigo-900
  px-6
  py-8
  lg:px-10
  lg:py-10
  text-white
  animate-fade-up
">


  <div className="
    absolute
-top-24
-right-24
w-80
h-80
bg-blue-400/20
rounded-full
blur-3xl
animate-float-slow
  "/>


  <div className="
   absolute
-bottom-20
left-20
w-64
h-64
bg-yellow-400/20
rounded-full
blur-3xl
animate-float-reverse
  "/>


  <div className="
    relative
    z-10
    flex
    flex-col
    lg:flex-row
    items-center
    justify-between
    gap-6
  ">


    <div className="max-w-2xl animate-slide-left">


      <h1 className="
        text-3xl
        md:text-5xl
        font-extrabold
        leading-tight
      ">
        Покупайте и продавайте
        <span className="
          block
          text-yellow-400
        ">
          всё рядом с вами
        </span>
      </h1>


      <p className="
        mt-3
        text-slate-200
        text-base
        md:text-lg
      ">
        Тысячи объявлений.
        Безопасные сделки.
        Общение напрямую с продавцами.
      </p>
{/* <SearchBox /> */}

      {/* мини преимущества */}

      <div className="
        flex
        flex-wrap
        gap-3
        mt-5
      ">


        <div className="
          bg-white/10
backdrop-blur
rounded-xl
px-4
py-2
text-sm
animate-chip
        ">
          ⚡ Быстрые покупки
        </div>


        <div className="
          bg-white/10
          backdrop-blur
          rounded-xl
          px-4
          py-2
          text-sm
          animate-chip-delay
        ">
          🔒 Надёжные сделки
        </div>


        <div className="
          bg-white/10
          backdrop-blur
          rounded-xl
          px-4
          py-2
          text-sm
          animate-chip-delay2
        ">
          📍 Ваш город
        </div>


      </div>


    </div>



    {/* правая часть */}

    <div className="
      hidden
lg:flex
w-64
h-40
rounded-3xl
bg-white/10
backdrop-blur
items-center
justify-center
text-7xl
animate-bounce-soft
hover:scale-110
transition
duration-500
    ">
      🛒
    </div>


  </div>


</div>



   

    {/* Популярные категории */}

<section className="mt-6">

  <div className="flex items-end justify-between mb-4 px-1">

    <div>
      <span className="text-sm font-semibold text-blue-600">
        ПОПУЛЯРНОЕ
      </span>

      <h2 className="
        mt-1
        text-2xl
        md:text-3xl
        font-bold
        text-slate-800
      ">
        Что ищут сегодня
      </h2>
    </div>



  </div>


  <div className="
    grid
    grid-cols-2
    sm:grid-cols-4
    gap-3
    lg:gap-4
  ">

    {featuredCategories.map((item) => {

      const Icon = item.icon;

      return (
        <button
  key={item.title}
  onClick={() => navigate(`/category/${item.slug}`)}
  type="button"
  className="
    group
    overflow-hidden
    rounded-2xl
    border
    border-slate-100
    bg-white
    text-left
    shadow-sm
    transition-all
    duration-300
    hover:-translate-y-1
    hover:shadow-lg
  "
>
  {/* ФОТО */}

 
<div className="relative h-36 overflow-hidden bg-slate-100">

  {item.image ? (
    <img
      src={item.image}
      alt={item.title}
      className="
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
        flex
        items-center
        justify-center
        bg-linear-to-br
        from-slate-200
        to-slate-300
      "
    >
      {(() => {
        const Icon = item.icon;

        return (
          <Icon
            size={54}
            className="text-slate-500"
          />
        );
      })()}
    </div>
  )}

  <div
    className="
      absolute
      inset-0
      bg-linear-to-t
      from-black/45
      via-black/5
      to-transparent
    "
  />

  <div
    className={`
      absolute
      bottom-3
      left-3
      flex
      h-10
      w-10
      items-center
      justify-center
      rounded-xl
      ${item.color}
      shadow-lg
      ring-2
      ring-white/80
      transition-transform
      duration-300
      group-hover:scale-110
    `}
  >
    {(() => {
      const Icon = item.icon;

      return <Icon size={20} />;
    })()}
  </div>

  <div
    className="
      absolute
      right-3
      top-3
      flex
      h-9
      w-9
      items-center
      justify-center
      rounded-xl
      bg-white/15
      text-white
      backdrop-blur-md
      transition-all
      duration-300
      group-hover:bg-white/25
    "
  >
    <ArrowRight
      size={17}
      className="
        transition-transform
        duration-300
        group-hover:translate-x-1
      "
    />
  </div>

</div>




  {/* ТЕКСТ */}

  <div className="p-4">

    <h3
      className="
        font-bold
        text-slate-800
        transition-colors
        group-hover:text-blue-600
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
      {item.description}
    </p>

  </div>
</button>
      );
    })}

  </div>

</section>
{/* Продавайте на BB */}

<section className="
  mt-6
  relative
  overflow-hidden
  rounded-3xl
  bg-linear-to-r
  from-blue-600
  via-indigo-600
  to-violet-600
  p-6
  md:p-8
  text-white
">

  {/* декоративные круги */}

  <div className="
    absolute
    -right-20
    -top-20
    w-64
    h-64
    rounded-full
    bg-white/10
    blur-2xl
  "/>

  <div className="
    absolute
    -left-16
    -bottom-24
    w-56
    h-56
    rounded-full
    bg-blue-300/20
    blur-2xl
  "/>


  <div className="
    relative
    z-10
    flex
    flex-col
    md:flex-row
    items-start
    md:items-center
    justify-between
    gap-6
  ">

    <div>

      <div className="
        inline-flex
        items-center
        gap-2
        rounded-full
        bg-white/15
        px-3
        py-1
        text-xs
        font-semibold
        backdrop-blur
      ">
        <Plus size={14} />
        Для продавцов
      </div>


      <h2 className="
        mt-3
        text-2xl
        md:text-3xl
        font-extrabold
      ">
        Есть что продать?
      </h2>


      <p className="
        mt-2
        max-w-xl
        text-sm
        md:text-base
        text-blue-100
      ">
        Разместите объявление на BB и найдите покупателя
        рядом с вами.
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
        text-blue-600
        shadow-lg
        hover:bg-blue-50
        hover:scale-105
        transition
      "
    >
      Разместить объявление
      <ArrowRight size={18} />
    </button>

  </div>

</section>
 <Suspense fallback={<div>Загрузка...</div>}>
      <CategoriesBar />
    </Suspense>

    <div className="
      bg-slate-50
      rounded-3xl
      p-3
      lg:p-2
    ">


      <div className="flex flex-col lg:flex-row gap-8">


        <div className="hidden lg:block lg:w-1/4">
          <FilterSidebar />
        </div>


        <section className="w-full">


          <h2 className="
            text-3xl
            font-bold
            mb-8
            mt-5
            text-slate-800
          ">
            🔥 Свежие объявления
          </h2>



          <div className="lg:hidden mb-6">
            <FilterSidebar />
          </div>



          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            xl:grid-cols-4
            gap-5
          ">

            {listings.map((listing,index)=>(
              <ListingCard
                key={listing._id}
                listing={listing}
                priority={index===0}
              />
            ))}

          </div>



          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">

              {[...Array(totalPages)].map((_,index)=>(
                <button
                  key={index}
                  onClick={()=>setPage(index+1)}
                  className={`
                    px-4
                    py-2
                    rounded-xl
                    border
                    transition
                    ${
                      page===index+1
                      ?
                      "bg-blue-600 text-white shadow-lg"
                      :
                      "bg-white hover:bg-gray-100"
                    }
                  `}
                >
                  {index+1}
                </button>
              ))}

            </div>
          )}


        </section>

      </div>

    </div>


  </MainLayout>
);
}