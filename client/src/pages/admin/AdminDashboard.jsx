import { useEffect, useState } from "react";
import { getAdminUsers, getAdminListings } from "../../api/adminApi";
import ListingsTable from "../../components/admin/ListingsTable";
import UsersTable from "../../components/admin/UsersTable";
import MainLayout from "../../layouts/MainLayout";

export default function AdminDashboard() {
  const [tab, setTab] = useState("listings");

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

  return (
    <MainLayout>
    <div className="max-w-7xl mx-auto p-6">

      {/* NAV */}
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

      {/* CONTENT */}
      {tab === "listings" && (
        <ListingsTable
          listings={listings}
          reload={loadData}
        />
      )}

      {tab === "users" && (
        <UsersTable users={users} reload={loadData} />
      )}

    </div>
    </MainLayout>
  );
}