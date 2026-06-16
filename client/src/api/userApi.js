import api from "./axios";

export const getMyListings = () =>
  api.get("/users/my-listings");

export const getUsers = () => api.get("/admin/users");

export const deleteUser = (id) =>
  api.delete(`/admin/users/${id}`);

// получить всех пользователей (ADMIN)
export const getAllUsers = () => {
  return api.get("/admin/users");
};
export const updateProfile = (data) =>
  api.put("/auth/profile", data);

export const getMe = () => api.get("/auth/me");