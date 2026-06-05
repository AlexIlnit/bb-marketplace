// import { create } from "zustand";
// import { toggleFavorite as toggleFavoriteApi } from "../api/favoriteApi";

// export const useFavoriteStore = create((set) => ({
//   favorites: [],

//   toggleFavorite: async (id) => {
//     const { data } = await toggleFavoriteApi(id);

//     set((state) => {
//       let updated;

//       if (data.isFavorite) {
//         updated = [...state.favorites, id];
//       } else {
//         updated = state.favorites.filter((f) => f !== id);
//       }

//       return { favorites: updated };
//     });
//   }
// }));




import { create } from "zustand";
import { toggleFavorite } from "../api/favoriteApi";

export const useFavoriteStore = create((set, get) => ({
  favorites: [], // <-- только ID

  fetchFavorites: async () => {
    const res = await fetch("http://localhost:5000/api/favorites", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    set({
      favorites: data,
    //   data.map((f) => f.listing._id),
    });
  },

  toggleFavorite: async (id) => {
    const { data } = await toggleFavorite(id);

    set((state) => {
      if (data.isFavorite) {
        return {
          favorites: [...state.favorites, id],
        };
      }

      return {
        favorites: state.favorites.filter((f) => f !== id),
      };
    });
  },
}));