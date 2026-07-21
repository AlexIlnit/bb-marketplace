import { useEffect, useState } from "react";
import { lazy, Suspense } from "react";

import MainLayout from "../../layouts/MainLayout";
import ListingCard from "../../components/listing/ListingCard";

import { useListingStore } from "../../store/listingStore";

import { useFavoriteStore } from "../../store/favoriteStore";
import { Helmet } from "react-helmet-async";

import SearchBox from "../../components/search/SearchBox";

const CategoriesBar = lazy(() => import("../../components/categories/CategoriesBar"));
const FilterSidebar = lazy(() => import("../../components/filters/FilterSidebar"));

export default function Home() {
  
  const [page, setPage] = useState(1);
  

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
    setCity,
    setSearch
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
    sellerType
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
  mb-5
  bg-linear-to-br
  from-slate-900
  via-blue-900
  to-indigo-900
  px-6
  py-8
  lg:px-10
  lg:py-10
  text-white
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


    <div className="max-w-2xl">


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
    ">
      🛒
    </div>


  </div>


</div>



    <Suspense fallback={<div>Загрузка...</div>}>
      <CategoriesBar />
    </Suspense>



    <div className="
      bg-slate-50
      rounded-3xl
      p-5
      lg:p-8
    ">


      <div className="flex flex-col lg:flex-row gap-8">


        <div className="hidden lg:block lg:w-1/4">
          <FilterSidebar />
        </div>


        <section className="w-full">


          <h3 className="
            text-3xl
            font-bold
            mb-8
            text-slate-800
          ">
            🔥 Свежие объявления
          </h3>



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