import { useEffect, useMemo, useState } from "react";

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

  // =====================================================
  // СОЗДАНИЕ
  // =====================================================

  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [creating, setCreating] = useState(false);

  // =====================================================
  // РЕДАКТИРОВАНИЕ
  // =====================================================

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingImage, setEditingImage] = useState(null);
  const [editingPreview, setEditingPreview] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // =====================================================
  // ОТКРЫТЫЕ ГЛАВНЫЕ КАТЕГОРИИ
  // =====================================================

  const [openCategories, setOpenCategories] = useState({});

  // =====================================================
  // ЗАГРУЗКА
  // =====================================================

  useEffect(() => {
    fetchCategories(true);
  }, [fetchCategories]);

  // =====================================================
  // ГЛАВНЫЕ КАТЕГОРИИ
  // =====================================================

  const mainCategories = useMemo(() => {
    return categories.filter(
      (category) => !category.parent
    );
  }, [categories]);

  // =====================================================
  // ПОДКАТЕГОРИИ
  // =====================================================

  const getChildren = (parentId) => {
    return categories.filter((category) => {
      const categoryParent =
        category.parent?._id ||
        category.parent;

      return (
        categoryParent &&
        String(categoryParent) === String(parentId)
      );
    });
  };

  // =====================================================
  // ОТКРЫТЬ / ЗАКРЫТЬ
  // =====================================================

  const toggleCategory = (id) => {
    setOpenCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // =====================================================
  // ВЫБОР КАРТИНКИ
  // =====================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setImagePreview(
      URL.createObjectURL(file)
    );
  };

  // =====================================================
  // СОЗДАНИЕ КАТЕГОРИИ
  // =====================================================

  const handleCreate = async (e) => {
    e.preventDefault();

    const categoryName = name.trim();

    if (!categoryName) {
      alert("Введите название");
      return;
    }

    setCreating(true);

    try {
      let imageUrl = "";

      // Картинка нужна только главной категории
      if (!parentId && image) {
        const response = await uploadImage(image);

        imageUrl = response.data.url;
      }

      const { data } = await createCategory({
        name: categoryName,
        image: imageUrl,
        parent: parentId || null,
      });

      addCategory(data);

      // Сбрасываем форму
      setName("");
      setParentId("");
      setImage(null);
      setImagePreview("");

      const input =
        document.getElementById(
          "category-image-input"
        );

      if (input) {
        input.value = "";
      }

      // Если создали подкатегорию —
      // автоматически открываем родителя
      if (parentId) {
        setOpenCategories((prev) => ({
          ...prev,
          [parentId]: true,
        }));
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

  // =====================================================
  // НАЧАТЬ РЕДАКТИРОВАНИЕ
  // =====================================================

  const handleEditStart = (category) => {
    setEditingId(category._id);
    setEditingName(category.name);
    setEditingImage(null);
    setEditingPreview(category.image || "");
  };

  // =====================================================
  // ОТМЕНА
  // =====================================================

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingName("");
    setEditingImage(null);
    setEditingPreview("");
  };

  // =====================================================
  // НОВАЯ КАРТИНКА
  // =====================================================

  const handleEditImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setEditingImage(file);

    setEditingPreview(
      URL.createObjectURL(file)
    );
  };

  // =====================================================
  // СОХРАНЕНИЕ
  // =====================================================

  const handleEditSave = async (id) => {
    const cleanName = editingName.trim();

    if (!cleanName) {
      alert("Введите название");
      return;
    }

    setSavingEdit(true);

    try {
      let imageUrl = editingPreview;

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

  // =====================================================
  // УДАЛЕНИЕ
  // =====================================================

  const handleDelete = async (
    id,
    categoryName
  ) => {
    const children = getChildren(id);

    if (children.length > 0) {
      alert(
        `Нельзя удалить "${categoryName}", пока у неё есть ${children.length} подкатегорий. Сначала удалите подкатегории.`
      );

      return;
    }

    const confirmed = window.confirm(
      `Удалить "${categoryName}"?`
    );

    if (!confirmed) return;

    try {
      await deleteCategory(id);

      removeCategory(id);
    } catch (error) {
      console.error(
        "Ошибка удаления:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Не удалось удалить категорию"
      );
    }
  };

  // =====================================================
  // ФОРМА
  // =====================================================

  return (
    <div className="space-y-6">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Категории
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Управление главными категориями и
          подкатегориями
        </p>
      </div>

      {/* ================================================= */}
      {/* СОЗДАНИЕ */}
      {/* ================================================= */}

      <section className="
        bg-white
        border
        border-gray-200
        rounded-2xl
        shadow-sm
        p-5
      ">

        <div className="mb-5">
          <h3 className="text-lg font-semibold">
            Добавить категорию
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Выберите, будет это главная категория
            или подкатегория.
          </p>
        </div>

        <form
          onSubmit={handleCreate}
          className="space-y-4"
        >

          {/* ТИП */}

          <div>
            <label 
            htmlFor="type"
            className="
              block
              text-sm
              font-medium
              text-gray-700
              mb-2
            ">
              Тип категории
            </label>

            <select
              id="type"
              name="type"
              value={parentId}
              onChange={(e) =>
                setParentId(e.target.value)
              }
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
            >

              <option value="">
                Главная категория
              </option>

              {mainCategories.map((category) => (
                <option
                  key={category._id}
                  value={category._id}
                >
                  ↳ Подкатегория: {category.name}
                </option>
              ))}

            </select>
          </div>

          {/* НАЗВАНИЕ */}

          <div>
            <label 
            htmlFor="name"
            className="
              block
              text-sm
              font-medium
              text-gray-700
              mb-2
            ">
              Название
            </label>

            <input
              id="name" 
              name="name"
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              autoComplete="off"
              placeholder={
                parentId
                  ? "Например: Телефоны"
                  : "Например: Электроника"
              }
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
          </div>

          {/* ИЗОБРАЖЕНИЕ */}

          {!parentId && (
            <div>

              <label 
              htmlFor="category-image"
              className="
                block
                text-sm
                font-medium
                text-gray-700
                mb-2
              ">
                Изображение главной категории
              </label>

              <input
                id="category-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm"
              />

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt=""
                  className="
                    mt-3
                    w-48
                    h-28
                    rounded-xl
                    object-cover
                    border
                  "
                />
              )}

            </div>
          )}

          {/* КНОПКА */}

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
              : parentId
                ? "Добавить подкатегорию"
                : "Добавить главную категорию"}
          </button>

        </form>
      </section>

      {/* ================================================= */}
      {/* СПИСОК */}
      {/* ================================================= */}

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

          <div className="
            flex
            items-center
            justify-between
            gap-4
          ">

            <div>
              <h3 className="font-semibold text-lg">
                Структура категорий
              </h3>

              <p className="
                text-sm
                text-gray-500
                mt-1
              ">
                Главных категорий:{" "}
                <b>{mainCategories.length}</b>
                {" · "}
                Всего категорий:{" "}
                <b>{categories.length}</b>
              </p>
            </div>

          </div>

        </div>

        {loading ? (

          <div className="
            p-8
            text-center
            text-gray-500
          ">
            Загрузка...
          </div>

        ) : mainCategories.length === 0 ? (

          <div className="
            p-8
            text-center
            text-gray-500
          ">
            Категорий пока нет
          </div>

        ) : (

          <div className="p-4 space-y-3">

            {mainCategories.map((parent) => {

              const children =
                getChildren(parent._id);

              const isOpen =
                openCategories[parent._id];

              return (
                <div
                  key={parent._id}
                  className="
                    border
                    border-gray-200
                    rounded-2xl
                    overflow-hidden
                  "
                >

                  {/* ================================= */}
                  {/* ГЛАВНАЯ */}
                  {/* ================================= */}

                  <div className="
                    flex
                    items-center
                    gap-4
                    p-4
                    bg-gray-50
                  ">

                    {/* КАРТИНКА */}

                    {parent.image ? (

                      <img
                        src={parent.image}
                        alt={parent.name}
                        className="
                          w-20
                          h-14
                          rounded-xl
                          object-cover
                          border
                          shrink-0
                        "
                      />

                    ) : (

                      <div className="
                        w-20
                        h-14
                        rounded-xl
                        bg-blue-100
                        text-blue-600
                        flex
                        items-center
                        justify-center
                        font-bold
                        text-xl
                        shrink-0
                      ">
                        {parent.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                    )}

                    {/* НАЗВАНИЕ */}

                    <div className="flex-1 min-w-0">

                      {editingId === parent._id ? (

                        <div className="space-y-3">

                          <input
                            value={editingName}
                            onChange={(e) =>
                              setEditingName(
                                e.target.value
                              )
                            }
                            autoFocus
                            className="
                              w-full
                              h-10
                              px-3
                              rounded-lg
                              border
                              border-blue-300
                              outline-none
                            "
                          />

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

                          {editingPreview && (
                            <img
                              src={editingPreview}
                              alt=""
                              className="
                                w-40
                                h-24
                                rounded-xl
                                object-cover
                              "
                            />
                          )}

                        </div>

                      ) : (

                        <>
                          <div className="
                            flex
                            items-center
                            gap-2
                          ">

                            <span className="
                              text-lg
                              font-bold
                              text-gray-900
                            ">
                              {parent.name}
                            </span>

                            <span className="
                              px-2
                              py-1
                              rounded-md
                              bg-blue-100
                              text-blue-700
                              text-[10px]
                              font-bold
                            ">
                              ГЛАВНАЯ
                            </span>

                          </div>

                          <div className="
                            text-xs
                            text-gray-400
                            mt-1
                          ">
                            Подкатегорий:{" "}
                            {children.length}
                          </div>
                        </>

                      )}

                    </div>

                    {/* КНОПКИ */}

                    {editingId === parent._id ? (

                      <div className="
                        flex
                        gap-2
                        shrink-0
                      ">

                        <button
                          type="button"
                          disabled={savingEdit}
                          onClick={() =>
                            handleEditSave(
                              parent._id
                            )
                          }
                          className="
                            px-3
                            py-2
                            rounded-xl
                            bg-green-600
                            text-white
                            text-sm
                          "
                        >
                          {savingEdit
                            ? "..."
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
                            bg-gray-200
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

                        {children.length > 0 && (
                          <button
                            type="button"
                            onClick={() =>
                              toggleCategory(
                                parent._id
                              )
                            }
                            className="
                              w-9
                              h-9
                              rounded-xl
                              bg-white
                              border
                              border-gray-200
                              flex
                              items-center
                              justify-center
                              text-gray-500
                              hover:text-blue-600
                            "
                          >
                            <span
                              className={`
                                text-xl
                                transition-transform
                                ${
                                  isOpen
                                    ? "rotate-90"
                                    : ""
                                }
                              `}
                            >
                              ›
                            </span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            handleEditStart(parent)
                          }
                          className="
                            px-3
                            py-2
                            rounded-xl
                            bg-blue-50
                            text-blue-600
                            text-sm
                            font-medium
                          "
                        >
                          Изменить
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              parent._id,
                              parent.name
                            )
                          }
                          className="
                            px-3
                            py-2
                            rounded-xl
                            bg-red-50
                            text-red-600
                            text-sm
                            font-medium
                          "
                        >
                          Удалить
                        </button>

                      </div>

                    )}

                  </div>


                  {/* ================================= */}
                  {/* ПОДКАТЕГОРИИ */}
                  {/* ================================= */}

                  {isOpen &&
                    children.length > 0 && (
                      <div className="
                        bg-white
                        border-t
                        border-gray-200
                      ">

                        {children.map(
                          (child) => (

                            <div
                              key={child._id}
                              className="
                                flex
                                items-center
                                gap-4
                                px-5
                                py-3
                                border-b
                                last:border-b-0
                                border-gray-100
                              "
                            >

                              <div className="
                                w-8
                                text-center
                                text-gray-300
                                text-lg
                              ">
                                ↳
                              </div>

                              <div className="
                                flex-1
                                min-w-0
                              ">

                                {editingId ===
                                child._id ? (

                                  <input
                                    value={
                                      editingName
                                    }
                                    onChange={(e) =>
                                      setEditingName(
                                        e.target.value
                                      )
                                    }
                                    className="
                                      w-full
                                      h-10
                                      px-3
                                      rounded-lg
                                      border
                                      border-blue-300
                                    "
                                  />

                                ) : (

                                  <div className="
                                    flex
                                    items-center
                                    gap-2
                                  ">

                                    <span className="
                                      font-medium
                                      text-gray-800
                                    ">
                                      {child.name}
                                    </span>

                                    <span className="
                                      px-2
                                      py-1
                                      rounded-md
                                      bg-gray-100
                                      text-gray-500
                                      text-[10px]
                                    ">
                                      ПОДКАТЕГОРИЯ
                                    </span>

                                  </div>

                                )}

                              </div>


                              {/* КНОПКИ */}

                              {editingId ===
                              child._id ? (

                                <div className="
                                  flex
                                  gap-2
                                ">

                                  <button
                                    type="button"
                                    disabled={
                                      savingEdit
                                    }
                                    onClick={() =>
                                      handleEditSave(
                                        child._id
                                      )
                                    }
                                    className="
                                      px-3
                                      py-2
                                      rounded-xl
                                      bg-green-600
                                      text-white
                                      text-sm
                                    "
                                  >
                                    {savingEdit
                                      ? "..."
                                      : "Сохранить"}
                                  </button>

                                  <button
                                    type="button"
                                    disabled={
                                      savingEdit
                                    }
                                    onClick={
                                      handleEditCancel
                                    }
                                    className="
                                      px-3
                                      py-2
                                      rounded-xl
                                      bg-gray-100
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
                                  gap-2
                                ">

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleEditStart(
                                        child
                                      )
                                    }
                                    className="
                                      px-3
                                      py-2
                                      rounded-xl
                                      bg-blue-50
                                      text-blue-600
                                      text-sm
                                    "
                                  >
                                    Изменить
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDelete(
                                        child._id,
                                        child.name
                                      )
                                    }
                                    className="
                                      px-3
                                      py-2
                                      rounded-xl
                                      bg-red-50
                                      text-red-600
                                      text-sm
                                    "
                                  >
                                    Удалить
                                  </button>

                                </div>

                              )}

                            </div>

                          )
                        )}

                      </div>
                    )}

                </div>
              );
            })}

          </div>

        )}

      </section>

    </div>
  );
}