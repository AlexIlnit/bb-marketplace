import { getListings } from "../src/lib/api";
import ListingCard from "../src/components/ListingCard";
import FiltersClient from "../src/components/filters/FiltersClient";
import PaginationClient from "../src/components/PaginationClient";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
type Listing = {
  _id: string;
  title: string;
  price: number;
  images?: string[];
};

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;

  const page = Number(params?.page || 1);

  const data = await getListings({
    ...params,
    page,
  });

  const listings: Listing[] = data.listings || [];

  return (
    <main className="max-w-7xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Свежие объявления
      </h1>

      {/* CLIENT FILTERS (SPA UX) */}
      <FiltersClient />

      {/* LISTINGS (SSR SEO CONTENT) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map((listing, index) => (
          <ListingCard
            key={listing._id}
            listing={listing}
            priority={index < 2}
          />
        ))}
      </div>

      {/* PAGINATION (SPA) */}
      <PaginationClient totalPages={data.totalPages || 1} />

    </main>
  );
}