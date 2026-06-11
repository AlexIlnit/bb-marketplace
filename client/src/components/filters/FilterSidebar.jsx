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
        <p>Поиск по названию</p>
        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Поиск..."
          className={fieldClass}
        />
<p>Категории</p>
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
 <p>Цена</p>
<div className="flex gap-2">
    <input
    type="number"
    value={priceFrom}
    onChange={(e) => setPriceFrom(e.target.value)}
    placeholder="от"
    className={`${fieldClass} flex-1`}
  />

  <input
    type="number"
    value={priceTo}
    onChange={(e) => setPriceTo(e.target.value)}
    placeholder="до"
    className={`${fieldClass} flex-1`}
  />
</div>
<p>Состояние</p>

<select
  value={condition}
  onChange={(e) => setCondition(e.target.value)}
  className={fieldClass}
>
  <option value="">Любое</option>
  <option value="new">Новое</option>
  <option value="used">Б/У</option>
</select>

<p>Продавец</p>

<select
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