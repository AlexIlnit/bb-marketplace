"use client";

import { create } from "zustand";

type User = {
  _id: string;
  name: string;
  role: string;
};

type AuthState = {
  user: User | null;
  token: string | null;

  loadUser: () => void;

  setUser: (
    user: User,
    token: string
  ) => void;

  logout: () => void;
};

export const useAuthStore =
  create<AuthState>((set) => ({
    user: null,
    token: null,

    loadUser: () => {
      if (typeof window === "undefined") return;

      const user =
        localStorage.getItem("user");

      const token =
        localStorage.getItem("token");

      set({
        user: user
          ? JSON.parse(user)
          : null,
        token,
      });
    },

    setUser: (user, token) => {
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      localStorage.setItem(
        "token",
        token
      );

      set({
        user,
        token,
      });
    },

    logout: () => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      set({
        user: null,
        token: null,
      });
    },
  }));