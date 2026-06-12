import { useEffect, useState } from "react";

import MainLayout from "../../layouts/MainLayout";
import ListingCard from "../../components/listing/ListingCard";

import { useListingStore } from "../../store/listingStore";

import FilterSidebar from "../../components/filters/FilterSidebar";

import { useFavoriteStore } from "../../store/favoriteStore";

import CategoriesBar from "../../components/categories/CategoriesBar";

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
    totalPages
  } = useListingStore();

  useEffect(() => {
    fetchListings(page);
  }, [
    page,
    search,
    category,
    priceFrom,
    priceTo,
    condition,
    sellerType
  ]);

  return (
    <MainLayout>
      <CategoriesBar />

      <div className="flex flex-col lg:flex-row gap-8">

        <div className="hidden lg:block lg:w-1/4">
          <FilterSidebar />
        </div>

        <section className="w-full">

          <h1 className="text-3xl font-bold mb-8">
            Свежие объявления
          </h1>

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