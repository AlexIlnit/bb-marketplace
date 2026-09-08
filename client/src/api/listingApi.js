import api from "./axios";

// export const getListings = (params) => {
//   const cleanParams = Object.fromEntries(
//     Object.entries(params).filter(
//       ([_, v]) => v !== "" && v !== null && v !== undefined
//     )
//   );

//   return api.get("/listings", {
//     params: cleanParams
//   });
// };
export const getListings = (params = {}) => {
  const {
    characteristics,
    ...regularParams
  } = params;

  const queryParams = {
    ...regularParams,
  };

  if (characteristics) {
    Object.entries(characteristics).forEach(
      ([key, value]) => {
        if (
          value !== "" &&
          value !== null &&
          value !== undefined
        ) {
          queryParams[`characteristics_${key}`] =
            value;
        }
      }
    );
  }

  return api.get("/listings", {
    params: queryParams,
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

  export const promoteListing = (id) =>
  api.patch(`/listings/${id}/promote`);