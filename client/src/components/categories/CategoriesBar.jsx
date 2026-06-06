import {
  Car,
  Home as HomeIcon,
  Smartphone,
  Briefcase,
  Shirt,
  Wrench,
  PawPrint,
  Sofa
} from "lucide-react";

import { useListingStore } from "../../store/listingStore";

const categories = [
  {
    name: "Недвижимость",
    icon: HomeIcon
  },
  {
    name: "Авто",
    icon: Car
  },
  {
    name: "Электроника",
    icon: Smartphone
  },
  {
    name: "Работа",
    icon: Briefcase
  },
  {
    name: "Одежда",
    icon: Shirt
  },
  {
    name: "Услуги",
    icon: Wrench
  },
  {
    name: "Животные",
    icon: PawPrint
  },
  {
    name: "Дом и сад",
    icon: Sofa
  }
];

export default function CategoriesBar() {
  return (
    <div className="mb-10">

      <h2 className="text-xl font-semibold mb-4">
        Категории
      </h2>

      <div
        className="
          grid
          grid-cols-4
          md:grid-cols-8
          gap-4
        "
      >
        {categories.map((cat) => {
          const Icon = cat.icon;

          return (
            <button
              key={cat.name}
              onClick={() =>
                useListingStore
                  .getState()
                  .setCategory(cat.name)
              }
              className="
                bg-white
                rounded-2xl
                p-4
                shadow-sm
                hover:shadow-md
                transition
                flex
                flex-col
                items-center
                gap-2
              "
            >
              <Icon size={28} />

              <span className="text-sm">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
}