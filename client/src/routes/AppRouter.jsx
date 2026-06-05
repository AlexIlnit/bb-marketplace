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

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/listing/:id" element={<GuestRoute><Listing /></GuestRoute>} />
      <Route path="/create-listing" element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
    </Routes>
  );
}