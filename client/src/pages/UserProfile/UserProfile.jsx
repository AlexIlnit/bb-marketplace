import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserProfile } from "../../api/userApi";
import ListingCard from "../../components/listing/ListingCard";
import MainLayout from "../../layouts/MainLayout";
import { getSellerRatings } from "../../api/ratingApi";

export default function UserProfile() {

  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [activeTab, setActiveTab] = useState("listings");

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    const { data } =
      await getUserProfile(id);

    setUser(data.user);
    setListings(data.listings);

    const ratingsRes = await getSellerRatings(id);
      setRatings(ratingsRes.data);
  };

  if (!user) {
    return <div>Загрузка...</div>;
  }

  return (
    <MainLayout>

      <div className="max-w-7xl mx-auto p-6">

        <div className="bg-white p-6 rounded-2xl mb-6">

          <div className="flex items-center gap-4">

            <img
              src={
                user.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.name
                )}`
              }
              alt=""
              className="
                w-24
                h-24
                rounded-full
                object-cover
              "
            />

            <div>

              <h1 className="text-3xl font-bold">
                {user.name}
              </h1>
              <div className="flex items-center gap-2 mt-2">

  <span className="text-yellow-500 text-xl">
    ★
  </span>

  <span className="font-semibold">
    {user.rating?.average || 0}
  </span>

  <span className="text-gray-500">
    ({user.rating?.count || 0} отзывов)
  </span>

</div>

              <p className="text-gray-500">
                На сайте с{" "}
                {new Date(
                  user.createdAt
                ).toLocaleDateString("ru-RU")}
              </p>

              <p className="mt-2">
                Объявлений: {listings.length}
              </p>

            </div>

          </div>

        </div>
        <div className="flex gap-3 border-b mb-6">

  <button
    onClick={() => setActiveTab("listings")}
    className={`pb-3 px-4 ${
      activeTab === "listings"
        ? "border-b-2 border-green-600 font-semibold"
        : "text-gray-500"
    }`}
  >
    Объявления
  </button>

  <button
    onClick={() => setActiveTab("ratings")}
    className={`pb-3 px-4 ${
      activeTab === "ratings"
        ? "border-b-2 border-green-600 font-semibold"
        : "text-gray-500"
    }`}
  >
    Отзывы ({ratings.length})
  </button>

</div>

        {activeTab === "listings" && (
  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {listings.map((listing) => (
            <ListingCard
              key={listing._id}
              listing={listing}
            />
          ))}

        </div>
        )}
        {activeTab === "ratings" && (

  <div className="space-y-4">

    {ratings.length === 0 && (
      <div className="text-gray-500">
        Пока нет отзывов
      </div>
    )}

    {ratings.map((rating) => (

      <div
        key={rating._id}
        className="bg-white rounded-2xl p-5 border"
      >

        <div className="flex items-center gap-3">

          <img
            src={
              rating.buyer.avatar ||
              "/default-avatar.png"
            }
            className="w-12 h-12 rounded-full object-cover"
          />

          <div>

            <div className="font-semibold">
              {rating.buyer.name}
            </div>

            <div className="text-yellow-500">
              {"★".repeat(rating.stars)}
              {"☆".repeat(5 - rating.stars)}
            </div>

          </div>

        </div>

        {rating.comment && (

          <div className="mt-4 text-gray-700">
            {rating.comment}
          </div>

        )}

        <div className="mt-3 text-xs text-gray-400">

          {new Date(
            rating.createdAt
          ).toLocaleDateString("ru-RU")}

        </div>

      </div>

    ))}

  </div>

)}

      </div>
      

    </MainLayout>
  );
}