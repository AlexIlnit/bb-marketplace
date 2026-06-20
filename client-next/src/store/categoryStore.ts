import { create } from "zustand";
import { getCategories } from "@/lib/categoryApi";

export const useCategoryStore = create((set, get) => ({
  categories: [],
  loading: false,

  fetchCategories: async () => {
    const state = get();

    if (state.categories.length > 0) {
      return;
    }

    set({ loading: true });

    try {
      const { data } = await getCategories();

      set({
        categories: data
      });
    } finally {
      set({
        loading: false
      });
    }
  }
}));