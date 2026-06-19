export type Listing = {
  _id: string;
  title: string;
  price: number;
  images?: string[];
  city?: string;
};

export type ListingsResponse = {
  listings: Listing[];
  totalPages: number;
};