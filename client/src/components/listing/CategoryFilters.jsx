import { useEffect, useMemo, useState } from "react";
import { ChevronDown, RotateCcw, SlidersHorizontal } from "lucide-react";

import { categoryCharacteristics } from "../../data/categoryCharacteristics";
import { carData } from "../../data/carData";

export default function CategoryFilters({
  categorySlug,
  filters,
  onChange,
  onApply,
  onReset,
}) {
  const config = categoryCharacteristics[categorySlug];

  const [open, setOpen] = useState(true);

  if (!config) return null;

  const handleChange = (name, value) => {
    onChange({
      ...filters,
      [name]: value,
    });
  };

  const handleReset = () => {
    onReset();
  };

  const getOptions = (field) => {
    // =========================
    // МОДЕЛИ АВТО
    // =========================

    if (field.name === "model" && filters.brand) {
      return carData[filters.brand] || [];
    }

    return field.options || [];
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white">
      {/* HEADER */}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between px-5 py-4"
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} />

          <span className="font-semibold text-gray-900">
            Фильтры
          </span>
        </div>

        <ChevronDown
          size={18}
          className={`transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="border-t border-gray-100 px-5 py-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {config.fields.map((field) => {
              const options = getOptions(field);

              // ==========================================
              // SELECT
              // ==========================================

              if (field.type === "select") {
                const disabled =
                  field.name === "model" && !filters.brand;

                return (
                  <div key={field.name}>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>

                    <select
                      value={filters[field.name] || ""}
                      disabled={disabled}
                      onChange={(event) =>
                        handleChange(
                          field.name,
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-gray-400 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
                    >
                      <option value="">
                        {disabled
                          ? "Сначала выберите марку"
                          : "Любое"}
                      </option>

                      {options.map((option) => (
                        <option
                          key={option}
                          value={option}
                        >
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              // ==========================================
              // NUMBER
              // ==========================================

              if (field.type === "number") {
                return (
                  <div key={field.name}>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>

                    <div className="relative">
                      <input
                        type="number"
                        value={filters[field.name] || ""}
                        min={field.min}
                        max={field.max}
                        placeholder={field.placeholder || ""}
                        onChange={(event) =>
                          handleChange(
                            field.name,
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 pr-14 text-sm outline-none transition focus:border-gray-400"
                      />

                      {field.unit && (
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                          {field.unit}
                        </span>
                      )}
                    </div>
                  </div>
                );
              }

              // ==========================================
              // TEXT
              // ==========================================

              if (field.type === "text") {
                return (
                  <div key={field.name}>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>

                    <input
                      type="text"
                      value={filters[field.name] || ""}
                      placeholder={field.placeholder || ""}
                      onChange={(event) =>
                        handleChange(
                          field.name,
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-gray-400"
                    />
                  </div>
                );
              }

              return null;
            })}
          </div>

          {/* BUTTONS */}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onApply}
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Применить фильтры
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <RotateCcw size={16} />

              Сбросить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}