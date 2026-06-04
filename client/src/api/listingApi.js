import api from "./axios";

export const getListings =
(page = 1) =>
  api.get(
    `/listings?page=${page}`
  );

export const getListingById = (id) =>
  api.get(`/listings/${id}`);

export const createListing = (data) =>
  api.post("/listings", data);