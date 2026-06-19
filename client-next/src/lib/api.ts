import type { ListingsResponse } from "../types/listing";

export async function getListings(params = {}) {
  const clean = Object.fromEntries(
    Object.entries(params || {})
      .filter(([_, v]) => v != null && v !== "")
      .map(([k, v]) => [k, String(v)])
  );

  const query = new URLSearchParams(clean).toString();

  const res = await fetch(
    `http://localhost:5000/api/listings?${query}`,
    { cache: "no-store" }
  );

  return res.json();
}