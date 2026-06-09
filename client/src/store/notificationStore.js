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
},

markAsRead: async (id) => {
  try {
    const token = localStorage.getItem("token");

    await api.patch(
      `/notifications/${id}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    set((state) => ({
      notifications: state.notifications.map((n) =>
        n._id === id ? { ...n, isRead: true } : n
      )
    }));
  } catch (err) {
    console.error(err);
  }
},
markAllAsRead: async () => {
  const token = localStorage.getItem("token");

  await api.patch(
    "/notifications/read-all",
    {},
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  set((state) => ({
    notifications: state.notifications.map((n) => ({
      ...n,
      isRead: true
    }))
  }));
}
}));