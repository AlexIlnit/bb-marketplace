import { Heart } from "lucide-react";
import { useFavoriteStore } from "../../store/favoriteStore";
import { useNavigate } from "react-router-dom";
import { memo, useState } from "react";
import NoImage from "../ui/NoImage";

function ListingCard({ listing, priority }) {
  if (!listing) return null;

  const navigate = useNavigate();

  const [currentImage, setCurrentImage] = useState(0);

  const images = listing.images || [];

  const isFavorite = useFavoriteStore(
    (state) =>
      state.favorites.some(
        (fav) => fav.listing?._id === listing._id
      )
  );

  const toggleFavorite = useFavoriteStore(
    (state) => state.toggleFavorite
  );

  const handleClick = () => {
    navigate(`/listing/${listing._id}`);
  };

  const nextImage = (e) => {
    e.stopPropagation();

    setCurrentImage((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    e.stopPropagation();

    setCurrentImage((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const imageUrl = images[currentImage]
    ? images[currentImage].replace(
        "/upload/",
        "/upload/f_auto,q_auto:eco,dpr_auto,w_350/"
      )
    : "";

    const isTop =
  listing.isTop === true &&
  listing.topUntil &&
  new Date(listing.topUntil) > new Date();

  return (
    <div
      onClick={handleClick}
      className="
        relative
        bg-white
        rounded-2xl
        shadow-sm
        overflow-hidden
        cursor-pointer
        flex
        sm:block
      "
    >
{isTop && (
  <div
    className="
      absolute
      top-3
      left-3
      z-10
      px-2.5
      py-1
      rounded-lg
      bg-yellow-400
      text-yellow-950
      text-xs
      font-bold
      shadow-md
    "
  >
    ТОП
  </div>
)}
      {/* Избранное */}
      <button
        aria-label={
          isFavorite
            ? "Убрать из избранного"
            : "Добавить в избранное"
        }
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(listing._id);
        }}
        className="
          absolute
          top-3
          right-3
          bg-white
          p-2
          rounded-full
          shadow
          z-20
        "
      >
        <Heart
          size={18}
          fill={isFavorite ? "red" : "none"}
          color={isFavorite ? "red" : "black"}
        />
      </button>


      {/* Фото */}
      <div
        className="
          relative
          w-32
          h-32
          shrink-0
          sm:w-full
          sm:h-auto
          sm:aspect-3/2
          overflow-hidden
          bg-gray-100
        "
      >

        {images.length > 0 ? (
          <img
            src={imageUrl}
            srcSet={`
              ${images[currentImage].replace(
                "/upload/",
                "/upload/f_auto,q_auto:eco,w_180/"
              )} 180w,

              ${images[currentImage].replace(
                "/upload/",
                "/upload/f_auto,q_auto:eco,w_250/"
              )} 250w,

              ${images[currentImage].replace(
                "/upload/",
                "/upload/f_auto,q_auto:eco,w_350/"
              )} 350w
            `}
            sizes="
              (max-width:640px) 128px,
              (max-width:768px) 50vw,
              (max-width:1280px) 33vw,
              25vw
            "
            alt={listing.title}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : undefined}
            decoding="async"
            className="
              absolute
              inset-0
              w-full
              h-full
              object-cover
              transition-opacity
              duration-200
            "
          />
        ) : (
          <NoImage />
        )}


        {/* Стрелка назад */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={prevImage}
            aria-label="Предыдущее фото"
            className="
              absolute
              left-2
              top-1/2
              -translate-y-1/2
              w-8
              h-8
              rounded-full
              bg-black/45
              hover:bg-black/65
              text-white
              flex
              items-center
              justify-center
              text-xl
              z-10
              transition
            "
          >
            ‹
          </button>
        )}


        {/* Стрелка вперед */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={nextImage}
            aria-label="Следующее фото"
            className="
              absolute
              right-2
              top-1/2
              -translate-y-1/2
              w-8
              h-8
              rounded-full
              bg-black/45
              hover:bg-black/65
              text-white
              flex
              items-center
              justify-center
              text-xl
              z-10
              transition
            "
          >
            ›
          </button>
        )}


        {/* Индикаторы */}
{images.length > 1 && (
  <div
    className="
      absolute
      bottom-1
      left-1/2
      -translate-x-1/2
      flex
      gap-0.5
      z-10
    "
  >
    {images.map((_, index) => (
      <button
        key={index}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setCurrentImage(index);
        }}
        aria-label={`Фото ${index + 1}`}
        className="
          w-8
          h-8
          rounded-full
          flex
          items-center
          justify-center
          shrink-0
        "
      >
        <span
          className={`
            w-2
            h-2
            rounded-full
            transition-all
            ${
              currentImage === index
                ? "bg-white scale-125"
                : "bg-white/50"
            }
          `}
        />
      </button>
    ))}
  </div>
)}

      </div>


      {/* Информация */}
      <div className="flex-1 p-3 flex flex-col justify-between">

        <div>

          {/* Цена */}
          <div className="text-blue-600 font-bold text-xl">
            {listing.price} р.
          </div>


          {/* Название */}
          <p className="font-semibold text-black line-clamp-2">
            {listing.title}
          </p>


          {/* Город */}
          <div className="text-xs pt-1 text-gray-500">
            {listing.city}

            {listing.region &&
              `, ${listing.region.replace(
                "область",
                "обл."
              )}`}
          </div>


          


        {/* Дата */}
        <div className="text-xs text-gray-600 mt-2">
          {new Date(listing.createdAt).toLocaleString(
            "ru-RU",
            {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }
          )}
        </div>

      </div>

    </div>
    </div>
  );
}

export default memo(ListingCard);