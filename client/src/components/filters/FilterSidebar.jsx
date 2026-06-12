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

  const { categories, fetchCategories } = useCategoryStore();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fieldClass = `
    border border-gray-300 bg-white text-gray-900
    rounded-xl p-3 w-full
    focus:outline-none focus:border-green-500
  `;

  const FiltersContent = () => (
    <div className="flex flex-col gap-4">
      
      <label>Поиск</label>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={fieldClass}
        placeholder="Поиск..."
      />

      <label>Категория</label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className={fieldClass}
      >
        <option value="">Все</option>
        {categories.map((c) => (
          <option key={c._id} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>

      <label>Цена от</label>
      <input
        type="number"
        value={priceFrom}
        onChange={(e) => setPriceFrom(e.target.value)}
        className={fieldClass}
      />

      <label>Цена до</label>
      <input
        type="number"
        value={priceTo}
        onChange={(e) => setPriceTo(e.target.value)}
        className={fieldClass}
      />

      <label>Состояние</label>
      <select
        value={condition}
        onChange={(e) => setCondition(e.target.value)}
        className={fieldClass}
      >
        <option value="">Любое</option>
        <option value="new">Новое</option>
        <option value="used">Б/У</option>
      </select>

      <label>Продавец</label>
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
        className="bg-gray-200 py-2 rounded-xl"
      >
        Сброс
      </button>
    </div>
  );

  return (
    <>
      {/* 📱 MOBILE BUTTON */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setOpen(true)}
          className="bg-green-600 text-white py-2 px-4 rounded-xl text-sm"
        >
          Фильтры
        </button>
      </div>

      {/* 🖥 DESKTOP SIDEBAR */}
      <aside className="hidden lg:block bg-white p-4 rounded-2xl shadow-sm">
        <FiltersContent />
      </aside>

      {/* 📱 MODAL */}
{open && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center lg:hidden">
    
    <div className="bg-white w-[90%] max-w-md p-4 rounded-2xl max-h-[80vh] overflow-y-auto shadow-xl">
      
      <div className="flex justify-between mb-4">
        <h2 className="font-bold">Фильтры</h2>
        <button onClick={() => setOpen(false)}>✕</button>
      </div>

      <FiltersContent />
    </div>

  </div>
)}
    </>
  );
}