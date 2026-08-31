import { useEffect, useState, Fragment } from "react";
import { getMyListings } from "../../api/userApi";
import { useAuthStore } from "../../store/authStore";
import ListingCard from "../../components/listing/ListingCard";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { updateListing, deleteListing } from "../../api/listingApi";
import { useCategoryStore } from "../../store/categoryStore";
import { uploadImage } from "../../api/uploadApi";
import { getMe } from "../../api/userApi";
import api from "../../api/axios";
import { Helmet } from "react-helmet-async";
import { LogOut } from "lucide-react";
import { updateProfile } from "../../api/userApi";
import { promoteListing } from "../../api/listingApi";
import { getSellerRatings, replyToRating } from "../../api/ratingApi";


export default function Profile() {
  const user = useAuthStore((s) => s.user);

  const logout = useAuthStore((s) => s.logout);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const { categories, fetchCategories } = useCategoryStore();
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
  title: "",
  price: "",
  city: "",
  description: "",
    });
    
const setUser = useAuthStore((s) => s.setUser);
const [savingProfile, setSavingProfile] = useState(false);
const [profileError, setProfileError] = useState("");
const [profileMessage, setProfileMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
  score: 0,
  text: "",
});

const [ratings, setRatings] = useState([]);
const [activeTab, setActiveTab] = useState("listings");

const [replyRatingId, setReplyRatingId] = useState(null);
const [replyText, setReplyText] = useState("");
const [replyLoading, setReplyLoading] = useState(false);

const formatPhone = (value) => {
  let digits = value.replace(/\D/g, "");

  // если удалили всё
  if (!digits) {
    return "";
  }

  // если пользователь удаляет код внутри скобок
  if (value.startsWith("+375") && digits.startsWith("375")) {
    digits = digits.slice(3);
  }


  // максимум 9 цифр после +375
  digits = digits.slice(0, 9);


  let result = "+375";


  if (digits.length > 0) {
    result += " (" + digits.slice(0, 2);
  }

  if (digits.length >= 2) {
    result += ")";
  }


  if (digits.length > 2) {
    result += " " + digits.slice(2, 5);
  }


  if (digits.length > 5) {
    result += "-" + digits.slice(5, 7);
  }


  if (digits.length > 7) {
    result += "-" + digits.slice(7, 9);
  }


  return result;
};

const checkPasswordStrength = (password) => {

  let score = 0;


  if(password.length >= 8){
    score++;
  }

  if(/[a-z]/.test(password)){
    score++;
  }

  if(/[A-Z]/.test(password)){
    score++;
  }

  if(/\d/.test(password)){
    score++;
  }

  if(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)){
    score++;
  }



  let text = "";


  if(score <= 2){
    text = "Слабый пароль";
  }
  else if(score <= 4){
    text = "Средний пароль";
  }
  else{
    text = "Надёжный пароль";
  }


  return {
    score,
    text
  };

};

const handleReplyToRating = async (ratingId) => {
  if (!replyText.trim()) {
    return;
  }

  setReplyLoading(true);

  try {
    const { data } = await replyToRating(
      ratingId,
      replyText
    );

    setRatings((prev) =>
      prev.map((rating) =>
        rating._id === ratingId
          ? data.rating
          : rating
      )
    );

    setReplyRatingId(null);
    setReplyText("");

  } catch (error) {
    alert(
      error?.response?.data?.message ||
      "Не удалось сохранить ответ"
    );
  } finally {
    setReplyLoading(false);
  }
};


const [profileModal, setProfileModal] = useState(false);
const [profileForm, setProfileForm] = useState({
  name: "",
  phone: "",
  oldPassword: "",
  newPassword: "",
});
useEffect(() => {
  if (user) {
    setProfileForm((prev) => ({
      ...prev,
      name: user.name || "",
      phone: formatPhone(user.phone || ""),
    }));
  }
}, [user]);
const refreshUser = async () => {
  try {
    const { data } = await getMe();
    setUser(data, localStorage.getItem("token"));
  } catch (err) {
    console.log("GET ME ERROR", err);
  }
  }

  useEffect(() => {
  if (!user?._id) return;

  const loadRatings = async () => {
    try {
      const { data } = await getSellerRatings(user._id);
      setRatings(data);
    } catch (error) {
      console.error("GET RATINGS ERROR:", error);
    }
  };

  loadRatings();
}, [user?._id]);

 const openEditModal = (listing) => {
  setEditItem(listing);

  setForm({
    title: listing.title || "",
    price: listing.price || "",
    city: listing.city || "",
    description: listing.description || "",
    category: listing.category || "",
  });

  setImageUrl(listing.images?.[0] || "");
};
const handleUpload = async () => {
  if (!imageFile) return;

  setUploading(true);

  try {
    const { data } = await uploadImage(imageFile);
    setImageUrl(data.url);
  } catch (err) {
    console.error(err);
  } finally {
    setUploading(false);
  }
};

  useEffect(() => {
  loadListings();
  fetchCategories();
  refreshUser();
}, []);

useEffect(() => {
  if (!user?._id) return;

  const loadRatings = async () => {
    try {
      const { data } = await getSellerRatings(user._id);
      setRatings(data);
    } catch (error) {
      console.error("GET RATINGS ERROR:", error);
    }
  };

  loadRatings();
}, [user?._id]);

   const handleLogout = () => {
  logout();
  };

  const loadListings = async () => {
  try {
    const { data } = await getMyListings();
    setListings(data);

    if (user?._id) {
      const ratingsRes = await getSellerRatings(user._id);
      setRatings(ratingsRes.data);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
const handlePromote = async (listingId) => {
  try {
    const { data } = await promoteListing(listingId);

    alert(
      `⭐ Объявление поднято в ТОП!\nОсталось баллов: ${data.points}`
    );

    // Обновляем конкретное объявление без перезагрузки страницы
    setListings((prev) =>
      prev.map((item) =>
        item._id === listingId
          ? data.listing
          : item
      )
    );

    // Обновляем количество баллов пользователя
    setUser(
      {
        ...user,
        points: data.points,
      },
      localStorage.getItem("token")
    );

  } catch (error) {
    alert(
      error?.response?.data?.message ||
      "Не удалось поднять объявление в ТОП"
    );
  }
};

const handleDelete = async (id) => {
  setDeleteItem(null); // закрыли сразу

  try {
    await deleteListing(id);

    setListings((prev) =>
      prev.filter((item) => item._id !== id)
    );
  } catch (err) {
    console.error(err);
  }
};
const handleUpdate = async () => {
  try {
    await updateListing(editItem._id, {
      ...form,
      price: Number(form.price),
      images: imageUrl ? [imageUrl] : [],
      status: "pending" // ← ВАЖНО
    });

    setListings((prev) =>
      prev.map((item) =>
        item._id === editItem._id
          ? {
              ...item,
              ...form,
              status: "pending",
              images: imageUrl ? [imageUrl] : item.images
            }
          : item
      )
    );

    setEditItem(null);
  } catch (err) {
    console.error(err);
  }
};
const [avatarModal, setAvatarModal] = useState(false);
const [imagePreview, setImagePreview] = useState("");
const handleAvatarUpload = async () => {
  if (!imageFile) return;

  try {
    const { data } = await uploadImage(imageFile);

    await api.put("/users/avatar", {
      avatar: data.url
    });

    refreshUser();

   } catch (err) {
    console.error(err);
  }
  setImageFile(null);
  setImagePreview("");
};

const handleUpdateProfile = async () => {

  setProfileError("");
  setProfileMessage("");
  setSavingProfile(true);

  try {

    const payload = {
      name: profileForm.name,
      phone: profileForm.phone,
    };


    if(profileForm.newPassword){

      payload.oldPassword = profileForm.oldPassword;
      payload.newPassword = profileForm.newPassword;

    }


    const {data} = await updateProfile(payload);


    setUser(
      {
        ...user,
        ...data
      },
      localStorage.getItem("token")
    );


    setProfileMessage("Профиль изменён");

    setTimeout(() => {
  setProfileMessage("");
}, 3000);

setProfileModal(false);


    setProfileForm(prev => ({
      ...prev,
      oldPassword:"",
      newPassword:""
    }));


  } catch(err){

    setProfileError(
      err.response?.data?.message ||
      "Ошибка обновления"
    );

  } finally {

    setSavingProfile(false);

  }

};

  if (loading) {
    return (
      <div className="p-10 text-center">
        Загрузка...
      </div>
    );
  }

 return (
    <MainLayout>
      <Helmet>
  <title>Профиль | {user?.name}</title>
  <meta
    name="description"
    content={`Профиль пользователя ${user?.name} и его объявления`}
  />
</Helmet>
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-3">
          Профиль
        </h1>

{/* PROFILE HEADER */}
<div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-8 overflow-hidden">

  <div className="p-5 md:p-6">

    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

      {/* LEFT — USER */}
      <div className="flex items-center gap-4 min-w-0">

        <img
          src={
            user?.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user?.name || ""
            )}`
          }
          alt=""
          onClick={() => setAvatarModal(true)}
          className="
            w-16 h-16
            md:w-20 md:h-20
            rounded-full
            object-cover
            border-2 border-gray-100
            cursor-pointer
            hover:opacity-80
            transition
            shrink-0
          "
        />

        <div className="min-w-0">

          <h1 className="
            text-xl
            md:text-2xl
            font-bold
            text-gray-900
            truncate
          ">
            {user?.name}
          </h1>

          {/* RATING */}
          <button
            type="button"
            onClick={() => setActiveTab("ratings")}
            className="
              flex
              items-center
              gap-1.5
              mt-1
              text-sm
              hover:opacity-70
              transition
            "
          >
            <span className="text-yellow-500 text-lg">
              ★
            </span>

            <span className="font-semibold text-gray-900">
              {Number(user?.rating?.average || 0).toFixed(1)}
            </span>

            <span className="text-gray-400">
              ({user?.rating?.count || 0})
            </span>
          </button>

          <p className="text-xs text-gray-400 mt-1">
            На сайте с{" "}
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString("ru-RU")
              : "-"
            }
          </p>

        </div>

      </div>


      {/* RIGHT — POINTS + CREATE */}
      <div className="
        flex
        items-center
        gap-3
        md:gap-4
      ">

        {/* POINTS */}
        <div className="
          flex
          items-center
          gap-3
          bg-gray-50
          border
          border-gray-100
          rounded-xl
          px-4
          py-3
        ">

          <div className="
            w-9
            h-9
            rounded-lg
            bg-yellow-100
            flex
            items-center
            justify-center
            text-lg
          ">
            ⭐
          </div>

          <div>
            <div className="
              text-[11px]
              text-gray-400
              leading-none
            ">
              Баллы
            </div>

            <div className="
              text-xl
              font-bold
              text-gray-900
              leading-tight
              mt-1
            ">
              {user?.points || 0}
            </div>
          </div>

        </div>


        {/* CREATE LISTING */}
        {!user?.isBlocked && (
          <Link
            to="/create-listing"
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-4
              py-3
              rounded-xl
              text-sm
              font-medium
              shadow-sm
              hover:shadow
              transition
              whitespace-nowrap
            "
          >
            <span className="text-lg leading-none">
              +
            </span>

            <span className="hidden sm:inline">
              Создать объявление
            </span>

            <span className="sm:hidden">
              Создать
            </span>
          </Link>
        )}

      </div>

    </div>


    {/* ACTIONS */}
    <div className="
      flex
      flex-wrap
      items-center
      gap-2
      mt-5
      pt-4
      border-t
      border-gray-100
    ">

      <button
        onClick={() => setProfileModal(true)}
        className="
          px-3
          py-2
          rounded-lg
          bg-gray-50
          hover:bg-gray-100
          text-gray-700
          text-xs
          font-medium
          transition
        "
      >
        ⚙ Редактировать профиль
      </button>

      <button
        onClick={handleLogout}
        className="
          inline-flex
          items-center
          gap-1.5
          px-3
          py-2
          rounded-lg
          bg-red-50
          hover:bg-red-100
          text-red-600
          text-xs
          font-medium
          transition
        "
      >
        <LogOut size={14} />
        Выйти
      </button>

      <div className="
        ml-auto
        text-xs
        text-gray-400
      ">
        Объявлений:{" "}
        <span className="font-semibold text-gray-700">
          {listings.length}
        </span>
      </div>

    </div>

  </div>


  {/* BLOCKED */}
  {user?.isBlocked && (
    <div className="
      border-t
      border-red-100
      bg-red-50
      px-5
      py-3
      text-sm
      text-red-700
    ">
      <span className="font-semibold">
        🚫 Аккаунт заблокирован
      </span>

      <span className="ml-2">
        Размещение и редактирование объявлений недоступно.
      </span>
    </div>
  )}

</div>


    
{/* TABS */}

<div className="flex gap-3 border-b mb-6">

  <button
    type="button"
    onClick={() => setActiveTab("listings")}
    className={`pb-3 px-4 ${
      activeTab === "listings"
        ? "border-b-2 border-green-600 font-semibold text-gray-900"
        : "text-gray-500 hover:text-gray-700"
    }`}
  >
    Мои объявления ({listings.length})
  </button>

  <button
    type="button"
    onClick={() => setActiveTab("ratings")}
    className={`pb-3 px-4 ${
      activeTab === "ratings"
        ? "border-b-2 border-green-600 font-semibold text-gray-900"
        : "text-gray-500 hover:text-gray-700"
    }`}
  >
    Отзывы ({ratings.length})
  </button>

</div>


{/* MY LISTINGS */}

{activeTab === "listings" && (

  <section>


{/* Заголовок */}

<div className="
  flex
  flex-col
  sm:flex-row
  sm:items-center
  sm:justify-between
  gap-3
  mb-5
">

  <div>
    <h2 className="
      text-2xl
      font-bold
      text-gray-900
    ">
      Мои объявления
    </h2>

    <p className="text-sm text-gray-500 mt-1">
      {listings.length} объявлений
    </p>
  </div>

  {!user?.isBlocked && (
    <Link
      to="/create-listing"
      className="
        inline-flex
        items-center
        justify-center
        px-4
        py-2.5
        rounded-xl
        bg-blue-600
        hover:bg-blue-700
        text-white
        text-sm
        font-medium
        transition
      "
    >
      + Добавить объявление
    </Link>
  )}

</div>


{listings.length === 0 ? (

  /* EMPTY */

  <div className="
    bg-white
    border
    border-gray-200
    rounded-2xl
    p-10
    text-center
  ">

    <div className="text-5xl mb-4">
      📦
    </div>

    <h3 className="
      text-lg
      font-semibold
      text-gray-900
    ">
      У вас пока нет объявлений
    </h3>

    <p className="
      text-sm
      text-gray-500
      mt-1
      mb-5
    ">
      Создайте первое объявление
    </p>

    {!user?.isBlocked && (
      <Link
        to="/create-listing"
        className="
          inline-flex
          bg-blue-600
          hover:bg-blue-700
          text-white
          px-5
          py-2.5
          rounded-xl
          text-sm
          font-medium
        "
      >
        Создать объявление
      </Link>
    )}

  </div>

) : (

  /* LISTINGS */

  <div className="
    grid
    grid-cols-1
    sm:grid-cols-2
    lg:grid-cols-3
    xl:grid-cols-4
    gap-5
  ">

    {listings.map((listing) => (

      <div
        key={listing._id}
        className="
          bg-white
          rounded-2xl
          overflow-hidden
          border
          border-gray-200
          shadow-sm
          hover:shadow-md
          transition
          flex
          flex-col
        "
      >

        {/* ТОВАР */}

        <ListingCard listing={listing} />


        {/* УПРАВЛЕНИЕ */}

        <div className="
          border-t
          border-gray-100
          p-3
          bg-gray-50/50
        ">


          {/* СТАТУС */}

          <div className="mb-3">

            {listing.status === "pending" && (

              <div className="
                flex
                items-center
                gap-2
                px-3
                py-2
                rounded-xl
                bg-yellow-50
                border
                border-yellow-200
                text-yellow-700
                text-xs
                font-medium
              ">
                <span>⏳</span>
                <span>На модерации</span>
              </div>

            )}


            {listing.status === "approved" && (

              <div className="
                flex
                items-center
                gap-2
                px-3
                py-2
                rounded-xl
                bg-green-50
                border
                border-green-200
                text-green-700
                text-xs
                font-medium
              ">
                <span>✓</span>
                <span>Опубликовано</span>
              </div>

            )}


            {listing.status === "rejected" && (

              <div className="
                flex
                items-center
                gap-2
                px-3
                py-2
                rounded-xl
                bg-red-50
                border
                border-red-200
                text-red-700
                text-xs
                font-medium
              ">
                <span>✕</span>
                <span>Отклонено модератором</span>
              </div>

            )}

          </div>


          {/* ПРОДВИЖЕНИЕ */}

          {!user?.isBlocked &&
            listing.status === "approved" && (

            listing.isTop &&
            listing.topUntil &&
            new Date(listing.topUntil) > new Date() ? (

              <div className="
                mb-2
                w-full
                py-2
                rounded-xl
                bg-yellow-50
                border
                border-yellow-200
                text-yellow-700
                text-xs
                font-semibold
                text-center
              ">
                ⭐ Объявление в ТОП
              </div>

            ) : (

              <button
                type="button"
                onClick={() =>
                  handlePromote(listing._id)
                }
                className="
                  mb-2
                  w-full
                  py-2
                  rounded-xl
                  bg-yellow-400
                  hover:bg-yellow-500
                  text-yellow-950
                  text-xs
                  font-semibold
                  transition
                "
              >
                ⭐ Поднять в ТОП · 10 баллов
              </button>

            )
          )}


          {/* ОСНОВНЫЕ ДЕЙСТВИЯ */}

          <div className="
            grid
            grid-cols-2
            gap-2
          ">


            {!user?.isBlocked && (

              listing.status === "rejected" ? (

                <button
                  type="button"
                  onClick={() =>
                    openEditModal(listing)
                  }
                  className="
                    py-2
                    rounded-xl
                    bg-orange-50
                    hover:bg-orange-100
                    text-orange-600
                    text-xs
                    font-semibold
                    transition
                  "
                >
                  Исправить
                </button>

              ) : (

                <button
                  type="button"
                  onClick={() =>
                    openEditModal(listing)
                  }
                  className="
                    py-2
                    rounded-xl
                    bg-blue-50
                    hover:bg-blue-100
                    text-blue-600
                    text-xs
                    font-semibold
                    transition
                  "
                >
                  Редактировать
                </button>

              )

            )}


            {!user?.isBlocked && (

              <button
                type="button"
                onClick={() =>
                  setDeleteItem(listing)
                }
                className="
                  py-2
                  rounded-xl
                  bg-red-50
                  hover:bg-red-100
                  text-red-600
                  text-xs
                  font-semibold
                  transition
                "
              >
                Удалить
              </button>

            )}


            {user?.isBlocked && (

              <div className="
                col-span-2
                py-2
                text-center
                rounded-xl
                bg-gray-100
                text-gray-400
                text-xs
              ">
                Управление недоступно
              </div>

            )}

          </div>

        </div>

      </div>

    ))}

  </div>

)}

  </section>
)}


  </div>




{/* RATINGS */}

{activeTab === "ratings" && (

  <div className="space-y-4">

    <div className="flex items-center gap-3 mb-5">

      <div className="text-yellow-500 text-2xl">
        ★
      </div>

      <div>
        <div className="text-2xl font-bold">
          {Number(user?.rating?.average || 0).toFixed(1)}
        </div>

        <div className="text-sm text-gray-500">
          {user?.rating?.count || 0} отзывов
        </div>
      </div>

    </div>


    {ratings.length === 0 && (

      <div className="bg-white rounded-2xl p-8 text-center text-gray-500">
        Пока нет отзывов
      </div>

    )}


    {ratings.map((rating) => (

      <div
        key={rating._id}
        className="bg-white rounded-2xl p-5 border"
      >

        <div className="flex items-center gap-3">

          <img
            src={
              rating.buyer?.avatar ||
              "/default-avatar.png"
            }
            alt=""
            className="w-12 h-12 rounded-full object-cover"
          />

          <div>

            <div className="font-semibold">
              {rating.buyer?.name || "Пользователь"}
            </div>

            <div className="text-yellow-500 text-lg">
              {"★".repeat(rating.stars)}
              {"☆".repeat(5 - rating.stars)}
            </div>

          </div>

        </div>


        {rating.comment && (

          <div className="mt-4 text-gray-700">
            {rating.comment}
          </div>

        )}
        
{/* ОТВЕТ ПРОДАВЦА */}

{rating.sellerReply?.text ? (

  <div className="mt-4 ml-6 border-l-4 border-green-200 pl-4">

    <div className="text-sm font-semibold text-gray-700">
      Ответ продавца
    </div>

    <div className="mt-1 text-gray-600">
      {rating.sellerReply.text}
    </div>

    {rating.sellerReply.updatedAt && (
      <div className="mt-2 text-xs text-gray-400">
        {new Date(
          rating.sellerReply.updatedAt
        ).toLocaleDateString("ru-RU")}
      </div>
    )}

    <button
      type="button"
      onClick={() => {
        setReplyRatingId(rating._id);
        setReplyText(
          rating.sellerReply.text
        );
      }}
      className="
        mt-2
        text-sm
        text-green-600
        hover:underline
      "
    >
      Изменить ответ
    </button>

  </div>

) : (

  <button
    type="button"
    onClick={() => {
      setReplyRatingId(rating._id);
      setReplyText("");
    }}
    className="
      mt-4
      text-sm
      text-blue-600
      hover:underline
    "
  >
    Ответить на отзыв
  </button>

)}


{/* ФОРМА ОТВЕТА */}

{replyRatingId === rating._id && (

  <div className="mt-4 ml-6">

    <textarea
      value={replyText}
      onChange={(e) =>
        setReplyText(e.target.value)
      }
      maxLength={500}
      rows={3}
      placeholder="Напишите ответ на отзыв..."
      className="
        w-full
        border
        rounded-xl
        p-3
        text-sm
        resize-none
        focus:outline-none
        focus:ring-2
        focus:ring-green-500/20
        focus:border-green-500
      "
    />

    <div className="flex items-center justify-between mt-2">

      <span className="text-xs text-gray-400">
        {replyText.length}/500
      </span>

      <div className="flex gap-2">

        <button
          type="button"
          onClick={() => {
            setReplyRatingId(null);
            setReplyText("");
          }}
          className="
            px-3
            py-2
            text-sm
            text-gray-600
            hover:bg-gray-100
            rounded-lg
          "
        >
          Отмена
        </button>

        <button
          type="button"
          disabled={
            replyLoading ||
            !replyText.trim()
          }
          onClick={() =>
            handleReplyToRating(
              rating._id
            )
          }
          className="
            px-4
            py-2
            bg-green-600
            hover:bg-green-700
            text-white
            text-sm
            rounded-lg
            disabled:bg-gray-300
            disabled:cursor-not-allowed
          "
        >
          {replyLoading
            ? "Сохранение..."
            : "Ответить"}
        </button>

      </div>

    </div>

  </div>

)}



        <div className="mt-3 text-xs text-gray-500">
          {new Date(
            rating.createdAt
          ).toLocaleDateString("ru-RU")}
        </div>

      </div>

    ))}

  </div>

)}



  
    {editItem && (

  <div
    className="
      fixed
      inset-0
      z-50
      bg-black/50
      backdrop-blur-sm
      flex
      items-center
      justify-center
      p-4
    "
    onClick={() => setEditItem(null)}
  >

<div
  className="
    w-full
    max-w-2xl
    max-h-[92vh]
    bg-white
    rounded-3xl
    shadow-2xl
    overflow-hidden
    flex
    flex-col
  "
  onClick={(e) => e.stopPropagation()}
>

  {/* ================= HEADER ================= */}

  <div className="
    flex
    items-center
    justify-between
    px-6
    py-4
    border-b
    border-gray-100
    shrink-0
  ">

    <div>
      <h2 className="
        text-xl
        font-bold
        text-gray-900
      ">
        Редактировать объявление
      </h2>

      <p className="
        text-xs
        text-gray-500
        mt-1
      ">
        Измените информацию об объявлении
      </p>
    </div>

    <button
      type="button"
      onClick={() => setEditItem(null)}
      className="
        w-9
        h-9
        rounded-full
        flex
        items-center
        justify-center
        text-gray-400
        hover:text-gray-700
        hover:bg-gray-100
        transition
        text-xl
      "
      aria-label="Закрыть"
    >
      ×
    </button>

  </div>


  {/* ================= CONTENT ================= */}

  <div className="
    overflow-y-auto
    px-6
    py-5
    space-y-6
  ">


    {/* ================= PHOTO ================= */}

    <section>

      <div className="mb-3">

        <h3 className="
          text-sm
          font-semibold
          text-gray-900
        ">
          Фотография
        </h3>

        <p className="
          text-xs
          text-gray-500
          mt-1
        ">
          Хорошее фото поможет быстрее продать товар
        </p>

      </div>


      <div className="
        grid
        grid-cols-1
        sm:grid-cols-[180px_1fr]
        gap-4
      ">

        {/* PREVIEW */}

        <div className="
          relative
          aspect-square
          rounded-2xl
          overflow-hidden
          bg-gray-100
          border
          border-gray-200
        ">

          {imageUrl ? (

            <img
              src={imageUrl}
              alt=""
              className="
                absolute
                inset-0
                w-full
                h-full
                object-cover
              "
            />

          ) : (

            <NoImage />

          )}

        </div>


        {/* UPLOAD */}

        <div className="
          rounded-2xl
          border
          border-dashed
          border-gray-300
          bg-gray-50
          p-4
          flex
          flex-col
          justify-center
        ">

          <div className="
            text-3xl
            mb-2
          ">
            📷
          </div>

          <div className="
            text-sm
            font-medium
            text-gray-800
          ">
            Загрузить новое фото
          </div>

          <div className="
            text-xs
            text-gray-500
            mt-1
            mb-3
          ">
            JPG, PNG или WEBP
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImageFile(e.target.files[0])
            }
            className="
              block
              w-full
              text-xs
              text-gray-500
              file:mr-3
              file:py-2
              file:px-3
              file:rounded-lg
              file:border-0
              file:bg-blue-50
              file:text-blue-600
              file:font-medium
              hover:file:bg-blue-100
              cursor-pointer
            "
          />

          <button
            type="button"
            onClick={handleUpload}
            disabled={!imageFile || uploading}
            className="
              mt-3
              w-full
              py-2.5
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              text-sm
              font-medium
              transition
              disabled:bg-gray-300
              disabled:cursor-not-allowed
            "
          >
            {uploading
              ? "Загрузка..."
              : "Загрузить фото"}
          </button>

        </div>

      </div>

    </section>


    {/* ================= BASIC INFO ================= */}

    <section>

      <h3 className="
        text-sm
        font-semibold
        text-gray-900
        mb-3
      ">
        Основная информация
      </h3>


      <div className="
        space-y-4
      ">

        {/* TITLE */}

        <div>

          <label className="
            block
            text-xs
            font-medium
            text-gray-600
            mb-1.5
          ">
            Название объявления
          </label>

          <input
            type="text"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value
              })
            }
            placeholder="Например: iPhone 15 Pro"
            className="
              w-full
              px-4
              py-3
              border
              border-gray-200
              rounded-xl
              text-sm
              text-gray-900
              placeholder:text-gray-400
              outline-none
              transition
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-500/10
            "
          />

        </div>


        {/* PRICE */}

        <div>

          <label className="
            block
            text-xs
            font-medium
            text-gray-600
            mb-1.5
          ">
            Цена
          </label>

          <div className="relative">

            <input
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm({
                  ...form,
                  price: e.target.value
                })
              }
              placeholder="0"
              className="
                w-full
                px-4
                py-3
                pr-12
                border
                border-gray-200
                rounded-xl
                text-sm
                font-medium
                text-gray-900
                outline-none
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-500/10
              "
            />

            <span className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-sm
              text-gray-400
              font-medium
            ">
              р.
            </span>

          </div>

        </div>


        {/* CITY */}

        <div>

          <label className="
            block
            text-xs
            font-medium
            text-gray-600
            mb-1.5
          ">
            Город
          </label>

          <input
            type="text"
            value={form.city}
            onChange={(e) =>
              setForm({
                ...form,
                city: e.target.value
              })
            }
            placeholder="Введите город"
            className="
              w-full
              px-4
              py-3
              border
              border-gray-200
              rounded-xl
              text-sm
              outline-none
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-500/10
            "
          />

        </div>


        {/* CATEGORY */}

        <div>

          <label className="
            block
            text-xs
            font-medium
            text-gray-600
            mb-1.5
          ">
            Категория
          </label>

          <select
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value
              })
            }
            className="
              w-full
              px-4
              py-3
              border
              border-gray-200
              bg-white
              rounded-xl
              text-sm
              text-gray-900
              outline-none
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-500/10
            "
          >

            <option value="">
              Выберите категорию
            </option>

            {categories
              .filter((cat) => !cat.parent)
              .map((parent) => {

                const children =
                  categories.filter(
                    (cat) =>
                      cat.parent &&
                      (
                        cat.parent === parent._id ||
                        cat.parent?._id === parent._id
                      )
                  );

                return (
                  <Fragment
                    key={parent._id}
                  >

                    <option
                      value={parent._id}
                    >
                      {parent.name}
                    </option>

                    {children.map(
                      (child) => (
                        <option
                          key={child._id}
                          value={child._id}
                        >
                          ↳ {child.name}
                        </option>
                      )
                    )}

                  </Fragment>
                );

              })}

          </select>

          {form.category && (

            <div className="
              mt-2
              text-xs
              text-blue-600
            ">

              Выбрана категория:{" "}

              <span className="font-semibold">

                {
                  categories.find(
                    (cat) =>
                      cat._id ===
                      form.category
                  )?.name
                }

              </span>

            </div>

          )}

        </div>


        {/* DESCRIPTION */}

        <div>

          <div className="
            flex
            items-center
            justify-between
            mb-1.5
          ">

            <label className="
              text-xs
              font-medium
              text-gray-600
            ">
              Описание
            </label>

            <span className="
              text-xs
              text-gray-400
            ">
              {form.description?.length || 0}
            </span>

          </div>

          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value
              })
            }
            rows={5}
            placeholder="Опишите товар, его состояние и особенности..."
            className="
              w-full
              px-4
              py-3
              border
              border-gray-200
              rounded-xl
              text-sm
              text-gray-900
              placeholder:text-gray-400
              resize-none
              outline-none
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-500/10
            "
          />

        </div>

      </div>

    </section>


    {/* ================= MODERATION NOTICE ================= */}

    <div className="
      flex
      gap-3
      p-4
      rounded-2xl
      bg-blue-50
      border
      border-blue-100
    ">

      <div className="
        w-8
        h-8
        shrink-0
        rounded-full
        bg-blue-100
        flex
        items-center
        justify-center
        text-blue-600
        text-sm
      ">
        ℹ
      </div>

      <div>

        <div className="
          text-sm
          font-semibold
          text-blue-900
        ">
          После сохранения объявление пройдет модерацию
        </div>

        <div className="
          text-xs
          text-blue-700
          mt-1
          leading-5
        ">
          После изменения информации статус объявления
          будет установлен на «На модерации».
        </div>

      </div>

    </div>

  </div>


  {/* ================= FOOTER ================= */}

  <div className="
    shrink-0
    border-t
    border-gray-100
    bg-white
    px-6
    py-4
    flex
    flex-col-reverse
    sm:flex-row
    sm:items-center
    sm:justify-between
    gap-3
  ">

    <button
      type="button"
      onClick={() => setEditItem(null)}
      className="
        px-5
        py-2.5
        rounded-xl
        text-sm
        font-medium
        text-gray-600
        hover:bg-gray-100
        transition
      "
    >
      Отмена
    </button>


    <button
      type="button"
      onClick={handleUpdate}
      className="
        px-6
        py-2.5
        rounded-xl
        bg-blue-600
        hover:bg-blue-700
        text-white
        text-sm
        font-semibold
        shadow-sm
        hover:shadow
        transition
      "
    >
      Сохранить изменения
    </button>

  </div>

</div>

  </div>
)}

{deleteItem && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="bg-white p-6 rounded-xl w-90">

      <h2 className="text-xl font-bold mb-2">
        Удалить объявление?
      </h2>

      <p className="text-gray-600 mb-4">
        "{deleteItem.title}" будет удалено без возможности восстановления.
      </p>

      <div className="flex justify-end gap-2">

        <button
          onClick={() => setDeleteItem(null)}
          className="px-3 py-1"
        >
          Отмена
        </button>

        <button
          onClick={() => handleDelete(deleteItem._id)}
          className="bg-red-600 text-white px-3 py-1 rounded"
        >
          Удалить
        </button>

      </div>

    </div>

  </div>
)}
{avatarModal && (
  <div
    className="
      fixed
      inset-0
      bg-black/50
      z-50
      flex
      items-center
      justify-center
    "
    onClick={() => setAvatarModal(false)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="
        bg-white
        rounded-2xl
        p-6
        w-full
        max-w-md
      "
    >
      <h2 className="text-xl font-bold mb-4">
        Изменить аватар
      </h2>

      <div className="flex justify-center mb-4">
        <img
          src={
            imagePreview ||
            user?.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user?.name || ""
            )}`
          }
          alt=""
          className="
            w-32
            h-32
            rounded-full
            object-cover
            border
          "
        />
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          setImageFile(file);

          if (file) {
            setImagePreview(
              URL.createObjectURL(file)
            );
          }
        }}
      />

      <div className="flex gap-2 mt-6">
        <button
          onClick={() => setAvatarModal(false)}
          className="
            flex-1
            bg-gray-200
            py-2
            rounded-xl
          "
        >
          Отмена
        </button>

        <button
          onClick={async () => {
            await handleAvatarUpload();
            setAvatarModal(false);
          }}
          className="
            flex-1
            bg-blue-600
            text-white
            py-2
            rounded-xl
          "
        >
          Сохранить
        </button>
      </div>
    </div>
  </div>
)}
{profileModal && (
  <div
    className="
      fixed inset-0
      bg-black/50
      backdrop-blur-sm
      z-50
      flex
      items-center
      justify-center
      p-3
      md:p-6
    "
    onClick={() => setProfileModal(false)}
  >

    <div
      onClick={(e) => e.stopPropagation()}
      className="
        bg-gray-50
        w-full
        max-w-2xl
        max-h-[94vh]
        overflow-hidden
        rounded-3xl
        shadow-2xl
        flex
        flex-col
      "
    >

      {/* ================= HEADER ================= */}

      <div className="
        bg-white
        px-5
        md:px-7
        py-5
        border-b
        border-gray-100
        flex
        items-center
        justify-between
        shrink-0
      ">

        <div>
          <h2 className="
            text-xl
            md:text-2xl
            font-bold
            text-gray-900
          ">
            Настройки профиля
          </h2>

          <p className="
            text-xs
            md:text-sm
            text-gray-400
            mt-1
          ">
            Управляйте личными данными и безопасностью
          </p>
        </div>

        <button
          type="button"
          onClick={() => setProfileModal(false)}
          className="
            w-9
            h-9
            rounded-full
            bg-gray-100
            hover:bg-gray-200
            text-gray-500
            flex
            items-center
            justify-center
            text-lg
            transition
          "
        >
          ×
        </button>

      </div>


      {/* ================= CONTENT ================= */}

      <div className="
        overflow-y-auto
        p-4
        md:p-6
        space-y-4
      ">


        {/* ================= PROFILE CARD ================= */}

        <div className="
          bg-white
          rounded-2xl
          border
          border-gray-100
          overflow-hidden
        ">

          <div className="
            px-5
            py-4
            border-b
            border-gray-100
          ">

            <h3 className="
              font-semibold
              text-gray-900
            ">
              Профиль
            </h3>

            <p className="
              text-xs
              text-gray-400
              mt-1
            ">
              Основная информация о вас
            </p>

          </div>


          <div className="p-5">

            {/* AVATAR */}

            <div className="
              flex
              items-center
              gap-4
              mb-6
            ">

              <div className="relative">

                <img
                  src={
                    user?.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.name || ""
                    )}&background=random`
                  }
                  alt=""
                  className="
                    w-20
                    h-20
                    rounded-full
                    object-cover
                    border-4
                    border-gray-50
                    shadow-sm
                  "
                />

                <button
                  type="button"
                  onClick={() => {
                    setProfileModal(false);
                    setAvatarModal(true);
                  }}
                  className="
                    absolute
                    right-0
                    bottom-0
                    w-7
                    h-7
                    rounded-full
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    flex
                    items-center
                    justify-center
                    text-xs
                    border-2
                    border-white
                    transition
                  "
                  title="Изменить фото"
                >
                  ✎
                </button>

              </div>


              <div>

                <div className="
                  font-semibold
                  text-gray-900
                ">
                  {user?.name}
                </div>

                <div className="
                  text-xs
                  text-gray-400
                  mt-1
                ">
                  Фото профиля
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setProfileModal(false);
                    setAvatarModal(true);
                  }}
                  className="
                    text-xs
                    text-blue-600
                    hover:underline
                    mt-2
                  "
                >
                  Изменить фотографию
                </button>

              </div>

            </div>


            {/* NAME */}

            <div className="mb-4">

              <label className="
                block
                text-xs
                font-medium
                text-gray-500
                mb-1.5
              ">
                Имя
              </label>

              <input
                type="text"
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    name: e.target.value,
                  })
                }
                placeholder="Введите имя"
                className="
                  w-full
                  bg-gray-50
                  border
                  border-gray-200
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  text-gray-900
                  outline-none
                  transition
                  focus:bg-white
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-500/10
                "
              />

            </div>


            {/* EMAIL */}

            <div className="mb-4">

              <label className="
                block
                text-xs
                font-medium
                text-gray-500
                mb-1.5
              ">
                Email
              </label>

              <div className="
                flex
                items-center
                gap-3
                bg-gray-50
                border
                border-gray-200
                rounded-xl
                px-4
                py-3
              ">

                <span className="text-gray-400">
                  ✉
                </span>

                <span className="
                  text-sm
                  text-gray-700
                  truncate
                ">
                  {user?.email}
                </span>

                <span className="
                  ml-auto
                  text-[10px]
                  px-2
                  py-1
                  rounded-full
                  bg-green-100
                  text-green-600
                  font-medium
                ">
                  подтверждён
                </span>

              </div>

              <p className="
                text-[11px]
                text-gray-400
                mt-1.5
              ">
                Email используется для входа в аккаунт
              </p>

            </div>


            {/* PHONE */}

            <div>

              <label className="
                block
                text-xs
                font-medium
                text-gray-500
                mb-1.5
              ">
                Телефон
              </label>

              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => {

                  let value = e.target.value;

                  if (value === "") {
                    setProfileForm({
                      ...profileForm,
                      phone: "",
                    });
                    return;
                  }

                  let digits = value.replace(/\D/g, "");

                  if (digits.startsWith("375")) {
                    digits = digits.substring(3);
                  }

                  digits = digits.substring(0, 9);

                  let result = "";

                  if (digits.length > 0) {
                    result = "+375 (";
                  }

                  if (digits.length > 0) {
                    result += digits.substring(0, 2);
                  }

                  if (digits.length >= 2) {
                    result += ")";
                  }

                  if (digits.length > 2) {
                    result += " " + digits.substring(2, 5);
                  }

                  if (digits.length > 5) {
                    result += "-" + digits.substring(5, 7);
                  }

                  if (digits.length > 7) {
                    result += "-" + digits.substring(7, 9);
                  }

                  setProfileForm({
                    ...profileForm,
                    phone: result,
                  });

                }}
                placeholder="+375 (29) 123-45-67"
                className="
                  w-full
                  bg-gray-50
                  border
                  border-gray-200
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  outline-none
                  transition
                  focus:bg-white
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-500/10
                "
              />

            </div>

          </div>

        </div>


        {/* ================= SECURITY ================= */}

        <div className="
          bg-white
          rounded-2xl
          border
          border-gray-100
          overflow-hidden
        ">

          <div className="
            px-5
            py-4
            border-b
            border-gray-100
          ">

            <div className="
              flex
              items-center
              gap-3
            ">

              <div className="
                w-9
                h-9
                rounded-xl
                bg-blue-50
                text-blue-600
                flex
                items-center
                justify-center
              ">
                🔒
              </div>

              <div>

                <h3 className="
                  font-semibold
                  text-gray-900
                ">
                  Безопасность
                </h3>

                <p className="
                  text-xs
                  text-gray-400
                  mt-0.5
                ">
                  Управление паролем аккаунта
                </p>

              </div>

            </div>

          </div>


          <div className="p-5">

            <div className="
              grid
              md:grid-cols-2
              gap-4
            ">

              {/* OLD PASSWORD */}

              <div>

                <label className="
                  block
                  text-xs
                  font-medium
                  text-gray-500
                  mb-1.5
                ">
                  Текущий пароль
                </label>

                <input
                  type="password"
                  value={profileForm.oldPassword}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      oldPassword: e.target.value,
                    })
                  }
                  placeholder="Введите текущий пароль"
                  className="
                    w-full
                    bg-gray-50
                    border
                    border-gray-200
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    outline-none
                    focus:bg-white
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-500/10
                  "
                />

              </div>


              {/* NEW PASSWORD */}

              <div>

                <label className="
                  block
                  text-xs
                  font-medium
                  text-gray-500
                  mb-1.5
                ">
                  Новый пароль
                </label>

                <input
                  type="password"
                  value={profileForm.newPassword}
                  onChange={(e) => {

                    const value = e.target.value;

                    setProfileForm({
                      ...profileForm,
                      newPassword: value,
                    });

                    setPasswordStrength(
                      checkPasswordStrength(value)
                    );

                  }}
                  placeholder="Введите новый пароль"
                  className="
                    w-full
                    bg-gray-50
                    border
                    border-gray-200
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    outline-none
                    focus:bg-white
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-500/10
                  "
                />

              </div>

            </div>


            {/* PASSWORD STRENGTH */}

            {profileForm.newPassword && (
              <div className="mt-4">

                <div className="
                  flex
                  gap-1
                  h-1.5
                ">

                  {[1, 2, 3, 4, 5].map((item) => (

                    <div
                      key={item}
                      className={`
                        flex-1
                        rounded-full
                        transition
                        ${
                          item <= passwordStrength.score
                            ? passwordStrength.score <= 2
                              ? "bg-red-500"
                              : passwordStrength.score <= 4
                                ? "bg-yellow-400"
                                : "bg-green-500"
                            : "bg-gray-200"
                        }
                      `}
                    />

                  ))}

                </div>

                <div className="
                  flex
                  justify-between
                  mt-2
                ">

                  <span className="
                    text-xs
                    text-gray-400
                  ">
                    Надёжность пароля
                  </span>

                  <span
                    className={`
                      text-xs
                      font-medium
                      ${
                        passwordStrength.score <= 2
                          ? "text-red-500"
                          : passwordStrength.score <= 4
                            ? "text-yellow-600"
                            : "text-green-600"
                      }
                    `}
                  >
                    {passwordStrength.text}
                  </span>

                </div>

              </div>
            )}

          </div>

        </div>


        {/* ================= AGREEMENT ================= */}

        <div className="
          bg-white
          rounded-2xl
          border
          border-gray-100
          overflow-hidden
        ">

          <div className="
            px-5
            py-4
            border-b
            border-gray-100
          ">

            <h3 className="
              font-semibold
              text-gray-900
            ">
              Согласия и документы
            </h3>

          </div>


          <div className="p-5">

            <div className="
              flex
              items-start
              gap-3
            ">

              <div className="
                w-9
                h-9
                rounded-xl
                bg-green-50
                text-green-600
                flex
                items-center
                justify-center
                shrink-0
              ">
                ✓
              </div>

              <div className="min-w-0">

                <div className="
                  font-medium
                  text-sm
                  text-gray-900
                ">
                  Пользовательское соглашение
                </div>

                <div className="
                  text-xs
                  text-gray-400
                  mt-1
                ">
                  Согласие принято{" "}
                  {user?.acceptedTermsDate
                    ? new Date(
                        user.acceptedTermsDate
                      ).toLocaleDateString("ru-RU")
                    : "-"
                  }
                </div>

                <div className="
                  flex
                  flex-wrap
                  gap-4
                  mt-3
                ">

                  <Link
                    to="/terms"
                    target="_blank"
                    className="
                      text-xs
                      text-blue-600
                      hover:underline
                    "
                  >
                    Пользовательское соглашение
                  </Link>

                  <Link
                    to="/privacy"
                    target="_blank"
                    className="
                      text-xs
                      text-blue-600
                      hover:underline
                    "
                  >
                    Политика данных
                  </Link>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ERROR */}

        {profileError && (
          <div className="
            bg-red-50
            border
            border-red-200
            text-red-600
            rounded-xl
            px-4
            py-3
            text-sm
          ">
            {profileError}
          </div>
        )}

      </div>


      {/* ================= FOOTER ================= */}

      <div className="
        bg-white
        border-t
        border-gray-100
        p-4
        md:px-6
        flex
        gap-3
        shrink-0
      ">

        <button
          type="button"
          onClick={() => setProfileModal(false)}
          className="
            flex-1
            md:flex-none
            md:px-6
            py-3
            rounded-xl
            bg-gray-100
            hover:bg-gray-200
            text-gray-700
            text-sm
            font-medium
            transition
          "
        >
          Отмена
        </button>

        <button
          type="button"
          onClick={handleUpdateProfile}
          disabled={savingProfile}
          className="
            flex-1
            py-3
            rounded-xl
            bg-blue-600
            hover:bg-blue-700
            text-white
            text-sm
            font-semibold
            shadow-sm
            hover:shadow
            transition
            disabled:bg-gray-300
            disabled:cursor-not-allowed
          "
        >
          {savingProfile
            ? "Сохранение..."
            : "Сохранить изменения"
          }
        </button>

      </div>

    </div>

  </div>
)}

    </MainLayout>
    
  );
}