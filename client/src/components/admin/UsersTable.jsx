import { deleteUser } from "../../api/adminApi";
import { useState } from "react";

export default function UsersTable({ users, reload }) {
  const [search, setSearch] = useState("");
  const admins = users.filter(
  (u) => u.role === "admin"
).length;

const regularUsers = users.filter(
  (u) => u.role !== "admin"
).length;

const filteredUsers = users.filter((u) =>
  [u.name, u.email]
    .join(" ")
    .toLowerCase()
    .includes(search.toLowerCase())
);

  return (
  <div className="space-y-6">

    {/* STATS */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

  <div className="bg-white rounded-xl p-4 shadow-sm">
    <div className="text-gray-500 text-sm">
      Всего пользователей
    </div>
    <div className="text-2xl font-bold">
      {users.length}
    </div>
  </div>

  <div className="bg-white rounded-xl p-4 shadow-sm">
    <div className="text-gray-500 text-sm">
      Администраторов
    </div>
    <div className="text-2xl font-bold text-red-600">
      {admins}
    </div>
  </div>

  <div className="bg-white rounded-xl p-4 shadow-sm">
    <div className="text-gray-500 text-sm">
      Обычных пользователей
    </div>
    <div className="text-2xl font-bold text-blue-600">
      {regularUsers}
    </div>
  </div>

  <div className="bg-white rounded-xl p-4 shadow-sm">
    <div className="text-gray-500 text-sm">
      Найдено по поиску
    </div>
    <div className="text-2xl font-bold text-green-600">
      {filteredUsers.length}
    </div>
  </div>

</div>

    {/* SEARCH */}
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <input
        type="text"
        placeholder="Поиск по имени или email..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="
          w-full
          border
          rounded-xl
          p-3
          outline-none
          focus:border-green-500
        "
      />
    </div>

    {/* USERS */}
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
      {filteredUsers.map((u) => (
        <div
          key={u._id}
          className="
            bg-white
            rounded-xl
            shadow-sm
            border
            p-4
            hover:shadow-md
            transition
          "
        >
          <div className="flex items-center gap-3 mb-4">

            <div
              className="
                w-12
                h-12
                rounded-full
                bg-green-100
                flex
                items-center
                justify-center
                font-bold
                text-green-700
              "
            >
              {u.name?.charAt(0)?.toUpperCase()}
            </div>

            <div className="min-w-0">
              <div className="font-semibold truncate">
                {u.name}
              </div>

              <div className="text-xs text-gray-500 truncate">
                {u.email}
              </div>
            </div>

          </div>

          <div className="space-y-2 text-sm">

            <div>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  u.role === "admin"
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {u.role}
              </span>
            </div>

            <div>
              <strong>ID:</strong>{" "}
              {u._id.slice(-8)}
            </div>

            <div>
              <strong>Дата:</strong>{" "}
              {u.createdAt
                ? new Date(
                    u.createdAt
                  ).toLocaleDateString("ru-RU")
                : "-"}
            </div>

          </div>

          <button
            onClick={async () => {
              if (
                !window.confirm(
                  `Удалить ${u.name}?`
                )
              )
                return;

              await deleteUser(u._id);
              reload();
            }}
            className="
              mt-4
              w-full
              bg-red-600
              hover:bg-red-700
              text-white
              py-2
              rounded-xl
            "
          >
            Удалить
          </button>
        </div>
      ))}
    </div>

  </div>
);
}