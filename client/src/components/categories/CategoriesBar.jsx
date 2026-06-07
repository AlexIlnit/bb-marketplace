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
      {/* <div className="grid grid-cols-4 md:grid-cols-8 gap-4"> */}
      <div className="w-full overflow-x-auto scrollbar-hide overscroll-x-contain">
  <div className="flex gap-3  pr-4">
<button
  onClick={() => setCategory("")}
  className={`
    flex-shrink-0
    w-24 sm:w-28 lg:w-32
    h-16 sm:h-20
    rounded-xl
    overflow-hidden
    relative

    border-2
    ${
      !activeCategory
        ? "border-green-500 shadow-lg"
        : "border-transparent"
    }

    transition
    duration-200
  `}
>
  <img
    src="https://images.unsplash.com/photo-1483985988355-763728e1935b"
    alt="Все категории"
    className="absolute inset-0 w-full h-full object-cover"
  />

  <div className="absolute inset-0 bg-gradient-to-br from-green-700/70 to-black/60" />

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
      text-center
      px-2
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
      activeCategory === cat.slug ? null : cat.slug
    )
  }
  className={`
    flex-shrink-0
    relative
    w-24 sm:w-28 lg:w-32
    h-16 sm:h-20
    rounded-xl
    overflow-hidden
    transition
    duration-200
    shadow-sm
    hover:shadow-lg
    ${activeCategory === cat.slug ? "border-2 border-green-500" : "border border-transparent"}
  `}
>
              <img
    src={cat.image}
    alt={cat.name}
    className="absolute inset-0 w-full h-full object-cover"
  />

  <div className="absolute inset-0 bg-black/40" />

  <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
    <span className="text-sm font-semibold text-center px-1">
      {cat.name}
    </span>
  </div>
</button>

          );
          
        })}
      </div>
      </div>
    </div>
  );
}