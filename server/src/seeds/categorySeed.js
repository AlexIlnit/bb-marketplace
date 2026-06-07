import Category from "../models/Category.js";

export const seedCategories = async () => {
  const count = await Category.countDocuments();

  if (count > 0) return;

await Category.insertMany([
  {
    name: "Недвижимость",
    slug: "real-estate",
    icon: "home",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa"
  },
  {
    name: "Авто",
    slug: "cars",
    icon: "car",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70"
  },
  {
    name: "Электроника",
    slug: "electronics",
    icon: "smartphone",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
  },
  {
    name: "Работа",
    slug: "work",
    icon: "briefcase",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216"
  },
  {
    name: "Одежда",
    slug: "clothes",
    icon: "shirt",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050"
  },
  {
    name: "Услуги",
    slug: "services",
    icon: "wrench",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952"
  },
  {
    name: "Животные",
    slug: "animals",
    icon: "paw-print",
    image: "https://images.unsplash.com/photo-1517849845537-4d257902454a"
  },
  {
    name: "Дом и сад",
    slug: "home-garden",
    icon: "sofa",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
  }
]);

  console.log("Categories seeded");
};