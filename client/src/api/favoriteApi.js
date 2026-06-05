import api from "./axios";

// ❤️ добавить / убрать из избранного (toggle)
export const toggleFavorite = (id) =>
  api.post(`/favorites/${id}`);

// 📄 получить все избранные объявления пользователя
export const getFavorites = () =>
  api.get("/favorites");