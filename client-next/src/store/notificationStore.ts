"use client";

import { create } from "zustand";
import api from "@/lib/axios";

type Notification = {
  _id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

type State = {
  notifications: Notification[];
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
};

export const useNotificationStore = create<State>((set) => ({
  notifications: [],

  fetchNotifications: async () => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;

      if (!token) return;

      const res = await api.get("/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ notifications: res.data });
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  },

  markAsRead: async (id: string) => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;

      if (!token) return;

      await api.patch(
        `/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        ),
      }));
    } catch (err) {
      console.error(err);
    }
  },

  markAllAsRead: async () => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;

      if (!token) return;

      await api.patch(
        "/notifications/read-all",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      set((state) => ({
        notifications: state.notifications.map((n) => ({
          ...n,
          isRead: true,
        })),
      }));
    } catch (err) {
      console.error(err);
    }
  },
}));