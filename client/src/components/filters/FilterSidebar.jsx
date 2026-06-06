import { useListingStore } from "../../store/listingStore";

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

      <div className="space-y-4">

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Поиск..."
          className="
            w-full
            border
            rounded-xl
            p-3
          "
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className="
            w-full
            border
            rounded-xl
            p-3
          "
        >
          <option value="">
            Все категории
          </option>

          <option value="Авто">
            Авто
          </option>

          <option value="Недвижимость">
            Недвижимость
          </option>

          <option value="Электроника">
            Электроника
          </option>
        </select>

        <input
          type="number"
          value={priceFrom}
          onChange={(e) =>
            setPriceFrom(e.target.value)
          }
          placeholder="Цена от"
          className="
            w-full
            border
            rounded-xl
            p-3
          "
        />

        <input
          type="number"
          value={priceTo}
          onChange={(e) =>
            setPriceTo(e.target.value)
          }
          placeholder="Цена до"
          className="
            w-full
            border
            rounded-xl
            p-3
          "
        />

      </div>

    </aside>
  );
}