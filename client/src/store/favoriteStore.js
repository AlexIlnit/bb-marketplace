// import { create } from "zustand";
// import { toggleFavorite, getFavorites } from "../api/favoriteApi";

// export const useFavoriteStore = create((set, get) => ({
//   favorites: [], // <-- только ID

//   fetchFavorites: async () => {
//     const res = await fetch("http://localhost:5000/api/favorites", {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     });

//     const data = await res.json();

//     set({
//       favorites: data
//     });
//   },

//   toggleFavorite: async (id) => {
//     const { data } = await toggleFavorite(id);

//     set((state) => {
//       if (data.isFavorite) {
//         return {
//           favorites: [...state.favorites, id],
//         };
//       }

//       return {
//         favorites: state.favorites.filter((f) => f !== id),
//       };
//     });
//   },
// }));
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