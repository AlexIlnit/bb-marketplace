import { create } from "zustand";
import api from "../api/axios";

export const useNotificationStore = create((set) => ({
  notifications: [],

fetchNotifications: async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.get("/notifications", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    set({
      notifications: res.data
    });

  } catch (err) {
    console.error("FETCH ERROR:", err);
  }
}
}));