import { useEffect, useState } from "react";
import { createListing } from "../../api/listingApi";
// import { uploadImage } from "../../api/uploadApi";
import { useNavigate } from "react-router-dom";
import { useCategoryStore } from "../../store/categoryStore";
import MainLayout from "../../layouts/MainLayout";
import { useAuthStore } from "../../store/authStore";
import { regions } from "../../data/regions";


export default function CreateListing() {

  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  useEffect(() => {
  if (user?.isBlocked) {
    navigate("/profile"); // или "/"
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

  // const handleUpload = async () => {
  //   if (!imageFile) return;

  //   setUploading(true);

  //   try {
  //     const { data } = await uploadImage(imageFile);
  //     setImageUrl(data.url);
  //   } catch (err) {
  //     alert("Ошибка загрузки фото");
  //   } finally {
  //     setUploading(false);
  //   }
  // };
// const formData = new FormData();

// images.forEach((file) => {
//   formData.append("images", file);
// });

 const submit = async (e) => {
  e.preventDefault();

  const formData = new FormData();

  formData.append("title", form.title);
  formData.append("description", form.description);
  formData.append("price", Number(form.price));
  formData.append("region", region);
  formData.append("city", city);
  formData.append("category", form.category);
  formData.append("condition", form.condition || "used");
  formData.append("sellerType", form.sellerType || "private");

  images.forEach((file) => {
    formData.append("images", file);
  });

  if (!user?.phone) {
  alert("Перед публикацией объявления укажите номер телефона в профиле.");
  return;
}

  await createListing(formData);

  navigate("/");
};
const MAX_IMAGES = 5;

const availableCities = region
  ? regions[region] || []
  : [];

  return (
   <MainLayout>
    <div className="max-w-2xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Создать объявление
      </h1>

      <form onSubmit={submit} className="space-y-6">

  {/* 1. Название */}
  <div className="bg-white border rounded-2xl p-6">
    <h2 className="font-semibold text-lg mb-4">
      1. Название объявления *
    </h2>

    <input
      name="title"
      value={form.title}
      onChange={handleChange}
      placeholder="Например: iPhone 15 Pro 256GB"
      maxLength={50}
      className="w-full p-3 border rounded-xl"
    />
<p className="text-sm text-gray-500 mt-2">
  {form.title.length}/50 символов
</p>
    
  </div>

  {/* 2. Категория */}
  <div className="bg-white border rounded-2xl p-6">
    <h2 className="font-semibold text-lg mb-4">
      2. Категория
    </h2>

    <select
      name="category"
      value={form.category}
      onChange={handleChange}
      className="w-full p-3 border rounded-xl"
    >
      <option value="">
        Выберите категорию
      </option>

      {categories.map((cat) => (
        <option
          key={cat._id}
          value={cat.slug}
        >
          {cat.name}
        </option>
      ))}
    </select>
  </div>

  {/* 3. Описание */}
  <div className="bg-white border rounded-2xl p-6">
    <h2 className="font-semibold text-lg mb-4">
      3. Описание
    </h2>

    <textarea
      name="description"
      value={form.description}
      onChange={handleChange}
      rows={8}
      placeholder="Опишите товар максимально подробно"
      maxLength={4000}
      className="w-full p-3 border rounded-xl"
    />

    <p className="text-sm text-gray-500 mt-2">
  {form.description.length}/4000 символов
</p>
  </div>

  {/* 4. Фото */}
  <div className="bg-white border rounded-2xl p-6">
    <h2 className="font-semibold text-lg mb-4">
      4. Фотографии
    </h2>

    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {Array.from({ length: MAX_IMAGES }).map((_, index) => (
        <div
          key={index}
          className="border rounded-xl p-2 text-center"
        >
          {previews[index] ? (
            <div className="relative">
              <img
                src={previews[index].url}
                className="w-full h-28 object-cover rounded-lg"
              />

              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white px-2 rounded"
              >
                ✕
              </button>
            </div>
          ) : (
            <label className="cursor-pointer flex items-center justify-center h-28 border-2 border-dashed rounded-lg">
              + Фото

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

          <div className="text-xs mt-2">
            Фото {index + 1}
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* 5. Цена */}
  <div className="bg-white border rounded-2xl p-6">
    <h2 className="font-semibold text-lg mb-4">
      5. Цена
    </h2>

    <input
      name="price"
      value={form.price}
      onChange={handleChange}
      placeholder="Введите цену"
      className="w-full p-3 border rounded-xl"
    />
  </div>

  {/* 6. Местоположение */}
  <div className="bg-white border rounded-2xl p-6">
    <h2 className="font-semibold text-lg mb-4">
      6. Местоположение
    </h2>

    <div className="space-y-4">
      <select
        value={region}
        onChange={(e) => {
          setRegion(e.target.value);
          setCity("");
        }}
        className="w-full p-3 border rounded-xl"
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

      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        disabled={!region}
        className="w-full p-3 border rounded-xl"
      >
        <option value="">
          Выберите город
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

  {/* 7. О продавце */}
  <div className="bg-white border rounded-2xl p-6">
    <h2 className="font-semibold text-lg mb-4">
      7. О продавце
    </h2>

    <div className="space-y-4">

      <div>
        <label className="block text-sm mb-2">
          Имя
        </label>

        <input
          type="text"
          value={user?.name || ""}
          readOnly
          className="w-full p-3 border rounded-xl"
        />
      </div>

      <div>
  <label className="block text-sm mb-2">
    Телефон
  </label>

  <input
    type="tel"
    value={user?.phone || ""}
    readOnly
    className="w-full p-3 border rounded-xl bg-gray-50"
  />

  {!user?.phone && (
    <p className="text-sm text-red-500 mt-2">
      Добавьте номер телефона в профиле.
    </p>
  )}
</div>

    </div>
  </div>

  {/* Кнопка */}
  <button
    disabled={loading}
    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold"
  >
    {loading
      ? "Публикация объявления..."
      : "Подать объявление"}
  </button>

  <p className="text-center text-sm text-gray-500">
    Публикуя объявление, вы соглашаетесь
    с условиями Пользовательского соглашения
  </p>

</form>
    </div>
    </MainLayout> 
  );
}