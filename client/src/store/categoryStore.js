import { create } from "zustand";
import { getCategories } from "../api/categoryApi";

export const useCategoryStore = create((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async (force = false) => {
    const state = get();

    if (state.categories.length > 0 && !force) {
      return;
    }

    set({
      loading: true,
      error: null,
    });

    try {
      const { data } = await getCategories();

      set({
        categories: Array.isArray(data) ? data : [],
        loading: false,
      });
    } catch (error) {
      console.error("Ошибка загрузки категорий:", error);

      set({
        categories: [],
        loading: false,
        error: error?.response?.data?.message || "Не удалось загрузить категории",
      });
    }
  },

  addCategory: (category) => {
    set((state) => ({
      categories: [...state.categories, category].sort((a, b) =>
        a.name.localeCompare(b.name, "ru")
      ),
    }));
  },

  updateCategory: (updatedCategory) => {
    set((state) => ({
      categories: state.categories
        .map((category) =>
          category._id === updatedCategory._id
            ? updatedCategory
            : category
        )
        .sort((a, b) =>
          a.name.localeCompare(b.name, "ru")
        ),
    }));
  },

  removeCategory: (id) => {
    set((state) => ({
      categories: state.categories.filter(
        (category) => category._id !== id
      ),
    }));
  },
}));