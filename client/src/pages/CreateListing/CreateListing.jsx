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

  const handleUpload = async () => {
    if (!imageFile) return;

    setUploading(true);

    try {
      const { data } = await uploadImage(imageFile);
      setImageUrl(data.url);
    } catch (err) {
      alert("Ошибка загрузки фото");
    } finally {
      setUploading(false);
    }
  };
const formData = new FormData();

images.forEach((file) => {
  formData.append("images", file);
});

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

      <form onSubmit={submit} className="space-y-4">

        <input
          name="title"
          placeholder="Название"
          className="w-full p-3 border rounded-xl"
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Описание"
          className="w-full p-3 border rounded-xl"
          onChange={handleChange}
        />

        <input
          name="price"
          placeholder="Цена"
          className="w-full p-3 border rounded-xl"
          onChange={handleChange}
        />

        <div className="space-y-4">

  <select
    value={region}
    onChange={(e) => {
      setRegion(e.target.value);
      setCity("");
    }}
    className="w-full border rounded-xl p-3"
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
    className="w-full border rounded-xl p-3"
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

        {/* CATEGORY SELECT */}
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

        <select
  name="condition"
  value={form.condition}
  onChange={handleChange}
  className="w-full p-3 border rounded-xl"
>
  <option value="used">Б/У</option>
  <option value="new">Новое</option>
</select>

<select
  name="sellerType"
  value={form.sellerType}
  onChange={handleChange}
  className="w-full p-3 border rounded-xl"
>
  <option value="private">
    Частное лицо
  </option>

  <option value="company">
    Компания
  </option>
</select>

        {/* IMAGE UPLOAD */}
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
        <label className="cursor-pointer block h-28 border-2 border-dashed rounded-lg items-center justify-center">
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

        <button
  disabled={loading}
  className="w-full bg-green-600 text-white py-3 rounded-xl"
>
  {loading ? "Загружаем фото и создаём объявление..." : "Создать объявление"}
</button>

      </form>
    </div>
    </MainLayout> 
  );
}