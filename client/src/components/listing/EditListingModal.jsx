import { useEffect, useState } from "react";
import {
  X,
  Check,
  ImagePlus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Package,
  MapPin,
  Tag,
  FileText,
  Banknote,
} from "lucide-react";

import { updateListing } from "../../api/listingApi";
import { useCategoryStore } from "../../store/categoryStore";
import { regions } from "../../data/regions";

export default function EditListingModal({
  listing,
  onClose,
  onSaved,
}) {
  const { categories, fetchCategories } = useCategoryStore();

  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    region: "",
    city: "",
    category: "",
    condition: "used",
    sellerType: "private",
  });

  /*
  |--------------------------------------------------------------------------
  | Фотографии
  |--------------------------------------------------------------------------
  |
  | Каждый элемент:
  |
  | {
  |   type: "existing",
  |   url: "https://..."
  | }
  |
  | или
  |
  | {
  |   type: "new",
  |   file: File,
  |   url: "blob:..."
  | }
  |
  */

  const [images, setImages] = useState([]);

  const [categoryPath, setCategoryPath] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  /*
  |--------------------------------------------------------------------------
  | Заполняем форму данными объявления
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!listing) return;

    setForm({
      title: listing.title || "",
      description: listing.description || "",
      price: listing.price ?? "",
      region: listing.region || "",
      city: listing.city || "",
      category:
        typeof listing.category === "object"
          ? listing.category?._id || ""
          : listing.category || "",
      condition: listing.condition || "used",
      sellerType: listing.sellerType || "private",
    });

    const existingImages = (listing.images || []).map((url) => ({
      type: "existing",
      url,
    }));

    setImages(existingImages);
    setCurrentImage(0);
  }, [listing]);

  /*
  |--------------------------------------------------------------------------
  | Изменение полей
  |--------------------------------------------------------------------------
  */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Категории
  |--------------------------------------------------------------------------
  */

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

  const selectedCategory = categories.find(
    (cat) => cat._id === form.category
  );

  const openCategory = (category) => {
    const subcategories = getSubcategories(category._id);

    if (subcategories.length > 0) {
      setCategoryPath((prev) => [...prev, category]);
      return;
    }

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

  /*
  |--------------------------------------------------------------------------
  | Фотографии
  |--------------------------------------------------------------------------
  */

  const addImages = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const available = 5 - images.length;

    if (available <= 0) {
      alert("Можно добавить максимум 5 фотографий.");
      return;
    }

    const selected = files.slice(0, available);

    const newImages = selected.map((file) => ({
      type: "new",
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);

    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const image = prev[index];

      if (image?.type === "new" && image.url) {
        URL.revokeObjectURL(image.url);
      }

      const updated = prev.filter((_, i) => i !== index);

      return updated;
    });

    setCurrentImage((prev) => {
      if (prev > 0 && prev >= images.length - 1) {
        return prev - 1;
      }

      return prev;
    });
  };

  const nextImage = () => {
    if (images.length <= 1) return;

    setCurrentImage((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (images.length <= 1) return;

    setCurrentImage((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Отправка
  |--------------------------------------------------------------------------
  */

  const submit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Введите название объявления.");
      return;
    }

    if (!form.category) {
      alert("Выберите категорию.");
      return;
    }

    if (!form.description.trim()) {
      alert("Введите описание.");
      return;
    }

    if (
      form.price === "" ||
      Number(form.price) < 0
    ) {
      alert("Укажите корректную цену.");
      return;
    }

    if (!form.region) {
      alert("Выберите область.");
      return;
    }

    if (!form.city) {
      alert("Выберите город.");
      return;
    }

    if (images.length === 0) {
      alert("Добавьте хотя бы одну фотографию.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append(
        "title",
        form.title.trim()
      );

      formData.append(
        "description",
        form.description.trim()
      );

      formData.append(
        "price",
        String(Number(form.price))
      );

      formData.append(
        "region",
        form.region
      );

      formData.append(
        "city",
        form.city
      );

      formData.append(
        "category",
        form.category
      );

      formData.append(
        "condition",
        form.condition
      );

      formData.append(
        "sellerType",
        form.sellerType
      );

      /*
       * Передаём существующие фотографии
       */

      const existingImages = images
        .filter((image) => image.type === "existing")
        .map((image) => image.url);

      formData.append(
        "existingImages",
        JSON.stringify(existingImages)
      );

      /*
       * Передаём новые фотографии
       */

      images
        .filter((image) => image.type === "new")
        .forEach((image) => {
          formData.append(
            "images",
            image.file
          );
        });

      const updatedListing = await updateListing(
  listing._id,
  formData
);

if (onSaved) {
  onSaved(updatedListing);
}

onClose();
    } catch (error) {
      console.error(
        "Ошибка редактирования объявления:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Не удалось сохранить изменения."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Города
  |--------------------------------------------------------------------------
  */

  const availableCities =
    form.region
      ? regions[form.region] || []
      : [];

  /*
  |--------------------------------------------------------------------------
  | Cleanup blob URL
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (
          image.type === "new" &&
          image.url
        ) {
          URL.revokeObjectURL(image.url);
        }
      });
    };
  }, [images]);

  if (!listing) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-100
        bg-black/60
        backdrop-blur-sm
        flex
        items-center
        justify-center
        p-0
        sm:p-4
      "
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >

      <div
        className="
          relative
          w-full
          h-full
          sm:h-auto
          sm:max-h-[94vh]
          sm:max-w-5xl
          bg-gray-50
          sm:rounded-3xl
          shadow-2xl
          overflow-hidden
          flex
          flex-col
        "
      >

        {/* =========================================================
            HEADER
        ========================================================= */}

        <header
          className="
            shrink-0
            bg-white
            border-b
            border-gray-200
            px-5
            sm:px-7
            py-4
            flex
            items-center
            gap-4
          "
        >

          <div
            className="
              w-11
              h-11
              rounded-2xl
              bg-blue-50
              text-blue-600
              flex
              items-center
              justify-center
              shrink-0
            "
          >
            <Package size={22} />
          </div>

          <div className="flex-1 min-w-0">

            <h2
              className="
                text-xl
                sm:text-2xl
                font-black
                text-gray-900
                truncate
              "
            >
              Редактировать объявление
            </h2>

            <p
              className="
                text-sm
                text-gray-500
                mt-0.5
                truncate
              "
            >
              Измените информацию о товаре
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              w-10
              h-10
              rounded-xl
              bg-gray-100
              hover:bg-gray-200
              text-gray-500
              flex
              items-center
              justify-center
              transition
              shrink-0
            "
          >
            <X size={21} />
          </button>

        </header>

        {/* =========================================================
            CONTENT
        ========================================================= */}

        <form
          onSubmit={submit}
          className="
            flex-1
            overflow-y-auto
          "
        >

          <div
            className="
              max-w-4xl
              mx-auto
              p-4
              sm:p-6
              lg:p-8
              space-y-5
            "
          >

            {/* =====================================================
                ОСНОВНАЯ ИНФОРМАЦИЯ
            ===================================================== */}

            <section
              className="
                bg-white
                border
                border-gray-200
                rounded-3xl
                shadow-sm
                overflow-hidden
              "
            >

              <div className="p-5 sm:p-7">

                <div className="flex gap-4 mb-6">

                  <div
                    className="
                      w-10
                      h-10
                      rounded-xl
                      bg-blue-600
                      text-white
                      flex
                      items-center
                      justify-center
                      shrink-0
                    "
                  >
                    <Tag size={19} />
                  </div>

                  <div>

                    <h3
                      className="
                        text-lg
                        font-bold
                        text-gray-900
                      "
                    >
                      Основная информация
                    </h3>

                    <p
                      className="
                        text-sm
                        text-gray-500
                        mt-1
                      "
                    >
                      Название и категория товара
                    </p>

                  </div>

                </div>

                {/* Название */}

                <label
                  className="
                    block
                    text-sm
                    font-semibold
                    text-gray-700
                    mb-2
                  "
                >
                  Название объявления
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  maxLength={50}
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
                  placeholder="Например: iPhone 15 Pro 256GB"
                />

                <div
                  className="
                    flex
                    justify-end
                    text-xs
                    text-gray-400
                    mt-2
                  "
                >
                  {form.title.length}/50
                </div>

                {/* Категория */}

                <label
                  className="
                    block
                    text-sm
                    font-semibold
                    text-gray-700
                    mb-2
                    mt-5
                  "
                >
                  Категория
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setShowCategoryModal(true)
                  }
                  className="
                    w-full
                    min-h-14
                    px-4
                    rounded-2xl
                    border
                    border-gray-200
                    bg-gray-50
                    hover:bg-white
                    hover:border-blue-400
                    transition
                    flex
                    items-center
                    justify-between
                    text-left
                  "
                >

                  <span
                    className={
                      selectedCategory
                        ? "font-medium text-gray-900"
                        : "text-gray-400"
                    }
                  >
                    {selectedCategory
                      ? selectedCategory.name
                      : "Выберите категорию"}
                  </span>

                  <span className="text-xl text-gray-400">
                    ›
                  </span>

                </button>

              </div>

            </section>

            {/* =====================================================
                СОСТОЯНИЕ
            ===================================================== */}

            <section
              className="
                bg-white
                border
                border-gray-200
                rounded-3xl
                shadow-sm
              "
            >

              <div className="p-5 sm:p-7">

                <div className="flex gap-4 mb-6">

                  <div
                    className="
                      w-10
                      h-10
                      rounded-xl
                      bg-blue-50
                      text-blue-600
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Check size={20} />
                  </div>

                  <div>

                    <h3 className="text-lg font-bold">
                      Состояние и продавец
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Основные характеристики объявления
                    </p>

                  </div>

                </div>

                <div className="grid sm:grid-cols-2 gap-4">

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Состояние
                    </label>

                    <select
                      name="condition"
                      value={form.condition}
                      onChange={handleChange}
                      className="
                        w-full
                        h-14
                        px-4
                        rounded-2xl
                        border
                        border-gray-200
                        bg-gray-50
                        outline-none
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

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Продавец
                    </label>

                    <select
                      name="sellerType"
                      value={form.sellerType}
                      onChange={handleChange}
                      className="
                        w-full
                        h-14
                        px-4
                        rounded-2xl
                        border
                        border-gray-200
                        bg-gray-50
                        outline-none
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

            {/* =====================================================
                ОПИСАНИЕ
            ===================================================== */}

            <section
              className="
                bg-white
                border
                border-gray-200
                rounded-3xl
                shadow-sm
              "
            >

              <div className="p-5 sm:p-7">

                <div className="flex gap-4 mb-6">

                  <div
                    className="
                      w-10
                      h-10
                      rounded-xl
                      bg-blue-50
                      text-blue-600
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <FileText size={20} />
                  </div>

                  <div>

                    <h3 className="text-lg font-bold">
                      Описание
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Подробно расскажите о товаре
                    </p>

                  </div>

                </div>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  maxLength={4000}
                  rows={7}
                  className="
                    w-full
                    p-4
                    rounded-2xl
                    border
                    border-gray-200
                    bg-gray-50
                    resize-none
                    outline-none
                    focus:bg-white
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-500/10
                  "
                  placeholder="Опишите состояние, характеристики и особенности товара..."
                />

                <div className="flex justify-end mt-2 text-xs text-gray-400">
                  {form.description.length}/4000
                </div>

              </div>

            </section>

            {/* =====================================================
                ФОТОГРАФИИ
            ===================================================== */}

            <section
              className="
                bg-white
                border
                border-gray-200
                rounded-3xl
                shadow-sm
              "
            >

              <div className="p-5 sm:p-7">

                <div className="flex gap-4 mb-6">

                  <div
                    className="
                      w-10
                      h-10
                      rounded-xl
                      bg-blue-50
                      text-blue-600
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <ImagePlus size={20} />
                  </div>

                  <div>

                    <h3 className="text-lg font-bold">
                      Фотографии
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      До 5 фотографий. Первое фото — главное.
                    </p>

                  </div>

                </div>

                {/* Главное фото */}

                {images.length > 0 && (
                  <div
                    className="
                      relative
                      w-full
                      aspect-video
                      sm:aspect-2/1
                      rounded-2xl
                      overflow-hidden
                      bg-gray-100
                      mb-4
                    "
                  >

                    <img
                      src={images[currentImage]?.url}
                      alt={form.title}
                      className="
                        w-full
                        h-full
                        object-contain
                        bg-gray-100
                      "
                    />

                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={prevImage}
                          className="
                            absolute
                            left-3
                            top-1/2
                            -translate-y-1/2
                            w-10
                            h-10
                            rounded-full
                            bg-black/50
                            text-white
                            flex
                            items-center
                            justify-center
                            hover:bg-black/70
                            transition
                          "
                        >
                          <ChevronLeft size={22} />
                        </button>

                        <button
                          type="button"
                          onClick={nextImage}
                          className="
                            absolute
                            right-3
                            top-1/2
                            -translate-y-1/2
                            w-10
                            h-10
                            rounded-full
                            bg-black/50
                            text-white
                            flex
                            items-center
                            justify-center
                            hover:bg-black/70
                            transition
                          "
                        >
                          <ChevronRight size={22} />
                        </button>
                      </>
                    )}

                    <div
                      className="
                        absolute
                        left-3
                        top-3
                        px-3
                        py-1.5
                        rounded-xl
                        bg-blue-600
                        text-white
                        text-xs
                        font-bold
                      "
                    >
                      ГЛАВНОЕ ФОТО
                    </div>

                  </div>
                )}

                {/* Миниатюры */}

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">

                  {images.map((image, index) => (
                    <div
                      key={`${image.url}-${index}`}
                      className={`
                        relative
                        aspect-square
                        rounded-2xl
                        overflow-hidden
                        border-2
                        cursor-pointer
                        group
                        ${
                          currentImage === index
                            ? "border-blue-500"
                            : "border-gray-100"
                        }
                      `}
                      onClick={() =>
                        setCurrentImage(index)
                      }
                    >

                      <img
                        src={image.url}
                        alt={`Фото ${index + 1}`}
                        className="
                          w-full
                          h-full
                          object-cover
                        "
                      />

                      {index === 0 && (
                        <span
                          className="
                            absolute
                            left-2
                            bottom-2
                            px-2
                            py-1
                            rounded-lg
                            bg-blue-600
                            text-white
                            text-[9px]
                            font-bold
                          "
                        >
                          ГЛАВНОЕ
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="
                          absolute
                          right-2
                          top-2
                          w-8
                          h-8
                          rounded-xl
                          bg-black/60
                          text-white
                          flex
                          items-center
                          justify-center
                          opacity-100
                          sm:opacity-0
                          group-hover:opacity-100
                          transition
                          hover:bg-red-500
                        "
                      >
                        <Trash2 size={15} />
                      </button>

                    </div>
                  ))}

                  {images.length < 5 && (
                    <label
                      className="
                        aspect-square
                        rounded-2xl
                        border-2
                        border-dashed
                        border-gray-300
                        hover:border-blue-400
                        hover:bg-blue-50/50
                        transition
                        cursor-pointer
                        flex
                        flex-col
                        items-center
                        justify-center
                        gap-2
                      "
                    >

                      <div
                        className="
                          w-11
                          h-11
                          rounded-xl
                          bg-gray-100
                          text-gray-400
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <ImagePlus size={21} />
                      </div>

                      <span className="text-xs font-semibold text-gray-500">
                        Добавить фото
                      </span>

                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={addImages}
                      />

                    </label>
                  )}

                </div>

                <div
                  className="
                    mt-5
                    p-4
                    rounded-2xl
                    bg-blue-50
                    border
                    border-blue-100
                    text-sm
                    text-blue-800
                  "
                >
                  💡 Первое фото будет отображаться в каталоге
                  и на карточке объявления.
                </div>

              </div>

            </section>

            {/* =====================================================
                ЦЕНА
            ===================================================== */}

            <section
              className="
                bg-white
                border
                border-gray-200
                rounded-3xl
                shadow-sm
              "
            >

              <div className="p-5 sm:p-7">

                <div className="flex gap-4 mb-6">

                  <div
                    className="
                      w-10
                      h-10
                      rounded-xl
                      bg-green-50
                      text-green-600
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Banknote size={20} />
                  </div>

                  <div>

                    <h3 className="text-lg font-bold">
                      Цена
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Стоимость товара
                    </p>

                  </div>

                </div>

                <div className="relative">

                  <input
                    name="price"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={handleChange}
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
                      font-black
                      outline-none
                      focus:bg-white
                      focus:border-blue-500
                      focus:ring-4
                      focus:ring-blue-500/10
                    "
                    placeholder="0"
                  />

                  <span
                    className="
                      absolute
                      right-5
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                      font-bold
                    "
                  >
                    BYN
                  </span>

                </div>

              </div>

            </section>

            {/* =====================================================
                МЕСТОПОЛОЖЕНИЕ
            ===================================================== */}

            <section
              className="
                bg-white
                border
                border-gray-200
                rounded-3xl
                shadow-sm
              "
            >

              <div className="p-5 sm:p-7">

                <div className="flex gap-4 mb-6">

                  <div
                    className="
                      w-10
                      h-10
                      rounded-xl
                      bg-orange-50
                      text-orange-600
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <MapPin size={20} />
                  </div>

                  <div>

                    <h3 className="text-lg font-bold">
                      Местоположение
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Где находится товар
                    </p>

                  </div>

                </div>

                <div className="grid sm:grid-cols-2 gap-4">

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Область
                    </label>

                    <select
                      name="region"
                      value={form.region}
                      onChange={(e) => {
                        setForm((prev) => ({
                          ...prev,
                          region: e.target.value,
                          city: "",
                        }));
                      }}
                      className="
                        w-full
                        h-14
                        px-4
                        rounded-2xl
                        border
                        border-gray-200
                        bg-gray-50
                        outline-none
                        focus:bg-white
                        focus:border-blue-500
                        focus:ring-4
                        focus:ring-blue-500/10
                      "
                    >

                      <option value="">
                        Выберите область
                      </option>

                      {Object.keys(regions).map(
                        (regionName) => (
                          <option
                            key={regionName}
                            value={regionName}
                          >
                            {regionName}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Город
                    </label>

                    <select
                      name="city"
                      value={form.city}
                      disabled={!form.region}
                      onChange={handleChange}
                      className="
                        w-full
                        h-14
                        px-4
                        rounded-2xl
                        border
                        border-gray-200
                        bg-gray-50
                        outline-none
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        focus:bg-white
                        focus:border-blue-500
                        focus:ring-4
                        focus:ring-blue-500/10
                      "
                    >

                      <option value="">
                        {form.region
                          ? "Выберите город"
                          : "Сначала выберите область"}
                      </option>

                      {availableCities.map(
                        (cityName) => (
                          <option
                            key={cityName}
                            value={cityName}
                          >
                            {cityName}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                </div>

              </div>

            </section>

            {/* =====================================================
                НИЖНЯЯ ПОДСКАЗКА
            ===================================================== */}

            <div
              className="
                rounded-3xl
                bg-linear-to-r
                from-blue-600
                to-indigo-600
                p-5
                sm:p-6
                text-white
                shadow-xl
                shadow-blue-500/20
              "
            >

              <div className="flex gap-4">

                <div
                  className="
                    w-11
                    h-11
                    rounded-2xl
                    bg-white/15
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >
                  ✨
                </div>

                <div>

                  <h3 className="font-bold text-lg">
                    Проверьте изменения
                  </h3>

                  <p className="text-sm text-blue-100 mt-1 leading-relaxed">
                    После сохранения обновлённая информация
                    появится в вашем объявлении.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </form>

        {/* =========================================================
            FOOTER
        ========================================================= */}

        <footer
          className="
            shrink-0
            bg-white
            border-t
            border-gray-200
            px-4
            sm:px-7
            py-3
            sm:py-4
            flex
            items-center
            justify-end
            gap-3
          "
        >

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              h-12
              px-5
              rounded-xl
              bg-gray-100
              hover:bg-gray-200
              text-gray-700
              font-semibold
              transition
              disabled:opacity-50
            "
          >
            Отмена
          </button>

          <button
            type="submit"
            onClick={submit}
            disabled={loading}
            className="
              h-12
              px-7
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-bold
              shadow-lg
              shadow-blue-500/20
              transition
              disabled:bg-gray-300
              disabled:shadow-none
              flex
              items-center
              justify-center
              gap-2
              min-w-47.5
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

                Сохранение...
              </>
            ) : (
              <>
                <Check size={19} />

                Сохранить изменения
              </>
            )}

          </button>

        </footer>

      </div>

      {/* ===========================================================
          CATEGORY MODAL
      =========================================================== */}

      {showCategoryModal && (
        <div
          className="
            absolute
            inset-0
            z-120
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

            {/* Header */}

            <div
              className="
                px-5
                sm:px-7
                py-5
                border-b
                border-gray-100
                flex
                items-center
                gap-3
              "
            >

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
                  "
                >
                  ‹
                </button>
              )}

              <div className="flex-1">

                <h3 className="text-xl font-bold">
                  {categoryPath.length
                    ? categoryPath[
                        categoryPath.length - 1
                      ].name
                    : "Выберите категорию"}
                </h3>

                {categoryPath.length > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    Выберите подкатегорию
                  </p>
                )}

              </div>

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
                "
              >
                <X size={19} />
              </button>

            </div>

            {/* Breadcrumb */}

            {categoryPath.length > 0 && (
              <div
                className="
                  px-5
                  sm:px-7
                  pt-4
                  text-sm
                  text-gray-400
                "
              >

                <button
                  type="button"
                  onClick={() =>
                    setCategoryPath([])
                  }
                  className="hover:text-blue-600"
                >
                  Все категории
                </button>

                {categoryPath.map((category) => (
                  <span key={category._id}>
                    <span className="mx-2">
                      ›
                    </span>

                    <span className="text-gray-600">
                      {category.name}
                    </span>
                  </span>
                ))}

              </div>
            )}

            {/* Categories */}

            <div className="flex-1 overflow-y-auto p-5 sm:p-7">

              {(() => {
                const currentParent =
                  categoryPath.length
                    ? categoryPath[
                        categoryPath.length - 1
                      ]._id
                    : null;

                const currentCategories =
                  categoryPath.length
                    ? getSubcategories(
                        currentParent
                      )
                    : rootCategories;

                return (
                  <div className="space-y-2">

                    {currentCategories.map(
                      (category) => {

                        const hasChildren =
                          getSubcategories(
                            category._id
                          ).length > 0;

                        return (
                          <button
                            key={category._id}
                            type="button"
                            onClick={() =>
                              openCategory(category)
                            }
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
                            "
                          >

                            <div className="flex items-center gap-4">

                              <div
                                className="
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
                                "
                              >
                                📦
                              </div>

                              <span className="font-medium">
                                {category.name}
                              </span>

                            </div>

                            <span className="text-xl text-gray-300">
                              {hasChildren
                                ? "›"
                                : "✓"}
                            </span>

                          </button>
                        );
                      }
                    )}

                    {!currentCategories.length && (
                      <div className="py-12 text-center text-gray-400">
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

    </div>
  );
}