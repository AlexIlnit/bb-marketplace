import { create } from "zustand";

import {
  getListings
} from "../api/listingApi";

export const useListingStore =
create((set) => ({

  listings: [],

  search: "",
  category: "",
  priceFrom: "",
  priceTo: "",

  setSearch: (value) =>
    set({ search: value }),

  setCategory: (value) =>
    set({ category: value }),

  setPriceFrom: (value) =>
    set({ priceFrom: value }),

  setPriceTo: (value) =>
    set({ priceTo: value }),

  totalPages: 1,

  loading: false,

  fetchListings:
    async (page = 1) => {

      set({
        loading: true
      });

      const { data } =
        await getListings(page);

      set({
        listings:
          data.listings,

        totalPages:
          data.totalPages,

        loading: false
      });
    }
}));