import api from "./axios";

/* USERS */
export const getAdminUsers = () => api.get("/admin/users");
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const toggleUserBlock = (id) => api.patch(`/admin/users/${id}/block`);

/* LISTINGS */
export const getAdminListings = () => api.get("/admin/listings");

export const approveListing = (id) =>
  api.patch(`/admin/listings/${id}/approve`);

export const rejectListing = (id) =>
  api.patch(`/admin/listings/${id}/reject`);

export const deleteListing = (id) =>
  api.delete(`/admin/listings/${id}`);