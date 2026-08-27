import { useEffect } from "react";

import MainLayout from "../../layouts/MainLayout";

import ListingCard from "../../components/listing/ListingCard";

import { useFavoriteStore } from "../../store/favoriteStore";

import { Helmet } from "react-helmet-async";

export default function Favorites() {

  const {
    favorites,
    fetchFavorites
  } =
    useFavoriteStore();

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <MainLayout>
      <Helmet>
      <title>Избранное | BB доска объявлений</title>
      <meta
        name="description"
        content="Избранные объявления"
      />
    </Helmet>

      <h1
        className="
        text-3xl
        font-bold
        mb-8
      "
      >
        Избранное
      </h1>

      <div
        className="
        grid
        md:grid-cols-2
        lg:grid-cols-4
        gap-6
      "
      >
 {/* {favorites.map((id) => (
  <ListingCard key={id} listing={{ _id: id }} />
))} */}
{favorites.map((fav) => (
  <ListingCard
    key={fav._id}
    listing={fav.listing}
  />
))}
      </div>

    </MainLayout>
  );
}