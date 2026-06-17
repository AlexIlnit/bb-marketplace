import { useEffect, useState } from "react";
import { lazy, Suspense } from "react";

import MainLayout from "../../layouts/MainLayout";
import ListingCard from "../../components/listing/ListingCard";

import { useListingStore } from "../../store/listingStore";

import { useFavoriteStore } from "../../store/favoriteStore";
import { Helmet } from "react-helmet-async";

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
    totalPages
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
      <CategoriesBar />

      <div className="flex flex-col lg:flex-row gap-8">

        <div className="hidden lg:block lg:w-1/4">
          <FilterSidebar />
        </div>

        <section className="w-full">

          <h3 className="text-3xl font-bold mb-8">
            Свежие объявления
          </h3>

          <div className="lg:hidden mb-6">
            <FilterSidebar />
          </div>

          {/* ✔️ ВОТ ТУТ ГЛАВНОЕ ИЗМЕНЕНИЕ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing, index) => (
              <ListingCard
                key={listing._id}
                listing={listing}
                priority={index < 4}
              />
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPage(index + 1)}
                  className={`px-4 py-2 rounded-xl border ${
                    page === index + 1
                      ? "bg-green-600 text-white"
                      : "bg-white"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}

        </section>
      </div>
    </MainLayout>
  );
}