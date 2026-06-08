import api from "./axios";

export const getListings =
(page = 1) =>
  api.get(
    `/listings?page=${page}`
  );
// получить ВСЕ объявления (для админки)
export const getAllListings = () => {
  return api.get("/listings");
};

export const getListingById = (id) =>
  api.get(`/listings/${id}`);

export const createListing = (data) =>
  api.post("/listings", data);

export const deleteListing = (id) =>
  api.delete(`/listings/${id}`);

export const updateListing = (
  id,
  data
) =>
  api.put(
    `/listings/${id}`,
    data
  );