"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { ListingsResponse } from "../types/listing";

type Props = {
  totalPages: number;
};

export default function PaginationClient({ totalPages }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const page = Number(params.get("page") || 1);

  const goTo = (p: number) => {
    const query = new URLSearchParams(params.toString());
    query.set("page", String(p));

    router.push(`/?${query.toString()}`);
  };

  return (
    <div className="flex gap-2 mt-10 justify-center">

      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          onClick={() => goTo(i + 1)}
          className={`px-3 py-1 border rounded ${
            page === i + 1 ? "bg-green-600 text-white" : ""
          }`}
        >
          {i + 1}
        </button>
      ))}

    </div>
  );
}