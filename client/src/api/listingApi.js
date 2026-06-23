import api from "./axios";

export const getListings = (params) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, v]) => v !== "" && v !== null && v !== undefined
    )
  );

  return api.get("/listings", {
    params: cleanParams
  });
};

// получить ВСЕ объявления (для админки)
export const getAllListings = () => {
  return api.get("/listings");
};

export const getListingById = (id) =>
  api.get(`/listings/${id}`);

export const createListing = (data) =>
  api.post("/listings", data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });


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

  export const getListingsCount = (params) =>
  api.get("/listings/count", {
    params,
  });