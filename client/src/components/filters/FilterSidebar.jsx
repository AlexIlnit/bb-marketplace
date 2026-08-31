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
  const [openCategories, setOpenCategories] = useState({});

  const toggleCategory = (id) => {
  setOpenCategories((prev) => ({
    ...prev,
    [id]: !prev[id],
  }));
};

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

{/* ========================================= */}
{/* ОБЛАСТЬ / ГОРОД */}
{/* ========================================= */}

<div className="flex flex-col gap-1 text-black">
  <span>Местоположение</span>

  <div className="border border-blue-100 rounded-xl bg-white overflow-hidden">

    {/* Вся Беларусь */}
    <button
      type="button"
      onClick={() => {
        setRegion("");
        setCity("");
      }}
      className={`
        w-full
        flex
        items-center
        justify-between
        px-3
        py-2.5
        text-xs
        transition
        ${
          !region && !city
            ? "bg-blue-50 text-blue-600 font-semibold"
            : "hover:bg-gray-50 text-gray-700"
        }
      `}
    >
      <span>Вся Беларусь</span>

      {!region && !city && (
        <span className="text-blue-600">
          ✓
        </span>
      )}
    </button>


    {/* ОБЛАСТИ */}
    {Object.entries(regions)
      .filter(
        ([regionName]) =>
          regionName !== "Все города" &&
          regionName !== "Вся Беларусь"
      )
      .map(([regionName, cities]) => {

        const isOpen =
          openCategories[`region-${regionName}`];

        const isRegionActive =
          region === regionName && !city;

        const hasActiveCity =
          region === regionName && !!city;

        return (
          <div key={regionName}>

            {/* Область */}
            <div
              className={`
                flex
                items-center
                border-t
                border-gray-100
                transition
                ${
                  isRegionActive || hasActiveCity
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }
              `}
            >

              {/* Название области */}
              <button
                type="button"
                onClick={() => {
                  setRegion(regionName);
                  setCity("");
                }}
                className={`
                  flex-1
                  text-left
                  px-3
                  py-2.5
                  text-xs
                  ${
                    isRegionActive || hasActiveCity
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700"
                  }
                `}
              >
                {regionName}
              </button>


              {/* Стрелка */}
              {cities.length > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    toggleCategory(
                      `region-${regionName}`
                    )
                  }
                  aria-label={
                    isOpen
                      ? "Скрыть города"
                      : "Показать города"
                  }
                  className="
                    w-10
                    h-10
                    flex
                    items-center
                    justify-center
                    text-gray-400
                    hover:text-blue-600
                    transition
                  "
                >
                  <span
                    className={`
                      text-base
                      transition-transform
                      duration-200
                      ${
                        isOpen
                          ? "rotate-90"
                          : ""
                      }
                    `}
                  >
                    ›
                  </span>
                </button>
              )}


              {/* Галочка области */}
              {isRegionActive && (
                <span className="pr-3 text-blue-600 text-xs">
                  ✓
                </span>
              )}

            </div>


            {/* ГОРОДА */}
            {isOpen && cities.length > 0 && (
              <div
                className="
                  bg-gray-50
                  border-t
                  border-gray-100
                "
              >

                {/* Все города области */}
                <button
                  type="button"
                  onClick={() => {
                    setRegion(regionName);
                    setCity("");
                  }}
                  className={`
                    w-full
                    flex
                    items-center
                    justify-between
                    text-left
                    pl-8
                    pr-3
                    py-2
                    text-xs
                    transition
                    ${
                      region === regionName &&
                      !city
                        ? "text-blue-600 bg-blue-100 font-semibold"
                        : "text-gray-600 hover:bg-gray-100"
                    }
                  `}
                >
                  <span>
                    Все города
                  </span>

                  {region === regionName &&
                    !city && (
                      <span className="text-blue-600">
                        ✓
                      </span>
                    )}
                </button>


                {/* Список городов */}
                {cities.map((cityName) => {

                  const isCityActive =
                    region === regionName &&
                    city === cityName;

                  return (
                    <button
                      key={cityName}
                      type="button"
                      onClick={() => {
                        setRegion(regionName);
                        setCity(cityName);
                      }}
                      className={`
                        w-full
                        flex
                        items-center
                        justify-between
                        text-left
                        pl-8
                        pr-3
                        py-2
                        text-xs
                        transition
                        ${
                          isCityActive
                            ? "text-blue-600 bg-blue-100 font-semibold"
                            : "text-gray-600 hover:bg-gray-100"
                        }
                      `}
                    >

                      <span>
                        {cityName}
                      </span>

                      {isCityActive && (
                        <span className="text-blue-600">
                          ✓
                        </span>
                      )}

                    </button>
                  );
                })}

              </div>
            )}

          </div>
        );
      })}

  </div>
</div>


      <div className="flex flex-col gap-1 text-black">
  <span>Категория</span>

  <div className="border border-blue-100 rounded-xl bg-white overflow-hidden">

    {/* Все категории */}
    <button
      type="button"
      onClick={() => setCategory("")}
      className={`
        w-full
        flex
        items-center
        justify-between
        px-3
        py-2.5
        text-xs
        transition
        ${
          !category
            ? "bg-blue-50 text-blue-600 font-semibold"
            : "hover:bg-gray-50 text-gray-700"
        }
      `}
    >
      <span>Все категории</span>

      {!category && (
        <span className="text-blue-600">✓</span>
      )}
    </button>

    {/* Главные категории */}
    {categories
      .filter((cat) => !cat.parent)
      .map((parent) => {
        const children = categories.filter(
  (cat) =>
    cat.parent &&
    String(cat.parent?._id || cat.parent) === String(parent._id)
);

        const isOpen = !!openCategories[parent.slug];
        const isParentActive = category === parent.slug;

        const hasActiveChild = children.some(
          (child) => child.slug === category
        );

        return (
          <div key={parent.slug}>

            {/* Главная категория */}
            <div
              className={`
                flex
                items-center
                border-t
                border-gray-100
                transition
                ${
                  isParentActive || hasActiveChild
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }
              `}
            >

              <button
                type="button"
                onClick={() => setCategory(parent.slug)}
                className={`
                  flex-1
                  text-left
                  px-3
                  py-2.5
                  text-xs
                  ${
                    isParentActive || hasActiveChild
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700"
                  }
                `}
              >
                {parent.name}
              </button>

              {/* Стрелка */}
              {children.length > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    toggleCategory(parent.slug)
                  }
                  aria-label={
                    isOpen
                      ? "Скрыть подкатегории"
                      : "Показать подкатегории"
                  }
                  className="
                    w-10
                    h-10
                    flex
                    items-center
                    justify-center
                    text-gray-400
                    hover:text-blue-600
                    transition
                  "
                >
                  <span
                    className={`
                      text-base
                      transition-transform
                      duration-200
                      ${isOpen ? "rotate-90" : ""}
                    `}
                  >
                    ›
                  </span>
                </button>
              )}

              {isParentActive && (
                <span className="pr-3 text-blue-600 text-xs">
                  ✓
                </span>
              )}

            </div>

            {/* Подкатегории */}
            {isOpen && children.length > 0 && (
              <div className="bg-gray-50 border-t border-gray-100">

                {children.map((child) => {
                  const isActive =
                    category === child.slug;

                  return (
                    <button
                      key={child.slug}
                      type="button"
                      onClick={() =>
                        setCategory(child.slug)
                      }
                      className={`
                        w-full
                        flex
                        items-center
                        justify-between
                        text-left
                        pl-8
                        pr-3
                        py-2
                        text-xs
                        transition
                        ${
                          isActive
                            ? "text-blue-600 bg-blue-100 font-semibold"
                            : "text-gray-600 hover:bg-gray-100"
                        }
                      `}
                    >
                      <span>
                        {child.name}
                      </span>

                      {isActive && (
                        <span className="text-blue-600">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}

              </div>
            )}

          </div>
        );
      })}

  </div>
</div>

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

{/* ========================================= */}
{/* СОСТОЯНИЕ */}
{/* ========================================= */}

<div className="flex flex-col gap-1 text-black">
  <span>Состояние</span>

  <div className="grid grid-cols-3 gap-1.5">

    {[
      { value: "", label: "Любое" },
      { value: "new", label: "Новое" },
      { value: "used", label: "Б/У" },
    ].map((item) => {
      const isActive = condition === item.value;

      return (
        <button
          key={item.value}
          type="button"
          onClick={() => setCondition(item.value)}
          className={`
            px-2
            py-2.5
            rounded-xl
            border
            text-xs
            transition
            ${
              isActive
                ? "bg-blue-50 border-blue-500 text-blue-600 font-semibold"
                : "bg-white border-blue-100 text-gray-700 hover:bg-gray-50 hover:border-blue-300"
            }
          `}
        >
          {item.label}
        </button>
      );
    })}

  </div>
</div>

{/* ========================================= */}
{/* ПРОДАВЕЦ */}
{/* ========================================= */}

<div className="flex flex-col gap-1 text-black">
  <span>Продавец</span>

  <div className="grid grid-cols-[0.8fr_1.5fr_1fr] gap-1.5">

    {[
      { value: "", label: "Любой" },
      { value: "private", label: "Частное лицо" },
      { value: "company", label: "Компания" },
    ].map((item) => {
      const isActive = sellerType === item.value;

      return (
        <button
          key={item.value}
          type="button"
          onClick={() => setSellerType(item.value)}
          className={`
            min-w-0
            h-10
            px-2
            rounded-xl
            border
            text-[11px]
            leading-none
            whitespace-nowrap
            transition
            ${
              isActive
                ? "bg-blue-50 border-blue-500 text-blue-600 font-semibold"
                : "bg-white border-blue-100 text-gray-700 hover:bg-gray-50 hover:border-blue-300"
            }
          `}
        >
          {item.label}
        </button>
      );
    })}

  </div>
</div>



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
