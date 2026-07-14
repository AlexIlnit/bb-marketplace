import api from "./axios";

export const createRating = (data) =>
  api.post("/ratings", data);

export const getSellerRatings = (sellerId) =>
  api.get(`/ratings/${sellerId}`);