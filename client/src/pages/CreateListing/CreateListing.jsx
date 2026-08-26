import { useEffect, useState, useRef } from "react";
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

  const [noPhotos, setNoPhotos] = useState(false);

  const [activeStep, setActiveStep] = useState(1);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const selectedCategory = categories.find( (cat) => cat._id === form.category);
  const [categoryPath, setCategoryPath] = useState([]);   
  

  const stepRefs = Array.from({ length: 8 }, () => useRef(null)); 

  const [loadingImage, setLoadingImage] = useState(null);

 const handleImageSelect = (e, index) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setLoadingImage(index);
  setNoPhotos(false);

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
  setImages((prev) => {
    const updated = prev.filter((_, i) => i !== index);

    if (updated.length === 0) {
      setNoPhotos(false);
    }

    return updated;
  });

  setPreviews((prev) => {
    const updated = [...prev];

    if (updated[index]?.url) {
      URL.revokeObjectURL(updated[index].url);
    }

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

  const getParentId = (category) => {
  if (!category?.parent) return null;

  if (typeof category.parent === "object") {
    return category.parent._id;
  }

  return category.parent;
};

const rootCategories = categories.filter(
  (cat) => !getParentId(cat)
);

const getSubcategories = (parentId) => {
  return categories.filter(
    (cat) => getParentId(cat) === parentId
  );
};

const openCategory = (category) => {
  const subcategories = getSubcategories(category._id);

  // Если есть подкатегории — открываем их
  if (subcategories.length > 0) {
    setCategoryPath((prev) => [...prev, category]);
    return;
  }

  // Если это конечная категория — выбираем её
  setForm((prev) => ({
    ...prev,
    category: category._id,
  }));

 
  setShowCategoryModal(false);
  setCategoryPath([]);
};

const goBackCategory = () => {
  setCategoryPath((prev) => prev.slice(0, -1));
};

const closeCategoryModal = () => {
  setShowCategoryModal(false);
  setCategoryPath([]);
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

const availableCities =
  region === "Все города"
    ? Object.values(regions).flat()
    : region
      ? regions[region] || []
      : [];

  const steps = [
  "Название объявления",
  "Категория",
  "Состояние и продавец",
  "Описание",
  "Фотографии",
  "Цена",
  "Местоположение",
  "Информация о продавце",
];

const isStepCompleted = (step) => {
  switch (step) {
    case 1:
      return form.title.trim().length > 0;

    case 2:
      return !!form.category;

    case 3:
      return !!form.condition && !!form.sellerType;

    case 4:
      return form.description.trim().length > 0;

    case 5:
      return images.length > 0 || noPhotos;

    case 6:
      return form.price !== "" && Number(form.price) >= 0;

    case 7:
      return !!region && !!city;

    case 8:
      return !!user?.name && !!user?.phone;

    default:
      return false;
  }
};
useEffect(() => {
  const observers = [];

  stepRefs.forEach((ref, index) => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveStep(index + 1);
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    observer.observe(ref.current);
    observers.push(observer);
  });

  return () => {
    observers.forEach((observer) => observer.disconnect());
  };
}, []);

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
                Заполните информацию о товаре или услуге — это займёт всего несколько минут
              </p>
            </div>

            <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-blue-50 items-center justify-center">
              <span className="text-3xl">📦</span>
            </div>
          </div>

        </div>
      </div>

      {/* Форма + прогресс */}
<div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

  <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-8 items-start">

    {/* ================= ФОРМА ================= */}

    <form
      onSubmit={submit}
      className="space-y-5 min-w-0"
    >

          {/* 1. НАЗВАНИЕ */}
          <section 
          ref={stepRefs[0]}
          className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
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
          <section 
          ref={stepRefs[1]}
          className="bg-white border border-gray-200 rounded-3xl shadow-sm">
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

              <button
  type="button"
  onClick={() => setShowCategoryModal(true)}
  className="
    w-full
    min-h-14
    px-4
    rounded-2xl
    border
    border-gray-200
    bg-gray-50
    outline-none
    cursor-pointer
    transition
    text-left
    flex
    items-center
    justify-between
    gap-3
    hover:bg-white
    hover:border-blue-400
    focus:border-blue-500
    focus:ring-4
    focus:ring-blue-500/10
  "
>
  <span
    className={
      selectedCategory
        ? "text-gray-900 font-medium"
        : "text-gray-400"
    }
  >
    {selectedCategory
      ? selectedCategory.name
      : "Выберите категорию"}
  </span>

  <span className="text-gray-400 text-xl">
    ›
  </span>
</button>

            </div>
          </section>
          {/* 3. СОСТОЯНИЕ И ПРОДАВЕЦ */}
<section 
ref={stepRefs[2]}
className="bg-white border border-gray-200 rounded-3xl shadow-sm">
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
          <section 
          ref={stepRefs[3]}
          className="bg-white border border-gray-200 rounded-3xl shadow-sm">
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
          <section 
          ref={stepRefs[4]}
          className="bg-white border border-gray-200 rounded-3xl shadow-sm">
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
              <div className="mt-4 flex justify-center">
  <button
    type="button"
    onClick={() => {
      setNoPhotos(true);
      setImages([]);
      setPreviews([]);
    }}
    className={`
      inline-flex
      items-center
      gap-2
      px-4
      h-11
      rounded-xl
      border-2
      border-dashed
      transition-all
      duration-200
      text-sm
      font-medium

      ${
        noPhotos
          ? "border-blue-500 bg-blue-50 text-blue-600"
          : "border-gray-300 bg-gray-50 text-gray-500 hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-600"
      }
    `}
  >
    <span
      className={`
        w-6
        h-6
        rounded-lg
        flex
        items-center
        justify-center
        text-sm
        ${
          noPhotos
            ? "bg-blue-100 text-blue-600"
            : "bg-gray-100 text-gray-400"
        }
      `}
    >
      ✓
    </span>

    {noPhotos ? "Без фотографий выбрано" : "Добавить без фотографий"}
  </button>
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
          <section 
          ref={stepRefs[5]}
          className="bg-white border border-gray-200 rounded-3xl shadow-sm">
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
          <section 
          ref={stepRefs[6]}
          className="bg-white border border-gray-200 rounded-3xl shadow-sm">
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
          <section 
          ref={stepRefs[7]}
          className="bg-white border border-gray-200 rounded-3xl shadow-sm">
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
<div className="bottom-4 z-20">
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

        {/* ================= ПРОГРЕСС ================= */}

      <aside className="hidden lg:block sticky top-15 self-start h-fit">
  <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">

    <div className="mb-4">
      <h3 className="font-bold text-gray-900">
        Заполнение объявления
      </h3>

      <p className="text-xs text-gray-500 mt-1">
        Шаг {activeStep} из {steps.length}
      </p>
    </div>

    {/* ШАГИ */}

    <div className="space-y-1">

      {steps.map((step, index) => {

        const number = index + 1;

        const isActive =
          activeStep === number;

        const isCompleted = isStepCompleted(number);

        return (
          <button
            key={step}
            type="button"
            onClick={() => {
              stepRefs[index].current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }}
            className={`
              w-full
              flex
              items-center
              gap-3
              text-left
              rounded-xl
              px-3
              py-2.5
              transition-all
              duration-200
              min-w-0

              ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "hover:bg-gray-50 text-gray-600"
              }
            `}
          >

            <span
              className={`
                shrink-0
                w-7
                h-7
                rounded-full
                flex
                items-center
                justify-center
                border-2
                text-xs
                font-bold
                transition-all

                ${
                  isCompleted
                    ? "bg-blue-600 border-blue-600 text-white"
                    : isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-gray-300 text-gray-400"
                }
              `}
            >
              {isCompleted ? "✓" : number}
            </span>

            <span
              className={`
                text-sm
                leading-tight
                min-w-0

                ${
                  isActive
                    ? "font-semibold text-blue-700"
                    : isCompleted
                      ? "text-gray-700"
                      : "text-gray-500"
                }
              `}
            >
              {step}
            </span>

          </button>
        );
      })}

    </div>

    {/* ПРОГРЕСС */}

    <div className="mt-4 pt-4 border-t border-gray-100">

      <div className="flex justify-between text-xs text-gray-500 mb-2">
        <span>
          Прогресс
        </span>

        <span>
          {
  Math.round(
    (steps.filter((_, index) =>
      isStepCompleted(index + 1)
    ).length / steps.length) * 100
  )
}%
        </span>
      </div>

      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">

        <div
          className="
            h-full
            bg-blue-600
            rounded-full
            transition-all
            duration-500
          "
          style={{
  width: `${
    (steps.filter((_, index) =>
      isStepCompleted(index + 1)
    ).length / steps.length) * 100
  }%`,
}}
        />

      </div>

    </div>

  </div>
</aside>
    
</div>
      </div>
    </div>
    {showCategoryModal && (
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
    onMouseDown={(e) => {
      if (e.target === e.currentTarget) {
        closeCategoryModal();
      }
    }}
  >
    <div
      className="
        w-full
        max-w-2xl
        max-h-[85vh]
        bg-white
        rounded-3xl
        shadow-2xl
        overflow-hidden
        flex
        flex-col
      "
    >

      {/* HEADER */}
      <div className="
        shrink-0
        px-5
        sm:px-7
        py-5
        border-b
        border-gray-100
        flex
        items-center
        gap-3
      ">

        {/* Назад */}
        {categoryPath.length > 0 && (
          <button
            type="button"
            onClick={goBackCategory}
            className="
              w-10
              h-10
              rounded-xl
              bg-gray-100
              hover:bg-gray-200
              flex
              items-center
              justify-center
              text-xl
              text-gray-600
              transition
              shrink-0
            "
          >
            ‹
          </button>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-gray-900">
            {categoryPath.length > 0
              ? categoryPath[categoryPath.length - 1].name
              : "Выберите категорию"}
          </h3>

          {categoryPath.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Выберите подкатегорию
            </p>
          )}
        </div>

        {/* Закрыть */}
        <button
          type="button"
          onClick={closeCategoryModal}
          className="
            w-10
            h-10
            rounded-xl
            bg-gray-100
            hover:bg-gray-200
            flex
            items-center
            justify-center
            text-xl
            text-gray-500
            transition
            shrink-0
          "
        >
          ×
        </button>

      </div>

      {/* ХЛЕБНЫЕ КРОШКИ */}
      {categoryPath.length > 0 && (
        <div className="
          px-5
          sm:px-7
          pt-4
          text-sm
          text-gray-400
        ">
          <button
            type="button"
            onClick={() => {
              setCategoryPath([]);
            }}
            className="hover:text-blue-600 transition"
          >
            Все категории
          </button>

          {categoryPath.map((category) => (
            <span key={category._id}>
              <span className="mx-2">›</span>
              <span className="text-gray-600">
                {category.name}
              </span>
            </span>
          ))}
        </div>
      )}

      {/* СПИСОК */}
      <div className="
        flex-1
        overflow-y-auto
        p-5
        sm:p-7
      ">

        {(() => {
          const currentParent =
            categoryPath.length > 0
              ? categoryPath[categoryPath.length - 1]._id
              : null;

          const currentCategories =
            categoryPath.length > 0
              ? getSubcategories(currentParent)
              : rootCategories;

          return (
            <div className="space-y-2">

              {currentCategories.map((category) => {

                const hasChildren =
                  getSubcategories(category._id).length > 0;

                return (
                  <button
                    key={category._id}
                    type="button"
                    onClick={() => openCategory(category)}
                    className="
                      w-full
                      min-h-16
                      px-5
                      py-3
                      rounded-2xl
                      border
                      border-gray-100
                      bg-gray-50
                      hover:bg-blue-50
                      hover:border-blue-200
                      transition
                      flex
                      items-center
                      justify-between
                      text-left
                      group
                    "
                  >

                    <div className="flex items-center gap-4">

                      <div className="
                        w-11
                        h-11
                        rounded-xl
                        bg-white
                        border
                        border-gray-100
                        flex
                        items-center
                        justify-center
                        text-xl
                        group-hover:bg-blue-100
                        group-hover:border-blue-200
                        transition
                      ">
                        📦
                      </div>

                      <span className="
                        font-medium
                        text-gray-800
                        group-hover:text-blue-700
                        transition
                      ">
                        {category.name}
                      </span>

                    </div>

                    <span className="
                      text-xl
                      text-gray-300
                      group-hover:text-blue-500
                      transition
                    ">
                      {hasChildren ? "›" : "✓"}
                    </span>

                  </button>
                );
              })}

              {currentCategories.length === 0 && (
                <div className="
                  py-12
                  text-center
                  text-gray-400
                ">
                  Категории не найдены
                </div>
              )}

            </div>
          );
        })()}

      </div>

    </div>
  </div>
)}
  </MainLayout>
);
}