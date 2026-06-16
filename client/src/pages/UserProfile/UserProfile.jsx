import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserProfile } from "../../api/userApi";
import ListingCard from "../../components/listing/ListingCard";
import MainLayout from "../../layouts/MainLayout";

export default function UserProfile() {

  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    const { data } =
      await getUserProfile(id);

    setUser(data.user);
    setListings(data.listings);
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {listings.map((listing) => (
            <ListingCard
              key={listing._id}
              listing={listing}
            />
          ))}

        </div>

      </div>

    </MainLayout>
  );
}