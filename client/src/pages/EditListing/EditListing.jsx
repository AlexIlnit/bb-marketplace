import { useState } from "react";
import { createListing } from "../../api/listingApi";
import { uploadImage } from "../../api/uploadApi";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    city: "",
    category: ""
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 📸 UPLOAD
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

  // 📦 SUBMIT
  const submit = async (e) => {
    e.preventDefault();

    if (!imageUrl) {
      alert("Сначала загрузите фото");
      return;
    }

    setLoading(true);

    try {
      await createListing({
        ...form,
        price: Number(form.price),
        images: [imageUrl]
      });

      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
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

        <input
          name="city"
          placeholder="Город"
          className="w-full p-3 border rounded-xl"
          onChange={handleChange}
        />

        <input
          name="category"
          placeholder="Категория"
          className="w-full p-3 border rounded-xl"
          onChange={handleChange}
        />

        {/* 📸 IMAGE UPLOAD */}
        <div className="space-y-3 border p-4 rounded-xl">

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />

          <button
            type="button"
            onClick={handleUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl"
          >
            {uploading ? "Загрузка..." : "Загрузить фото"}
          </button>

          {/* 📸 PREVIEW */}
          {imageUrl && (
            <div className="mt-3">
              <img
                src={imageUrl}
                className="w-full h-64 object-cover rounded-xl border"
              />

              <p className="text-green-600 text-sm mt-2">
                Фото загружено ✓
              </p>
            </div>
          )}

        </div>

        <button
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-xl"
        >
          {loading ? "Создание..." : "Создать объявление"}
        </button>

      </form>
    </div>
  );
}