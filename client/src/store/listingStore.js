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

 fetchListings: async (page = 1, overrides = {}) => {
  set({ loading: true });

  try {
    const state = get();

    const params = {
      page,

      search:
        overrides.search !== undefined
          ? overrides.search
          : state.search,

      category:
        overrides.category !== undefined
          ? overrides.category
          : state.category,

      region:
        overrides.region !== undefined
          ? overrides.region
          : state.region,

      city:
        overrides.city !== undefined
          ? overrides.city
          : state.city,

      priceFrom:
        overrides.priceFrom !== undefined
          ? overrides.priceFrom
          : state.priceFrom,

      priceTo:
        overrides.priceTo !== undefined
          ? overrides.priceTo
          : state.priceTo,

      condition:
        overrides.condition !== undefined
          ? overrides.condition
          : state.condition,

      sellerType:
        overrides.sellerType !== undefined
          ? overrides.sellerType
          : state.sellerType,
    };

    const { data } = await getListings(params);

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