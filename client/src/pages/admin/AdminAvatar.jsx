import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useAuthStore } from "../../store/authStore";

export default function AdminAvatar() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [avatarModal, setAvatarModal] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const uploadAvatar = async () => {
    if (!file) return;

    setLoading(true);

    try {
      // 1. upload image
      const formData = new FormData();
      formData.append("image", file);

      const uploadRes = await api.post(
        "/upload",
        formData
      );

      const avatarUrl = uploadRes.data.url;

      // 2. save to DB
      const res = await api.put("/admin/me/avatar", {
        avatar: avatarUrl,
      });

      // 3. update store (без reload)
      setUser(res.data, localStorage.getItem("token"));

      setAvatarModal(false);
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.log(err);
      alert("Ошибка загрузки аватарки");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 mb-4">

      <img
        src={
          user?.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "")}`
        }
        alt="avatar"
        onClick={() => setAvatarModal(true)}
        className="w-24 h-24 rounded-full object-cover border cursor-pointer hover:opacity-80 transition"
      />

      <div>
        <p className="font-bold">{user?.name}</p>
        <p className="text-sm text-gray-500">Администратор</p>
      </div>

      {avatarModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setAvatarModal(false)}
        >
          <div
            className="bg-white p-6 rounded-xl w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">
              Изменить аватар
            </h2>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files[0];
                setFile(f);

                if (f) {
                  setPreview(URL.createObjectURL(f));
                }
              }}
            />

            {preview && (
              <img
                src={preview}
                className="w-32 h-32 rounded-full object-cover mx-auto my-4"
              />
            )}

            <button
              onClick={uploadAvatar}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl"
            >
              {loading ? "Загрузка..." : "Сохранить"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}