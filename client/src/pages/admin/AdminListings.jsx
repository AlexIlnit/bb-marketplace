import { useEffect, useState } from "react";
import { getAllListings, deleteListing } from "../../api/listingApi";
import AdminImageSlider from "../../components/pages/admin/AdminImageSlider";

export default function AdminListings() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await getAllListings();
    setListings(data);
  };

  const remove = async (id) => {
    await deleteListing(id);
    setListings((prev) => prev.filter((i) => i._id !== id));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Listings
      </h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
  <table className="w-full min-w-250">
    <thead className="bg-gray-100">
      <tr>
        <th className="p-3 text-left">Фото</th>
        <th className="p-3 text-left">Название</th>
        <th className="p-3 text-left">Цена</th>
        <th className="p-3 text-left">Город</th>
        <th className="p-3 text-left">Категория</th>
        <th className="p-3 text-left">Автор</th>
        <th className="p-3 text-left">Фото</th>
        <th className="p-3 text-left">Дата</th>
        <th className="p-3 text-left">Действия</th>
      </tr>
    </thead>

    <tbody>
      {listings.map((l) => (
        <tr
          key={l._id}
          className="border-t hover:bg-gray-50"
        >
          <td className="p-3">
  <div className="flex gap-1 flex-wrap">
    {l.images?.map((img, index) => (
      <img
        key={index}
        src={img}
        alt=""
        className="w-12 h-12 object-cover rounded"
      />
    ))}
  </div>
</td>

          <td className="p-3 font-medium">
            {l.title}
          </td>

          <td className="p-3 text-green-600 font-bold">
            {l.price} ₽
          </td>

          <td className="p-3">
            {l.city || "-"}
          </td>

          <td className="p-3">
            {l.category?.name || "-"}
          </td>

          <td className="p-3">
            {l.user?.name || "-"}
          </td>

          <td className="p-3">
            {l.images?.length || 0}
          </td>

          <td className="p-3 text-sm text-gray-500">
            {new Date(l.createdAt).toLocaleString(
              "ru-RU",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            )}
          </td>

          <td className="p-3">
            <button
              onClick={() => remove(l._id)}
              className="
                bg-red-500
                hover:bg-red-600
                text-white
                px-3
                py-1
                rounded-lg
              "
            >
              Удалить
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
    </div>
  );
}
