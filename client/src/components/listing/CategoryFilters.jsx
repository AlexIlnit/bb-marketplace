import { useState } from "react";
import {
  ChevronDown,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";

import { categoryCharacteristics } from "../../data/categoryCharacteristics";

import { carData } from "../../data/carData";
import { truckData } from "../../data/truckData";
import { motoData } from "../../data/motoData";
import { phoneData } from "../../data/phoneData";
import { tabletData } from "../../data/tabletData";
import { laptopData } from "../../data/laptopData";
import { photoVideoData } from "../../data/photoVideoData";
import { tvData } from "../../data/tvData";
import { computerData } from "../../data/computerData";
import { audioData } from "../../data/audioData";
import { homeApplianceData } from "../../data/homeApplianceData";

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

  // ==========================================
  // КАТЕГОРИИ
  // ==========================================

  const isPartsCategory =
    categorySlug === "auto-parts";

  const isPhotoVideoCategory =
    categorySlug === "photo-video";

  const isAudioCategory =
    categorySlug === "audio";

  const isHomeApplianceCategory =
    categorySlug === "home-appliances";

  // ==========================================
  // БЫТОВАЯ ТЕХНИКА
  // Тип → Бренд → Модель
  // ==========================================

  const selectedApplianceType =
    filters.applianceType || "";

  const selectedApplianceBrand =
    filters.brand || "";

  const applianceTypeData =
    isHomeApplianceCategory
      ? homeApplianceData[selectedApplianceType] || {}
      : {};

  const applianceBrands =
    isHomeApplianceCategory
      ? Object.keys(applianceTypeData)
      : [];

  const applianceModels =
    isHomeApplianceCategory &&
    selectedApplianceBrand
      ? applianceTypeData[selectedApplianceBrand] || []
      : [];

  // ==========================================
  // ФОТО И ВИДЕО
  // Тип → Бренд → Модель
  // ==========================================

  const selectedPhotoVideoType =
    filters.photoVideoType || "";

  const selectedPhotoVideoBrand =
    filters.brand || "";

  const photoVideoTypeData =
    isPhotoVideoCategory
      ? photoVideoData[selectedPhotoVideoType] || {}
      : {};

  const photoVideoBrands =
    isPhotoVideoCategory
      ? Object.keys(photoVideoTypeData)
      : [];

  const photoVideoModels =
    isPhotoVideoCategory &&
    selectedPhotoVideoBrand
      ? photoVideoTypeData[selectedPhotoVideoBrand] || []
      : [];

  // ==========================================
  // АУДИО
  // Тип → Бренд → Модель
  // ==========================================

  const selectedAudioType =
    filters.audioType || "";

  const selectedAudioBrand =
    filters.brand || "";

  const audioTypeData =
    isAudioCategory
      ? audioData[selectedAudioType] || {}
      : {};

  const audioBrands =
    isAudioCategory
      ? Object.keys(audioTypeData)
      : [];

  const audioModels =
    isAudioCategory &&
    selectedAudioBrand
      ? audioTypeData[selectedAudioBrand] || []
      : [];

  // ==========================================
  // ДАННЫЕ АВТОЗАПЧАСТЕЙ
  // ==========================================

  const vehicleData = isPartsCategory
    ? filters.vehicleType === "truck"
      ? truckData
      : filters.vehicleType === "passenger"
        ? carData
        : {}
    : categorySlug === "passenger-cars"
      ? carData
      : categorySlug === "trucks"
        ? truckData
        : categorySlug === "motorcycles"
          ? motoData
          : categorySlug === "phones"
            ? phoneData
            : categorySlug === "tablets"
              ? tabletData
              : categorySlug === "laptops"
                ? laptopData
                : categorySlug === "tv"
                  ? tvData
                  : categorySlug === "computers"
                    ? computerData
                    : {};

  // ==========================================
  // CHANGE
  // ==========================================

  const handleChange = (name, value) => {
    const updatedFilters = {
      ...filters,
      [name]: value,
    };

    // ========================================
    // БЫТОВАЯ ТЕХНИКА
    // ========================================

    if (
      isHomeApplianceCategory &&
      name === "applianceType"
    ) {
      updatedFilters.brand = "";
      updatedFilters.model = "";
    }

    if (
      isHomeApplianceCategory &&
      name === "brand"
    ) {
      updatedFilters.model = "";
    }

    // ========================================
    // ФОТО И ВИДЕО
    // ========================================

    if (
      isPhotoVideoCategory &&
      name === "photoVideoType"
    ) {
      updatedFilters.brand = "";
      updatedFilters.model = "";
    }

    if (
      isPhotoVideoCategory &&
      name === "brand"
    ) {
      updatedFilters.model = "";
    }

    // ========================================
    // АУДИО
    // ========================================

    if (
      isAudioCategory &&
      name === "audioType"
    ) {
      updatedFilters.brand = "";
      updatedFilters.model = "";
    }

    if (
      isAudioCategory &&
      name === "brand"
    ) {
      updatedFilters.model = "";
    }

    // ========================================
    // АВТОЗАПЧАСТИ
    // ========================================

    if (isPartsCategory) {
      if (name === "vehicleType") {
        updatedFilters.carBrand = "";
        updatedFilters.carModel = "";
      }

      if (name === "carBrand") {
        updatedFilters.carModel = "";
      }
    }

    // ========================================
    // ОБЫЧНЫЕ КАТЕГОРИИ
    // Авто / телефоны / планшеты /
    // ноутбуки / ТВ / компьютеры
    // ========================================

    if (
      !isPartsCategory &&
      !isHomeApplianceCategory &&
      !isPhotoVideoCategory &&
      !isAudioCategory &&
      name === "brand"
    ) {
      updatedFilters.model = "";
    }

    onChange(updatedFilters);
  };

  // ==========================================
  // RESET
  // ==========================================

  const handleReset = () => {
    onReset();
  };

  // ==========================================
  // OPTIONS
  // ==========================================

  const getOptions = (field) => {
    // ========================================
    // БЫТОВАЯ ТЕХНИКА
    // ========================================

    if (isHomeApplianceCategory) {
      // Тип техники
      if (field.name === "applianceType") {
        return Object.keys(homeApplianceData);
      }

      // Бренд
      if (field.name === "brand") {
        return applianceBrands;
      }

      // Модель
      if (
        field.name === "model" &&
        filters.brand
      ) {
        return applianceModels;
      }

      return field.options || [];
    }

    // ========================================
    // АУДИО
    // ========================================

    if (isAudioCategory) {
      // Тип техники
      if (field.name === "audioType") {
        return Object.keys(audioData);
      }

      // Бренд
      if (field.name === "brand") {
        return audioBrands;
      }

      // Модель
      if (
        field.name === "model" &&
        filters.brand
      ) {
        return audioModels;
      }

      return field.options || [];
    }

    // ========================================
    // ФОТО И ВИДЕО
    // ========================================

    if (isPhotoVideoCategory) {
      // Тип техники
      if (field.name === "photoVideoType") {
        return Object.keys(photoVideoData);
      }

      // Бренд
      if (field.name === "brand") {
        return photoVideoBrands;
      }

      // Модель
      if (
        field.name === "model" &&
        filters.brand
      ) {
        return photoVideoModels;
      }

      return field.options || [];
    }

    // ========================================
    // АВТОЗАПЧАСТИ
    // ========================================

    if (isPartsCategory) {
      // Марка автомобиля
      if (field.name === "carBrand") {
        return Object.keys(vehicleData);
      }

      // Модель автомобиля
      if (
        field.name === "carModel" &&
        filters.carBrand
      ) {
        return (
          vehicleData[filters.carBrand] || []
        );
      }

      return field.options || [];
    }

    // ========================================
    // АВТОАКСЕССУАРЫ
    // ========================================

    if (
      field.name === "carBrand" &&
      categorySlug === "auto-accessories"
    ) {
      return Object.keys(carData);
    }

    if (
      field.name === "carModel" &&
      categorySlug === "auto-accessories" &&
      filters.carBrand
    ) {
      return (
        carData[filters.carBrand] || []
      );
    }

    // ========================================
    // ОБЫЧНЫЕ КАТЕГОРИИ
    // Авто / телефоны / планшеты /
    // ноутбуки / ТВ / компьютеры
    // ========================================

    if (field.name === "brand") {
      return Object.keys(vehicleData);
    }

    if (
      field.name === "model" &&
      filters.brand
    ) {
      return (
        vehicleData[filters.brand] || []
      );
    }

    return field.options || [];
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="rounded-2xl border border-gray-200 bg-white">

      {/* HEADER */}

      <button
        type="button"
        onClick={() =>
          setOpen((value) => !value)
        }
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

              // ====================================
              // SPECIAL FLAGS
              // ====================================

              const isApplianceType =
                isHomeApplianceCategory &&
                field.name === "applianceType";

              const isApplianceBrand =
                isHomeApplianceCategory &&
                field.name === "brand";

              const isApplianceModel =
                isHomeApplianceCategory &&
                field.name === "model";

              // ====================================
              // DISABLED
              // ====================================

              let disabled = false;

              // ------------------------------------
              // Бытовая техника
              // ------------------------------------

              if (
                isApplianceBrand &&
                !filters.applianceType
              ) {
                disabled = true;
              }

              if (
                isApplianceModel &&
                !filters.brand
              ) {
                disabled = true;
              }

              // ------------------------------------
              // Аудио
              // ------------------------------------

              if (
                isAudioCategory &&
                field.name === "brand" &&
                !filters.audioType
              ) {
                disabled = true;
              }

              if (
                isAudioCategory &&
                field.name === "model" &&
                !filters.brand
              ) {
                disabled = true;
              }

              // ------------------------------------
              // Фото и видео
              // ------------------------------------

              if (
                isPhotoVideoCategory &&
                field.name === "brand" &&
                !filters.photoVideoType
              ) {
                disabled = true;
              }

              if (
                isPhotoVideoCategory &&
                field.name === "model" &&
                !filters.brand
              ) {
                disabled = true;
              }

              // ------------------------------------
              // Обычные категории
              // ------------------------------------

              if (
                !isPartsCategory &&
                !isHomeApplianceCategory &&
                !isPhotoVideoCategory &&
                !isAudioCategory &&
                field.name === "model" &&
                !filters.brand
              ) {
                disabled = true;
              }

              // ------------------------------------
              // Автоаксессуары
              // ------------------------------------

              if (
                categorySlug === "auto-accessories" &&
                field.name === "carModel" &&
                !filters.carBrand
              ) {
                disabled = true;
              }

              // ------------------------------------
              // Запчасти: марка
              // ------------------------------------

              if (
                isPartsCategory &&
                field.name === "carBrand" &&
                !filters.vehicleType
              ) {
                disabled = true;
              }

              // ------------------------------------
              // Запчасти: модель
              // ------------------------------------

              if (
                isPartsCategory &&
                field.name === "carModel" &&
                !filters.carBrand
              ) {
                disabled = true;
              }

              // ====================================
              // SELECT
              // ====================================

              if (field.type === "select") {
                return (
                  <div key={field.name}>

                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>

                    <select
                      value={
                        filters[field.name] || ""
                      }
                      disabled={disabled}
                      onChange={(event) =>
                        handleChange(
                          field.name,
                          event.target.value
                        )
                      }
                      className="
                        w-full
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        px-3.5
                        py-3
                        text-sm
                        outline-none
                        transition
                        focus:border-gray-400
                        disabled:cursor-not-allowed
                        disabled:bg-gray-50
                        disabled:text-gray-400
                      "
                    >

                      <option value="">
                        {disabled
                          ? isApplianceBrand &&
                            !filters.applianceType
                            ? "Сначала выберите тип техники"

                          : isApplianceModel &&
                            !filters.brand
                            ? "Сначала выберите бренд"

                          : isPartsCategory &&
                            field.name === "carBrand" &&
                            !filters.vehicleType
                            ? "Сначала выберите тип автомобиля"

                          : isPartsCategory &&
                            field.name === "carModel" &&
                            !filters.carBrand
                            ? "Сначала выберите марку"

                          : isPhotoVideoCategory &&
                            field.name === "brand" &&
                            !filters.photoVideoType
                            ? "Сначала выберите тип техники"

                          : isPhotoVideoCategory &&
                            field.name === "model" &&
                            !filters.brand
                            ? "Сначала выберите бренд"

                          : isAudioCategory &&
                            field.name === "brand" &&
                            !filters.audioType
                            ? "Сначала выберите тип техники"

                          : isAudioCategory &&
                            field.name === "model" &&
                            !filters.brand
                            ? "Сначала выберите бренд"

                          : categorySlug === "auto-accessories" &&
                            field.name === "carModel" &&
                            !filters.carBrand
                            ? "Сначала выберите марку"

                          : "Сначала выберите марку"

                          : "Любое"}
                      </option>

                      {options.map((option) => {
                        const value =
                          typeof option === "object"
                            ? option.value
                            : option;

                        const label =
                          typeof option === "object"
                            ? option.label
                            : option;

                        return (
                          <option
                            key={value}
                            value={value}
                          >
                            {label}
                          </option>
                        );
                      })}

                    </select>

                  </div>
                );
              }

              // ====================================
              // NUMBER
              // ====================================

              if (field.type === "number") {
                return (
                  <div key={field.name}>

                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>

                    <div className="relative">

                      <input
                        type="number"
                        value={
                          filters[field.name] || ""
                        }
                        min={field.min}
                        max={field.max}
                        placeholder={
                          field.placeholder || ""
                        }
                        onChange={(event) =>
                          handleChange(
                            field.name,
                            event.target.value
                          )
                        }
                        className="
                          w-full
                          rounded-xl
                          border
                          border-gray-200
                          bg-white
                          px-3.5
                          py-3
                          pr-14
                          text-sm
                          outline-none
                          transition
                          focus:border-gray-400
                        "
                      />

                      {field.unit && (
                        <span
                          className="
                            pointer-events-none
                            absolute
                            right-3
                            top-1/2
                            -translate-y-1/2
                            text-xs
                            text-gray-400
                          "
                        >
                          {field.unit}
                        </span>
                      )}

                    </div>

                  </div>
                );
              }

              // ====================================
              // TEXT
              // ====================================

              if (field.type === "text") {
                return (
                  <div key={field.name}>

                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>

                    <input
                      type="text"
                      value={
                        filters[field.name] || ""
                      }
                      placeholder={
                        field.placeholder || ""
                      }
                      onChange={(event) =>
                        handleChange(
                          field.name,
                          event.target.value
                        )
                      }
                      className="
                        w-full
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        px-3.5
                        py-3
                        text-sm
                        outline-none
                        transition
                        focus:border-gray-400
                      "
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
              className="
                inline-flex
                flex-1
                items-center
                justify-center
                rounded-xl
                bg-black
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-gray-800
              "
            >
              Применить фильтры
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-gray-200
                bg-white
                px-5
                py-3
                text-sm
                font-medium
                text-gray-700
                transition
                hover:bg-gray-50
              "
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