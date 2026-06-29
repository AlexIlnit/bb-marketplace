import { create } from "zustand";

const defaultSettings = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
};

export const useCookieStore = create((set) => ({
  accepted: false,

  settings: defaultSettings,

  modalOpen: false,

  openModal: () =>
    set({
      modalOpen: true,
    }),

  closeModal: () =>
    set({
      modalOpen: false,
    }),

  load: () => {
    const saved = localStorage.getItem("cookie-consent");

    if (!saved) return;

    set({
      accepted: true,
      settings: JSON.parse(saved),
    });
  },

  save: (settings) => {
    settings.necessary = true;

    localStorage.setItem(
      "cookie-consent",
      JSON.stringify(settings)
    );

    set({
      accepted: true,
      settings,
      modalOpen: false,
    });
  },
}));