import { Link } from "react-router-dom";

export default function ListingCard({ listing }) {
  return (
    <Link to={`/listing/${listing._id}`}>
      <div className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition">
        <img
          src={listing.images?.[0] || "https://placehold.co/600x400"}
          className="h-56 w-full object-cover"
        />

        <div className="p-4">
          <h3 className="font-semibold mb-2">
            {listing.title}
          </h3>

          <div className="text-green-600 font-bold text-xl">
            {listing.price} BYN
          </div>

          <div className="text-gray-500 mt-1">
            {listing.city}
          </div>
        </div>
      </div>
    </Link>
  );
}