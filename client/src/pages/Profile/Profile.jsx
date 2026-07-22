import { useEffect, useState } from "react";
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

   const handleLogout = () => {
  logout();
  };

  const loadListings = async () => {
    try {
      const { data } = await getMyListings();
      setListings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">

  {/* HEADER */}
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

    {/* LEFT: PROFILE INFO */}
    <div className="flex items-center gap-5">

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
          w-20 h-20 md:w-24 md:h-24
          rounded-full object-cover border
          cursor-pointer hover:opacity-80 transition
        "
      />

      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold">
          Имя: {user?.name}
        </h1>

        <p className="text-gray-500 text-sm">
          Email: {user?.email}
        </p>
        <p className="text-gray-500 text-sm">
  Телефон: {user?.phone || "Телефон не указан"}
</p>
        <p className="text-gray-500">
                На сайте с{" "}
                {new Date(
                  user.createdAt
                ).toLocaleDateString("ru-RU")}
              </p>

              <p className="mt-2">
                Объявлений: {listings.length}
              </p>
      </div>

    </div>
{profileMessage && (
<div
className="
mb-4
bg-green-50
border
border-green-200
text-green-700
p-3
rounded-xl
text-sm
"
>
{profileMessage}
</div>
)}
    {/* RIGHT: ACTIONS */}
    <div className=" flex-col sm:flex-row gap-3">

      <button
        onClick={() => setProfileModal(true)}
        className="
          px-4 py-2
          rounded-xl
          bg-blue-600 hover:bg-blue-700 mb-3
          transition
          text-sm
          text-white 
        "
      >
        Редактировать профиль
      </button>

      <button
        onClick={handleLogout}
        className="
          flex items-center justify-center gap-2
          px-4 py-2
          rounded-xl
          bg-red-50 hover:bg-red-100
          text-red-600
          transition
          text-sm font-medium
        "
      >
        <LogOut size={16} />
        Выйти
      </button>

    </div>

  </div>

  {/* DOCUMENTS */}

{user?.acceptedTerms && (

<div className="
  mt-6
  bg-linear-to-r
  from-green-50
  to-white
  border
  border-green-100
  rounded-2xl
  p-5
">


<div className="
  flex
  items-center
  justify-between
  mb-4
">

<h3 className="
  text-lg
  font-semibold
  text-gray-900
">
  Документы и соглашения
</h3>


<div className="
  bg-green-100
  text-green-700
  text-xs
  px-3
  py-1
  rounded-full
">
  Принято
</div>


</div>



<div className="
  space-y-3
  text-sm
">


<div className="
  flex
  items-center
  gap-2
  text-gray-700
">

<span className="
  w-6
  h-6
  rounded-full
  bg-green-600
  text-white
  flex
  items-center
  justify-center
  text-xs
">
✓
</span>


Пользовательское соглашение

</div>




<div className="
  flex
  justify-between
  bg-white
  rounded-xl
  p-3
">

<span className="text-gray-500">
Версия документа
</span>

<span className="font-medium">
{user.acceptedTermsVersion}
</span>

</div>



<div className="
  flex
  justify-between
  bg-white
  rounded-xl
  p-3
">

<span className="text-gray-500">
Дата принятия
</span>

<span className="font-medium">

{
 user.acceptedTermsDate
 ?
 new Date(
   user.acceptedTermsDate
 )
 .toLocaleDateString("ru-RU")
 :
 "-"
}

</span>

</div>



<div className="
 flex
 gap-4
 pt-2
">


<Link
to="/terms"
className="
text-green-600
text-sm
hover:underline
"
>
Пользовательское соглашение
</Link>


<Link
to="/privacy"
className="
text-green-600
text-sm
hover:underline
"
>
Политика данных
</Link>


</div>



</div>

</div>

)}

  {/* BLOCKED MESSAGE */}
  {user?.isBlocked && (
    <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
      <div className="font-semibold">
        🚫 Ваш аккаунт заблокирован
      </div>

      <div className="text-sm mt-1">
        Размещение и редактирование объявлений недоступно.
        Обратитесь к администрации.
      </div>
    </div>
  )}

  {/* CREATE BUTTON */}
  {!user?.isBlocked && (
    <div className="mt-6">
      <Link
        to="/create-listing"
        className="
          inline-flex items-center justify-center
          bg-blue-600 hover:bg-blue-700
          text-white
          px-5 py-3
          rounded-xl
          transition
          text-sm font-medium
        "
      >
        Создать объявление
      </Link>
    </div>
  )}

</div>

      <h2 className="text-2xl font-bold mb-6">
        Мои объявления
      </h2>

      {listings.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl">
          У вас пока нет объявлений
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <div key={listing._id} className="relative">

                <ListingCard listing={listing} />
                <div className="mt-2">

  {listing.status === "pending" && (
    <div className="bg-yellow-100 text-yellow-700 px-3 py-2 rounded-lg text-sm">
      ⏳ Объявление находится на модерации
    </div>
  )}

  {listing.status === "approved" && (
    <div className="bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm">
      ✅ Объявление опубликовано
    </div>
  )}

  {listing.status === "rejected" && (
    <div className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm">
      ❌ Объявление отклонено модератором
    </div>
  )}

</div>

                {/* ACTIONS */}
                <div className="flex flex-wrap gap-2 mt-2 w-full">

  {!user?.isBlocked && (
    <button
    onClick={() => setDeleteItem(listing)}
    className="bg-red-500 text-white px-2 py-1 text-xs rounded"
  >
    Удалить
  </button>
  )}

  {!user?.isBlocked ? (
  listing.status === "rejected" ? (
    <button
      onClick={() => openEditModal(listing)}
      className="bg-orange-500 text-white px-2 py-1 text-xs rounded"
    >
      Исправить
    </button>
  ) : (
    <button
      onClick={() => openEditModal(listing)}
      className="bg-blue-500 text-white px-2 py-1 text-xs rounded"
    >
      Редактировать
    </button>
  )
) : (
  <button
    disabled
    className="bg-gray-300 text-gray-600 px-2 py-1 text-xs rounded cursor-not-allowed"
    title="Аккаунт заблокирован"
  >
    Редактирование недоступно
  </button>
)}

</div>

              </div>
            ))}
          </div>
        )}


    </div>
    {editItem && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl w-105 max-h-[90vh] overflow-auto">

      <h2 className="text-xl font-bold mb-4">
        Редактировать объявление
      </h2>

      <input
        className="w-full border p-2 mb-2 rounded"
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
        placeholder="Название"
      />

      <textarea
        className="w-full border p-2 mb-2 rounded"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
        placeholder="Описание"
      />

      <input
        className="w-full border p-2 mb-2 rounded"
        value={form.price}
        onChange={(e) =>
          setForm({ ...form, price: e.target.value })
        }
        placeholder="Цена"
      />

      <input
        className="w-full border p-2 mb-2 rounded"
        value={form.city}
        onChange={(e) =>
          setForm({ ...form, city: e.target.value })
        }
        placeholder="Город"
      />

      {/* CATEGORY */}
      <select
        className="w-full border p-2 mb-2 rounded"
        value={form.category}
        onChange={(e) =>
          setForm({ ...form, category: e.target.value })
        }
      >
        <option value="">Выберите категорию</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* IMAGE UPLOAD */}
      <div className="border p-3 rounded mb-3">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        <button
          type="button"
          onClick={handleUpload}
          className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
        >
          {uploading ? "Загрузка..." : "Загрузить фото"}
        </button>

        {imageUrl && (
          <img
            src={imageUrl}
            className="mt-3 w-full h-40 object-cover rounded"
          />
        )}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => setEditItem(null)}
          className="px-3 py-1"
        >
          Отмена
        </button>

        <button
          onClick={handleUpdate}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Сохранить
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
    fixed 
    inset-0 
    bg-black/50 
    z-50 
    flex 
    items-center 
    justify-center
    p-4
    overflow-y-auto
  "
>
  <div 
    className="
      bg-white
      p-6
      rounded-xl
      w-full
      max-w-md
      max-h-[90vh]
      overflow-y-auto
    "
  >

      <h2 className="text-xl font-bold mb-4">
        Редактировать профиль
      </h2>

      {profileError && (
  <div className="
    mb-4
    bg-red-50
    border
    border-red-200
    text-red-600
    p-3
    rounded-xl
    text-sm
  ">
    {profileError}
  </div>
)}
{profileMessage && (
<div className="
bg-green-50
border
border-green-200
text-green-700
p-3
rounded-xl
text-sm
mb-3
">
{profileMessage}
</div>
)}

      {/* NAME */}
      <input
className="w-full border p-2 mb-3 rounded"
value={profileForm.name}
onChange={(e)=>
 setProfileForm({
   ...profileForm,
   name:e.target.value
 })
}
placeholder="Имя"
/>

       {/* PHONE */}
<input
  type="tel"
  className="w-full border p-2 mb-3 rounded"
  value={profileForm.phone}
  onChange={(e)=>{

 let value = e.target.value;


 // если пользователь всё стер
 if(value === ""){
   setProfileForm({
     ...profileForm,
     phone:""
   });
   return;
 }


 let cursor = e.target.selectionStart;


 let digits = value.replace(/\D/g,"");


 // убираем 375
 if(digits.startsWith("375")){
   digits = digits.substring(3);
 }


 digits = digits.substring(0,9);


 let result="";
if (
 e.nativeEvent.inputType === "deleteContentBackward" &&
 value.length < profileForm.phone.length
){
 setProfileForm({
   ...profileForm,
   phone:value
 });
 return;
}

 if(digits.length > 0){
   result="+375 (";
 }


 if(digits.length > 0){
   result += digits.substring(0,2);
 }


 if(digits.length >=2){
   result+=")";
 }


 if(digits.length >2){
   result+=" "+digits.substring(2,5);
 }


 if(digits.length >5){
   result+="-"+digits.substring(5,7);
 }


 if(digits.length >7){
   result+="-"+digits.substring(7,9);
 }


 setProfileForm({
   ...profileForm,
   phone:result
 });


}}
  placeholder="+375 (29) 123-45-67"
/>


      {/* OLD PASSWORD */}
      <input
        type="password"
        className="w-full border p-2 mb-3 rounded"
        value={profileForm.oldPassword}
        onChange={(e) =>
          setProfileForm({
            ...profileForm,
            oldPassword: e.target.value,
          })
        }
        placeholder="Старый пароль"
      />

      {/* NEW PASSWORD */}
                <div>

<input
  type="password"
  placeholder="Пароль"
  value={profileForm.newPassword}
  required
  onChange={(e)=>{

    const value = e.target.value;

    setProfileForm({
  ...profileForm,
  newPassword:value
});

setPasswordStrength(
  checkPasswordStrength(value)
);

  }}

  className="
    w-full
    p-3.5
    border
    rounded-xl
    outline-none
    focus:ring-2
    focus:ring-green-500
  "
/>



{profileForm.newPassword && (

<div className="mt-3">


<div className="
 flex
 gap-1
 h-2
 mb-2
">


{[1,2,3,4,5].map((item)=>(

<div

key={item}

className={`
 flex-1
 rounded-full

 ${
 item <= passwordStrength.score
 ?
 passwordStrength.score <=2
 ?
 "bg-red-500"
 :
 passwordStrength.score <=4
 ?
 "bg-yellow-400"
 :
 "bg-green-500"

 :
 "bg-gray-200"
 }

`}

/>

))}


</div>



<p
className={`
text-sm
font-medium

${
passwordStrength.score <=2
?
"text-red-500"
:
passwordStrength.score <=4
?
"text-yellow-600"
:
"text-green-600"

}

`}
>

{passwordStrength.text}

</p>


<div className="
text-xs
text-gray-500
mt-2
space-y-1
">

<p className={
profileForm.newPassword?.length>=8
?
"text-green-600"
:
""
}>
✓ Минимум 8 символов
</p>


<p className={
/[A-Z]/.test(profileForm.newPassword || "")
?
"text-green-600"
:
""
}>
✓ Заглавная буква
</p>


<p className={
/[a-z]/.test(profileForm.newPassword || "")
?
"text-green-600"
:
""
}>
✓ Строчная буква
</p>


<p className={
/\d/.test(profileForm.newPassword || "")
?
"text-green-600"
:
""
}>
✓ Цифра
</p>


<p className={
/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(profileForm.newPassword || "")
?
"text-green-600"
:
""
}>
✓ Специальный символ
</p>


</div>


</div>

)}

</div>

      {/* PERSONAL DATA AGREEMENT */}

<div className="
  mt-4
  p-4
  bg-gray-50
  border
  rounded-xl
">

  <h3 className="
    font-semibold
    text-gray-900
    mb-3
  ">
    Согласия пользователя
  </h3>


  <div className="
    flex
    items-start
    gap-3
  ">


    <input
      type="checkbox"
      checked={user?.acceptedTerms || false}
      disabled
      className="
        mt-1
        w-4
        h-4
      "
    />


    <div className="text-sm">

      <p className="text-gray-700">

        Я согласен на обработку персональных данных

      </p>


      <div className="
        flex
        gap-3
        mt-2
      ">

        <Link
          to="/personal-data"
          target="_blank"
          className="
            text-blue-600
            hover:underline
          "
        >
          Посмотреть согласие
        </Link>


        <Link
          to="/privacy"
          target="_blank"
          className="
            text-blue-600
            hover:underline
          "
        >
          Политика данных
        </Link>

      </div>


      <p className="
        text-xs
        text-gray-500
        mt-2
      ">
        Принято:
        {" "}
        {
          user?.acceptedTermsDate
          ?
          new Date(
            user.acceptedTermsDate
          ).toLocaleDateString("ru-RU")
          :
          "-"
        }
      </p>


    </div>


  </div>

</div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setProfileModal(false)}
          className="flex-1 bg-gray-200 py-2 rounded-xl"
        >
          Отмена
        </button>

        <button
 onClick={handleUpdateProfile}
 disabled={savingProfile}
 className="
 flex-1
 bg-blue-600
 text-white
 py-2
 rounded-xl
 disabled:bg-gray-400
 "
>
 {
 savingProfile
 ? "Сохранение..."
 : "Сохранить"
 }
</button>
      </div>

    </div>
  </div>
)}
    </MainLayout>
    
  );
}