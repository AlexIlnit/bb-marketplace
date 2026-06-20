import Image from "next/image";
import { getListingById } from "@/lib/api";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {

  const { id } = await params;

  const listing = await getListingById(id);

  return {
    title: `${listing.title} - ${listing.price} BYN`,
    description:
      listing.description?.slice(0, 160),
    openGraph: {
      title: listing.title,
      description: listing.description,
      images: listing.images?.[0]
        ? [listing.images[0]]
        : [],
    },
  };
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const listing = await getListingById(id);

if (!listing) {
  notFound();
}

  return (
    <main className="max-w-6xl mx-auto p-6">

      <div className="grid md:grid-cols-2 gap-8">

        <div className="relative w-full h-[500px]">

          <Image
            src={
              listing.images?.[0] ||
              "https://placehold.co/800x600"
            }
            alt={listing.title}
            fill
            priority
            className="object-cover rounded-2xl"
          />

        </div>

        <div>

          <h1 className="text-3xl font-bold mb-4">
            {listing.title}
          </h1>

          <p className="text-4xl font-bold text-green-600 mb-6">
            {listing.price} BYN
          </p>

          <p className="mb-2">
            📍 {listing.city}
          </p>

          <p className="mb-2">
            🏷️ {listing.category}
          </p>

          <p className="mb-2">
            {listing.condition === "new"
              ? "🆕 Новое"
              : "♻️ Б/У"}
          </p>

          <p className="mb-2">
            {listing.sellerType === "company"
              ? "🏢 Компания"
              : "👤 Частное лицо"}
          </p>

        </div>

      </div>

      <div className="mt-10 bg-white p-6 rounded-2xl border">

        <h2 className="text-2xl font-bold mb-4">
          Описание
        </h2>

        <p>
          {listing.description}
        </p>

      </div>

    </main>
  );
}