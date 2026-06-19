import { getListings } from "../src/lib/api";
import ListingCard from "../src/components/ListingCard";
import PaginationClient from "../src/components/PaginationClient";
import MainLayout from "../src/components/layout/MainLayout";



type Props = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export const metadata = {
  title: "BB Доска объявлений",
  description: "Продажа товаров, авто, недвижимости и услуг",
};

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;

  const page = Number(params.page ?? 1);

  const data = await getListings({
    ...params,
    page,
  });

  return (
    <MainLayout>
      <main className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">
          Свежие объявления
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {data.listings.map((listing, index) => (
            <ListingCard
              key={listing._id}
              listing={listing}
              priority={index === 0}
            />
          ))}
        </div>

        <PaginationClient totalPages={data.totalPages} />
      </main>
    </MainLayout>
  );
}