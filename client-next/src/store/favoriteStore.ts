import { create } from "zustand";
import {
  toggleFavorite as toggleFavoriteApi,
  getFavorites
} from "../api/favoriteApi";

export const useFavoriteStore = create((set) => ({

  favorites: [],

  fetchFavorites: async () => {
    try {
      const { data } = await getFavorites();

      set({
        favorites: data
      });

    } catch (error) {
      console.error(error);
    }
  },

  toggleFavorite: async (id) => {
    try {
      await toggleFavoriteApi(id);

      const { data } = await getFavorites();

      set({
        favorites: data
      });

    } catch (error) {
      console.error(error);
    }
  }

}));