import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,


  setUser: (user, token) => {

    const normalizedUser = {
      ...user,
      _id: user._id || user.id,
    };


    localStorage.setItem(
      "user",
      JSON.stringify(normalizedUser)
    );

    localStorage.setItem(
      "token",
      token
    );


    set({
      user: normalizedUser,
      token
    });

  },


  logout: () => {

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    set({
      user:null,
      token:null
    });

  }

}));