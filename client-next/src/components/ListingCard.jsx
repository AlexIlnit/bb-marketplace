export default function ListingCard({ listing, priority }) {
  const image = listing.images?.[0];

  const imageUrl = image
    ? image.replace(
        "/upload/",
        "/upload/f_auto,q_auto:eco,w_350/"
      )
    : "";

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow">
      <img
        src={imageUrl}
        alt={listing.title}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <div className="text-green-600 font-bold">
          {listing.price} BYN
        </div>
        <div className="font-semibold">
          {listing.title}
        </div>
      </div>
    </div>
  );
}