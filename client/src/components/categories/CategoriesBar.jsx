import { useEffect, memo  } from "react";
import { useCategoryStore } from "../../store/categoryStore";
import { useListingStore } from "../../store/listingStore";
import { iconMap } from "../../utils/iconMap";
import { LayoutGrid } from "lucide-react";
function CategoriesBar() {
  const categories = useCategoryStore((state) => state.categories);
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);

  const activeCategory = useListingStore((state) => state.category);
  const setCategory = useListingStore((state) => state.setCategory);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="mb-5 mt-5 ">
      {/* <h2 className="text-xl font-semibold mb-4 text-yellow-500 ">Категории</h2> */}

      <div className=" w-full overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 pr-4">

          <button
            aria-label="Все категории"
            aria-pressed={!activeCategory}
            onClick={() => setCategory("")}
            className={`
              shrink-0
              w-28
              aspect-3/2
              rounded-xl
              overflow-hidden
              relative
              border-2
              ${!activeCategory ? "border-blue-500" : "border-transparent"}
            `}
          >
            <img
              src="/categories/all.webp"
              alt="Все категории"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </button>

          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug;

            return (
              <button
                key={cat._id}
                aria-label={`Категория ${cat.name}`}
                aria-pressed={activeCategory === cat.slug}
                onClick={() =>
                  setCategory(isActive ? "" : cat.slug)
                }
                className={`
                  shrink-0
                  w-28
                  aspect-3/2
                  rounded-xl
                  overflow-hidden
                  relative
                  transition
                  ${isActive ? "border-2 border-blue-500" : ""}
                `}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  width="200"
                  height="120"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/40" />

                <div className="relative z-10 flex items-center justify-center h-full text-white">
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