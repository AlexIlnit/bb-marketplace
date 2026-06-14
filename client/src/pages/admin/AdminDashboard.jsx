import { useEffect, useState } from "react";
import { getAdminUsers, getAdminListings } from "../../api/adminApi";
import ListingsTable from "../../components/admin/ListingsTable";
import UsersTable from "../../components/admin/UsersTable";
import MainLayout from "../../layouts/MainLayout";

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
      <div className="max-w-7xl mx-auto p-6">

        {/* TOP NAV */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setTab("listings")}
            className={`px-4 py-2 rounded-xl ${
              tab === "listings" ? "bg-green-600 text-white" : "bg-white"
            }`}
          >
            Объявления
          </button>

          <button
            onClick={() => setTab("users")}
            className={`px-4 py-2 rounded-xl ${
              tab === "users" ? "bg-green-600 text-white" : "bg-white"
            }`}
          >
            Пользователи
          </button>
        </div>

        {/* LISTINGS SECTION */}
        {tab === "listings" && (
          <>
            {/* STATUS FILTER */}
            <div className="flex gap-3 mb-6">
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
      </div>
    </MainLayout>
  );
}