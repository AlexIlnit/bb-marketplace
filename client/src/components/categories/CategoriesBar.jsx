import { useEffect } from "react";
import { useCategoryStore } from "../../store/categoryStore";
import { useListingStore } from "../../store/listingStore";
import { iconMap } from "../../utils/iconMap";
import { LayoutGrid } from "lucide-react";

export default function CategoriesBar() {
  const { categories, fetchCategories } = useCategoryStore();

  const {
    category: activeCategory,
    setCategory
  } = useListingStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-4">
        Категории
      </h2>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
<button
  onClick={() => setCategory(null)}
  className={`
    relative
    overflow-hidden
    rounded-2xl
    h-24
    shadow-sm
    hover:shadow-lg
    transition
    ${
      !activeCategory
        ? "ring-4 ring-green-500"
        : ""
    }
  `}
>
  <img
    src="https://images.unsplash.com/photo-1483985988355-763728e1935b"
    alt="Все категории"
    className="
      absolute
      inset-0
      w-full
      h-full
      object-cover
    "
  />

  <div className="absolute inset-0 bg-black/50" />

  <div
    className="
      relative
      z-10
      flex
      items-center
      justify-center
      h-full
      text-white
      font-semibold
      text-sm
    "
  >
    Все категории
  </div>
</button>
        {categories.map((cat) => {
          const isActive = activeCategory === cat.slug;

          const Icon = iconMap?.[cat.icon];

          return (
            <button
              key={cat._id}
              onClick={() =>
                setCategory(
                  isActive
                    ? null
                    : cat.slug
                )
              }
              className={`
                relative
                overflow-hidden
                rounded-2xl
                h-24
                shadow-sm
                hover:shadow-lg
                transition
                ${
                  isActive
                    ? "ring-4 ring-green-500 scale-105"
                    : "hover:scale-105"
                }
              `}
            >
              <img
                src={
                  cat.image ||
                  "https://placehold.co/300x200"
                }
                alt={cat.name}
                className="
                  absolute
                  inset-0
                  w-full
                  h-full
                  object-cover
                "
              />

              <div className="absolute inset-0 bg-black/50" />

              <div
                className="
                  relative
                  z-10
                  flex
                  flex-col
                  items-center
                  justify-center
                  h-full
                  text-white
                "
              >
                {Icon && (
                  <Icon
                    size={22}
                    className="mb-1"
                  />
                )}

                <span className="text-xs font-semibold text-center px-1">
                  {cat.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}