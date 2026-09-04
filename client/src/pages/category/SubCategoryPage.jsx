import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import MainLayout from "../../layouts/MainLayout";
import ListingCard from "../../components/listing/ListingCard";

import { useListingStore } from "../../store/listingStore";
import { categoryData } from "../../data/categoryData";

export default function SubCategoryPage() {
  const { slug, subcategorySlug } = useParams();
  const navigate = useNavigate();

  const {
    listings,
    loading,
    totalPages,
    fetchListings,
  } = useListingStore();

  const [search, setSearch] = useState("");

  const category = categoryData[slug];

  const subcategory = useMemo(() => {
    if (!category) return null;

    return category.subcategories.find(
      (item) => item.slug === subcategorySlug
    );
  }, [category, subcategorySlug]);

  useEffect(() => {
    if (!category || !subcategory) return;

    fetchListings(1, {
      category: subcategorySlug,
    });
  }, [category, subcategory, subcategorySlug]);

  const filteredListings = useMemo(() => {
    if (!search.trim()) return listings;

    const value = search.toLowerCase();

    return listings.filter((listing) =>
      listing.title?.toLowerCase().includes(value)
    );
  }, [listings, search]);

  if (!category || !subcategory) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Подкатегория не найдена
          </h1>

          <button
            type="button"
            onClick={() => navigate(`/category/${slug}`)}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
          >
            <ArrowLeft size={17} />
            Вернуться в категорию
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Helmet>
        <title>
          {subcategory.name} — объявления в Беларуси | BB
        </title>

        <meta
          name="description"
          content={`${subcategory.name}: объявления о продаже и услугах в Беларуси на BB.`}
        />
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Breadcrumbs */}

        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link
            to="/"
            className="transition hover:text-gray-900"
          >
            Главная
          </Link>

          <ChevronRight size={15} />

          <Link
            to={`/category/${slug}`}
            className="transition hover:text-gray-900"
          >
            {category.title}
          </Link>

          <ChevronRight size={15} />

          <span className="font-medium text-gray-900">
            {subcategory.name}
          </span>
        </nav>

        {/* Header */}

        <div className="mb-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                {subcategory.name}
              </h1>

              <p className="mt-2 max-w-2xl text-gray-500">
                Объявления в категории «{subcategory.name}»
                на BB.
              </p>
            </div>

            <Link
              to="/create-listing"
              className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Подать объявление
            </Link>
          </div>
        </div>

        {/* Search / filters */}

        <div className="mb-8 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`Поиск в категории «${subcategory.name}»`}
              className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-gray-400"
            />
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
          >
            <SlidersHorizontal size={18} />
            Фильтры
          </button>
        </div>

        {/* Listings header */}

        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
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

          <button
            type="button"
            className="hidden rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 md:block"
          >
            Сначала новые
          </button>
        </div>

        {/* Loading */}

        {loading && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white"
              >
                <div className="aspect-square animate-pulse bg-gray-100" />

                <div className="space-y-3 p-4">
                  <div className="h-4 animate-pulse rounded bg-gray-100" />
                  <div className="h-5 w-1/2 animate-pulse rounded bg-gray-100" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Listings */}

        {!loading && filteredListings.length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filteredListings.map((listing) => (
              <ListingCard
                key={listing._id}
                listing={listing}
              />
            ))}
          </div>
        )}

        {/* Empty */}

        {!loading && filteredListings.length === 0 && (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
            <div className="mx-auto max-w-md">
              <h3 className="text-xl font-semibold text-gray-900">
                Объявлений пока нет
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                В категории «{subcategory.name}» пока
                нет опубликованных объявлений.
              </p>

              <Link
                to="/create-listing"
                className="mt-6 inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Подать первое объявление
              </Link>
            </div>
          </div>
        )}

        {/* Pagination */}

        {!loading && totalPages > 1 && (
          <div className="mt-10 flex justify-center gap-2">
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
                  })
                }
                className="flex h-10 min-w-10 items-center justify-center rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium transition hover:border-gray-400"
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}