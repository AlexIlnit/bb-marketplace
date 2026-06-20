import type { ListingsResponse } from "../types/listing";

type ListingsParams = {
  search?: string;
  category?: string;
  city?: string;
  region?: string;
  condition?: string;
  sellerType?: string;
  priceFrom?: string;
  priceTo?: string;
  page?: number | string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

  export async function getListingById(id: string) {
  const res = await fetch(
    `${API_URL}/listings/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Listing not found");
  }

  return res.json();
}

export async function getListings(
  params: ListingsParams = {}
): Promise<ListingsResponse> {

  const clean = Object.fromEntries(
    Object.entries(params)
      .filter(([_, v]) => v != null && v !== "")
      .map(([k, v]) => [k, String(v)])
  );

  const query = new URLSearchParams(clean).toString();

  const res = await fetch(
    `${API_URL}/listings?${query}`,
    {
      next: {
        revalidate: 60
      }
    }
  );
  

  return res.json();
}