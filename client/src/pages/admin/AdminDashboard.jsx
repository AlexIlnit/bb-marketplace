import { useEffect, useState } from "react";
import { getAdminUsers, getAdminListings } from "../../api/adminApi";
import ListingsTable from "../../components/admin/ListingsTable";
import UsersTable from "../../components/admin/UsersTable";
import MainLayout from "../../layouts/MainLayout";
import AdminSettings from "./AdminSettings";
import AdminChats from "./AdminChats";

export default function AdminDashboard() {
  const [tab, setTab] = useState("listings");
  const [statusTab, setStatusTab] = useState("pending");

  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const usersRes = await getAdminUsers();
    const listingsRes = await getAdminListings();

    setUsers(usersRes.data);
    setListings(listingsRes.data);
  };

  const filteredListings = listings.filter((l) => {
    if (statusTab === "all") return true;
    return l.status === statusTab;
  });

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6">

        {/* TOP NAV */}
<div className="grid grid-cols-2 md:flex gap-3 mb-6">

  <button
    onClick={() => setTab("listings")}
    className={`px-4 py-3 rounded-xl font-medium transition ${
      tab === "listings"
        ? "bg-blue-600 text-white"
        : "bg-white border"
    }`}
  >
    Объявления
  </button>

  <button
    onClick={() => setTab("users")}
    className={`px-4 py-3 rounded-xl font-medium transition ${
      tab === "users"
        ? "bg-blue-600 text-white"
        : "bg-white border"
    }`}
  >
    Пользователи
  </button>

  <button
    onClick={() => setTab("chats")}
    className={`px-4 py-3 rounded-xl font-medium transition ${
      tab === "chats"
        ? "bg-blue-600 text-white"
        : "bg-white border"
    }`}
  >
    Чаты
  </button>

  <button
    onClick={() => setTab("settings")}
    className={`px-4 py-3 rounded-xl font-medium transition ${
      tab === "settings"
        ? "bg-blue-600 text-white"
        : "bg-white border"
    }`}
  >
    Настройки
  </button>

</div>

        {/* LISTINGS SECTION */}
        {tab === "listings" && (
          <>
            {/* STATUS FILTER */}
            <div className="grid grid-cols-2 md:flex gap-3 mb-6">
              <button
                onClick={() => setStatusTab("pending")}
                className={`px-3 py-1 rounded-xl ${
                  statusTab === "pending"
                    ? "bg-yellow-500 text-white"
                    : "bg-white"
                }`}
              >
                На модерации
              </button>

              <button
                onClick={() => setStatusTab("approved")}
                className={`px-3 py-1 rounded-xl ${
                  statusTab === "approved"
                    ? "bg-green-600 text-white"
                    : "bg-white"
                }`}
              >
                Одобренные
              </button>

              <button
                onClick={() => setStatusTab("rejected")}
                className={`px-3 py-1 rounded-xl ${
                  statusTab === "rejected"
                    ? "bg-red-600 text-white"
                    : "bg-white"
                }`}
              >
                Отклонённые
              </button>

              <button
                onClick={() => setStatusTab("all")}
                className="px-3 py-1 rounded-xl bg-gray-100"
              >
                Все
              </button>
            </div>

            {/* TABLE */}
            <ListingsTable
              listings={filteredListings}
              reload={loadData}
            />
          </>
        )}

        {/* USERS */}
        {tab === "users" && (
          <UsersTable users={users} setUsers={setUsers} reload={loadData} />
        )}

        {tab === "settings" && (
  <AdminSettings />
)}
{tab === "chats" && (
  <AdminChats />
)}
      </div>
    </MainLayout>
  );
}