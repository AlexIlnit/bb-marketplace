import { useEffect } from "react";

import { useListingStore } from "../../store/listingStore";
import { useCategoryStore } from "../../store/categoryStore";

export default function FilterSidebar() {
  const {
    search,
    category,
    priceFrom,
    priceTo,

    setSearch,
    setCategory,
    setPriceFrom,
    setPriceTo
  } = useListingStore();

  const {
    categories,
    fetchCategories
  } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, []);
const fieldClass = `
  border
  border-gray-300
  rounded-xl
  p-3
  w-full

  transition-all
  duration-200

  focus:outline-none
  focus:border-green-500
  focus:shadow-md
`;
  return (
    <aside
      className="
        bg-white
        rounded-2xl
        p-5
        shadow-sm
      "
    >
      <h2
        className="
          text-xl
          font-bold
          mb-4
        "
      >
        Фильтры
      </h2>

      <div
        className="
          flex
          flex-col
          gap-4

          lg:flex-col

          md:flex-row
          md:overflow-x-auto
        "
      >
        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Поиск..."
          className={fieldClass}
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className={fieldClass}
        >
          <option value="">
            Все категории
          </option>

          {categories.map((cat) => (
            <option
              key={cat._id}
              value={cat.slug}
            >
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={priceFrom}
          onChange={(e) =>
            setPriceFrom(e.target.value)
          }
          placeholder="Цена от"
          className={fieldClass}
        />

        <input
          type="number"
          value={priceTo}
          onChange={(e) =>
            setPriceTo(e.target.value)
          }
          placeholder="Цена до"
          className={fieldClass}
        />
      </div>
    </aside>
  );
}