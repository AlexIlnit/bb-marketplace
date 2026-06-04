import api from "./axios";

export const getFavorites =
  () => api.get("/favorites");

export const addFavorite =
  (id) =>
    api.post(`/favorites/${id}`);

export const removeFavorite =
  (id) =>
    api.delete(`/favorites/${id}`);