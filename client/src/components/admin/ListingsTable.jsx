import {
  approveListing,
  rejectListing,
  deleteListing,
} from "../../api/adminApi";

export default function ListingsTable({
  listings,
  reload,
}) {
  return (
    <div className="space-y-4">

      {listings.map((l) => (
        <div
          key={l._id}
          className="
            bg-white
            rounded-2xl
            shadow-sm
            p-4
            flex
            flex-col
            lg:flex-row
            gap-4
          "
        >
          {/* PHOTO */}
          <div className="shrink-0">
            <img
              src={
                l.images?.[0] ||
                "https://via.placeholder.com/160x120?text=No+Photo"
              }
              alt={l.title}
              className="
                w-full
                lg:w-40
                h-40
                object-cover
                rounded-xl
                bg-gray-100
              "
            />
          </div>

          {/* INFO */}
          <div className="flex-1">
            <h3 className="font-bold text-lg">
              {l.title}
            </h3>

            <p className="text-green-600 font-semibold text-xl">
              {l.price} BYN
            </p>

            <div className="mt-2 text-sm text-gray-600 space-y-1">
              <p>
                <strong>Статус:</strong>{" "}
                {l.status}
              </p>

              <p>
                <strong>Город:</strong>{" "}
                {l.city || "Не указан"}
              </p>

              <p>
                <strong>Категория:</strong>{" "}
                {l.category?.name || "-"}
              </p>

              <p>
                <strong>Автор:</strong>{" "}
                {l.user?.name || "-"}
              </p>

              <p>
                <strong>Телефон:</strong>{" "}
                {l.phone || "-"}
              </p>

              <p>
                <strong>Фото:</strong>{" "}
                {l.images?.length || 0}
              </p>

              <p>
                <strong>Дата:</strong>{" "}
                {new Date(
                  l.createdAt
                ).toLocaleString("ru-RU")}
              </p>
            </div>

            {l.description && (
              <div className="mt-3">
                <p className="text-sm text-gray-700 line-clamp-3">
                  {l.description}
                </p>
              </div>
            )}
          </div>

          {/* ACTIONS */}
          <div
            className="
              flex
              lg:flex-col
              gap-2
              lg:min-w-[140px]
            "
          >
            <button
              onClick={async () => {
                await approveListing(l._id);
                reload();
              }}
              className="
                bg-green-600
                hover:bg-green-700
                text-white
                px-4
                py-2
                rounded-xl
              "
            >
              Одобрить
            </button>

            <button
              onClick={async () => {
                await rejectListing(l._id);
                reload();
              }}
              className="
                bg-yellow-500
                hover:bg-yellow-600
                text-white
                px-4
                py-2
                rounded-xl
              "
            >
              Отклонить
            </button>

            <button
              onClick={async () => {
                if (
                  !window.confirm(
                    "Удалить объявление?"
                  )
                )
                  return;

                await deleteListing(l._id);
                reload();
              }}
              className="
                bg-red-600
                hover:bg-red-700
                text-white
                px-4
                py-2
                rounded-xl
              "
            >
              Удалить
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}