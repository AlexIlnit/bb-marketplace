import {
  useEffect
} from "react";

import MainLayout
from "../../layouts/MainLayout";

import ListingCard
from "../../components/listing/ListingCard";

import {
  useListingStore
} from "../../store/listingStore";

import { Link } from "react-router-dom";

export default function Home() {

  const {
    listings,
    fetchListings
  } =
    useListingStore();

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <MainLayout>

      <h1
        className="
        text-3xl
        font-bold
        mb-8
        "
      >
        Свежие объявления
      </h1>

      <div
        className="
        grid
        md:grid-cols-2
        lg:grid-cols-4
        gap-6
        "
      >
        {listings.map(
          listing => (
            <ListingCard
              key={listing._id}
              listing={listing}
            />
          )
        )}
      </div>

    </MainLayout>
  );
}