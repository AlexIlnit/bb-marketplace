import { useEffect, useState } from "react";
import { getMyListings } from "../../api/userApi";
import { useAuthStore } from "../../store/authStore";
import ListingCard from "../../components/listing/ListingCard";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { updateListing, deleteListing } from "../../api/listingApi";
import { useCategoryStore } from "../../store/categoryStore";
import { uploadImage } from "../../api/uploadApi";
import { getMe } from "../../api/userApi";

export default function Profile() {
  const user = useAuthStore((s) => s.user);

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const { categories, fetchCategories } = useCategoryStore();
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
  title: "",
  price: "",
  city: "",
  description: "",
    });
const setUser = useAuthStore((s) => s.setUser);

const refreshUser = async () => {
  try {
    const { data } = await getMe();
    setUser(data, localStorage.getItem("token"));
  } catch (err) {
    console.log("GET ME ERROR", err);
  }
  }

 const openEditModal = (listing) => {
  setEditItem(listing);

  setForm({
    title: listing.title || "",
    price: listing.price || "",
    city: listing.city || "",
    description: listing.description || "",
    category: listing.category || "",
  });

  setImageUrl(listing.images?.[0] || "");
};
const handleUpload = async () => {
  if (!imageFile) return;

  setUploading(true);

  try {
    const { data } = await uploadImage(imageFile);
    setImageUrl(data.url);
  } catch (err) {
    console.error(err);
  } finally {
    setUploading(false);
  }
};

  useEffect(() => {
    loadListings();
    fetchCategories();
    refreshUser();
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
const handleUpdate = async () => {
  try {
    await updateListing(editItem._id, {
      ...form,
      price: Number(form.price),
      images: imageUrl ? [imageUrl] : [],
      status: "pending" // ← ВАЖНО
    });

    setListings((prev) =>
      prev.map((item) =>
        item._id === editItem._id
          ? {
              ...item,
              ...form,
              status: "pending",
              images: imageUrl ? [imageUrl] : item.images
            }
          : item
      )
    );

    setEditItem(null);
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

{user?.isBlocked && (
  <div
    className="
      mt-4
      bg-red-50
      border
      border-red-200
      text-red-700
      rounded-xl
      p-4
    "
  >
    <div className="font-semibold">
      🚫 Ваш аккаунт заблокирован
    </div>

    <div className="text-sm mt-1">
      Размещение и редактирование объявлений недоступно.
      Обратитесь к администрации.
    </div>
  </div>
)}

{!user?.isBlocked && (
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
)}

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
                <div className="mt-2">

  {listing.status === "pending" && (
    <div className="bg-yellow-100 text-yellow-700 px-3 py-2 rounded-lg text-sm">
      ⏳ Объявление находится на модерации
    </div>
  )}

  {listing.status === "approved" && (
    <div className="bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm">
      ✅ Объявление опубликовано
    </div>
  )}

  {listing.status === "rejected" && (
    <div className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm">
      ❌ Объявление отклонено модератором
    </div>
  )}

</div>

                {/* ACTIONS */}
                <div className="flex flex-wrap gap-2 mt-2 w-full">

  {!user?.isBlocked && (
    <button
    onClick={() => setDeleteItem(listing)}
    className="bg-red-500 text-white px-2 py-1 text-xs rounded"
  >
    Удалить
  </button>
  )}

  {!user?.isBlocked ? (
  listing.status === "rejected" ? (
    <button
      onClick={() => openEditModal(listing)}
      className="bg-orange-500 text-white px-2 py-1 text-xs rounded"
    >
      Исправить
    </button>
  ) : (
    <button
      onClick={() => openEditModal(listing)}
      className="bg-blue-500 text-white px-2 py-1 text-xs rounded"
    >
      Редактировать
    </button>
  )
) : (
  <button
    disabled
    className="bg-gray-300 text-gray-600 px-2 py-1 text-xs rounded cursor-not-allowed"
    title="Аккаунт заблокирован"
  >
    Редактирование недоступно
  </button>
)}

</div>

              </div>
            ))}
          </div>
        )}


    </div>
    {editItem && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl w-[420px] max-h-[90vh] overflow-auto">

      <h2 className="text-xl font-bold mb-4">
        Редактировать объявление
      </h2>

      <input
        className="w-full border p-2 mb-2 rounded"
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
        placeholder="Название"
      />

      <textarea
        className="w-full border p-2 mb-2 rounded"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
        placeholder="Описание"
      />

      <input
        className="w-full border p-2 mb-2 rounded"
        value={form.price}
        onChange={(e) =>
          setForm({ ...form, price: e.target.value })
        }
        placeholder="Цена"
      />

      <input
        className="w-full border p-2 mb-2 rounded"
        value={form.city}
        onChange={(e) =>
          setForm({ ...form, city: e.target.value })
        }
        placeholder="Город"
      />

      {/* CATEGORY */}
      <select
        className="w-full border p-2 mb-2 rounded"
        value={form.category}
        onChange={(e) =>
          setForm({ ...form, category: e.target.value })
        }
      >
        <option value="">Выберите категорию</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* IMAGE UPLOAD */}
      <div className="border p-3 rounded mb-3">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        <button
          type="button"
          onClick={handleUpload}
          className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
        >
          {uploading ? "Загрузка..." : "Загрузить фото"}
        </button>

        {imageUrl && (
          <img
            src={imageUrl}
            className="mt-3 w-full h-40 object-cover rounded"
          />
        )}
      </div>

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