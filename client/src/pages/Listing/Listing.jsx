import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getListingById } from "../../api/listingApi";
import MainLayout from "../../layouts/MainLayout";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

import SEO from "../../components/seo/Seo";

export default function Listing() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

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
       <div className="aspect-3/2 relative overflow-hidden">
  <img
    src={images[currentImage]}
    alt={listing.title}
    className="absolute inset-0 w-full h-full object-cover"
  />

  {images.length > 1 && (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setCurrentImage((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
          );
        }}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full px-2 py-1"
      >
        ‹
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setCurrentImage((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
          );
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full px-2 py-1"
      >
        ›
      </button>
    </>
  )}
  {images.length > 1 && (
  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
    {images.map((_, index) => (
      <div
        key={index}
        className={`w-2 h-2 rounded-full ${
          currentImage === index
            ? "bg-white"
            : "bg-white/50"
        }`}
      />
    ))}
  </div>
)}
</div>

        {/* Информация */}
        <div>

          <h1 className="text-3xl font-bold mb-4">
            {listing.title}
          </h1>

          <p className="text-4xl font-bold text-green-600 mb-6">
            {listing.price} BYN
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

         <button
  onClick={async () => {
    try {
      const { data } = await api.post("/chat/conversation", {
  userId: listing.user._id,
  listingId: listing._id,
});

      navigate(`/chat/${data._id}`);
    } catch (err) {
      console.error(err);
    }
  }}
  className="
    mt-8
    w-full
    bg-blue-600
    text-white
    py-3
    rounded-xl
    font-semibold
  "
>
  Написать продавцу
</button>
{listing.user?.phone && (
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
    📞 Позвонить: {listing.user.phone}
  </a>
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

      <div className="font-semibold text-lg">
        {listing.user?.name}
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
      <div className="mt-10 bg-white p-6 rounded-2xl border">

        <h2 className="text-2xl font-bold mb-4">
          Описание
        </h2>

        <p className="leading-7 text-gray-700">
          {listing.description}
        </p>

      </div>
            {/* Характеристики */}
      <div className="mt-10 bg-white p-6 rounded-2xl border">

        <h2 className="text-2xl font-bold mb-4">
         Характеристики
        </h2>

        <p className="leading-7 text-gray-700">
          
        </p>

      </div>
      {/* О продавце */}
      <div className="mt-10 bg-white p-6 rounded-2xl border">

        <h2 className="text-2xl font-bold mb-4">
         О продавце 
        </h2>

        <p className="leading-7 text-gray-700">
          
        </p>

      </div>

    </div>
    </MainLayout>
  );
}