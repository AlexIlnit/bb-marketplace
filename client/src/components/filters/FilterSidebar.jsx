import { useEffect, useState } from "react";

import { useListingStore } from "../../store/listingStore";
import { useCategoryStore } from "../../store/categoryStore";

export default function FilterSidebar() {
  const {
  search,
  category,
  priceFrom,
  priceTo,
  condition,
  sellerType,

  setSearch,
  setCategory,
  setPriceFrom,
  setPriceTo,
  setCondition,
  setSellerType
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
  bg-white
  text-gray-900
  placeholder:text-gray-500

  rounded-xl
  p-3
  w-full

  transition-all
  duration-200

  focus:outline-none
  focus:border-green-500
  focus:ring-2
  focus:ring-green-200
`;
  return (
    <aside
      className="
        bg-white
        rounded-2xl
        p-4
        shadow-sm
      "
    >
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
       <label className="block text-sm font-medium">
        Поиск по названию</label>
        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Поиск..."
          className={fieldClass}
        />
<label htmlFor="category" className="block text-sm font-medium">
  Категория
</label>
        <select
          id="category"
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
 <label className="block text-sm font-medium">
  Цена от
</label>

    <input
    type="number"
    value={priceFrom}
    onChange={(e) => setPriceFrom(e.target.value)}
    placeholder="от"
    className={`${fieldClass} flex-1`}
  />
<label className="block text-sm font-medium">
  Цена до
</label>
  <input
    type="number"
    value={priceTo}
    onChange={(e) => setPriceTo(e.target.value)}
    placeholder="до"
    className={`${fieldClass} flex-1`}
  />

<label htmlFor="condition" className="block text-sm font-medium">
  Состояние
</label>

<select
  id="condition"
  value={condition}
  onChange={(e) => setCondition(e.target.value)}
  className={fieldClass}
>
  <option value="">Любое</option>
  <option value="new">Новое</option>
  <option value="used">Б/У</option>
</select>

<label htmlFor="sellerType" className="block text-sm font-medium">
  Продавец
</label>

<select
  id="sellerType"
  value={sellerType}
  onChange={(e) => setSellerType(e.target.value)}
  className={fieldClass}
>
  <option value="">Любой</option>
  <option value="private">Частное лицо</option>
  <option value="company">Компания</option>
</select>

<button
  onClick={() => {
    setSearch("");
    setCategory("");
    setPriceFrom("");
    setPriceTo("");
    setCondition("");
    setSellerType("");
  }}
  className="
    bg-gray-200
    hover:bg-gray-300
    px-4
    py-2
    rounded-xl
    transition
  "
>
  Сброс
</button>
      </div>
    </aside>
  );
}