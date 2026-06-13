import {
  Heart,
  User,
  Menu,
  Search,
  LogOut
} from "lucide-react";

import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MobileMenu from "./MobileMenu";
import { useAuthStore } from "../../store/authStore";
import { useNotificationStore } from "../../store/notificationStore.js";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);

  const navigate = useNavigate();
  const { notifications, fetchNotifications, markAsRead  } =
    useNotificationStore();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const dropdownRef = useRef();

  // FETCH NOTIFICATIONS
  useEffect(() => {
    if (!user) return;

    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, [user]);


  // CLOSE ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpenNotif(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const soundRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  
  const prevIdsRef = useRef(new Set());
  const firstLoadRef = useRef(true);

useEffect(() => {
  soundRef.current = new Audio("/sounds/notification.mp3");
  soundRef.current.volume = 0.5;
  const unlock = () => {
    setSoundEnabled(true);
    document.removeEventListener("click", unlock);
  };

  document.addEventListener("click", unlock);

  return () => {
    document.removeEventListener("click", unlock);
  };
}, []);

useEffect(() => {
  if (!soundEnabled) return;

  const currentIds = new Set(
  (notifications || []).map(n => n._id)
);

  // первый запрос после входа
  if (firstLoadRef.current) {
    prevIdsRef.current = currentIds;
    firstLoadRef.current = false;
    return;
  }

  const hasNewNotification = (notifications || []).some(
  n => !prevIdsRef.current.has(n._id)
);

  if (hasNewNotification) {
    soundRef.current?.play().catch(() => {});
  }

  prevIdsRef.current = currentIds;

}, [notifications, soundEnabled]);


  const unreadCount = (notifications || []).filter(
    (n) => !n.isRead
  ).length;
  let audioEnabled = false;

  const navItems = [
  { to: "/favorites", label: "Избранное" },
  { to: "/create-listing", label: "Подать объявление", auth: true },
  { to: "/profile", label: "Профиль", auth: true },
  { to: "/admin", label: "Админ", role: "admin" }
];

document.addEventListener("click", () => {
  audioEnabled = true;
});

  return (
    <>
      <header className="w-full bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-8">
            <Link to="/">
              <h1 className="text-green-600 font-bold text-2xl">
                BB
              </h1>
            </Link>

            <div className="hidden md:flex items-center bg-gray-100 px-4 rounded-xl w-[450px]">
              <Search size={18} />
              <input
                name="searchTop"
                placeholder="Поиск товаров"
                className="bg-transparent p-3 w-full outline-none"
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="hidden md:flex items-center gap-6">

            <Link to="/favorites" aria-label="Избранное">
              <Heart className="cursor-pointer" />
            </Link>

            {/* 🔔 NOTIFICATIONS */}
            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpenNotif(!openNotif)}
                  className="relative"
                >
                  🔔

                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* DROPDOWN */}
                {openNotif && (
                  <div className="absolute right-0 mt-3 w-80 bg-white border shadow-xl rounded-xl z-50">
                    <div className="p-3 border-b font-semibold">
                      Уведомления
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-gray-500 text-sm">
                          Нет уведомлений
                        </p>
                      ) : (
                        notifications.map((n) => (
                         <div
  key={n._id}
  onClick={() => markAsRead(n._id)}
  className={`
    p-3 border-b cursor-pointer transition-all duration-300
    hover:bg-gray-50
    ${n.isRead ? "opacity-50 bg-gray-100" : "bg-white font-medium"}
  `}
>
  <p className="text-sm">{n.message}</p>

  <span className="text-xs text-gray-400">
    {new Date(n.createdAt).toLocaleString()}
  </span>
</div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* AUTH */}
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
                  to={
                    user?.role === "admin"
                      ? "/admin"
                      : "/profile"
                  }
                  className="flex items-center gap-2 hover:text-green-600"
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

          {/* MOBILE */}
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
        user={user}
      />
    </>
  );
}