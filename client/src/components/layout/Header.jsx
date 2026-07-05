import {
  Heart,
  User,
  Menu,
  Search,
  LogOut,
  MessageCircle,
  X
} from "lucide-react";

import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useListingStore } from "../../store/listingStore";
import MobileMenu from "./MobileMenu";
import { useAuthStore } from "../../store/authStore";
import { useNotificationStore } from "../../store/notificationStore.js";
import { cities } from "../../data/cities";
import { regions } from "../../data/regions";
import { getListingsCount} from "../../api/listingApi";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);

  const search = useListingStore((s) => s.search);
  const setSearch = useListingStore((s) => s.setSearch);


const [citySearch, setCitySearch] = useState("");

const [selectedRegion, setSelectedRegion] =
  useState("Все города");

const allCities = [...new Set(Object.values(regions).flat())];

const citiesToShow =
  selectedRegion === "Все города"
    ? allCities
    : regions[selectedRegion] || [];

const filteredCities = citiesToShow.filter((city) =>
  city.toLowerCase().includes(citySearch.toLowerCase())
);
  const [cityModal, setCityModal] = useState(false);
  // const [tempCity, setTempCity] = useState(null);
  const city = useListingStore((s) => s.city);
  const setCity = useListingStore((s) => s.setCity);

  const [selectedCity, setSelectedCity] = useState(
  localStorage.getItem("city") || "Вся Беларусь"
  );

  const finalCity = selectedCity || "Все города";

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
  if (cityModal) {
    setSelectedRegion("Все города");
   
    setCitySearch("");
  }
}, [cityModal]);

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
  // let audioEnabled = false;

  const navItems = [
  { to: "/favorites", label: "Избранное" },
  { to: "/create-listing", label: "Подать объявление", auth: true },
  { to: "/profile", label: "Профиль", auth: true },
  { to: "/admin", label: "Админ", role: "admin" }
];
const [adsCount, setAdsCount] = useState(0);
useEffect(() => {
  const loadCount = async () => {
    try {
      const { data } = await getListingsCount({
        city: selectedCity,
        region: selectedRegion,
      });

      setAdsCount(data.total);
    } catch (err) {
      console.error(err);
    }
  };

  loadCount();
}, [selectedCity, selectedRegion]);

  return (
    <>
      <header className="w-full bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-8">
            <Link to="/">
              <h1 className="text-blue-600 font-bold text-2xl">
                BB
              </h1>
            </Link>

            <div className="hidden md:flex items-center bg-gray-100 px-4 rounded-xl w-80">
              <Search
  size={18}
  className="cursor-pointer"
  onClick={() => navigate("/")}
/>
              <input
  value={search}
  name="search"
  onChange={(e) => setSearch(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      navigate("/");
    }
  }}
  placeholder="Поиск товаров"
  className="bg-transparent p-2 w-full outline-none"
/>

            </div>
            <button
  onClick={() => setCityModal(true)}
  className="
    flex items-center gap-2
    px-2 py-1
    rounded-xl
    text-blue-600
  "
>
  📍{city || "Вся Беларусь"}
</button>
          </div>

          {/* RIGHT */}
          <div className="hidden md:flex items-center gap-6 ">

            <Link to="/favorites"
            className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-blue-100 transition"
            aria-label="Избранное">
              <Heart className="cursor-pointer text-blue-500 " />
            </Link>

<Link
  to="/messages"
  className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-blue-100 transition"
>
  <MessageCircle className="cursor-pointer text-blue-500" />

  {/* badge */}
  {/* <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] px-1.5 rounded-full">
    3
  </span> */}
</Link>

            {/* 🔔 NOTIFICATIONS */}
            {user && (
              <div className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-blue-100 transition  " ref={dropdownRef}>
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
  to={user?.role === "admin" ? "/admin" : "/profile"}
  className="hover:opacity-90 transition"
>
  <img
    src={
      user?.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user?.name || "User"
      )}&background=2563eb&color=fff&size=128`
    }
    alt={user?.name}
    className="w-10 h-10 rounded-full object-cover border"
  />
</Link>

                
              </div>
            )}

            {/* BUTTON */}
            {user && (
              <Link to="/create-listing">
  <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition-all
    {/* Стили по умолчанию (для экранов МЕНЬШЕ 1200px): квадратная кнопка */}
    w-10 h-10 p-0
    {/* Стили для экранов ОТ 1200px (xl и выше): прямоугольная кнопка с текстом */}
    xl:w-auto xl:h-auto xl:px-4 xl:py-2"
  >
    {/* Иконка плюса: видна ВСЕГДА */}
    <span className="text-2xl font-bold flex items-center justify-center leading-none select-none">
  +
</span>
    
    {/* Текст: скрыт на мобильных/планшетах, появляется только от 1200px */}
    <span className="hidden xl:inline xl:ml-2">
      Подать объявление
    </span>
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
{cityModal && (
  <div
    className="fixed inset-0 z-100 bg-black/50 flex items-center justify-center p-4"
    onClick={() => setCityModal(false)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white rounded-2xl w-full max-w-3xl h-[95vh] flex flex-col overflow-hidden shadow-2xl"
    >

  {/* HEADER */}
<div className="sticky top-0 z-20 bg-white border-b p-6">

  <div className="flex items-start justify-between mb-4">

    <div>
      <h2 className="text-xl font-bold">
        Выбор региона
      </h2>

      <p className="text-sm text-gray-500 mt-1">
        Текущий город:
        <span className="font-semibold ml-1">
          {selectedCity || "Все города"}
        </span>
      </p>
    </div>

    <button
      onClick={() => setCityModal(false)}
      className="
        p-2
        rounded-lg
        hover:bg-gray-100
        transition
      "
    >
      <X size={22} />
    </button>

  </div>

  <input
    value={citySearch}
    onChange={(e) => setCitySearch(e.target.value)}
    placeholder="Поиск города..."
    className="w-full border rounded-xl p-2 mb-4"
  />

  <div className="flex flex-wrap gap-2">
    {Object.keys(regions).map((region) => (
      <button
        key={region}
        onClick={() => {
          setSelectedRegion(region);
          setCitySearch("");
        }}
        className={`px-3 py-2 border rounded-full text-sm ${
          selectedRegion === region
            ? "bg-blue-600 text-white border-blue-600"
            : "hover:border-blue-500"
        }`}
      >
        {region}
      </button>
    ))}
  </div>

</div>

  {/* BODY */}
 <div className="flex-1 overflow-y-auto p-6">
  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2">

    {filteredCities.map((city) => (
      <label
        key={city}
        onClick={() => setSelectedCity(city)}
        className="group flex items-center gap-3 cursor-pointer p-2"
      >
        <div
          className={`w-5 h-5 border-2 rounded-sm flex items-center justify-center transition-colors ${
            city === selectedCity
              ? "bg-blue-600 border-blue-600"
              : "border-gray-400 group-hover:border-blue-600"
          }`}
        >
          {city === selectedCity && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>

        <span>{city}</span>
      </label>
    ))}

  </div>
</div>

  {/* FOOTER */}
  <div className="sticky bottom-0 z-20 bg-white border-t p-6 flex gap-3">

    <button
      onClick={() => {
        const finalCity = selectedCity || "Все города";

        setCity(finalCity);
        setSelectedCity(finalCity);

        localStorage.setItem("city", finalCity);

        setCityModal(false);
        navigate("/");
      }}
      className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium"
    >
      Показать объявления ({adsCount})
    </button>

    {selectedCity !== "Все города" && (
      <button
        onClick={() => setSelectedCity("Вся Беларусь")}
        className="flex-1 border py-3 rounded-xl hover:bg-gray-50"
      >
        Сбросить
      </button>
    )}

  </div>
 </div> 
</div>
)}


      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        user={user}
      />
    </>
  );
}