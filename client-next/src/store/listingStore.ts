import { create } from "zustand";
import { getListings } from "@/lib/api";

type Listing = any;

type ListingStore = {
  listings: Listing[];
  search: string;
  category: string;
  priceFrom: string;
  priceTo: string;
  condition: string;
  sellerType: string;
  region: string;
  city: string;

  totalPages: number;
  loading: boolean;

  setRegion: (v: string) => void;
  setCity: (v: string) => void;
  setSearch: (v: string) => void;
  setCategory: (v: string) => void;
  setPriceFrom: (v: string) => void;
  setPriceTo: (v: string) => void;
  setCondition: (v: string) => void;
  setSellerType: (v: string) => void;

  fetchListings: (page?: number) => Promise<void>;
};

export const useListingStore = create<ListingStore>((set, get) => ({
  listings: [],

  search: "",
  category: "",
  priceFrom: "",
  priceTo: "",
  condition: "",
  sellerType: "",
  region: "",
  city: "",

  totalPages: 1,
  loading: false,

  setRegion: (region) => set({ region }),
  setCity: (city) => set({ city }),
  setSearch: (search) => set({ search }),
  setCategory: (category) => set({ category }),
  setPriceFrom: (priceFrom) => set({ priceFrom }),
  setPriceTo: (priceTo) => set({ priceTo }),
  setCondition: (condition) => set({ condition }),
  setSellerType: (sellerType) => set({ sellerType }),

  fetchListings: async (page = 1) => {
    set({ loading: true });

    const state = get();

    const res = await getListings({
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
      listings: res.listings,
      totalPages: res.totalPages,
      loading: false,
    });
  },
}));