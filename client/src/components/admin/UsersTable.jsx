import { deleteUser } from "../../api/adminApi";
import { toggleUserBlock } from "../../api/adminApi";
import { useState } from "react";
import { toggleAdmin } from "../../api/adminApi";

export default function UsersTable({ users, reload, setUsers}) {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);


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
const handleToggleBlock = async (id) => {
  const res = await toggleUserBlock(id);

  setUsers((prev) =>
    prev.map((u) =>
      u._id === id ? res.data : u
    )
  );
};

const handleToggleAdmin = async (id) => {
  const res = await toggleAdmin(id);

  setUsers((prev) =>
    prev.map((u) =>
      u._id === id ? res.data : u
    )
  );

  if (selectedUser?._id === id) {
    setSelectedUser(res.data);
  }
};

  return (
    <div className="space-y-6">

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
          <div className="text-2xl font-bold text-blue-600">
            {filteredUsers.length}
          </div>
        </div>

      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <input
          type="text"
          name="search"
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
            focus:border-blue-500
          "
        />
      </div>

      <div
        className="
          grid
          grid-cols-2
          sm:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
          gap-4
        "
      >
        {filteredUsers.map((u) => (
          <div
            key={u._id}
            onClick={() => setSelectedUser(u)}
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
    overflow-hidden
    bg-gray-100
    flex
    items-center
    justify-center
  "
>
  {u.avatar ? (
    <img
      src={u.avatar}
      alt={u.name}
      className="w-full h-full object-cover"
    />
  ) : (
    <span className="font-bold text-green-700">
      {u.name?.charAt(0)?.toUpperCase()}
    </span>
  )}
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
  <span
    className={`px-2 py-1 rounded-full text-xs ${
      u.isBlocked
        ? "bg-red-100 text-red-700"
        : "bg-green-100 text-green-700"
    }`}
  >
    {u.isBlocked
      ? "Заблокирован"
      : "Активен"}
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
              <div>
  <strong>Объявления:</strong>{" "}
  <span className="font-semibold text-green-600">
    {u.listingsCount || 0}
  </span>
</div>

            </div>
<div className="mt-4 space-y-2">
            <button
 onClick={(e) => {
  e.stopPropagation();
  handleToggleBlock(u._id);
}}
  className={`
    mt-4
    w-full
    py-2
    rounded-xl
    text-white
    ${u.isBlocked
      ? "bg-green-600 hover:bg-green-700"
      : "bg-red-600 hover:bg-red-700"}
  `}
>
  {u.isBlocked ? "Разблокировать" : "Заблокировать"}
</button>
<button
  onClick={async (e) => {
    e.stopPropagation();

    const ok = window.confirm(
      `Удалить пользователя ${u.name}? Это действие нельзя отменить.`
    );

    if (!ok) return;

    await deleteUser(u._id);
    reload();
  }}
  className="
    w-full py-2 rounded-xl
    bg-gray-900 hover:bg-black
    text-white
  "
>
  Удалить
</button>
<button
  onClick={(e) => {
    e.stopPropagation();
    handleToggleAdmin(u._id);
  }}
  className={`w-full py-2 rounded-xl text-white ${
    u.role === "admin"
      ? "bg-orange-500 hover:bg-orange-600"
      : "bg-indigo-600 hover:bg-indigo-700"
  }`}
>
  {u.role === "admin"
    ? "Снять admin"
    : "Назначить admin"}
</button>
</div>
          </div>
        ))}
      </div>

{selectedUser && (
  <div
    className="
      fixed
      inset-0
      bg-black/50
      z-50
      flex
      items-center
      justify-center
    "
    onClick={() => setSelectedUser(null)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="
        bg-white
        rounded-2xl
        p-6
        w-full
        max-w-md
      "
    >
      <h2 className="text-xl font-bold mb-4 text-center">
        Профиль пользователя
      </h2>
      <div className="flex justify-center mb-4">
  {selectedUser.avatar ? (
    <img
      src={selectedUser.avatar}
      alt={selectedUser.name}
      className="
        w-24
        h-24
        rounded-full
        object-cover
        border
      "
    />
  ) : (
    <div
      className="
        w-24
        h-24
        rounded-full
        bg-green-100
        flex
        items-center
        justify-center
        text-3xl
        font-bold
        text-green-700
      "
    >
      {selectedUser.name?.charAt(0)?.toUpperCase()}
    </div>
  )}
</div>

      <div className="space-y-3">

        <p>
          <strong>Имя:</strong>{" "}
          {selectedUser.name}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {selectedUser.email}
        </p>

        <p>
          <strong>Роль:</strong>{" "}
          {selectedUser.role}
        </p>

        <p>
          <strong>ID:</strong>{" "}
          {selectedUser._id}
        </p>
        <p>
  <strong>Объявления:</strong>{" "}
  <span className="font-semibold text-green-600">
    {selectedUser.listingsCount || 0}
  </span>
</p>

        <p>
  <strong>Статус:</strong>{" "}
  <span
    className={
      selectedUser.isBlocked
        ? "text-red-600 font-semibold"
        : "text-green-600 font-semibold"
    }
  >
    {selectedUser.isBlocked ? "Заблокирован" : "Активен"}
  </span>
</p>

        <p>
          <strong>Регистрация:</strong>{" "}
          {selectedUser.createdAt
            ? new Date(
                selectedUser.createdAt
              ).toLocaleString("ru-RU")
            : "-"}
        </p>

      </div>

      <button
        onClick={() => setSelectedUser(null)}
        className="
          mt-6
          w-full
          bg-gray-200
          py-2
          rounded-xl
        "
      >
        Закрыть
      </button>
    </div>
  </div>
)}
    </div>
  );
}