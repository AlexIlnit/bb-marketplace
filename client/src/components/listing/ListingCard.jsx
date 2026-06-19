import { Heart } from "lucide-react";
import { useFavoriteStore } from "../../store/favoriteStore";
import { useNavigate } from "react-router-dom";

export default function ListingCard({ listing, priority = false }) {
if (!listing) return null;

  const navigate = useNavigate(); // ✅ ВОТ ЭТОГО НЕ ХВАТАЛО
  

  const handleClick = () => {
  navigate(`/listing/${listing._id}`);
};
  const isFavorite = useFavoriteStore(
  (state) =>
    state.favorites.some(
      (fav) => fav.listing?._id === listing._id
    )
);

const toggleFavorite = useFavoriteStore(
  (state) => state.toggleFavorite
);

  // const isFavorite = favorites.some(
  //   (fav) => fav.listing?._id === listing._id
  // );
// const imageUrl = listing.images?.[0]
//   ? listing.images[0].includes("/upload/")
//     ? listing.images[0].replace("/upload/", "/upload/f_auto,q_auto,w_500/")
//     : listing.images[0]
//   : "";
const imageUrl = listing.images?.[0]
  ? listing.images[0].replace(
      "/upload/",
      "/upload/f_auto,q_auto:eco,dpr_auto,w_350/"
    )
  : "";

  return (
    <div onClick={handleClick}
      
      className="relative w-full bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer"
    >

      <button
        aria-label={
        isFavorite
          ? "Убрать из избранного"
          : "Добавить в избранное"
        }
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

<div className="aspect-[3/2] relative overflow-hidden">
<img
  src={imageUrl}
  srcSet={`
    ${listing.images[0].replace("/upload/", "/upload/f_auto,q_auto,w_250/")} 250w,
    ${listing.images[0].replace("/upload/", "/upload/f_auto,q_auto,w_350/")} 350w,
    ${listing.images[0].replace("/upload/", "/upload/f_auto,q_auto,w_500/")} 500w
  `}
  sizes="
    (max-width: 640px) 100vw,
    (max-width: 1024px) 50vw,
    25vw
  "
  alt={listing.title}
  loading={priority ? "eager" : "lazy"}
  className="absolute inset-0 w-full h-full object-cover"
/>
</div>

      <div className="p-4">
      <div className="text-green-600 font-bold text-xl">
        {listing.price} р.
      </div>
      <p className="font-semibold">{listing.title}</p>

  

      <div className="text-gray-500">
      {listing.city}
      </div>

  <div className="text-xs text-gray-400 mt-2">
    {new Date(listing.createdAt).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}
  </div>
</div>
</div>
  );
}
