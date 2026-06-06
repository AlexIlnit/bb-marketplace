import { Heart } from "lucide-react";
import { useFavoriteStore } from "../../store/favoriteStore";

export default function ListingCard({ listing }) {
  if (!listing) return null;

  const { favorites, toggleFavorite } = useFavoriteStore();

  // const isFavorite = favorites.includes(listing._id);
  const isFavorite = favorites.some(
  (fav) => fav.listing?._id === listing._id
);

  return (
    <div className="relative">

      <button
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(listing._id);
        }}
        className="absolute top-3 right-3 bg-white p-2 rounded-full shadow"
      >
        <Heart
          size={18}
          fill={isFavorite ? "red" : "none"}
          color={isFavorite ? "red" : "black"}
        />
      </button>

      <div className="overflow-hidden rounded-2xl">
  <img
    src={listing.images?.[0] || "https://placehold.co/600x400"}
    alt={listing.title}
    className="
      h-56
      w-56
      
      object-cover
      transition-transform
      duration-300
    "
  />
</div>

      <div className="p-4">
        <p className="font-semibold mb-2">
          {listing.title}
        </p>

        <div className="text-green-600 font-bold text-xl">
          {listing.price} BYN
        </div>

        <div className="text-gray-500 mt-1">
          {listing.city}
        </div>
      </div>

    </div>
  );
}