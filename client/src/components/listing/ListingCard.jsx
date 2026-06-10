import { Heart } from "lucide-react";
import { useFavoriteStore } from "../../store/favoriteStore";
import { useNavigate } from "react-router-dom";

export default function ListingCard({ listing }) {
  if (!listing) return null;

  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavoriteStore();

  const isFavorite = favorites.some(
    (fav) => fav.listing?._id === listing._id
  );

  return (
    <div
      onClick={() => navigate(`/listing/${listing._id}`)}
      
      className="relative w-full bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer"
    >

      <button
        onClick={(e) => {
          e.stopPropagation(); // ❗ важно
          toggleFavorite(listing._id);
        }}
        className="absolute top-3 right-3 bg-white p-2 rounded-full shadow z-10"
      >
        <Heart
          size={18}
          fill={isFavorite ? "red" : "none"}
          color={isFavorite ? "red" : "black"}
        />
      </button>

      <img
        src={listing.images?.[0] || "https://placehold.co/600x400"}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <p className="font-semibold">{listing.title}</p>
        <div className="text-green-600 font-bold text-xl">
          {listing.price} BYN
        </div>
        <div className="text-gray-500">{listing.city}</div>
      </div>

    </div>
  );
}
