import { useEffect, useState } from "react";

import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/categoryApi";

import { uploadImage } from "../../api/uploadApi";

import { useCategoryStore } from "../../store/categoryStore";

export default function AdminCategories() {
  const {
    categories,
    fetchCategories,
    updateCategory: updateCategoryStore,
    addCategory,
    removeCategory,
    loading,
  } = useCategoryStore();

  // =========================
  // Создание
  // =========================

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [creating, setCreating] = useState(false);

  // =========================
  // Редактирование
  // =========================

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingImage, setEditingImage] = useState(null);
  const [editingPreview, setEditingPreview] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // =========================
  // Загрузка категорий
  // =========================

  useEffect(() => {
    fetchCategories(true);
  }, [fetchCategories]);

  // =========================
  // Выбор картинки при создании
  // =========================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // =========================
  // Создание категории
  // =========================

  const handleCreate = async (e) => {
    e.preventDefault();

    const categoryName = name.trim();

    if (!categoryName) {
      alert("Введите название категории");
      return;
    }

    setCreating(true);

    try {
      let imageUrl = "";

      // Сначала загружаем изображение
      if (image) {
        const response = await uploadImage(image);
        imageUrl = response.data.url;
      }

      // Создаём категорию
      const { data } = await createCategory({
        name: categoryName,
        image: imageUrl,
      });

      addCategory(data);

      // Очистка формы
      setName("");
      setImage(null);
      setImagePreview("");

      // Очищаем input file
      const fileInput = document.getElementById(
        "category-image-input"
      );

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error(
        "Ошибка создания категории:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Не удалось создать категорию"
      );
    } finally {
      setCreating(false);
    }
  };

  // =========================
  // Начать редактирование
  // =========================

  const handleEditStart = (category) => {
    setEditingId(category._id);
    setEditingName(category.name);
    setEditingImage(null);
    setEditingPreview(category.image || "");
  };

  // =========================
  // Отмена редактирования
  // =========================

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingName("");
    setEditingImage(null);
    setEditingPreview("");
  };

  // =========================
  // Выбор новой картинки
  // =========================

  const handleEditImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setEditingImage(file);

    setEditingPreview(
      URL.createObjectURL(file)
    );
  };

  // =========================
  // Сохранение категории
  // =========================

  const handleEditSave = async (id) => {
    const cleanName = editingName.trim();

    if (!cleanName) {
      alert("Введите название категории");
      return;
    }

    setSavingEdit(true);

    try {
      let imageUrl = editingPreview;

      // Если выбрали новую картинку —
      // загружаем её
      if (editingImage) {
        const response = await uploadImage(
          editingImage
        );

        imageUrl = response.data.url;
      }

      const { data } = await updateCategory(id, {
        name: cleanName,
        image: imageUrl,
      });

      updateCategoryStore(data);

      handleEditCancel();
    } catch (error) {
      console.error(
        "Ошибка изменения категории:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Не удалось изменить категорию"
      );
    } finally {
      setSavingEdit(false);
    }
  };

  // =========================
  // Удаление
  // =========================

  const handleDelete = async (
    id,
    categoryName
  ) => {
    const confirmed = window.confirm(
      `Удалить категорию "${categoryName}"?`
    );

    if (!confirmed) return;

    try {
      await deleteCategory(id);

      removeCategory(id);
    } catch (error) {
      console.error(
        "Ошибка удаления категории:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Не удалось удалить категорию"
      );
    }
  };

  return (
    <div className="space-y-6">

      {/* ========================= */}
      {/* Заголовок */}
      {/* ========================= */}

      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Категории
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Управление категориями объявлений
        </p>
      </div>

      {/* ========================= */}
      {/* Добавление */}
      {/* ========================= */}

      <section className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">

        <h3 className="font-semibold text-lg mb-4">
          Добавить категорию
        </h3>

        <form
          onSubmit={handleCreate}
          className="space-y-4"
        >

          {/* Название */}

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Например: Автомобили"
            maxLength={100}
            className="
              w-full
              h-12
              px-4
              rounded-xl
              border
              border-gray-200
              bg-gray-50
              outline-none
              focus:bg-white
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-500/10
            "
          />

          {/* Картинка */}

          <div>
            <label className="
              block
              text-sm
              font-medium
              text-gray-700
              mb-2
            ">
              Фоновое изображение категории
            </label>

            <input
              id="category-image-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm"
            />

            {imagePreview && (
              <div className="mt-3">
                <img
                  src={imagePreview}
                  alt="Предпросмотр"
                  className="
                    w-48
                    h-28
                    object-cover
                    rounded-xl
                    border
                  "
                />
              </div>
            )}
          </div>

          {/* Кнопка */}

          <button
            type="submit"
            disabled={creating}
            className="
              h-12
              px-6
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              disabled:bg-gray-300
              text-white
              font-semibold
              transition
            "
          >
            {creating
              ? "Добавление..."
              : "Добавить категорию"}
          </button>

        </form>
      </section>

      {/* ========================= */}
      {/* Существующие категории */}
      {/* ========================= */}

      <section className="
        bg-white
        border
        border-gray-200
        rounded-2xl
        shadow-sm
        overflow-hidden
      ">

        <div className="
          p-5
          border-b
          border-gray-100
        ">

          <h3 className="font-semibold text-lg">
            Существующие категории
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Всего: {categories.length}
          </p>

        </div>

        {loading ? (

          <div className="
            p-8
            text-center
            text-gray-500
          ">
            Загрузка категорий...
          </div>

        ) : categories.length === 0 ? (

          <div className="
            p-8
            text-center
            text-gray-500
          ">
            Категорий пока нет
          </div>

        ) : (

          <div className="divide-y divide-gray-100">

            {categories.map((category) => (

              <div
                key={category._id}
                className="
                  flex
                  flex-col
                  sm:flex-row
                  sm:items-center
                  justify-between
                  gap-4
                  px-5
                  py-4
                  hover:bg-gray-50
                  transition
                "
              >

                {/* ========================= */}
                {/* Левая часть */}
                {/* ========================= */}

                <div className="
                  flex
                  items-start
                  gap-4
                  min-w-0
                  flex-1
                ">

                  {/* Изображение */}

                  {category.image ? (

                    <img
                      src={category.image}
                      alt={category.name}
                      className="
                        w-24
                        h-16
                        sm:w-28
                        sm:h-20
                        rounded-xl
                        object-cover
                        border
                        shrink-0
                      "
                    />

                  ) : (

                    <div className="
                      w-24
                      h-16
                      sm:w-28
                      sm:h-20
                      rounded-xl
                      bg-blue-50
                      text-blue-600
                      flex
                      items-center
                      justify-center
                      font-bold
                      text-xl
                      shrink-0
                    ">
                      {category.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                  )}

                  {/* Название / редактирование */}

                  <div className="
                    flex-1
                    min-w-0
                  ">

                    {editingId === category._id ? (

                      <div className="space-y-3">

                        {/* Название */}

                        <input
                          value={editingName}
                          onChange={(e) =>
                            setEditingName(
                              e.target.value
                            )
                          }
                          autoFocus
                          maxLength={100}
                          className="
                            w-full
                            h-10
                            px-3
                            rounded-lg
                            border
                            border-blue-300
                            outline-none
                            focus:ring-2
                            focus:ring-blue-500/20
                          "
                        />

                        {/* Новое изображение */}

                        <div>

                          <label className="
                            block
                            text-xs
                            text-gray-500
                            mb-1
                          ">
                            Изменить изображение
                          </label>

                          <input
                            type="file"
                            accept="image/*"
                            onChange={
                              handleEditImageChange
                            }
                            className="
                              block
                              w-full
                              text-sm
                            "
                          />

                        </div>

                        {/* Preview */}

                        {editingPreview && (

                          <img
                            src={editingPreview}
                            alt=""
                            className="
                              w-40
                              h-24
                              object-cover
                              rounded-xl
                              border
                            "
                          />

                        )}

                      </div>

                    ) : (

                      <>
                        <div className="
                          font-semibold
                          text-gray-900
                          text-lg
                        ">
                          {category.name}
                        </div>

                        <div className="
                          text-xs
                          text-gray-400
                          mt-1
                        ">
                          ID: {category._id}
                        </div>
                      </>

                    )}

                  </div>

                </div>

                {/* ========================= */}
                {/* Кнопки */}
                {/* ========================= */}

                {editingId === category._id ? (

                  <div className="
                    flex
                    items-center
                    gap-2
                    shrink-0
                  ">

                    <button
                      type="button"
                      disabled={savingEdit}
                      onClick={() =>
                        handleEditSave(
                          category._id
                        )
                      }
                      className="
                        px-3
                        py-2
                        rounded-xl
                        bg-green-600
                        hover:bg-green-700
                        disabled:bg-gray-300
                        text-white
                        text-sm
                        font-medium
                      "
                    >
                      {savingEdit
                        ? "Сохранение..."
                        : "Сохранить"}
                    </button>

                    <button
                      type="button"
                      disabled={savingEdit}
                      onClick={
                        handleEditCancel
                      }
                      className="
                        px-3
                        py-2
                        rounded-xl
                        bg-gray-100
                        hover:bg-gray-200
                        text-gray-700
                        text-sm
                      "
                    >
                      Отмена
                    </button>

                  </div>

                ) : (

                  <div className="
                    flex
                    items-center
                    gap-2
                    shrink-0
                  ">

                    <button
                      type="button"
                      onClick={() =>
                        handleEditStart(category)
                      }
                      className="
                        px-3
                        py-2
                        rounded-xl
                        bg-blue-50
                        text-blue-600
                        hover:bg-blue-100
                        font-medium
                        text-sm
                        transition
                      "
                    >
                      Изменить
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          category._id,
                          category.name
                        )
                      }
                      className="
                        px-3
                        py-2
                        rounded-xl
                        bg-red-50
                        text-red-600
                        hover:bg-red-100
                        font-medium
                        text-sm
                        transition
                      "
                    >
                      Удалить
                    </button>

                  </div>

                )}

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}