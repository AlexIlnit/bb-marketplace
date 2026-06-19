import { getListings } from "../lib/api";
import ListingCard from "../components/ListingCard";

export default async function HomePage({ searchParams }) {
  const data = await getListings(searchParams);

  const listings = data.listings || [];

  return (
    <main className="max-w-7xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Свежие объявления
      </h1>

      {/* FILTERS (URL-based) */}
      <form className="flex gap-2 mb-6">

        <input
          name="search"
          placeholder="Поиск..."
          defaultValue={searchParams.search || ""}
          className="border p-2 rounded"
        />

        <select name="category" defaultValue={searchParams.category || ""}>
          <option value="">Все категории</option>
          <option value="cars">Авто</option>
          <option value="tech">Техника</option>
        </select>

        <input
          name="priceFrom"
          placeholder="Цена от"
          defaultValue={searchParams.priceFrom || ""}
          className="border p-2 rounded"
        />

        <input
          name="priceTo"
          placeholder="Цена до"
          defaultValue={searchParams.priceTo || ""}
          className="border p-2 rounded"
        />

        <button className="bg-green-600 text-white px-4 rounded">
          Применить
        </button>
      </form>

      {/* LISTINGS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map((listing, index) => (
          <ListingCard
            key={listing._id}
            listing={listing}
            priority={index === 0}
          />
        ))}
      </div>

    </main>
  );
}