export default function ListingCard({ listing, priority }) {
  const image = listing.images?.[0];

  const imageUrl = listing.images?.[0]
  ? listing.images[0].includes("/upload/")
    ? listing.images[0].replace(
        "/upload/",
        "/upload/f_auto,q_auto,w_400/"
      )
    : listing.images[0]
  : "";

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow">
      <img
  src={imageUrl}
  srcSet={`
    ${imageUrl.replace("w_400", "w_200")} 200w,
    ${imageUrl.replace("w_400", "w_400")} 400w,
    ${imageUrl.replace("w_400", "w_600")} 600w
  `}
  sizes="(max-width: 640px) 100vw, 25vw"
  alt={listing.title}
  loading={priority ? "eager" : "lazy"}
  fetchPriority={priority ? "high" : "auto"}
  decoding="async"
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