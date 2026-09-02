import {
  Heart,
  User,
  Menu,
  Search,
  LogOut,
  MessageCircle,
  X,
  MapPin,
  Bell,
  Package
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

  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);


const [citySearch, setCitySearch] = useState("");

const [selectedRegion, setSelectedRegion] = useState(
  localStorage.getItem("region") || "Все города"
);

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

  const region = useListingStore((s) => s.region);
  const setRegion = useListingStore((s) => s.setRegion);

  const [selectedCity, setSelectedCity] = useState(
  localStorage.getItem("city") || "Вся Беларусь"
);

  const finalCity = selectedCity || "Все города";
  const selectionLabel =
  selectedRegion !== "Все города"
    ? selectedCity
      ? `${selectedRegion} · ${selectedCity}`
      : selectedRegion
    : selectedCity || "Вся Беларусь";

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
    setSelectedRegion(region || "Все города");

    setSelectedCity(city || "");

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
      const params = {
        city: selectedCity === "Вся Беларусь"
          ? ""
          : selectedCity,

        region: selectedRegion === "Все города"
          ? ""
          : selectedRegion,
      };

      const { data } = await getListingsCount(params);

      setAdsCount(data.total);
    } catch (err) {
      console.error("Ошибка получения количества объявлений:", err);
      setAdsCount(0);
    }
  };

  loadCount();
}, [selectedCity, selectedRegion]);

useEffect(() => {

  const handleScroll = () => {

    const currentScrollY = window.scrollY;

    // В самом верху всегда показываем header
    if (currentScrollY <= 10) {

      setShowHeader(true);
      lastScrollY.current = currentScrollY;

      return;
    }

    // Игнорируем мелкие движения
    if (
      Math.abs(currentScrollY - lastScrollY.current) < 5
    ) {
      return;
    }

    // Скролл вниз
    if (currentScrollY > lastScrollY.current) {

      setShowHeader(false);

    }

    // Скролл вверх
    else {

      setShowHeader(true);

    }

    lastScrollY.current = currentScrollY;
  };


  window.addEventListener(
    "scroll",
    handleScroll,
    { passive: true }
  );


  return () => {

    window.removeEventListener(
      "scroll",
      handleScroll
    );

  };

}, []);

  return (
    <>
      <header
  className={`
    w-full
    bg-white/90
    backdrop-blur-md
    border-b
    shadow-sm
    sticky
    top-0
    z-50
    transition-transform
    duration-300
    ease-out
    ${
      showHeader
        ? "translate-y-0"
        : "-translate-y-full"
    }
  `}
>

<div 
className="
max-w-7xl
mx-auto
px-3
h-16
flex
items-center
justify-between
">

          {/* LEFT */}
          <div className="flex items-center gap-8">
            <Link 
to="/"
aria-label="Главная страница BB"
className="
flex
items-center
gap-2
group
"
>

<div
className="
w-11
h-11
rounded-2xl
bg-linear-to-br
from-blue-500
to-blue-700
flex
items-center
justify-center
shadow-lg
shadow-blue-500/30
group-hover:scale-105
transition
"
>
<span
className="
text-white
font-black
text-xl
"
>
BB
</span>

</div>

<div className="hidden sm:block">

{/* <p className="
font-bold
text-xl
leading-none
text-gray-900
">
BB
</p> */}


</div>

</Link>

            <div
className="
hidden
lg:flex
items-center
bg-gray-100
border
border-gray-200
px-4
rounded-2xl
w-90
h-12
focus-within:ring-2
focus-within:ring-blue-500/30
transition
"
>
              <Search
  aria-hidden="true"
  size={18}
  className="cursor-pointer"
  onClick={() => navigate("/")}
/>
<input
  id="header-search"
  name="search"
  type="search"
  placeholder="Поиск товаров"
  className="
    flex-1
    bg-transparent
    px-2
    outline-none"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

            </div>
<button
onClick={() => setCityModal(true)}
aria-label="Выбрать город"
title="Выбрать город"
className="
group
flex
items-center
gap-3
px-4
h-11
rounded-2xl
bg-linear-to-r
from-blue-50
to-indigo-50
border
border-blue-100
text-blue-700
hover:border-blue-300
hover:shadow-md
transition-all
duration-200
"
>
<MapPin
size={20}
aria-hidden="true"
className="
text-blue-600
group-hover:scale-110
transition
"
/>

<div className="flex flex-col items-start leading-none">

{/* <span className="text-[11px] text-gray-400">
Местоположение
</span> */}

<span className="font-semibold text-sm">
{city || region || "Вся Беларусь"}
</span>

</div>

</button>
          </div>

          {/* RIGHT */}
          <div className="hidden lg:flex items-center gap-5">

           <Link
  to="/favorites"
  aria-label="Избранное"
  title="Избранное"
  className="
    group
    relative
    flex
    items-center
    justify-center
    w-11
    h-11
    rounded-2xl
    hover:bg-blue-50
    transition-all
    duration-300
  "
>
  <Heart
    size={22}
    aria-hidden="true"
    className="
      text-red-500
      transition-all
      duration-300
      ease-[cubic-bezier(.34,1.56,.64,1)]
      group-hover:scale-125
      group-hover:fill-red-500
      group-hover:text-red-600
      group-hover:-translate-y-0.5
    "
  />

  {/* лёгкое свечение */}
  <span
    className="
      absolute
      inset-0
      rounded-2xl
      bg-blue-400/10
      scale-0
      opacity-0
      transition-all
      duration-300
      group-hover:scale-100
      group-hover:opacity-100
      -z-10
    "
  />
</Link>

<Link
  to="/messages"
  aria-label="Сообщения"
  title="Сообщения"
  className="
    group
    relative
    flex
    items-center
    justify-center
    w-11
    h-11
    rounded-2xl
    hover:bg-blue-50
    transition-all
    duration-300
  "
>
  <MessageCircle
    size={22}
    aria-hidden="true"
    className="
      text-gray-400
      transition-all
      duration-300
      ease-[cubic-bezier(.34,1.56,.64,1)]
      group-hover:scale-125
      group-hover:text-gray-600
      group-hover:-translate-y-1
    "
  />

  {/* мягкое свечение */}
  <span
    className="
      absolute
      inset-0
      rounded-2xl
      bg-blue-400/10
      scale-0
      opacity-0
      transition-all
      duration-300
      group-hover:scale-100
      group-hover:opacity-100
      -z-10
    "
  />
</Link>

            {/* 🔔 NOTIFICATIONS */}
            {user && (
              <div className="
relative
flex
items-center
justify-center
w-11
h-11
rounded-2xl
hover:bg-blue-50
transition
" ref={dropdownRef}>
                <button
  onClick={() => setOpenNotif(!openNotif)}
  aria-label="Уведомления"
  aria-expanded={openNotif}
  aria-haspopup="menu"
  className="
    group
    flex
    items-center
    justify-center
    w-11
    h-11
    rounded-2xl
    hover:bg-blue-50
    transition-all
    duration-300
    relative
  "
>
  <Bell
    size={22}
    aria-hidden="true"
    className="
      text-yellow-400
      transition-all
      duration-300
      ease-[cubic-bezier(.34,1.56,.64,1)]
      group-hover:scale-125
      group-hover:text-yellow-400
      group-hover:-translate-y-1
      group-hover:rotate-6
    "
  />

  {/* Количество уведомлений */}
  {unreadCount > 0 && (
    <span
      className="
        absolute
        -top-1
        -right-1
        min-w-5
        h-5
        px-1
        rounded-full
        bg-red-500
        border-2
        border-white
        text-white
        text-[10px]
        font-bold
        flex
        items-center
        justify-center
        animate-pulse
      "
    >
      {unreadCount > 99 ? "99+" : unreadCount}
    </span>
  )}

  {/* Мягкое свечение */}
  <span
    className="
      absolute
      inset-0
      rounded-2xl
      bg-blue-400/10
      scale-0
      opacity-0
      transition-all
      duration-300
      group-hover:scale-100
      group-hover:opacity-100
      -z-10
    "
  />
</button>

                {/* DROPDOWN */}
                {openNotif && (
                  <div className="fixed
      top-20
      right-6
      w-80
      bg-white
      rounded-2xl
      shadow-2xl
      border
      z-9999
      overflow-hidden">
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

  <span className="text-xs text-gray-600">
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
    alt={`Аватар пользователя ${user?.name}`}
    loading="lazy"
    className="
w-11
h-11
rounded-2xl
object-cover
border-2
border-white
shadow
hover:scale-105
transition
"
  />
</Link>

                
              </div>
            )}

            {/* BUTTON */}
            {user && (
              <Link to="/create-listing">
  <button
    className="
group
flex
items-center
justify-center
gap-2
h-12
px-5
rounded-2xl
bg-linear-to-r
from-blue-600
to-blue-700
text-white
font-semibold
shadow-lg
shadow-blue-500/30
hover:shadow-xl
hover:scale-[1.03]
transition
"
  >
    <span
className="
text-2xl
font-bold
group-hover:rotate-90
transition
"
>
+
</span>

    <span
      className="
        hidden xl:block
        ml-3
        whitespace-nowrap
        text-sm
        font-semibold
      "
    >
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
        </header>
        <div className="lg:hidden bg-white border-b px-3 py-3">

    <div className="
    flex
    items-center
    bg-gray-100
    rounded-xl
    px-3
    h-11">

        <Search
            size={18}
            className="text-gray-500"
        />

        <input
  id="mobile-search"
  name="search"
  type="search"
  placeholder="Поиск товаров"
  className="
    flex-1
    bg-transparent
    px-2
    outline-none"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

    </div>

</div>

{cityModal && (
  <div
    className="
      fixed inset-0 z-100
      bg-black/55 backdrop-blur-sm
      flex items-center justify-center
      p-3 sm:p-5
    "
    onClick={() => setCityModal(false)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="
        w-full max-w-5xl
        h-[90vh]
        bg-white
        rounded-3xl
        shadow-2xl
        overflow-hidden
        flex flex-col
      "
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          shrink-0
          bg-white
          border-b border-gray-200
          px-5 sm:px-6
          pt-4
          pb-3
        "
      >

        {/* TOP ROW */}

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          {/* TITLE */}

          <div
            className="
              flex
              items-center
              gap-3
              shrink-0
            "
          >

            <div
              className="
                w-10 h-10
                rounded-xl
                bg-blue-50
                text-blue-600
                flex
                items-center
                justify-center
              "
            >
              <MapPin size={20} />
            </div>

            <div className="hidden sm:block">

              <h2
                className="
                  text-base
                  font-bold
                  text-gray-900
                  leading-tight
                "
              >
                Выберите город
              </h2>

              <p
                className="
                  text-[11px]
                  text-gray-400
                  mt-0.5
                "
              >
                Объявления рядом с вами
              </p>

            </div>

          </div>


          {/* CURRENT CITY */}

          <div
  className="
    hidden md:flex
    items-center
    gap-2
    px-3
    h-10
    rounded-xl
    bg-blue-50
    border border-blue-100
    min-w-35
    max-w-60
  "
>
  <MapPin
    size={15}
    className="text-blue-600 shrink-0"
  />

  <div className="min-w-0">

    <div
      className="
        text-[9px]
        text-blue-500
        uppercase
        font-semibold
        leading-none
      "
    >
      Ваш выбор
    </div>

    <div
      className="
        text-xs
        font-semibold
        text-blue-700
        truncate
        mt-1
      "
      title={selectionLabel}
    >
      {selectionLabel}
    </div>

  </div>
</div>

          


          {/* SEARCH */}

          <div className="relative flex-1 min-w-30">

            <Search
              size={17}
              className="
                absolute
                left-3.5
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              autoFocus
              value={citySearch}
              onChange={(e) =>
                setCitySearch(e.target.value)
              }
              placeholder="Найти город..."
              className="
                w-full
                h-10
                pl-10
                pr-9
                rounded-xl
                bg-gray-50
                border border-gray-200
                text-sm
                outline-none
                transition
                focus:bg-white
                focus:border-blue-400
                focus:ring-2
                focus:ring-blue-100
              "
            />

            {citySearch && (
              <button
                type="button"
                onClick={() => setCitySearch("")}
                className="
                  absolute
                  right-2
                  top-1/2
                  -translate-y-1/2
                  w-6 h-6
                  rounded-md
                  flex
                  items-center
                  justify-center
                  text-gray-400
                  hover:bg-gray-200
                  hover:text-gray-700
                "
              >
                <X size={14} />
              </button>
            )}

          </div>


          {/* CLOSE */}

          <button
            type="button"
            onClick={() => setCityModal(false)}
            aria-label="Закрыть"
            className="
              w-10 h-10
              shrink-0
              rounded-xl
              flex
              items-center
              justify-center
              text-gray-400
              hover:bg-gray-100
              hover:text-gray-700
              transition
            "
          >
            <X size={20} />
          </button>

        </div>


        {/* MOBILE CURRENT CITY */}

        <div
          className="
            md:hidden
            mt-3
            flex
            items-center
            gap-2
            text-xs
            text-gray-500
          "
        >

          <span>
            Ваш выбор:
          </span>

          <span
  className="
    font-semibold
    text-blue-600
    truncate
  "
>
  {selectionLabel}
</span>

        </div>

{/* =================================================
    REGIONS
================================================= */}

<div className="mt-3">

  <div className="flex items-center justify-between mb-2">

    <span
      className="
        text-[10px]
        font-semibold
        text-gray-400
        uppercase
        tracking-wide
      "
    >
      Регион
    </span>

    <span className="text-[10px] text-gray-400">

    городов: {filteredCities.length} 
    </span>

  </div>


  <div
    className="
      grid
      grid-cols-4
      sm:grid-cols-5
      lg:grid-cols-6
      gap-1.5
    "
  >

{/* ВСЯ БЕЛАРУСЬ */}

<button
  type="button"
  onClick={() => {
    setSelectedRegion("Все города");
    setSelectedCity("Вся Беларусь");
    setCitySearch("");
  }}
  className={`
    h-8
    px-2
    rounded-lg
    border
    text-[11px]
    font-semibold
    transition
    truncate
    ${
      selectedRegion === "Все города"
        ? `
          bg-blue-600
          border-blue-600
          text-white
          shadow-sm
        `
        : `
          bg-white
          border-gray-200
          text-gray-600
          hover:border-blue-300
          hover:text-blue-600
        `
    }
  `}
>
  Вся Беларусь
</button>


{/* ОБЛАСТИ */}

{Object.entries(regions).map(
  ([region, regionCities]) => {

    const active =
      selectedRegion === region;

    return (
      <button
        key={region}
        type="button"
        onClick={() => {
          setSelectedRegion(region);
          setSelectedCity("");
          setCitySearch("");
        }}
        className={`
          h-8
          px-2
          rounded-lg
          border
          text-[11px]
          font-medium
          transition
          truncate
          flex
          items-center
          justify-center
          gap-1
          ${
            active
              ? `
                bg-blue-600
                border-blue-600
                text-white
                shadow-sm
              `
              : `
                bg-white
                border-gray-200
                text-gray-600
                hover:border-blue-300
                hover:text-blue-600
              `
          }
        `}
        title={region}
      >
        <span className="truncate">
          {region}
        </span>

        <span
          className={`
            shrink-0
            text-[8px]
            px-1
            rounded-full
            ${
              active
                ? "bg-white/20 text-white"
                : "bg-gray-100 text-gray-400"
            }
          `}
        >
          {regionCities.length}
        </span>
      </button>
    );
  }
)}


  </div>

</div>


      </div>


      {/* =====================================================
          CITIES
      ===================================================== */}

      <div
        className="
          flex-1
          min-h-0
          overflow-y-auto
          bg-gray-50
          px-4 sm:px-6
          py-4
        "
      >

        {/* CITY HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
            mb-3
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <h3
              className="
                text-sm
                font-bold
                text-gray-800
              "
            >
              {selectedRegion === "Все города"
                ? "Города Беларуси"
                : selectedRegion}
            </h3>

            {selectedCity !== "Вся Беларусь" && (
              <span
                className="
                  px-2
                  py-0.5
                  rounded-md
                  bg-blue-100
                  text-blue-600
                  text-[10px]
                  font-semibold
                "
              >
                {selectedCity}
              </span>
            )}

          </div>

          {citySearch && (
            <span
              className="
                text-[11px]
                text-gray-400
              "
            >
              Поиск: {filteredCities.length}
            </span>
          )}

        </div>


        {/* CITY LIST */}

        {filteredCities.length > 0 ? (

          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-3
              lg:grid-cols-4
              xl:grid-cols-5
              gap-2
            "
          >

            {filteredCities.map((cityName) => {

              const selected =
                cityName === selectedCity;

              return (
                <button
                  key={cityName}
                  type="button"
                  onClick={() => {
  setSelectedCity(cityName);
}}
                  className={`
                    group
                    relative
                    min-h-12
                    px-3
                    py-2.5
                    rounded-xl
                    border
                    text-left
                    transition-all
                    duration-150
                    ${
                      selected
                        ? `
                          bg-blue-600
                          border-blue-600
                          shadow-md
                          shadow-blue-500/20
                          scale-[1.01]
                        `
                        : `
                          bg-white
                          border-gray-200
                          hover:border-blue-300
                          hover:bg-blue-50
                          hover:shadow-sm
                        `
                    }
                  `}
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-2.5
                    "
                  >

                    {/* CITY ICON */}

                    <div
                      className={`
                        w-8 h-8
                        shrink-0
                        rounded-lg
                        flex
                        items-center
                        justify-center
                        transition
                        ${
                          selected
                            ? `
                              bg-white/15
                              text-white
                            `
                            : `
                              bg-gray-100
                              text-gray-400
                              group-hover:bg-blue-100
                              group-hover:text-blue-600
                            `
                        }
                      `}
                    >
                      <MapPin size={15} />
                    </div>


                    {/* NAME */}

                    <span
                      className={`
                        text-sm
                        leading-tight
                        truncate
                        ${
                          selected
                            ? `
                              text-white
                              font-semibold
                            `
                            : `
                              text-gray-700
                              font-medium
                            `
                        }
                      `}
                    >
                      {cityName}
                    </span>


                    {/* CHECK */}

                    {selected && (
                      <div
                        className="
                          ml-auto
                          w-5 h-5
                          shrink-0
                          rounded-full
                          bg-white
                          text-blue-600
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <svg
                          className="w-3 h-3"
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
                      </div>
                    )}

                  </div>

                </button>
              );
            })}

          </div>

        ) : (

          /* EMPTY */

          <div
            className="
              h-64
              rounded-2xl
              bg-white
              border border-gray-200
              flex
              flex-col
              items-center
              justify-center
              text-center
            "
          >

            <div
              className="
                w-12 h-12
                rounded-xl
                bg-gray-100
                text-gray-400
                flex
                items-center
                justify-center
                mb-3
              "
            >
              <Search size={21} />
            </div>

            <p
              className="
                text-sm
                font-semibold
                text-gray-700
              "
            >
              Город не найден
            </p>

            <p
              className="
                text-xs
                text-gray-400
                mt-1
              "
            >
              Попробуйте изменить поисковый запрос
            </p>

            <button
              type="button"
              onClick={() => setCitySearch("")}
              className="
                mt-3
                px-4 py-2
                rounded-lg
                bg-blue-50
                text-blue-600
                text-xs
                font-medium
                hover:bg-blue-100
                transition
              "
            >
              Очистить поиск
            </button>

          </div>

        )}

      </div>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div
        className="
          shrink-0
          bg-white
          border-t border-gray-200
          px-4 sm:px-6
          py-3
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          {/* SELECTED */}

          <div
            className="
              hidden sm:flex
              items-center
              gap-2
              flex-1
              min-w-0
            "
          >

            <div
              className="
                w-8 h-8
                shrink-0
                rounded-lg
                bg-blue-50
                text-blue-600
                flex
                items-center
                justify-center
              "
            >
              <MapPin size={15} />
            </div>

            <div className="min-w-0">

              <div
                className="
                  text-[10px]
                  text-gray-400
                "
              >
                Выбранный город
              </div>

              <div
                className="
                  text-xs
                  font-semibold
                  text-gray-800
                  truncate
                "
              >
                {selectionLabel}
              </div>

            </div>

          </div>


          {/* RESET */}

          {selectedCity !== "Вся Беларусь" && (
            <button
              type="button"
              onClick={() =>
                setSelectedCity("Вся Беларусь")
              }
              className="
                h-10
                px-4
                rounded-xl
                border border-gray-200
                text-xs
                font-medium
                text-gray-600
                hover:bg-gray-50
                transition
              "
            >
              Сбросить
            </button>
          )}


          {/* APPLY */}

          <button
            type="button"
            onClick={() => {
  const finalCity =
    selectedCity === "Вся Беларусь"
      ? ""
      : selectedCity;

  const finalRegion =
    selectedRegion === "Все города"
      ? ""
      : selectedRegion;

  setCity(finalCity);
  setRegion(finalRegion);

  localStorage.setItem("city", finalCity);
  localStorage.setItem("region", finalRegion);

  setCityModal(false);
  navigate("/");
}}
            className="
              h-10
              px-5
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              text-xs
              sm:text-sm
              font-semibold
              shadow-md
              shadow-blue-500/20
              transition
              flex
              items-center
              justify-center
              gap-2
            "
          >

            <MapPin size={15} />

            Показать объявления

            <span
              className="
                px-1.5
                py-0.5
                rounded-md
                bg-white/15
                text-[10px]
              "
            >
              {adsCount}
            </span>

          </button>

        </div>

      </div>

    </div>
  </div>
)}
     

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        aria-label="Открыть меню"
        user={user}
      />
    </>
  );
}