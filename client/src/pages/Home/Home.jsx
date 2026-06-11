import { useEffect, useState } from "react";

import MainLayout from "../../layouts/MainLayout";
import ListingCard from "../../components/listing/ListingCard";

import { useListingStore } from "../../store/listingStore";

import FilterSidebar from "../../components/filters/FilterSidebar";

import { useFavoriteStore } from "../../store/favoriteStore";

import CategoriesBar from "../../components/categories/CategoriesBar";


export default function Home() {
  

  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 24;
  const {
  listings,
  fetchListings,

  search,
  category,
  priceFrom,
  priceTo,
  condition,
  sellerType
} = useListingStore();

 const { fetchFavorites } =
  useFavoriteStore();

useEffect(() => {
  fetchListings();
  fetchFavorites();
}, []);

  useEffect(() => {
  setPage(1);
}, [search, category, priceFrom, priceTo]);
  

  const filteredListings =
  listings.filter((listing) => {

    const matchSearch =
      listing.title
        ?.toLowerCase()
        .includes(search?.toLowerCase() || "");

    const matchCategory =
      !category ||
      listing.category === category;

    const matchPriceFrom =
      !priceFrom ||
      listing.price >= Number(priceFrom);

    const matchPriceTo =
      !priceTo ||
      listing.price <= Number(priceTo);

      const matchesCondition =
    !condition || listing.condition === condition;

   const matchesSeller =
    !sellerType || listing.sellerType === sellerType;

    return (
      matchSearch &&
      matchCategory &&
      matchPriceFrom &&
      matchPriceTo &&
      matchesCondition &&
      matchesSeller
    );
  });

  const totalPages = Math.ceil(
    filteredListings.length/ ITEMS_PER_PAGE
  );

  const paginatedListings =
  filteredListings.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );



  return (
<MainLayout>
  <CategoriesBar />

  <div className="flex flex-col lg:flex-row gap-8">

    {/* FILTERS */}
    <div className="hidden lg:block lg:w-1/4">
      <FilterSidebar />
    </div>

    {/* LISTINGS */}
    <section className="w-full ">

      <h1
        className="
          text-3xl
          font-bold
          mb-8
        "
      >
        Свежие объявления
      </h1>
      {/* Фильтр сверху на планшетах и телефонах */}
    <div className="lg:hidden mb-6">
      <FilterSidebar />
    </div>

      <div
        className="
          grid
    grid-cols-1
    sm:grid-cols-2
    md:grid-cols-3
    xl:grid-cols-4
    gap-6
        "
      >
        {paginatedListings.map(
          (listing) => (
            <ListingCard
              key={listing._id}
              listing={listing}
            />
          )
        )}
      </div>

      {totalPages > 1 && (
        <div
          className="
            flex
            justify-center
            gap-2
            mt-10
          "
        >
          {[...Array(totalPages)].map(
            (_, index) => (
              <button
                key={index}
                onClick={() =>
                  setPage(index + 1)
                }
                className={`
                  px-4
                  py-2
                  rounded-xl
                  border
                  ${
                    page === index + 1
                      ? "bg-green-600 text-white"
                      : "bg-white"
                  }
                `}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      )}

    </section>

  </div>

</MainLayout>
  );
}