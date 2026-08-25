import api from "./axios";

export const uploadImage = (file, folder = "listings") => {
  const formData = new FormData();

  formData.append("image", file);
  formData.append("folder", folder);

  return api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};