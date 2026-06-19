"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  totalPages: number;
};

export default function PaginationClient({ totalPages }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);

  const goTo = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(p));

    router.push(`/?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex gap-2 mt-10 justify-center">
      {Array.from({ length: totalPages }).map((_, i) => {
        const pageNum = i + 1;

        return (
          <button
            key={pageNum}
            onClick={() => goTo(pageNum)}
            aria-current={page === pageNum ? "page" : undefined}
            className={`px-3 py-1 border rounded transition ${
              page === pageNum
                ? "bg-green-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {pageNum}
          </button>
        );
      })}
    </div>
  );
}