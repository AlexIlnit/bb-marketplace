import { create } from "zustand";

import {
  getFavorites,
  addFavorite,
  removeFavorite
} from "../api/favoriteApi";

export const useFavoriteStore =
create((set) => ({
  favorites: [],

  fetchFavorites:
  async () => {
    const { data } =
      await getFavorites();

    set({
      favorites: data
    });
  },

addToFavorites: async (id) => {
  try {
    const res = await addFavorite(id);
    console.log("FAVORITE:", res.data);
  } catch (err) {
    console.log(err.response?.data);
  }
},

  removeFromFavorites:
  async (id) => {
    await removeFavorite(id);
  }
}));