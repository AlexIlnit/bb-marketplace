import {
  X,
  Heart,
  User,
  LogOut,
  PlusCircle,
  Shield
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function MobileMenu({ open, onClose, user }) {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  if (!open) return null;

  const handleLogout = () => {
    logout?.();
    onClose();
    navigate("/");
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50">
      <div className="bg-white w-72 h-full p-4">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">Меню</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <nav className="flex flex-col gap-3">

          {/* HOME */}
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-2"
          >
            🏠 Главная
          </Link>

          {/* FAVORITES */}
          <Link
            to="/favorites"
            onClick={onClose}
            className="flex items-center gap-2"
          >
            <Heart size={18} />
            Избранное
          </Link>

          {/* CREATE LISTING (как desktop) */}
          {user && (
            <Link
              to="/create-listing"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <PlusCircle size={18} />
              Подать объявление
            </Link>
          )}

          {/* ADMIN */}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <Shield size={18} />
              Админ панель
            </Link>
          )}

          {/* AUTH SECTION (как desktop) */}
          {user ? (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">

              <Link
                to="/profile"
                onClick={onClose}
                className="flex items-center gap-2"
              >
                <User size={18} />
                {user.name}
              </Link>

              <button
                onClick={handleLogout}
                className="text-red-500"
              >
                <LogOut size={18} />
              </button>

            </div>
          ) : (
            <Link
              to="/login"
              onClick={onClose}
              className="flex items-center gap-2 mt-4 pt-4 border-t"
            >
              <User size={18} />
              Войти
            </Link>
          )}

        </nav>
      </div>
    </div>
  );
}