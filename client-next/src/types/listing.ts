export type Listing = {
  _id: string;
  title: string;
  price: number;
  city: string;
  images?: string[];
  createdAt?: string;
};

export type ListingsResponse = {
  listings: Listing[];
  totalPages: number;
};