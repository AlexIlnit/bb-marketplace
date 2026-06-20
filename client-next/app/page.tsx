import { getListings } from "@/lib/api";
import ListingCard from "@/components/listing/ListingCard";
import PaginationClient from "@/components/pagination/PaginationClient";
import MainLayout from "@/components/layout/MainLayout";
import CategoriesBar from "@/components/categories/CategoriesBar";
import FilterSidebar from "@/components/filters/FilterSidebar";

export const metadata = {
  title: "BB Доска объявлений",
  description: "Продажа товаров, авто, недвижимости и услуг",
};

type Props = {
  searchParams: Record<string, string | undefined>;
};

export default async function HomePage({ searchParams }: Props) {
  const page = Number(searchParams.page ?? 1);

  const data = await getListings({
    ...searchParams,
    page,
  });

  return (
    <MainLayout>
      {/* CATEGORIES */}
      <CategoriesBar />

      <div className="flex flex-col lg:flex-row gap-8 mt-6">

        {/* FILTERS */}
        <div className="hidden lg:block lg:w-1/4">
          <FilterSidebar />
        </div>

        {/* CONTENT */}
        <section className="w-full">

          <h3 className="text-3xl font-bold mb-8">
            Свежие объявления
          </h3>

          {/* MOBILE FILTER */}
          <div className="lg:hidden mb-6">
            <FilterSidebar />
          </div>

          {/* LISTINGS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.listings.map((listing, index) => (
              <ListingCard
                key={listing._id}
                listing={listing}
                priority={index === 0}
              />
            ))}
          </div>

          {/* PAGINATION */}
          {data.totalPages > 1 && (
            <PaginationClient totalPages={data.totalPages} />
          )}

        </section>
      </div>
    </MainLayout>
  );
}