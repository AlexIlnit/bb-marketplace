import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

import { useFavoriteStore } from "../../store/favoriteStore";

export default function ListingCard({ listing }) {

  const addToFavorites =
    useFavoriteStore(
      (s) => s.addToFavorites
    );

  return (
    <Link to={`/listing/${listing._id}`}>
      <div className="relative bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition">

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            addToFavorites(
              listing._id
            );
          }}
          className="
          absolute
          top-3
          right-3
          bg-white
          p-2
          rounded-full
          shadow
          z-10
        "
        >
          <Heart size={18} />
        </button>

        <img
          src={
            listing.images?.[0] ||
            "https://placehold.co/600x400"
          }
          className="
          h-56
          w-full
          object-cover
        "
        />

        <div className="p-4">
          <h3 className="font-semibold mb-2">
            {listing.title}
          </h3>

          <div className="text-green-600 font-bold text-xl">
            {listing.price} BYN
          </div>

          <div className="text-gray-500 mt-1">
            {listing.city}
          </div>
        </div>

      </div>
    </Link>
  );
}