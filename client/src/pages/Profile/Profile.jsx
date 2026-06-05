import { useEffect, useState } from "react";
import { getMyListings } from "../../api/userApi";
import { useAuthStore } from "../../store/authStore";
import ListingCard from "../../components/listing/ListingCard";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { updateListing, deleteListing } from "../../api/listingApi";

export default function Profile() {
  const user = useAuthStore((s) => s.user);

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [form, setForm] = useState({
  title: "",
  price: "",
  city: "",
  description: "",
    });

  const openEditModal = (listing) => {
  setEditItem(listing);
  setForm({
    title: listing.title || "",
    price: listing.price || "",
    city: listing.city || "",
    description: listing.description || "",
  });
};
const handleUpdate = async () => {
  try {
    await updateListing(editItem._id, form);

    setListings((prev) =>
      prev.map((item) =>
        item._id === editItem._id
          ? { ...item, ...form }
          : item
      )
    );

    setEditItem(null);
  } catch (err) {
    console.error(err);
  }
};

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
const handleDelete = async (id) => {
  setDeleteItem(null); // закрыли сразу

  try {
    await deleteListing(id);

    setListings((prev) =>
      prev.filter((item) => item._id !== id)
    );
  } catch (err) {
    console.error(err);
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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <div key={listing._id} className="relative">

                <ListingCard listing={listing} />

                {/* ACTIONS */}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setDeleteItem(listing)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Удалить
                  </button>

                  <button
  onClick={() => openEditModal(listing)}
  className="bg-blue-500 text-white px-3 py-1 rounded"
>
  Редактировать
</button>
                </div>

              </div>
            ))}
          </div>
        )}


    </div>
    {editItem && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-xl w-[400px]">

      <h2 className="text-xl font-bold mb-4">
        Редактировать объявление
      </h2>

      <input
        className="w-full border p-2 mb-2"
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
        placeholder="Название"
      />

      <input
        className="w-full border p-2 mb-2"
        value={form.price}
        onChange={(e) =>
          setForm({ ...form, price: e.target.value })
        }
        placeholder="Цена"
      />

      <input
        className="w-full border p-2 mb-2"
        value={form.city}
        onChange={(e) =>
          setForm({ ...form, city: e.target.value })
        }
        placeholder="Город"
      />

      <textarea
        className="w-full border p-2 mb-2"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
        placeholder="Описание"
      />

      <div className="flex justify-end gap-2 mt-4">

        <button
          onClick={() => setEditItem(null)}
          className="px-3 py-1"
        >
          Отмена
        </button>

        <button
          onClick={handleUpdate}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Сохранить
        </button>

      </div>

    </div>
  </div>
)}
{deleteItem && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="bg-white p-6 rounded-xl w-[360px]">

      <h2 className="text-xl font-bold mb-2">
        Удалить объявление?
      </h2>

      <p className="text-gray-600 mb-4">
        "{deleteItem.title}" будет удалено без возможности восстановления.
      </p>

      <div className="flex justify-end gap-2">

        <button
          onClick={() => setDeleteItem(null)}
          className="px-3 py-1"
        >
          Отмена
        </button>

        <button
          onClick={() => handleDelete(deleteItem._id)}
          className="bg-red-600 text-white px-3 py-1 rounded"
        >
          Удалить
        </button>

      </div>

    </div>

  </div>
)}
    </MainLayout>
    
  );
}