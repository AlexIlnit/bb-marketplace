import { useEffect, useState } from "react";
import { useListingStore } from "../../store/listingStore";
import { useCategoryStore } from "../../store/categoryStore";
import { regions } from "../../data/regions";

export default function FilterSidebar() {
  const {
    search,
    category,
    region,
    city,
    setCity,
    setRegion,
    priceFrom,
    priceTo,
    condition,
    sellerType,
    setSearch,
    setCategory,
    setPriceFrom,
    setPriceTo,
    setCondition,
    setSellerType,
    fetchListings // 🔥 Достаем функцию запроса из стора
  } = useListingStore();

  const { categories, fetchCategories } = useCategoryStore();
  const [open, setOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(search);

  // 1. Первоначальная загрузка категорий
  useEffect(() => {
    fetchCategories();
  }, []);

  // 2. 🔥 ГЛАВНЫЙ АВТО-ЗАПУСК ФИЛЬТРАЦИИ
  // Этот хук следит за изменениями ВСЕХ фильтров в Zustand и сразу обновляет список объявлений
  useEffect(() => {
    fetchListings(1); // Запрашиваем 1-ю страницу с новыми фильтрами
  }, [search, category, region, city, priceFrom, priceTo, condition, sellerType]);

  // 3. Debounce для строки поиска, чтобы не спамить запросами при каждой букве
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(localSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch]);

  const availableCities = region && regions[region] ? regions[region] : [];

  const fieldClass = `
    border border-blue-100 bg-white text-gray-900
    rounded-xl p-2 w-full
    focus:outline-none focus:border-blue-500
    text-xs
    
  `;

  // 🔥 Выносим контент фильтров в отдельную функцию внутри компонента
  const renderFiltersContent = () => (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col  text-black  gap-1">
        <span>По названию </span>
        <input
          name="search"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className={fieldClass}
          placeholder="Поиск..."
          autoComplete="off"
          
        />
      </label>

      <label className="flex flex-col gap-1 text-black">
        <span>Область</span>
        <select
          value={region}
          name="region"
          autoComplete="off"
          onChange={(e) => {
            setRegion(e.target.value);
            setCity(""); // При смене области обязательно сбрасываем город
          }}
          className={fieldClass}
        >
          <option value="">Все области</option>
          {Object.keys(regions)
  .filter(
    (regionName) =>
      regionName !== "Все города"
  )
  .map((regionName) => (
    <option key={regionName} value={regionName}>
      {regionName}
    </option>
  ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-black">
        <span>Город</span>
        <select
          value={city}
          name="city"
          autoComplete="off"
          onChange={(e) => setCity(e.target.value)}
          disabled={!region} // Блокируем, если область не выбрана
          className={fieldClass}
        >
          <option value="">Все города</option>
          {availableCities.map((cityName) => (
            <option key={cityName} value={cityName}>
              {cityName}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-black">
        <span>Категория</span>
        <select
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={fieldClass}
        >
          <option value="">Все</option>
          {categories.map((c) => (
           <option key={c._id} value={c._id}>
            {c.name}
          </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-black">
        <span>Цена от</span>
        <input
          name="priceFrom"
          type="number"
          value={priceFrom}
          onChange={(e) => setPriceFrom(e.target.value)}
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-1 text-black">
        <span>Цена до</span>
        <input
          name="priceTo"
          type="number"
          value={priceTo}
          onChange={(e) => setPriceTo(e.target.value)}
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-1 text-black">
        <span>Состояние</span>
        <select
          name="condition"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className={fieldClass}
        >
          <option value="">Любое</option>
          <option value="new">Новое</option>
          <option value="used">Б/У</option>
        </select>
      </label>

      <label className="flex flex-col gap-1 text-black">
        <span>Продавец</span>
        <select
          name="sellerType"
          value={sellerType}
          onChange={(e) => setSellerType(e.target.value)}
          className={fieldClass}
        >
          <option value="">Любой</option>
          <option value="private">Частное лицо</option>
          <option value="company">Компания</option>
        </select>
      </label>

      <button
        onClick={() => {
          setLocalSearch(""); // Сбрасываем локальный инпут поиска
          setSearch("");
          setCategory("");
          setPriceFrom("");
          setPriceTo("");
          setCondition("");
          setSellerType("");
          setRegion("");
          setCity("");
        }}
        className=" bg-blue-600
     hover:bg-blue-700 py-2 rounded-xl text-white
        
        "
      >
        Сброс
      </button>
    </div>
  );

  // 🔥 ЕДИНСТВЕННЫЙ И ПРАВИЛЬНЫЙ RETURN ДЛЯ КОМПОНЕНТА
  return (
    <>
      {/* 📱 MOBILE BUTTON */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white py-2 px-4 rounded-xl text-sm"
        >
          Фильтры
        </button>
      </div>

      {/* 🖥 DESKTOP SIDEBAR */}
      <aside className="hidden lg:block bg-white p-4 rounded-2xl shadow-sm">
        {renderFiltersContent()}
      </aside>

      {/* 📱 MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center lg:hidden">
          <div className="bg-white w-[90%] max-w-md p-4 rounded-2xl max-h-[80vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between mb-4">
              <h2 className="font-bold">Фильтры</h2>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>
            {renderFiltersContent()}
          </div>
        </div>
      )}
    </>
  );
}
