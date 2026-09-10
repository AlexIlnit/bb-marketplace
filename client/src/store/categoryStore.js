import { create } from "zustand";
import { getCategories } from "../api/categoryApi";

export const useCategoryStore = create((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  // =====================================================
  // ЗАГРУЗКА КАТЕГОРИЙ
  // =====================================================

  fetchCategories: async (force = false) => {
    const state = get();

    if (state.loading) {
      return;
    }

    if (state.categories.length > 0 && !force) {
      return;
    }

    set({
      loading: true,
      error: null,
    });

    try {
      const { data } = await getCategories();

      const categories = Array.isArray(data)
        ? data
        : [];

      set({
        categories,
        loading: false,
        error: null,
      });

    } catch (error) {
      console.error(
        "Ошибка загрузки категорий:",
        error
      );

      set({
        loading: false,
        error:
          error?.response?.data?.message ||
          "Не удалось загрузить категории",
      });
    }
  },

  // =====================================================
  // ДОБАВЛЕНИЕ
  // =====================================================

  addCategory: (category) => {
    if (!category?._id) {
      return;
    }

    set((state) => {
      const exists = state.categories.some(
        (item) => item._id === category._id
      );

      if (exists) {
        return state;
      }

      return {
        categories: [
          ...state.categories,
          category,
        ],
      };
    });
  },

  // =====================================================
  // ИЗМЕНЕНИЕ
  // =====================================================

  updateCategory: (updatedCategory) => {
    if (!updatedCategory?._id) {
      return;
    }

    set((state) => ({
      categories: state.categories.map(
        (category) =>
          category._id === updatedCategory._id
            ? {
                ...category,
                ...updatedCategory,
              }
            : category
      ),
    }));
  },

  // =====================================================
  // УДАЛЕНИЕ
  // =====================================================

  removeCategory: (id) => {
    if (!id) {
      return;
    }

    set((state) => ({
      categories: state.categories.filter(
        (category) =>
          String(category._id) !== String(id)
      ),
    }));
  },

  // =====================================================
  // ПРИНУДИТЕЛЬНАЯ СИНХРОНИЗАЦИЯ
  // =====================================================

  refreshCategories: async () => {
    set({
      loading: true,
      error: null,
    });

    try {
      const { data } = await getCategories();

      set({
        categories: Array.isArray(data)
          ? data
          : [],
        loading: false,
        error: null,
      });

    } catch (error) {
      console.error(
        "Ошибка обновления категорий:",
        error
      );

      set({
        loading: false,
        error:
          error?.response?.data?.message ||
          "Не удалось обновить категории",
      });
    }
  },
}));

