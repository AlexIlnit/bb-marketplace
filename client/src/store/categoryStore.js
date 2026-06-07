import { create } from "zustand";
import { getCategories } from "../api/categoryApi";

export const useCategoryStore = create((set) => ({
  categories: [],
  loading: false,

  fetchCategories: async () => {
    set({ loading: true });

    try {
      const { data } = await getCategories();
      set({ categories: data });
    } finally {
      set({ loading: false });
    }
  }
}));