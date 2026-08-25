import { useEffect, useState } from "react";
import { createListing } from "../../api/listingApi";
// import { uploadImage } from "../../api/uploadApi";
import { useNavigate } from "react-router-dom";
import { useCategoryStore } from "../../store/categoryStore";
import MainLayout from "../../layouts/MainLayout";
import { useAuthStore } from "../../store/authStore";
import { regions } from "../../data/regions";
import { Link } from "react-router-dom";


export default function CreateListing() {

  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  useEffect(() => {
  if (user?.isBlocked) {
    navigate("/profile"); 
  }
}, [user]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    region: "",
    city: "",
    category: "",
    condition: "used",
    sellerType: "private"

  });

  const { categories, fetchCategories } = useCategoryStore();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [loadingImage, setLoadingImage] = useState(null);

 const handleImageSelect = (e, index) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setLoadingImage(index);

  const newImages = [...images];
  newImages[index] = file;
  setImages(newImages);

  const newPreviews = [...previews];
  newPreviews[index] = {
    file,
    url: URL.createObjectURL(file),
  };
  setPreviews(newPreviews);

  setLoadingImage(null);
};

const removeImage = (index) => {
  setImages((prev) => prev.filter((_, i) => i !== index));

  setPreviews((prev) => {
    const updated = [...prev];
    URL.revokeObjectURL(updated[index].url);
    updated.splice(index, 1);
    return updated;
  });
};
useEffect(() => {
  return () => {
    previews.forEach((p) => URL.revokeObjectURL(p.url));
  };
}, [previews]);

  useEffect(() => {
    fetchCategories();
  }, []);

  

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

 const submit = async (e) => {
  e.preventDefault();

  if (!user?.phone) {
    alert(
      "Перед публикацией объявления укажите номер телефона в профиле."
    );
    return;
  }

  if (!form.title.trim()) {
    alert("Введите название объявления.");
    return;
  }

  if (!form.category) {
    alert("Выберите категорию.");
    return;
  }

  if (!form.description.trim()) {
    alert("Введите описание объявления.");
    return;
  }

  if (!form.price || Number(form.price) < 0) {
    alert("Укажите корректную цену.");
    return;
  }

  if (!region) {
    alert("Выберите область.");
    return;
  }

  if (!city) {
    alert("Выберите город.");
    return;
  }

  setLoading(true);

  try {
    const formData = new FormData();

    formData.append("title", form.title.trim());
    formData.append("description", form.description.trim());
    formData.append("price", String(Number(form.price)));
    formData.append("region", region);
    formData.append("city", city);
    formData.append("category", form.category);
    formData.append("condition", form.condition || "used");
    formData.append("sellerType", form.sellerType || "private");

    images.forEach((file) => {
      if (file) {
        formData.append("images", file);
      }
    });

    await createListing(formData);

    navigate("/");
  } catch (error) {
    console.error("Ошибка создания объявления:", error);

    alert(
      error?.response?.data?.message ||
      "Не удалось создать объявление. Попробуйте ещё раз."
    );
  } finally {
    setLoading(false);
  }
};
const MAX_IMAGES = 5;

const availableCities = region
  ? regions[region] || []
  : [];

  return (
  <MainLayout>
    <div className="min-h-screen bg-gray-50">

      {/* Верхняя часть */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

          <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="hover:text-blue-600 transition"
            >
              Главная
            </button>

            <span>›</span>

            <span className="text-gray-900">
              Новое объявление
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                Подать объявление
              </h1>

              <p className="mt-2 text-gray-500">
                Заполните информацию о товаре — это займёт всего несколько минут
              </p>
            </div>

            <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-blue-50 items-center justify-center">
              <span className="text-3xl">📦</span>
            </div>
          </div>

        </div>
      </div>

      {/* Форма */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        <form
          onSubmit={submit}
          className="space-y-5"
        >

          {/* 1. НАЗВАНИЕ */}
          <section className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-5 sm:p-7">

              <div className="flex items-start gap-4 mb-6">

                <div className="
                  shrink-0
                  w-10
                  h-10
                  rounded-xl
                  bg-blue-600
                  text-white
                  flex
                  items-center
                  justify-center
                  font-bold
                  shadow-lg
                  shadow-blue-500/20
                ">
                  1
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Название объявления
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Коротко и понятно опишите, что вы продаёте
                  </p>
                </div>

              </div>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Например: iPhone 15 Pro 256GB"
                maxLength={50}
                required
                className="
                  w-full
                  h-14
                  px-4
                  rounded-2xl
                  border
                  border-gray-200
                  bg-gray-50
                  text-gray-900
                  placeholder:text-gray-400
                  outline-none
                  transition
                  focus:bg-white
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-500/10
                "
              />

              <div className="flex justify-between mt-2 px-1">
                <span className="text-xs text-gray-400">
                  Хорошее название повышает количество просмотров
                </span>

                <span className="text-xs text-gray-400">
                  {form.title.length}/50
                </span>
              </div>

            </div>
          </section>


          {/* 2. КАТЕГОРИЯ */}
          <section className="bg-white border border-gray-200 rounded-3xl shadow-sm">
            <div className="p-5 sm:p-7">

              <div className="flex items-start gap-4 mb-6">

                <div className="
                  shrink-0
                  w-10
                  h-10
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                  flex
                  items-center
                  justify-center
                  font-bold
                ">
                  2
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    Категория
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Выберите категорию, которая лучше всего подходит вашему товару
                  </p>
                </div>

              </div>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="
                  w-full
                  h-14
                  px-4
                  rounded-2xl
                  border
                  border-gray-200
                  bg-gray-50
                  outline-none
                  cursor-pointer
                  transition
                  focus:bg-white
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-500/10
                "
              >
                <option value="">
                  Выберите категорию
                </option>

                {categories.map((cat) => (
                  <option
                    key={cat._id}
                    value={cat._id}
                  >
                    {cat.name}
                  </option>
                ))}
              </select>

            </div>
          </section>
          {/* 3. СОСТОЯНИЕ И ПРОДАВЕЦ */}
<section className="bg-white border border-gray-200 rounded-3xl shadow-sm">
  <div className="p-5 sm:p-7">

    <div className="flex items-start gap-4 mb-6">

      <div className="
        shrink-0
        w-10
        h-10
        rounded-xl
        bg-blue-50
        text-blue-600
        flex
        items-center
        justify-center
        font-bold
      ">
        3
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900">
          Состояние и продавец
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Укажите состояние товара и тип продавца
        </p>
      </div>

    </div>

    <div className="grid sm:grid-cols-2 gap-5">

      {/* СОСТОЯНИЕ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Состояние товара
        </label>

        <select
          name="condition"
          value={form.condition}
          onChange={handleChange}
          required
          className="
            w-full
            h-14
            px-4
            rounded-2xl
            border
            border-gray-200
            bg-gray-50
            outline-none
            cursor-pointer
            transition
            focus:bg-white
            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-500/10
          "
        >
          <option value="used">
            Б/у
          </option>

          <option value="new">
            Новое
          </option>
        </select>
      </div>

      {/* ТИП ПРОДАВЦА */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Продавец
        </label>

        <select
          name="sellerType"
          value={form.sellerType}
          onChange={handleChange}
          required
          className="
            w-full
            h-14
            px-4
            rounded-2xl
            border
            border-gray-200
            bg-gray-50
            outline-none
            cursor-pointer
            transition
            focus:bg-white
            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-500/10
          "
        >
          <option value="private">
            Частное лицо
          </option>

          <option value="company">
            Компания
          </option>
        </select>
      </div>

    </div>

  </div>
</section>


          {/* 4. ОПИСАНИЕ */}
          <section className="bg-white border border-gray-200 rounded-3xl shadow-sm">
            <div className="p-5 sm:p-7">

              <div className="flex items-start gap-4 mb-6">

                <div className="
                  shrink-0
                  w-10
                  h-10
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                  flex
                  items-center
                  justify-center
                  font-bold
                ">
                  4
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    Описание
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Расскажите о состоянии, характеристиках и особенностях товара
                  </p>
                </div>

              </div>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={8}
                maxLength={4000}
                required
                placeholder="Например: продаю в отличном состоянии, использовался аккуратно..."
                className="
                  w-full
                  p-4
                  rounded-2xl
                  border
                  border-gray-200
                  bg-gray-50
                  resize-none
                  outline-none
                  transition
                  focus:bg-white
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-500/10
                "
              />

              <div className="flex justify-between mt-2 px-1">
                <span className="text-xs text-gray-400">
                  Чем подробнее описание, тем больше доверия покупателей
                </span>

                <span className="text-xs text-gray-400">
                  {form.description.length}/4000
                </span>
              </div>

            </div>
          </section>


          {/* 5. ФОТО */}
          <section className="bg-white border border-gray-200 rounded-3xl shadow-sm">
            <div className="p-5 sm:p-7">

              <div className="flex items-start gap-4 mb-6">

                <div className="
                  shrink-0
                  w-10
                  h-10
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                  flex
                  items-center
                  justify-center
                  font-bold
                ">
                  5
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    Фотографии
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Добавьте до 5 фотографий. Первое фото будет главным.
                  </p>
                </div>

              </div>


              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">

                {Array.from({ length: MAX_IMAGES }).map((_, index) => (

                  <div
                    key={index}
                    className={`
                      relative
                      aspect-square
                      rounded-2xl
                      overflow-hidden
                      transition-all
                      ${
                        previews[index]
                          ? "bg-gray-100"
                          : "border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/50"
                      }
                    `}
                  >

                    {previews[index] ? (

                      <div className="relative w-full h-full group">

                        <img
                          src={previews[index].url}
                          alt={`Фото ${index + 1}`}
                          className="
                            w-full
                            h-full
                            object-cover
                            transition
                            duration-300
                            group-hover:scale-105
                          "
                        />

                        {index === 0 && (
                          <span className="
                            absolute
                            top-2
                            left-2
                            px-2
                            py-1
                            rounded-lg
                            bg-blue-600
                            text-white
                            text-[10px]
                            font-bold
                          ">
                            ГЛАВНОЕ
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="
                            absolute
                            top-2
                            right-2
                            w-8
                            h-8
                            rounded-xl
                            bg-black/60
                            backdrop-blur
                            text-white
                            flex
                            items-center
                            justify-center
                            opacity-0
                            group-hover:opacity-100
                            transition
                            hover:bg-red-500
                          "
                        >
                          ×
                        </button>

                      </div>

                    ) : (

                      <label className="
                        w-full
                        h-full
                        flex
                        flex-col
                        items-center
                        justify-center
                        cursor-pointer
                        gap-2
                      ">

                        <div className="
                          w-11
                          h-11
                          rounded-xl
                          bg-gray-100
                          flex
                          items-center
                          justify-center
                          text-2xl
                          text-gray-400
                        ">
                          +
                        </div>

                        <span className="text-xs font-medium text-gray-500">
                          Добавить
                        </span>

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageSelect(e, index)
                          }
                        />

                      </label>

                    )}

                  </div>

                ))}

              </div>


              <div className="
                mt-5
                flex
                items-start
                gap-3
                rounded-2xl
                bg-blue-50
                border
                border-blue-100
                p-4
              ">

                <span className="text-lg">
                  💡
                </span>

                <p className="text-sm text-blue-800">
                  Используйте качественные фотографии товара.
                  Хорошие фото заметно увеличивают интерес покупателей.
                </p>

              </div>

            </div>
          </section>


          {/* 6. ЦЕНА */}
          <section className="bg-white border border-gray-200 rounded-3xl shadow-sm">
            <div className="p-5 sm:p-7">

              <div className="flex items-start gap-4 mb-6">

                <div className="
                  shrink-0
                  w-10
                  h-10
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                  flex
                  items-center
                  justify-center
                  font-bold
                ">
                  6
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    Цена
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Укажите стоимость товара
                  </p>
                </div>

              </div>


              <div className="relative">

                <input
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0"
                  type="number"
                  min="0"
                  required
                  className="
                    w-full
                    h-16
                    px-5
                    pr-20
                    rounded-2xl
                    border
                    border-gray-200
                    bg-gray-50
                    text-2xl
                    font-bold
                    outline-none
                    transition
                    focus:bg-white
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-500/10
                  "
                />

                <span className="
                  absolute
                  right-5
                  top-1/2
                  -translate-y-1/2
                  font-semibold
                  text-gray-400
                ">
                  BYN
                </span>

              </div>

            </div>
          </section>


          {/* 7. МЕСТОПОЛОЖЕНИЕ */}
          <section className="bg-white border border-gray-200 rounded-3xl shadow-sm">
            <div className="p-5 sm:p-7">

              <div className="flex items-start gap-4 mb-6">

                <div className="
                  shrink-0
                  w-10
                  h-10
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                  flex
                  items-center
                  justify-center
                  font-bold
                ">
                  7
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    Местоположение
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Где находится товар?
                  </p>
                </div>

              </div>


              <div className="grid sm:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Область
                  </label>

                  <select
                    value={region}
                    onChange={(e) => {
                      setRegion(e.target.value);
                      setCity("");
                    }}
                    required
                    className="
                      w-full
                      h-14
                      px-4
                      rounded-2xl
                      border
                      border-gray-200
                      bg-gray-50
                      outline-none
                      transition
                      focus:bg-white
                      focus:border-blue-500
                      focus:ring-4
                      focus:ring-blue-500/10
                    "
                  >
                    <option value="">
                      Выберите область
                    </option>

                    {Object.keys(regions).map((regionName) => (
                      <option
                        key={regionName}
                        value={regionName}
                      >
                        {regionName}
                      </option>
                    ))}
                  </select>
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Город
                  </label>

                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={!region}
                    required
                    className="
                      w-full
                      h-14
                      px-4
                      rounded-2xl
                      border
                      border-gray-200
                      bg-gray-50
                      outline-none
                      transition
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                      focus:bg-white
                      focus:border-blue-500
                      focus:ring-4
                      focus:ring-blue-500/10
                    "
                  >
                    <option value="">
                      {region
                        ? "Выберите город"
                        : "Сначала выберите область"}
                    </option>

                    {availableCities.map((cityName) => (
                      <option
                        key={cityName}
                        value={cityName}
                      >
                        {cityName}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

            </div>
          </section>


          {/* 8. ПРОДАВЕЦ */}
          <section className="bg-white border border-gray-200 rounded-3xl shadow-sm">
            <div className="p-5 sm:p-7">

              <div className="flex items-start gap-4 mb-6">

                <div className="
                  shrink-0
                  w-10
                  h-10
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                  flex
                  items-center
                  justify-center
                  font-bold
                ">
                  8
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    Информация о продавце
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Эти данные будут отображаться в объявлении
                  </p>
                </div>

              </div>


              <div className="grid sm:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Имя
                  </label>

                  <div className="
                    h-14
                    px-4
                    rounded-2xl
                    border
                    border-gray-200
                    bg-gray-50
                    flex
                    items-center
                    text-gray-700
                  ">
                    {user?.name || "Не указано"}
                  </div>
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Телефон
                  </label>

                  <div className="
                    h-14
                    px-4
                    rounded-2xl
                    border
                    border-gray-200
                    bg-gray-50
                    flex
                    items-center
                    text-gray-700
                  ">
                    {user?.phone || "Не указан"}
                  </div>

                  {!user?.phone && (
                    <p className="text-xs text-red-500 mt-2">
                      Добавьте номер телефона в профиле.
                    </p>
                  )}
                </div>

              </div>

            </div>
          </section>


          {/* ПОДСКАЗКА */}
<div
  className="
    bg-linear-to-r
    from-blue-600
    to-indigo-600
    rounded-3xl
    p-6
    text-white
    shadow-xl
    shadow-blue-500/20
  "
>
  <div className="flex gap-4">
    <div
      className="
        shrink-0
        w-11
        h-11
        rounded-2xl
        bg-white/15
        flex
        items-center
        justify-center
        text-xl
      "
    >
      ✨
    </div>

    <div>
      <h3 className="font-bold text-lg">
        Почти готово!
      </h3>

      <p className="text-sm text-blue-100 mt-1 leading-relaxed">
        Проверьте название, цену, фотографии и местоположение
        перед публикацией. После отправки объявление появится
        на проверке.
      </p>
    </div>
  </div>
</div>

{/* КНОПКА */}
<div className="sticky bottom-4 z-20">
  <button
    type="submit"
    disabled={loading || !user?.phone}
    className="
      group
      w-full
      h-16
      rounded-2xl
      bg-blue-600
      hover:bg-blue-700
      disabled:bg-gray-300
      disabled:cursor-not-allowed
      text-white
      font-bold
      text-lg
      shadow-xl
      shadow-blue-500/20
      hover:shadow-blue-500/30
      transition-all
      duration-300
      hover:-translate-y-0.5
      flex
      items-center
      justify-center
      gap-3
    "
  >
    {loading ? (
      <>
        <span
          className="
            w-5
            h-5
            border-2
            border-white/40
            border-t-white
            rounded-full
            animate-spin
          "
        />

        Публикация...
      </>
    ) : (
      <>
        <span
          className="
            text-2xl
            transition-transform
            duration-300
            group-hover:scale-125
          "
        >
          +
        </span>

        Подать объявление
      </>
    )}
  </button>
</div>

<p className="text-center text-xs text-gray-400 pb-4">
  Публикуя объявление, вы соглашаетесь с условиями 
  <Link 
        to="/terms"
        className=" hover:text-gray-300 transition ml-2"
      >
        Пользовательского соглашения.
      </Link>
  
</p>

        </form>

      </div>
    </div>
  </MainLayout>
);
}