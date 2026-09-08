import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getListingById } from "../../api/listingApi";
import MainLayout from "../../layouts/MainLayout";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { Heart } from "lucide-react";
import { useFavoriteStore } from "../../store/favoriteStore";
import { ImageOff } from "lucide-react";
import { categoryCharacteristics } from "../../data/categoryCharacteristics";

import SEO from "../../components/seo/Seo";

export default function Listing() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [showPhone, setShowPhone] = useState(false);

 

  const favorites = useFavoriteStore(
  (state) => state.favorites
);

const toggleFavorite = useFavoriteStore(
  (state) => state.toggleFavorite
);

const validFavorites = favorites.filter(
  (fav) => fav?.listing?._id
);

const isFavorite = listing
  ? validFavorites.some(
      (fav) => fav.listing._id === listing._id
    )
  : false;

const favoritesCount = validFavorites.length;



  useEffect(() => {
    loadListing();
  }, [id]);

  const loadListing = async () => {
    try {
      const { data } = await getListingById(id);

       
      setListing(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="p-10 text-center">
        Загрузка...
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="p-10 text-center">
        Объявление не найдено
      </div>
    );
  }
  const title = `${listing.title} — ${listing.price} BYN | Маркетплейс`;

const description =
  listing.description?.slice(0, 150) ||
  "Смотрите объявление на маркетплейсе";



const url = window.location.href;


const images = listing.images || [];
  const image = listing.images?.[0];

  const rawCharacteristics = listing.characteristics || {};

const characteristics =
  rawCharacteristics instanceof Map
    ? Object.fromEntries(rawCharacteristics)
    : rawCharacteristics;

const characteristicConfig =
  listing.category?.slug
    ? categoryCharacteristics[listing.category.slug]
    : null;


  return (
    <MainLayout>
      
     <SEO
        title={title}
        description={description}
        image={image}
        url={url}
        
      />
    <div className="max-w-6xl mx-auto p-6">

      <div className="grid md:grid-cols-2 gap-8">

        {/* Фото */}
<div className="aspect-3/2 relative overflow-hidden rounded-xl bg-gray-100">

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
      top-4
      right-4
      bg-white
      p-2
      rounded-full
      shadow-lg
      z-20
      hover:scale-105
      transition
    "
  >
    <Heart
      size={22}
      fill={isFavorite ? "red" : "none"}
      color={isFavorite ? "red" : "#374151"}
    />
  </button>

  {/* Если есть фотографии */}
  {images.length > 0 ? (
    <>
      <img
        src={images[currentImage]}
        alt={listing.title}
        className="
          absolute
          inset-0
          w-full
          h-full
          object-cover
          rounded-xl
        "
      />

      {/* Переключатели */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentImage((prev) =>
                prev === 0 ? images.length - 1 : prev - 1
              );
            }}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              w-10
              h-10
              rounded-full
              bg-white/90
              shadow-md
              flex
              items-center
              justify-center
              text-2xl
              text-gray-700
              hover:bg-white
              transition
              z-10
            "
          >
            ‹
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentImage((prev) =>
                prev === images.length - 1 ? 0 : prev + 1
              );
            }}
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              w-10
              h-10
              rounded-full
              bg-white/90
              shadow-md
              flex
              items-center
              justify-center
              text-2xl
              text-gray-700
              hover:bg-white
              transition
              z-10
            "
          >
            ›
          </button>
        </>
      )}

      {/* Точки */}
      {images.length > 1 && (
        <div className="
          absolute
          bottom-3
          left-1/2
          -translate-x-1/2
          flex
          gap-1.5
          z-10
        ">
          {images.map((_, index) => (
            <div
              key={index}
              className={`
                w-2
                h-2
                rounded-full
                transition
                ${
                  currentImage === index
                    ? "bg-white scale-110"
                    : "bg-white/50"
                }
              `}
            />
          ))}
        </div>
      )}
    </>
  ) : (

    /* Заглушка без фотографии */
    <div className="
      absolute
      inset-0
      flex
      flex-col
      items-center
      justify-center
      bg-linear-to-br
      from-gray-100
      via-gray-50
      to-gray-200
      text-gray-400
    ">
      <div className="
        w-20
        h-20
        rounded-3xl
        bg-white
        shadow-sm
        flex
        items-center
        justify-center
        mb-4
      ">
        <ImageOff
          size={38}
          strokeWidth={1.5}
          className="text-gray-300"
        />
      </div>

      <span className="text-sm font-medium text-gray-400">
        Фото отсутствует
      </span>

      <span className="text-xs text-gray-300 mt-1">
        Продавец не добавил фотографию
      </span>
    </div>
  )}

</div>

        {/* Информация */}
        <div>

          <h1 className="text-2xl font-bold text-black mb-4">
            {listing.title}
          </h1>

          <p className="text-2xl font-bold text-blue-600 mb-6">
            {listing.price} р.
          </p>

          <div className="space-y-3 text-gray-600">

            <p>
              📍 {listing.city}
            </p>

            <p>
              🏷️ {listing.category?.name}
            </p>

            <div className="text-xs text-gray-500 mt-1">
  {listing.condition === "new" ? "🆕 Новое" : "♻️ Б/У"}
</div>

<div className="text-xs text-gray-500">
  {listing.sellerType === "company"
    ? "🏢 Компания"
    : "👤 Частное лицо"}
</div>

          </div>

         {/* СПОСОБЫ СВЯЗИ */}

{listing.allowChat !== false && (
  <button
    onClick={async () => {
      try {
        const { data } = await api.post("/chat/conversation", {
          userId: listing.user._id,
          listingId: listing._id,
        });

        navigate("/messages", {
          state: {
            conversationId: data._id,
          },
        });
      } catch (err) {
        console.error("Ошибка создания чата:", err);
      }
    }}
    className="
      mt-8
      w-full
      bg-blue-600
      hover:bg-blue-700
      text-white
      py-3
      rounded-xl
      font-semibold
      transition
    "
  >
    💬 Написать продавцу
  </button>
)}

{listing.showPhone !== false && listing.user?.phone && (
  <>
    {!showPhone ? (
      <button
        onClick={() => setShowPhone(true)}
        className="
          mt-3
          w-full
          bg-green-600
          hover:bg-green-700
          text-white
          py-3
          rounded-xl
          font-semibold
          transition
        "
      >
        📞 Показать телефон
      </button>
    ) : (
      <a
        href={`tel:${listing.user.phone}`}
        className="
          mt-3
          w-full
          flex
          items-center
          justify-center
          bg-green-600
          hover:bg-green-700
          text-white
          py-3
          rounded-xl
          font-semibold
          transition
        "
      >
        📞 {listing.user.phone}
      </a>
    )}
  </>
)}

{listing.allowChat === false &&
  listing.showPhone === false && (
    <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
      <div className="text-gray-500 text-sm">
        Продавец не указал способы связи
      </div>
    </div>
  )}
<Link
  to={`/user/${listing.user?._id}`}
  className="
    block
    mt-6
    border
    rounded-2xl
    p-4
    bg-white
    shadow-sm
    hover:shadow-md
    transition
  "
>
  

  <div className="flex items-center gap-4">

    <img
      src={
        listing.user?.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          listing.user?.name || "User"
        )}`
      }
      alt=""
      className="
        w-16
        h-16
        rounded-full
        object-cover
        border
      "
    />

    <div>

      <div className="flex items-center gap-2">
  <div className="font-semibold text-lg">
    {listing.user?.name}
  </div>

  {/* {listing.user?.rating?.count > 0 && (
    <div className="flex items-center gap-1">
      <span className="text-yellow-500">
        ★
      </span>

      <span className="text-sm font-medium">
        {listing.user.rating.average}
      </span>

      <span className="text-xs text-gray-500">
        ({listing.user.rating.count})
      </span>
    </div>
  )} */}
<div className="flex items-center gap-2">
  {listing.user?.rating?.count > 0 ? (
    <>
      <span className="text-yellow-500">★</span>

      <span className="text-sm font-medium">
        {listing.user.rating.average.toFixed(1)}
      </span>

      <span className="text-xs text-gray-500">
        ({listing.user.rating.count})
      </span>
    </>
  ) : (
    <span className="text-sm text-gray-500">
      Нет отзывов
    </span>
  )}
</div>
</div>

      <div className="text-gray-500 text-sm">
        Объявлений:
        {" "}
        {listing.sellerListingsCount}
      </div>

      <div className="text-blue-600 text-sm mt-1">
        Смотреть профиль →
      </div>

    </div>

  </div>

</Link>
        </div>

      </div>
      

      {/* Описание */}
      <div className="mt-10 bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-2xl font-bold mb-4">
          Описание
        </h2>
        </div>
        <div className="px-6 py-5">
        <p className="leading-7 text-gray-700">
          {listing.description}
        </p>
        </div>

      </div>
        
{/* Характеристики */}
{characteristicConfig && (
  <div className="mt-10 bg-white rounded-2xl border border-gray-200 overflow-hidden">

    {/* Заголовок */}
    <div className="px-6 py-5 border-b border-gray-200">
      <h2 className="text-xl font-bold text-gray-900">
        {characteristicConfig.title}
      </h2>
    </div>

    {Object.keys(characteristics).length > 0 ? (
      <div className="px-6">

        {characteristicConfig.fields.map((field, index) => {
          const value = characteristics[field.name];

          if (
            value === undefined ||
            value === null ||
            String(value).trim() === ""
          ) {
            return null;
          }

          return (
            <div
              key={field.name}
              className={`
                flex
                items-center
                min-h-13
                gap-6
                ${
                  index !== characteristicConfig.fields.length - 1
                    ? "border-b border-dashed border-gray-200"
                    : ""
                }
              `}
            >

              {/* Название */}
              <div className="w-1/2 text-sm text-gray-500">
                {field.label}
              </div>

              {/* Значение */}
              <div className="w-1/2 text-sm font-medium text-gray-900">
                <span>
                  {value}
                </span>

                {field.unit && (
                  <span className="ml-1 text-gray-500 font-normal">
                    {field.unit}
                  </span>
                )}
              </div>

            </div>
          );
        })}

      </div>
    ) : (
      <div className="px-6 py-5">
        <p className="text-sm text-gray-500">
          Характеристики не указаны
        </p>
      </div>
    )}

  </div>
)}      
    
{/* О продавце */}
<div className="mt-10 bg-white rounded-2xl border border-gray-200 overflow-hidden">

  {/* Заголовок */}
  <div className="px-6 py-5 border-b border-gray-200">
    <h2 className="text-xl font-bold text-gray-900">
      О продавце
    </h2>
  </div>

  <div className="px-6 py-5">

    {/* Профиль продавца */}
    <div className="flex items-center gap-4 pb-5 border-b border-gray-100">

      {/* Аватар */}
      <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">

        {listing.user?.avatar ? (
          <img
            src={listing.user.avatar}
            alt={listing.user.name || "Продавец"}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-xl font-semibold text-gray-400">
            {listing.user?.name?.charAt(0)?.toUpperCase() || "?"}
          </span>
        )}

      </div>

      {/* Имя + рейтинг */}
      <div className="min-w-0">

        <div className="font-semibold text-gray-900 truncate">
          {listing.user?.name || "Продавец"}
        </div>

        {listing.user?.rating && (
          <div className="flex items-center gap-2 mt-1">

            <span className="text-yellow-500">
              ★
            </span>

            <span className="text-sm font-medium text-gray-900">
              {Number(
                listing.user.rating.average || 0
              ).toFixed(1)}
            </span>

            <span className="text-sm text-gray-500">
              ({listing.user.rating.count || 0} отзывов)
            </span>

          </div>
        )}

      </div>

    </div>

    {/* Информация */}
    <div className="mt-2 max-w-xl">

      {/* Тип продавца */}
      <div className="flex items-center gap-6 py-3 border-b border-dashed border-gray-200">

        <span className="w-44 shrink-0 text-sm text-gray-500">
          Тип продавца
        </span>

        <span className="text-sm font-medium text-gray-900">
          {listing.sellerType === "company"
            ? "Компания"
            : "Частное лицо"}
        </span>

      </div>

      {/* Количество объявлений */}
      <div className="flex items-center gap-6 py-3 border-b border-dashed border-gray-200">

        <span className="w-44 shrink-0 text-sm text-gray-500">
          Объявлений на сайте
        </span>

        <span className="text-sm font-medium text-gray-900">
          {listing.sellerListingsCount ?? 0}
        </span>

      </div>

      {/* Телефон */}
      {listing.user?.phone && listing.showPhone !== false && (
        <div className="flex items-center gap-6 py-3">

          <span className="w-44 shrink-0 text-sm text-gray-500">
            Телефон
          </span>

          <a
            href={`tel:${listing.user.phone}`}
            className="
              text-sm
              font-medium
              text-gray-900
              hover:text-blue-600
              transition
            "
          >
            {listing.user.phone}
          </a>

        </div>
      )}

    </div>

    {/* Кнопка объявлений */}
    <div className="mt-5">

      
<Link
  to={`/user/${listing.user?._id}`}
  className="
    inline-flex
    items-center
    justify-center
    px-5
    py-2.5
    rounded-xl
    border
    border-gray-300
    text-sm
    font-medium
    text-gray-900
    hover:bg-gray-50
    hover:border-gray-400
    transition
  "
>
  Все объявления продавца
</Link>



    </div>

  </div>
</div>

    </div>
    </MainLayout>
  );
}