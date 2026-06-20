"use client";

import { useEffect, memo } from "react";
import Image from "next/image";
import { useCategoryStore } from "@/store/categoryStore";
import { useListingStore } from "@/store/listingStore";

function CategoriesBar() {
  const categories = useCategoryStore(
    (state: any) => state.categories
  );

  const fetchCategories = useCategoryStore(
    (state: any) => state.fetchCategories
  );

  const activeCategory = useListingStore(
    (state: any) => state.category
  );

  const setCategory = useListingStore(
    (state: any) => state.setCategory
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-4">
        Категории
      </h2>

      <div className="w-full overflow-x-auto">
        <div className="flex gap-3 pr-4">

          <button
            onClick={() => setCategory("")}
            className={`
              flex-shrink-0
              w-28
              aspect-[3/2]
              rounded-xl
              overflow-hidden
              relative
              border-2
              ${
                !activeCategory
                  ? "border-green-500"
                  : "border-transparent"
              }
            `}
          >
            <Image
              src="/categories/all.webp"
              alt="Все категории"
              fill
              className="object-cover"
            />
          </button>

          {categories?.map((cat: any) => {
            const isActive =
              activeCategory === cat.slug;

            return (
              <button
                key={cat._id}
                onClick={() =>
                  setCategory(
                    isActive ? "" : cat.slug
                  )
                }
                className={`
                  flex-shrink-0
                  w-28
                  aspect-[3/2]
                  rounded-xl
                  overflow-hidden
                  relative
                  ${
                    isActive
                      ? "border-2 border-green-500"
                      : ""
                  }
                `}
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-black/40" />

                <div className="relative z-10 flex items-center justify-center h-full text-white text-sm text-center px-2">
                  {cat.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default memo(CategoriesBar);