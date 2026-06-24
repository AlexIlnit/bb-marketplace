import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import AdminRoute from "./AdminRoute";

// 🔥 КРИТИЧЕСКИЙ ФИКС ДЛЯ СКОРОСТИ LCP:
// Главные страницы импортируем СИНХРОННО. Браузер отобразит их контент и картинки мгновенно!
import Home from "../pages/Home/Home";
import Listing from "../pages/Listing/Listing";
import Messages from "../pages/Chat/Messages";

// 💤 ЛЕНИВЫЕ СТРАНИЦЫ (оставляем lazy, они не влияют на первую загрузку сайта):
const Login = lazy(() => import("../pages/Login/Login"));
const Register = lazy(() => import("../pages/Register/Register"));
const CreateListing = lazy(() => import("../pages/CreateListing/CreateListing"));
const Profile = lazy(() => import("../pages/Profile/Profile"));
const Favorites = lazy(() => import("../pages/Favorites/Favorites"));
const UserProfile = lazy(() => import("../pages/UserProfile/UserProfile"));
const ChatList = lazy(() => import("../pages/Chat/ChatList"));
const ChatRoom = lazy(() => import("../pages/Chat/ChatRoom"));
const ChatPage = lazy(() => import("../pages/Chat/ChatPage"));

// Админка (lazy — идеальное решение для тяжелых панелей управления)
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const AdminListings = lazy(() => import("../pages/admin/AdminListings"));
const AdminUsers = lazy(() => import("../pages/admin/AdminUsers"));

export default function AppRouter() {
  return (
    // Заменим скучный Loading... на аккуратный визуальный индикатор (опционально)
    <Suspense fallback={<div className="p-6 text-gray-500 animate-pulse">Загрузка...</div>}>
      <Routes>
        {/* Прямой рендеринг без ожидания ленивых чанков */}
        <Route path="/" element={<Home />} />
        <Route path="/listing/:id" element={<Listing />} />
        
        <Route path="/user/:id" element={<UserProfile />}/>

        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />

        <Route
          path="/create-listing"
          element={
            <ProtectedRoute>
              <CreateListing />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />

        <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="/chat/:id" element={<ProtectedRoute><ChatRoom /></ProtectedRoute>} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/listings"
          element={
            <AdminRoute>
              <AdminListings />
            </AdminRoute>
          }
        />

        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}
