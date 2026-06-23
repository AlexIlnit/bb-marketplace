import {
  approveListing,
  rejectListing,
  deleteListing,
} from "../../api/adminApi";
import  AdminImageSlider from "./AdminImageSlider";

export default function ListingsTable({
  listings,
  reload,
}) {
  if (!listings.length) {
    return (
      <div className="bg-white rounded-xl p-4 text-gray-500">
        Нет объявлений
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
            Одобрено
          </span>
        );

      case "rejected":
        return (
          <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
            Отклонено
          </span>
        );

      default:
        return (
          <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
            Модерация
          </span>
        );
    }
  };

  return (
    <div
      className="
        grid
    grid-cols-1
    sm:grid-cols-2
    lg:grid-cols-3
    xl:grid-cols-4
    gap-4
      "
    >
      {listings.map((l) => (
        <div
          key={l._id}
          className="
            bg-white
            rounded-xl
            shadow-sm
            overflow-hidden
            border
          "
        >
          {/* Фото */}
          <div className="relative">
  <div className="h-40">
    <AdminImageSlider images={l.images} />
  </div>

  <div className="absolute top-2 right-2">
    {getStatusBadge(l.status)}
  </div>
</div>

          {/* Контент */}
          <div className="p-3">
            <h3 className="font-semibold text-sm line-clamp-1">
              {l.title}
            </h3>

            <p className="text-green-600 font-bold text-lg">
              {l.price} BYN
            </p>

            <div className="mt-2 text-xs text-gray-600 space-y-1">
              <p>📍 {l.city || "Не указан"}</p>

              <p>
                👤 {l.user?.name || "Неизвестно"}
              </p>

              <p>
                🖼 {l.images?.length || 0} фото
              </p>

              <p>
                📅{" "}
                {new Date(
                  l.createdAt
                ).toLocaleDateString("ru-RU")}
              </p>
            </div>

            {l.description && (
              <p className="mt-2 text-xs text-gray-500 line-clamp-2">
                {l.description}
              </p>
            )}

            {/* Кнопки */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              <button
                onClick={async () => {
                  await approveListing(l._id);
                  reload();
                }}
                className="
                  bg-green-600
                  text-white
                  text-xs
                  py-2
                  rounded-lg
                "
              >
                ✓
              </button>

              <button
                onClick={async () => {
                  await rejectListing(l._id);
                  reload();
                }}
                className="
                  bg-yellow-500
                  text-white
                  text-xs
                  py-2
                  rounded-lg
                "
              >
                ✕
              </button>

              <button
                onClick={async () => {
                  if (!window.confirm("Удалить?"))
                    return;

                  await deleteListing(l._id);
                  reload();
                }}
                className="
                  bg-red-600
                  text-white
                  text-xs
                  py-2
                  rounded-lg
                "
              >
                🗑
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}