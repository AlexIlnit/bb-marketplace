import api from "./axios";

export const getMyListings = () =>
  api.get("/users/my-listings");