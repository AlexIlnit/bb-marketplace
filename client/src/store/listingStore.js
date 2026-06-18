import { create } from "zustand";

import {
  getListings
} from "../api/listingApi";

export const useListingStore =
create((set, get) => ({

  listings: [],

  search: "",
  category: "",
  priceFrom: "",
  priceTo: "",
  condition: "",
  sellerType: "",
  region: "",
  city: "",

  setRegion: (region) =>
    set({ region }),

  setCity: (city) =>
    set({ city }),

  setSearch: (value) =>
    set({ search: value }),

  setCategory: (value) =>
    set({ category: value }),

  setPriceFrom: (value) =>
    set({ priceFrom: value }),

  setPriceTo: (value) =>
    set({ priceTo: value }),
  
  setCondition: (value) => set({ condition: value }),

  setSellerType: (value) =>
  set({ sellerType: value }),
  

  totalPages: 1,

  loading: false,

fetchListings: async (page = 1) => {
  set({ loading: true });

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
    sellerType: state.sellerType
  });

  set({
    listings: data.listings,
    totalPages: data.totalPages,
    loading: false
  });
}
}));