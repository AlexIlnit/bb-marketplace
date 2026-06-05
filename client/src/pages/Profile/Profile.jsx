import { useEffect, useState } from "react";
import { getMyListings } from "../../api/userApi";
import { useAuthStore } from "../../store/authStore";
import ListingCard from "../../components/listing/ListingCard";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";

export default function Profile() {
  const user = useAuthStore((s) => s.user);

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const { data } = await getMyListings();
      setListings(data);
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

  return (
    <MainLayout>
    <div className="max-w-7xl mx-auto p-6">

      <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">

        <h1 className="text-3xl font-bold">
          Профиль
        </h1>

        <div className="mt-4">
          <p>
            <strong>Имя:</strong> {user?.name}
          </p>

          <p>
            <strong>Email:</strong> {user?.email}
          </p>
        </div>

        <Link
          to="/create-listing"
          className="
            inline-block
            mt-4
            bg-green-600
            text-white
            px-5
            py-3
            rounded-xl
          "
        >
          Создать объявление
        </Link>

      </div>

      <h2 className="text-2xl font-bold mb-6">
        Мои объявления
      </h2>

      {listings.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl">
          У вас пока нет объявлений
        </div>
      ) : (
        <div
          className="
            grid
            md:grid-cols-2
            lg:grid-cols-4
            gap-6
          "
        >
          {listings.map((listing) => (
            <ListingCard
              key={listing._id}
              listing={listing}
            />
          ))}
        </div>
      )}

    </div>
    </MainLayout>
  );
}