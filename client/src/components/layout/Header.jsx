import {
  Heart,
  User,
  Menu,
  Search,
  LogOut
} from "lucide-react";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MobileMenu from "./MobileMenu";
import { useAuthStore } from "../../store/authStore";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <header className="w-full bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-8">
            <Link to="/">
            <h2 className="text-green-600 font-bold text-2xl">
              BB
            </h2>
            </Link>
            <div className="hidden md:flex items-center bg-gray-100 px-4 rounded-xl w-[450px]">
              <Search size={18} />
              <input
                placeholder="Поиск товаров"
                className="bg-transparent p-3 w-full outline-none"
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="hidden md:flex items-center gap-6">

            <Link to="/favorites">
              <Heart className="cursor-pointer" />
            </Link>

            {/* AUTH BLOCK */}
            {!user ? (
              <Link to="/login">
                <div className="flex items-center gap-2 cursor-pointer">
                  <User />
                  <span>Войти</span>
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-4">

    <Link
      to={user?.role === "admin" ? "/admin" : "/profile"}
      className="
        flex
        items-center
        gap-2
        hover:text-green-600
      "
    >
      <User size={20} />
      <span>{user.name}</span>
    </Link>

    <LogOut
      className="cursor-pointer text-red-500"
      onClick={handleLogout}
    />
  </div>
)}

            {/* BUTTON */}
            {user && (
              <Link to="/create-listing">
                <button className="bg-green-600 text-white px-4 py-2 rounded-xl">
                  Подать объявление
                </button>
              </Link>
            )}

          </div>

          {/* MOBILE MENU */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden"
          >
            <Menu />
          </button>
        </div>
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}