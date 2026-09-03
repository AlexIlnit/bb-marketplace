import Category from "../models/Category.js";

export const seedCategories = async () => {
  // =========================
  // ОСНОВНЫЕ КАТЕГОРИИ
  // =========================

  const mainCategories = [
  {
    name: "Недвижимость",
    slug: "nedvizhimost",
    icon: "home",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa",
  },
  {
    name: "Авто",
    slug: "avto",
    icon: "car",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
  },
  {
    name: "Электроника",
    slug: "elektronika",
    icon: "smartphone",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
  },
  {
    name: "Работа",
    slug: "rabota",
    icon: "briefcase",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216",
  },
  {
    name: "Одежда",
    slug: "odezhda",
    icon: "shirt",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050",
  },
  {
    name: "Услуги",
    slug: "uslugi",
    icon: "wrench",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
  },
  {
    name: "Животные",
    slug: "zhivotnye",
    icon: "paw-print",
    image:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a",
  },
  {
    name: "Дом и сад",
    slug: "dom-i-sad",
    icon: "sofa",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
  },
];

  // Создаём основные категории, если их ещё нет
  for (const category of mainCategories) {
    await Category.findOneAndUpdate(
      { slug: category.slug },
      {
        ...category,
        parent: null,
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );
  }

  // =========================
  // ПОЛУЧАЕМ ОСНОВНЫЕ КАТЕГОРИИ
  // =========================

  const realEstate = await Category.findOne({
  slug: "nedvizhimost",
});

const cars = await Category.findOne({
  slug: "avto",
});

const electronics = await Category.findOne({
  slug: "elektronika",
});

const work = await Category.findOne({
  slug: "rabota",
});

const clothes = await Category.findOne({
  slug: "odezhda",
});

const services = await Category.findOne({
  slug: "uslugi",
});

const animals = await Category.findOne({
  slug: "zhivotnye",
});

const homeGarden = await Category.findOne({
  slug: "dom-i-sad",
});
  // =========================
  // ПОДКАТЕГОРИИ
  // =========================

  const subcategories = [

    // -------- Недвижимость --------

    {
      name: "Квартиры",
      slug: "apartments",
      parent: realEstate._id,
    },
    {
      name: "Дома",
      slug: "houses",
      parent: realEstate._id,
    },
    {
      name: "Комнаты",
      slug: "rooms",
      parent: realEstate._id,
    },
    {
      name: "Земельные участки",
      slug: "land",
      parent: realEstate._id,
    },
    {
      name: "Коммерческая недвижимость",
      slug: "commercial-real-estate",
      parent: realEstate._id,
    },
    {
      name: "Гаражи и машиноместа",
      slug: "garages",
      parent: realEstate._id,
    },

    // -------- Авто --------

    {
      name: "Легковые автомобили",
      slug: "passenger-cars",
      parent: cars._id,
    },
    {
      name: "Грузовые автомобили",
      slug: "trucks",
      parent: cars._id,
    },
    {
      name: "Мотоциклы",
      slug: "motorcycles",
      parent: cars._id,
    },
    {
      name: "Запчасти",
      slug: "auto-parts",
      parent: cars._id,
    },
    {
      name: "Автоаксессуары",
      slug: "auto-accessories",
      parent: cars._id,
    },
    {
      name: "Шины и диски",
      slug: "tires-wheels",
      parent: cars._id,
    },

    // -------- Электроника --------

    {
      name: "Телефоны",
      slug: "phones",
      parent: electronics._id,
    },
    {
      name: "Ноутбуки",
      slug: "laptops",
      parent: electronics._id,
    },
    {
      name: "Компьютеры",
      slug: "computers",
      parent: electronics._id,
    },
    {
      name: "Планшеты",
      slug: "tablets",
      parent: electronics._id,
    },
    {
      name: "Телевизоры",
      slug: "tv",
      parent: electronics._id,
    },
    {
      name: "Аудиотехника",
      slug: "audio",
      parent: electronics._id,
    },
    {
      name: "Фото и видеотехника",
      slug: "photo-video",
      parent: electronics._id,
    },
    {
      name: "Игровые приставки",
      slug: "game-consoles",
      parent: electronics._id,
    },

    // -------- Работа --------

    {
      name: "Вакансии",
      slug: "vacancies",
      parent: work._id,
    },
    {
      name: "Резюме",
      slug: "resumes",
      parent: work._id,
    },
    {
      name: "Подработка",
      slug: "part-time",
      parent: work._id,
    },
    {
      name: "Удалённая работа",
      slug: "remote-work",
      parent: work._id,
    },

    // -------- Одежда --------

    {
      name: "Женская одежда",
      slug: "women-clothes",
      parent: clothes._id,
    },
    {
      name: "Мужская одежда",
      slug: "men-clothes",
      parent: clothes._id,
    },
    {
      name: "Детская одежда",
      slug: "children-clothes",
      parent: clothes._id,
    },
    {
      name: "Обувь",
      slug: "shoes",
      parent: clothes._id,
    },
    {
      name: "Аксессуары",
      slug: "clothing-accessories",
      parent: clothes._id,
    },

    // -------- Услуги --------

    {
      name: "Ремонт и строительство",
      slug: "repair-construction",
      parent: services._id,
    },
    {
      name: "Красота и здоровье",
      slug: "beauty-health",
      parent: services._id,
    },
    {
      name: "Перевозки",
      slug: "transport-services",
      parent: services._id,
    },
    {
      name: "Уборка",
      slug: "cleaning",
      parent: services._id,
    },
    {
      name: "Обучение",
      slug: "education-services",
      parent: services._id,
    },
    {
      name: "Фото и видеосъёмка",
      slug: "photo-video-services",
      parent: services._id,
    },

    // -------- Животные --------

    {
      name: "Собаки",
      slug: "dogs",
      parent: animals._id,
    },
    {
      name: "Кошки",
      slug: "cats",
      parent: animals._id,
    },
    {
      name: "Птицы",
      slug: "birds",
      parent: animals._id,
    },
    {
      name: "Грызуны",
      slug: "rodents",
      parent: animals._id,
    },
    {
      name: "Аквариумные животные",
      slug: "aquarium",
      parent: animals._id,
    },

    // -------- Дом и сад --------

    {
      name: "Мебель",
      slug: "furniture",
      parent: homeGarden._id,
    },
    {
      name: "Бытовая техника",
      slug: "home-appliances",
      parent: homeGarden._id,
    },
    {
      name: "Посуда",
      slug: "dishes",
      parent: homeGarden._id,
    },
    {
      name: "Инструменты",
      slug: "tools",
      parent: homeGarden._id,
    },
    {
      name: "Сад и огород",
      slug: "garden",
      parent: homeGarden._id,
    },
    {
      name: "Декор",
      slug: "decor",
      parent: homeGarden._id,
    },
  ];

  // =========================
  // СОЗДАЁМ ПОДКАТЕГОРИИ
  // =========================

  for (const category of subcategories) {
    await Category.findOneAndUpdate(
      { slug: category.slug },
      category,
      {
        upsert: true,
        returnDocument: "after",
      }
    );
  }

  console.log("Categories and subcategories seeded");
};