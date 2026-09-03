import { create } from "zustand";
import { getListings } from "../api/listingApi";

export const useListingStore = create((set, get) => ({
  listings: [],

  search: "",
  category: "",
  priceFrom: "",
  priceTo: "",
  condition: "",
  sellerType: "",

  region: localStorage.getItem("region") || "",
  city: localStorage.getItem("city") || "",

  totalPages: 1,
  loading: false,

  setRegion: (region) => set({ region }),

  setCity: (city) => set({ city }),

  setSearch: (value) => set({ search: value }),

  setCategory: (value) => set({ category: value }),

  setPriceFrom: (value) => set({ priceFrom: value }),

  setPriceTo: (value) => set({ priceTo: value }),

  setCondition: (value) => set({ condition: value }),

  setSellerType: (value) => set({ sellerType: value }),

  fetchListings: async (page = 1) => {
    set({ loading: true });

    try {
      const state = get();

      const { data } = await getListings({
        page,
        search: state.search,
        category: state.category,
        region: state.region,
        city: state.city,
        priceFrom: state.priceFrom,
        priceTo: state.priceTo,
        condition: state.condition,
        sellerType: state.sellerType,
      });

      set({
        listings: data.listings || [],
        totalPages: data.totalPages || 1,
      });
    } catch (error) {
      console.error(
        "FETCH LISTINGS ERROR:",
        error.response?.data || error.message
      );

      set({
        listings: [],
        totalPages: 1,
      });
    } finally {
      set({ loading: false });
    }
  },
}));