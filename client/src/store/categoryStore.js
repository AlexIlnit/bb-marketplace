import { create } from "zustand";
import { getCategories } from "../api/categoryApi";

export const useCategoryStore = create((set, get) => ({
  categories: [],
  loading: false,

  fetchCategories: async (force = false) => {
    const state = get();

    if (state.categories.length > 0 && !force) {
      return;
    }

    set({ loading: true });

    try {
      const { data } = await getCategories();

      set({
        categories: data,
      });
    } catch (error) {
      console.error(
        "Ошибка загрузки категорий:",
        error
      );
    } finally {
      set({
        loading: false,
      });
    }
  },

  addCategory: (category) => {
    set((state) => ({
      categories: [
        ...state.categories,
        category,
      ].sort((a, b) =>
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