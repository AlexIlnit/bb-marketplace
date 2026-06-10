import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Listing from "../pages/Listing/Listing";
import CreateListing from "../pages/CreateListing/CreateListing";
import Profile from "../pages/Profile/Profile";

import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import Favorites from "../pages/Favorites/Favorites";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminListings from "../pages/admin/AdminListings";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminRoute from "./AdminRoute";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/listing/:id" element={<Listing />} />
      <Route path="/create-listing" element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>}/>
      <Route path="/admin/listings" element={<AdminRoute><AdminListings /></AdminRoute>}/>
      <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>}/>
    </Routes>
  );
}