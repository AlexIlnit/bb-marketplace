import { carData} from "./carData";
import { truckData} from "./truckData";
import { phoneData} from "./phoneData";
export const categoryCharacteristics = {
  // =========================================================
  // НЕДВИЖИМОСТЬ
  // =========================================================

  apartments: {
    title: "Характеристики квартиры",
    fields: [
      {
        name: "rooms",
        label: "Количество комнат",
        type: "select",
        options: ["1", "2", "3", "4", "5", "6+"],
        required: true,
      },
      {
        name: "totalArea",
        label: "Общая площадь",
        type: "number",
        placeholder: "60",
        min: 0,
        required: true,
        unit: "м²",
      },
      {
        name: "livingArea",
        label: "Жилая площадь",
        type: "number",
        placeholder: "40",
        min: 0,
        unit: "м²",
      },
      {
        name: "kitchenArea",
        label: "Площадь кухни",
        type: "number",
        placeholder: "10",
        min: 0,
        unit: "м²",
      },
      {
        name: "floor",
        label: "Этаж",
        type: "number",
        placeholder: "5",
        min: 1,
      },
      {
        name: "floors",
        label: "Этажность дома",
        type: "number",
        placeholder: "9",
        min: 1,
        required: true,
      },
      {
        name: "buildingType",
        label: "Тип дома",
        type: "select",
        options: [
          "Панельный",
          "Кирпичный",
          "Монолитный",
          "Каркасный",
          "Блочный",
          "Деревянный",
        ],
      },
      {
        name: "bathroom",
        label: "Санузел",
        type: "select",
        options: [
          "Раздельный",
          "Совмещённый",
          "2 и более",
        ],
      },
      {
        name: "balcony",
        label: "Балкон / лоджия",
        type: "select",
        options: [
          "Нет",
          "Балкон",
          "Лоджия",
          "Несколько",
        ],
      },
      {
        name: "yearBuilt",
        label: "Год постройки",
        type: "number",
        placeholder: "2015",
        min: 1800,
        max: new Date().getFullYear(),
      },
    ],
  },

  houses: {
    title: "Характеристики дома",
    fields: [
      {
        name: "totalArea",
        label: "Площадь дома",
        type: "number",
        placeholder: "120",
        min: 0,
        required: true,
        unit: "м²",
      },
      {
        name: "landArea",
        label: "Площадь участка",
        type: "number",
        placeholder: "10",
        min: 0,
        unit: "соток",
      },
      {
        name: "rooms",
        label: "Количество комнат",
        type: "select",
        options: ["1", "2", "3", "4", "5", "6+"],
      },
      {
        name: "floors",
        label: "Этажность",
        type: "number",
        placeholder: "2",
        min: 1,
      },
      {
        name: "buildingType",
        label: "Материал дома",
        type: "select",
        options: [
          "Кирпич",
          "Газосиликат",
          "Блок",
          "Дерево",
          "Каркас",
          "Монолит",
        ],
      },
      {
        name: "heating",
        label: "Отопление",
        type: "select",
        options: [
          "Газовое",
          "Электрическое",
          "Печное",
          "Твердотопливное",
          "Центральное",
          "Другое",
        ],
      },
      {
        name: "water",
        label: "Водоснабжение",
        type: "select",
        options: [
          "Центральное",
          "Скважина",
          "Колодец",
          "Нет",
        ],
      },
      {
        name: "sewerage",
        label: "Канализация",
        type: "select",
        options: [
          "Центральная",
          "Септик",
          "Выгребная яма",
          "Нет",
        ],
      },
    ],
  },

  rooms: {
    title: "Характеристики комнаты",
    fields: [
      {
        name: "area",
        label: "Площадь комнаты",
        type: "number",
        placeholder: "18",
        min: 0,
        required: true,
        unit: "м²",
      },
      {
        name: "roomsInApartment",
        label: "Комнат в квартире",
        type: "select",
        options: ["1", "2", "3", "4", "5", "6+"],
      },
      {
        name: "floor",
        label: "Этаж",
        type: "number",
        min: 1,
      },
      {
        name: "floors",
        label: "Этажность дома",
        type: "number",
        min: 1,
      },
      {
        name: "buildingType",
        label: "Тип дома",
        type: "select",
        options: [
          "Панельный",
          "Кирпичный",
          "Монолитный",
          "Блочный",
          "Деревянный",
        ],
      },
      {
        name: "bathroom",
        label: "Санузел",
        type: "select",
        options: [
          "Раздельный",
          "Совмещённый",
          "Общий",
        ],
      },
    ],
  },

  land: {
    title: "Характеристики земельного участка",
    fields: [
      {
        name: "area",
        label: "Площадь участка",
        type: "number",
        placeholder: "10",
        min: 0,
        required: true,
        unit: "соток",
      },
      {
        name: "purpose",
        label: "Назначение",
        type: "select",
        options: [
          "ИЖС",
          "ЛПХ",
          "Садоводство",
          "Сельхозназначение",
          "Коммерческое",
          "Другое",
        ],
      },
      {
        name: "landType",
        label: "Тип участка",
        type: "select",
        options: [
          "Ровный",
          "С уклоном",
          "Лесной",
          "У воды",
        ],
      },
      {
        name: "water",
        label: "Водоснабжение",
        type: "select",
        options: [
          "Центральное",
          "Скважина",
          "Колодец",
          "Нет",
        ],
      },
      {
        name: "gas",
        label: "Газ",
        type: "select",
        options: ["Есть", "По улице", "Нет"],
      },
      {
        name: "electricity",
        label: "Электричество",
        type: "select",
        options: ["Есть", "Рядом", "Нет"],
      },
    ],
  },

  "commercial-real-estate": {
    title: "Характеристики коммерческой недвижимости",
    fields: [
      {
        name: "propertyType",
        label: "Тип недвижимости",
        type: "select",
        options: [
          "Офис",
          "Магазин",
          "Склад",
          "Производство",
          "Ресторан / кафе",
          "Салон",
          "Другое",
        ],
        required: true,
      },
      {
        name: "area",
        label: "Площадь",
        type: "number",
        placeholder: "100",
        min: 0,
        required: true,
        unit: "м²",
      },
      {
        name: "floor",
        label: "Этаж",
        type: "number",
        min: 1,
      },
      {
        name: "floors",
        label: "Этажность здания",
        type: "number",
        min: 1,
      },
      {
        name: "buildingType",
        label: "Тип здания",
        type: "select",
        options: [
          "Кирпичное",
          "Панельное",
          "Монолитное",
          "Каркасное",
          "Другое",
        ],
      },
      {
        name: "entrance",
        label: "Вход",
        type: "select",
        options: [
          "Отдельный",
          "Общий",
          "С улицы",
          "Со двора",
        ],
      },
      {
        name: "parking",
        label: "Парковка",
        type: "select",
        options: [
          "Есть",
          "Рядом",
          "Нет",
        ],
      },
    ],
  },

  garages: {
    title: "Характеристики гаража",
    fields: [
      {
        name: "area",
        label: "Площадь",
        type: "number",
        placeholder: "24",
        min: 0,
        required: true,
        unit: "м²",
      },
      {
        name: "garageType",
        label: "Тип",
        type: "select",
        options: [
          "Гараж",
          "Паркинг",
          "Машиноместо",
          "Бокс",
        ],
      },
      {
        name: "buildingType",
        label: "Материал",
        type: "select",
        options: [
          "Кирпич",
          "Бетон",
          "Металл",
          "Блок",
        ],
      },
      {
        name: "electricity",
        label: "Электричество",
        type: "select",
        options: ["Есть", "Нет"],
      },
      {
        name: "heating",
        label: "Отопление",
        type: "select",
        options: ["Есть", "Нет"],
      },
      {
        name: "security",
        label: "Охрана",
        type: "select",
        options: ["Есть", "Нет"],
      },
    ],
  },

  // =========================================================
  // АВТО
  // =========================================================

  "passenger-cars": {
    title: "Характеристики автомобиля",
    fields: [
    {
      name: "brand",
      label: "Марка",
      type: "select",
      options: Object.keys(carData),
      required: true,
    },

    {
      name: "model",
      label: "Модель",
      type: "select",
      options: [],
      required: true,
    },

    {
      name: "year",
      label: "Год выпуска",
      type: "number",
      placeholder: "2020",
      min: 1900,
      max: new Date().getFullYear(),
      required: true,
    },
      {
        name: "engine",
        label: "Двигатель",
        type: "select",
        options: [
          "Бензин",
          "Дизель",
          "Газ",
          "Гибрид",
          "Электро",
        ],
      },
      {
        name: "engineVolume",
        label: "Объём двигателя",
        type: "text",
        placeholder: "2.0 л",
      },
      {
        name: "mileage",
        label: "Пробег",
        type: "number",
        placeholder: "150000",
        min: 0,
        unit: "км",
      },
      {
        name: "transmission",
        label: "Коробка передач",
        type: "select",
        options: [
          "Механика",
          "Автомат",
          "Робот",
          "Вариатор",
        ],
      },
      {
        name: "drive",
        label: "Привод",
        type: "select",
        options: [
          "Передний",
          "Задний",
          "Полный",
        ],
      },
      {
        name: "bodyType",
        label: "Тип кузова",
        type: "select",
        options: [
          "Седан",
          "Хэтчбек",
          "Универсал",
          "Купе",
          "Кабриолет",
          "Внедорожник",
          "Минивэн",
          "Пикап",
        ],
      },
      {
        name: "color",
        label: "Цвет",
        type: "text",
        placeholder: "Например, чёрный",
      },
    ],
  },

  "trucks": {
  title: "Характеристики грузового автомобиля",

  fields: [
    {
      name: "brand",
      label: "Марка",
      type: "select",
      options: Object.keys(truckData),
      required: true,
    },

    {
      name: "model",
      label: "Модель",
      type: "select",
      options: [],
      required: true,
    },

    {
      name: "year",
      label: "Год выпуска",
      type: "number",
      min: 1900,
      max: new Date().getFullYear(),
      required: true,
    },

    {
      name: "mileage",
      label: "Пробег",
      type: "number",
      min: 0,
      unit: "км",
    },

    {
      name: "engine",
      label: "Тип двигателя",
      type: "select",
      options: [
        "Дизель",
        "Бензин",
        "Газ",
        "Гибрид",
        "Электро",
      ],
    },

    {
      name: "engineVolume",
      label: "Объём двигателя",
      type: "text",
      placeholder: "6.7 л",
    },

    {
      name: "loadCapacity",
      label: "Грузоподъёмность",
      type: "number",
      min: 0,
      unit: "т",
    },

    {
      name: "bodyType",
      label: "Тип кузова",
      type: "select",
      options: [
        "Бортовой",
        "Тент",
        "Фургон",
        "Самосвал",
        "Рефрижератор",
        "Цистерна",
        "Седельный тягач",
      ],
    },

    {
      name: "transmission",
      label: "Коробка передач",
      type: "select",
      options: [
        "Механика",
        "Автомат",
        "Робот",
      ],
    },
  ],
},

  "motorcycles": {
  title: "Мотоцикл",

  fields: [
    {
      name: "brand",
      label: "Марка",
      type: "select",
      required: true,
      options: [],
    },

    {
      name: "model",
      label: "Модель",
      type: "select",
      required: true,
      options: [],
    },
  ],
},

  "auto-parts": {
  title: "Автомобиль",
  fields: [
    {
      name: "vehicleType",
      label: "Тип автомобиля",
      type: "select",
      required: true,
      options: [
        {
          value: "passenger",
          label: "Легковой",
        },
        {
          value: "truck",
          label: "Грузовой",
        },
      ],
    },

    {
      name: "carBrand",
      label: "Марка",
      type: "select",
      required: true,
      options: [],
    },

    {
      name: "carModel",
      label: "Модель",
      type: "select",
      required: true,
      options: [],
    },
  ],
},

  "auto-accessories": {
  title: "Характеристики автоаксессуара",
  fields: [
    {
      name: "accessoryType",
      label: "Тип аксессуара",
      type: "text",
      placeholder: "Например, автобагажник",
      required: true,
    },

    {
      name: "brand",
      label: "Бренд",
      type: "text",
    },

    // Марка автомобиля
    {
      name: "carBrand",
      label: "Марка автомобиля",
      type: "select",
      options: Object.keys(carData),
    },

    // Модель автомобиля
    {
      name: "carModel",
      label: "Модель автомобиля",
      type: "select",
      options: [],
    },

    {
      name: "material",
      label: "Материал",
      type: "text",
    },

    {
      name: "condition",
      label: "Состояние",
      type: "select",
      options: [
        "Новое",
        "Б/у",
      ],
    },
  ],
},

  "tires-wheels": {
    title: "Характеристики шин и дисков",
    fields: [
      {
        name: "type",
        label: "Тип",
        type: "select",
        options: [
          "Шины",
          "Диски",
          "Комплект",
        ],
        required: true,
      },
      {
        name: "diameter",
        label: "Диаметр",
        type: "select",
        options: [
          "R13",
          "R14",
          "R15",
          "R16",
          "R17",
          "R18",
          "R19",
          "R20",
          "R21",
          "R22+",
        ],
      },
      {
        name: "width",
        label: "Ширина",
        type: "text",
        placeholder: "205",
      },
      {
        name: "profile",
        label: "Профиль",
        type: "text",
        placeholder: "55",
      },
      {
        name: "season",
        label: "Сезон",
        type: "select",
        options: [
          "Летние",
          "Зимние",
          "Всесезонные",
        ],
      },
      {
        name: "brand",
        label: "Бренд",
        type: "text",
      },
      {
        name: "boltPattern",
        label: "Разболтовка",
        type: "text",
        placeholder: "5x112",
      },
      {
        name: "condition",
        label: "Состояние",
        type: "select",
        options: [
          "Новые",
          "Б/у",
        ],
      },
    ],
  },

  // =========================================================
  // ЭЛЕКТРОНИКА
  // =========================================================

  phones: {
    title: "Характеристики телефона",
    fields: [
      {
        name: "brand",
        label: "Бренд",
        type: "select",
        placeholder: "Apple",
        required: true,
        options: [],
      },
      {
        name: "model",
        label: "Модель",
        type: "select",
        placeholder: "iPhone 15 Pro",
        required: true,
        options: [],
      },
      {
        name: "storage",
        label: "Память",
        type: "select",
        options: [
          "32 ГБ",
          "64 ГБ",
          "128 ГБ",
          "256 ГБ",
          "512 ГБ",
          "1 ТБ",
        ],
      },
      {
        name: "ram",
        label: "Оперативная память",
        type: "select",
        options: [
          "2 ГБ",
          "3 ГБ",
          "4 ГБ",
          "6 ГБ",
          "8 ГБ",
          "12 ГБ",
          "16 ГБ+",
        ],
      },
      {
        name: "screenSize",
        label: "Диагональ экрана",
        type: "number",
        min: 0,
        unit: "″",
      },
      {
        name: "operatingSystem",
        label: "Операционная система",
        type: "select",
        options: [
          "Android",
          "iOS",
          "HarmonyOS",
          "Другая",
        ],
      },
      {
        name: "sim",
        label: "SIM-карта",
        type: "select",
        options: [
          "1 SIM",
          "2 SIM",
          "eSIM",
          "2 SIM + eSIM",
        ],
      },
      {
        name: "color",
        label: "Цвет",
        type: "text",
      },
    ],
  },

  laptops: {
    title: "Характеристики ноутбука",
    fields: [
      {
        name: "brand",
        label: "Бренд",
        type: "text",
        required: true,
      },
      {
        name: "model",
        label: "Модель",
        type: "text",
        required: true,
      },
      {
        name: "processor",
        label: "Процессор",
        type: "text",
        placeholder: "Intel Core i7",
      },
      {
        name: "ram",
        label: "Оперативная память",
        type: "select",
        options: [
          "4 ГБ",
          "8 ГБ",
          "16 ГБ",
          "32 ГБ",
          "64 ГБ+",
        ],
      },
      {
        name: "storage",
        label: "Накопитель",
        type: "select",
        options: [
          "128 ГБ SSD",
          "256 ГБ SSD",
          "512 ГБ SSD",
          "1 ТБ SSD",
          "2 ТБ+",
          "HDD",
        ],
      },
      {
        name: "graphics",
        label: "Видеокарта",
        type: "text",
        placeholder: "RTX 4060",
      },
      {
        name: "screenSize",
        label: "Диагональ",
        type: "number",
        min: 0,
        unit: "″",
      },
      {
        name: "resolution",
        label: "Разрешение",
        type: "select",
        options: [
          "HD",
          "Full HD",
          "2K",
          "4K",
        ],
      },
      {
        name: "operatingSystem",
        label: "ОС",
        type: "select",
        options: [
          "Windows",
          "macOS",
          "Linux",
          "Без ОС",
        ],
      },
    ],
  },

  computers: {
    title: "Характеристики компьютера",
    fields: [
      {
        name: "brand",
        label: "Производитель",
        type: "text",
      },
      {
        name: "processor",
        label: "Процессор",
        type: "text",
        required: true,
      },
      {
        name: "ram",
        label: "Оперативная память",
        type: "select",
        options: [
          "4 ГБ",
          "8 ГБ",
          "16 ГБ",
          "32 ГБ",
          "64 ГБ+",
        ],
      },
      {
        name: "storage",
        label: "Накопитель",
        type: "text",
        placeholder: "512 ГБ SSD",
      },
      {
        name: "graphics",
        label: "Видеокарта",
        type: "text",
      },
      {
        name: "motherboard",
        label: "Материнская плата",
        type: "text",
      },
      {
        name: "powerSupply",
        label: "Блок питания",
        type: "text",
        placeholder: "650 Вт",
      },
      {
        name: "operatingSystem",
        label: "ОС",
        type: "select",
        options: [
          "Windows",
          "Linux",
          "Без ОС",
        ],
      },
    ],
  },

  tablets: {
    title: "Характеристики планшета",
    fields: [
      {
        name: "brand",
        label: "Бренд",
        type: "text",
        required: true,
      },
      {
        name: "model",
        label: "Модель",
        type: "text",
        required: true,
      },
      {
        name: "storage",
        label: "Память",
        type: "select",
        options: [
          "32 ГБ",
          "64 ГБ",
          "128 ГБ",
          "256 ГБ",
          "512 ГБ",
          "1 ТБ",
        ],
      },
      {
        name: "ram",
        label: "Оперативная память",
        type: "select",
        options: [
          "2 ГБ",
          "3 ГБ",
          "4 ГБ",
          "6 ГБ",
          "8 ГБ",
          "12 ГБ+",
        ],
      },
      {
        name: "screenSize",
        label: "Диагональ",
        type: "number",
        min: 0,
        unit: "″",
      },
      {
        name: "operatingSystem",
        label: "ОС",
        type: "select",
        options: [
          "Android",
          "iPadOS",
          "Windows",
          "Другая",
        ],
      },
      {
        name: "sim",
        label: "SIM",
        type: "select",
        options: [
          "Нет",
          "Есть",
          "eSIM",
        ],
      },
    ],
  },

  tv: {
    title: "Характеристики телевизора",
    fields: [
      {
        name: "brand",
        label: "Бренд",
        type: "text",
        required: true,
      },
      {
        name: "model",
        label: "Модель",
        type: "text",
        required: true,
      },
      {
        name: "screenSize",
        label: "Диагональ",
        type: "number",
        min: 0,
        unit: "″",
      },
      {
        name: "resolution",
        label: "Разрешение",
        type: "select",
        options: [
          "HD",
          "Full HD",
          "4K UHD",
          "8K",
        ],
      },
      {
        name: "displayType",
        label: "Тип экрана",
        type: "select",
        options: [
          "LED",
          "OLED",
          "QLED",
          "Mini LED",
          "LCD",
        ],
      },
      {
        name: "smartTV",
        label: "Smart TV",
        type: "select",
        options: [
          "Да",
          "Нет",
        ],
      },
      {
        name: "operatingSystem",
        label: "ОС",
        type: "text",
      },
    ],
  },

  audio: {
    title: "Характеристики аудиотехники",
    fields: [
      {
        name: "type",
        label: "Тип устройства",
        type: "select",
        options: [
          "Наушники",
          "Колонки",
          "Акустическая система",
          "Усилитель",
          "Ресивер",
          "Музыкальный центр",
          "Другое",
        ],
        required: true,
      },
      {
        name: "brand",
        label: "Бренд",
        type: "text",
      },
      {
        name: "model",
        label: "Модель",
        type: "text",
      },
      {
        name: "connection",
        label: "Подключение",
        type: "select",
        options: [
          "Bluetooth",
          "Wi-Fi",
          "USB",
          "AUX",
          "3.5 мм",
          "Оптическое",
          "Другое",
        ],
      },
      {
        name: "power",
        label: "Мощность",
        type: "number",
        min: 0,
        unit: "Вт",
      },
    ],
  },

  "photo-video": {
    title: "Характеристики фото- и видеотехники",
    fields: [
      {
        name: "type",
        label: "Тип",
        type: "select",
        options: [
          "Фотоаппарат",
          "Видеокамера",
          "Объектив",
          "Экшн-камера",
          "Дрон",
          "Аксессуар",
          "Другое",
        ],
        required: true,
      },
      {
        name: "brand",
        label: "Бренд",
        type: "text",
      },
      {
        name: "model",
        label: "Модель",
        type: "text",
      },
      {
        name: "resolution",
        label: "Разрешение",
        type: "text",
        placeholder: "24 Мп",
      },
      {
        name: "video",
        label: "Видео",
        type: "select",
        options: [
          "Full HD",
          "4K",
          "5K",
          "8K",
        ],
      },
      {
        name: "mount",
        label: "Крепление / байонет",
        type: "text",
      },
    ],
  },

  "game-consoles": {
    title: "Характеристики игровой приставки",
    fields: [
      {
        name: "brand",
        label: "Бренд",
        type: "text",
        required: true,
      },
      {
        name: "model",
        label: "Модель",
        type: "text",
        required: true,
      },
      {
        name: "storage",
        label: "Память",
        type: "select",
        options: [
          "256 ГБ",
          "512 ГБ",
          "1 ТБ",
          "2 ТБ",
        ],
      },
      {
        name: "generation",
        label: "Поколение",
        type: "text",
      },
      {
        name: "controllers",
        label: "Количество контроллеров",
        type: "number",
        min: 0,
      },
      {
        name: "condition",
        label: "Состояние",
        type: "select",
        options: [
          "Новое",
          "Б/у",
        ],
      },
    ],
  },

  // =========================================================
  // РАБОТА
  // =========================================================

  vacancies: {
    title: "Характеристики вакансии",
    fields: [
      {
        name: "profession",
        label: "Должность",
        type: "text",
        required: true,
      },
      {
        name: "employment",
        label: "Тип занятости",
        type: "select",
        options: [
          "Полная",
          "Частичная",
          "Временная",
          "Проектная",
        ],
      },
      {
        name: "schedule",
        label: "График",
        type: "select",
        options: [
          "5/2",
          "2/2",
          "Сменный",
          "Гибкий",
          "Свободный",
        ],
      },
      {
        name: "experience",
        label: "Опыт",
        type: "select",
        options: [
          "Без опыта",
          "До 1 года",
          "1–3 года",
          "3–5 лет",
          "5+ лет",
        ],
      },
      {
        name: "salaryFrom",
        label: "Зарплата от",
        type: "number",
        min: 0,
        unit: "BYN",
      },
      {
        name: "salaryTo",
        label: "Зарплата до",
        type: "number",
        min: 0,
        unit: "BYN",
      },
      {
        name: "remote",
        label: "Удалённая работа",
        type: "select",
        options: [
          "Да",
          "Нет",
          "Возможна",
        ],
      },
    ],
  },

  resumes: {
    title: "Характеристики резюме",
    fields: [
      {
        name: "profession",
        label: "Желаемая должность",
        type: "text",
        required: true,
      },
      {
        name: "experience",
        label: "Опыт работы",
        type: "select",
        options: [
          "Без опыта",
          "До 1 года",
          "1–3 года",
          "3–5 лет",
          "5+ лет",
        ],
      },
      {
        name: "employment",
        label: "Занятость",
        type: "select",
        options: [
          "Полная",
          "Частичная",
          "Проектная",
          "Стажировка",
        ],
      },
      {
        name: "schedule",
        label: "График",
        type: "select",
        options: [
          "5/2",
          "2/2",
          "Сменный",
          "Гибкий",
          "Свободный",
        ],
      },
      {
        name: "salary",
        label: "Желаемая зарплата",
        type: "number",
        min: 0,
        unit: "BYN",
      },
      {
        name: "remote",
        label: "Удалённая работа",
        type: "select",
        options: [
          "Да",
          "Нет",
          "Возможна",
        ],
      },
    ],
  },

  "part-time": {
    title: "Характеристики подработки",
    fields: [
      {
        name: "profession",
        label: "Вид работы",
        type: "text",
        required: true,
      },
      {
        name: "schedule",
        label: "График",
        type: "select",
        options: [
          "Свободный",
          "По вечерам",
          "По выходным",
          "Посменно",
        ],
      },
      {
        name: "paymentType",
        label: "Оплата",
        type: "select",
        options: [
          "Почасовая",
          "За смену",
          "За выполнение",
          "Ежедневная",
          "Еженедельная",
        ],
      },
      {
        name: "payment",
        label: "Оплата",
        type: "number",
        min: 0,
        unit: "BYN",
      },
      {
        name: "experience",
        label: "Опыт",
        type: "select",
        options: [
          "Не требуется",
          "Желателен",
          "Обязателен",
        ],
      },
    ],
  },

  "remote-work": {
    title: "Характеристики удалённой работы",
    fields: [
      {
        name: "profession",
        label: "Должность",
        type: "text",
        required: true,
      },
      {
        name: "employment",
        label: "Занятость",
        type: "select",
        options: [
          "Полная",
          "Частичная",
          "Проектная",
          "Фриланс",
        ],
      },
      {
        name: "experience",
        label: "Опыт",
        type: "select",
        options: [
          "Без опыта",
          "До 1 года",
          "1–3 года",
          "3–5 лет",
          "5+ лет",
        ],
      },
      {
        name: "salary",
        label: "Зарплата",
        type: "number",
        min: 0,
        unit: "BYN",
      },
      {
        name: "paymentCurrency",
        label: "Валюта",
        type: "select",
        options: [
          "BYN",
          "USD",
          "EUR",
        ],
      },
    ],
  },

  // =========================================================
  // ОДЕЖДА
  // =========================================================

  "women-clothes": {
    title: "Характеристики женской одежды",
    fields: [
      {
        name: "type",
        label: "Тип одежды",
        type: "text",
        placeholder: "Платье, куртка, брюки...",
        required: true,
      },
      {
        name: "brand",
        label: "Бренд",
        type: "text",
      },
      {
        name: "size",
        label: "Размер",
        type: "select",
        options: [
          "XXS",
          "XS",
          "S",
          "M",
          "L",
          "XL",
          "XXL",
          "XXXL",
        ],
      },
      {
        name: "color",
        label: "Цвет",
        type: "text",
      },
      {
        name: "material",
        label: "Материал",
        type: "text",
      },
      {
        name: "season",
        label: "Сезон",
        type: "select",
        options: [
          "Лето",
          "Весна",
          "Осень",
          "Зима",
          "Демисезон",
        ],
      },
    ],
  },

  "men-clothes": {
    title: "Характеристики мужской одежды",
    fields: [
      {
        name: "type",
        label: "Тип одежды",
        type: "text",
        placeholder: "Куртка, брюки, рубашка...",
        required: true,
      },
      {
        name: "brand",
        label: "Бренд",
        type: "text",
      },
      {
        name: "size",
        label: "Размер",
        type: "select",
        options: [
          "XS",
          "S",
          "M",
          "L",
          "XL",
          "XXL",
          "XXXL",
        ],
      },
      {
        name: "color",
        label: "Цвет",
        type: "text",
      },
      {
        name: "material",
        label: "Материал",
        type: "text",
      },
      {
        name: "season",
        label: "Сезон",
        type: "select",
        options: [
          "Лето",
          "Весна",
          "Осень",
          "Зима",
          "Демисезон",
        ],
      },
    ],
  },

  "children-clothes": {
    title: "Характеристики детской одежды",
    fields: [
      {
        name: "type",
        label: "Тип одежды",
        type: "text",
        required: true,
      },
      {
        name: "brand",
        label: "Бренд",
        type: "text",
      },
      {
        name: "size",
        label: "Размер",
        type: "text",
        placeholder: "110",
      },
      {
        name: "age",
        label: "Возраст",
        type: "select",
        options: [
          "0–1 год",
          "1–3 года",
          "3–5 лет",
          "6–9 лет",
          "10–13 лет",
          "14+ лет",
        ],
      },
      {
        name: "gender",
        label: "Пол",
        type: "select",
        options: [
          "Для девочки",
          "Для мальчика",
          "Унисекс",
        ],
      },
      {
        name: "color",
        label: "Цвет",
        type: "text",
      },
    ],
  },

  shoes: {
    title: "Характеристики обуви",
    fields: [
      {
        name: "type",
        label: "Тип обуви",
        type: "text",
        placeholder: "Кроссовки, ботинки...",
        required: true,
      },
      {
        name: "brand",
        label: "Бренд",
        type: "text",
      },
      {
        name: "size",
        label: "Размер",
        type: "select",
        options: [
          "35",
          "36",
          "37",
          "38",
          "39",
          "40",
          "41",
          "42",
          "43",
          "44",
          "45",
          "46",
          "47",
        ],
      },
      {
        name: "material",
        label: "Материал",
        type: "text",
      },
      {
        name: "season",
        label: "Сезон",
        type: "select",
        options: [
          "Лето",
          "Демисезон",
          "Зима",
        ],
      },
      {
        name: "color",
        label: "Цвет",
        type: "text",
      },
    ],
  },

  "clothing-accessories": {
    title: "Характеристики аксессуара",
    fields: [
      {
        name: "type",
        label: "Тип аксессуара",
        type: "text",
        placeholder: "Сумка, ремень, часы...",
        required: true,
      },
      {
        name: "brand",
        label: "Бренд",
        type: "text",
      },
      {
        name: "material",
        label: "Материал",
        type: "text",
      },
      {
        name: "color",
        label: "Цвет",
        type: "text",
      },
      {
        name: "gender",
        label: "Для кого",
        type: "select",
        options: [
          "Женский",
          "Мужской",
          "Унисекс",
          "Детский",
        ],
      },
    ],
  },

  // =========================================================
  // УСЛУГИ
  // =========================================================

  "repair-construction": {
    title: "Характеристики услуги",
    fields: [
      {
        name: "serviceType",
        label: "Вид услуги",
        type: "text",
        placeholder: "Ремонт квартиры",
        required: true,
      },
      {
        name: "specialization",
        label: "Специализация",
        type: "select",
        options: [
          "Отделочные работы",
          "Электрика",
          "Сантехника",
          "Плиточные работы",
          "Малярные работы",
          "Строительство",
          "Другое",
        ],
      },
      {
        name: "experience",
        label: "Опыт",
        type: "select",
        options: [
          "До 1 года",
          "1–3 года",
          "3–5 лет",
          "5–10 лет",
          "10+ лет",
        ],
      },
      {
        name: "priceType",
        label: "Стоимость",
        type: "select",
        options: [
          "За час",
          "За м²",
          "За работу",
          "Договорная",
        ],
      },
    ],
  },

  "beauty-health": {
    title: "Характеристики услуги",
    fields: [
      {
        name: "serviceType",
        label: "Вид услуги",
        type: "text",
        placeholder: "Маникюр, массаж...",
        required: true,
      },
      {
        name: "specialization",
        label: "Специализация",
        type: "select",
        options: [
          "Парикмахер",
          "Маникюр / педикюр",
          "Массаж",
          "Косметология",
          "Визаж",
          "Брови / ресницы",
          "Другое",
        ],
      },
      {
        name: "experience",
        label: "Опыт",
        type: "select",
        options: [
          "До 1 года",
          "1–3 года",
          "3–5 лет",
          "5+ лет",
        ],
      },
      {
        name: "location",
        label: "Место оказания",
        type: "select",
        options: [
          "У специалиста",
          "У клиента",
          "Салон",
          "Онлайн",
        ],
      },
    ],
  },

  "transport-services": {
    title: "Характеристики транспортной услуги",
    fields: [
      {
        name: "serviceType",
        label: "Вид услуги",
        type: "select",
        options: [
          "Грузоперевозки",
          "Пассажирские перевозки",
          "Такси",
          "Эвакуатор",
          "Переезд",
          "Другое",
        ],
        required: true,
      },
      {
        name: "vehicleType",
        label: "Тип транспорта",
        type: "select",
        options: [
          "Легковой автомобиль",
          "Микроавтобус",
          "Грузовик",
          "Прицеп",
          "Спецтехника",
        ],
      },
      {
        name: "loadCapacity",
        label: "Грузоподъёмность",
        type: "number",
        min: 0,
        unit: "т",
      },
      {
        name: "driver",
        label: "Водитель",
        type: "select",
        options: [
          "Предоставляется",
          "Не предоставляется",
        ],
      },
    ],
  },

  cleaning: {
    title: "Характеристики услуги уборки",
    fields: [
      {
        name: "cleaningType",
        label: "Вид уборки",
        type: "select",
        options: [
          "Поддерживающая",
          "Генеральная",
          "После ремонта",
          "Мытьё окон",
          "Химчистка",
          "Другое",
        ],
        required: true,
      },
      {
        name: "propertyType",
        label: "Тип объекта",
        type: "select",
        options: [
          "Квартира",
          "Дом",
          "Офис",
          "Магазин",
          "Другое",
        ],
      },
      {
        name: "priceType",
        label: "Расчёт стоимости",
        type: "select",
        options: [
          "За час",
          "За м²",
          "За объект",
          "Договорная",
        ],
      },
    ],
  },

  "education-services": {
    title: "Характеристики образовательной услуги",
    fields: [
      {
        name: "subject",
        label: "Предмет / направление",
        type: "text",
        placeholder: "Математика",
        required: true,
      },
      {
        name: "format",
        label: "Формат",
        type: "select",
        options: [
          "Онлайн",
          "Очно",
          "Онлайн и очно",
        ],
      },
      {
        name: "level",
        label: "Уровень",
        type: "select",
        options: [
          "Начальный",
          "Средний",
          "Продвинутый",
          "Подготовка к экзаменам",
        ],
      },
      {
        name: "experience",
        label: "Опыт преподавания",
        type: "select",
        options: [
          "До 1 года",
          "1–3 года",
          "3–5 лет",
          "5+ лет",
        ],
      },
      {
        name: "priceType",
        label: "Стоимость",
        type: "select",
        options: [
          "За час",
          "За занятие",
          "За курс",
        ],
      },
    ],
  },

  "photo-video-services": {
    title: "Характеристики фото- и видеосъёмки",
    fields: [
      {
        name: "serviceType",
        label: "Вид съёмки",
        type: "select",
        options: [
          "Фотосессия",
          "Свадебная съёмка",
          "Предметная съёмка",
          "Видео",
          "Репортаж",
          "Контент для бизнеса",
          "Другое",
        ],
        required: true,
      },
      {
        name: "format",
        label: "Формат",
        type: "select",
        options: [
          "В помещении",
          "На улице",
          "Студия",
          "Выезд",
        ],
      },
      {
        name: "experience",
        label: "Опыт",
        type: "select",
        options: [
          "До 1 года",
          "1–3 года",
          "3–5 лет",
          "5+ лет",
        ],
      },
      {
        name: "equipment",
        label: "Оборудование",
        type: "text",
      },
    ],
  },

  // =========================================================
  // ЖИВОТНЫЕ
  // =========================================================

  dogs: {
    title: "Характеристики собаки",
    fields: [
      {
        name: "breed",
        label: "Порода",
        type: "text",
        placeholder: "Например, немецкая овчарка",
        required: true,
      },
      {
        name: "age",
        label: "Возраст",
        type: "number",
        min: 0,
        unit: "лет",
      },
      {
        name: "gender",
        label: "Пол",
        type: "select",
        options: [
          "Самец",
          "Самка",
        ],
      },
      {
        name: "color",
        label: "Окрас",
        type: "text",
      },
      {
        name: "vaccinated",
        label: "Прививки",
        type: "select",
        options: [
          "Да",
          "Нет",
          "Частично",
        ],
      },
      {
        name: "pedigree",
        label: "Родословная",
        type: "select",
        options: [
          "Есть",
          "Нет",
        ],
      },
    ],
  },

  cats: {
    title: "Характеристики кошки",
    fields: [
      {
        name: "breed",
        label: "Порода",
        type: "text",
        placeholder: "Британская",
        required: true,
      },
      {
        name: "age",
        label: "Возраст",
        type: "number",
        min: 0,
        unit: "лет",
      },
      {
        name: "gender",
        label: "Пол",
        type: "select",
        options: [
          "Кот",
          "Кошка",
        ],
      },
      {
        name: "color",
        label: "Окрас",
        type: "text",
      },
      {
        name: "vaccinated",
        label: "Прививки",
        type: "select",
        options: [
          "Да",
          "Нет",
          "Частично",
        ],
      },
      {
        name: "pedigree",
        label: "Родословная",
        type: "select",
        options: [
          "Есть",
          "Нет",
        ],
      },
    ],
  },

  birds: {
    title: "Характеристики птицы",
    fields: [
      {
        name: "species",
        label: "Вид",
        type: "text",
        placeholder: "Попугай",
        required: true,
      },
      {
        name: "breed",
        label: "Порода",
        type: "text",
      },
      {
        name: "age",
        label: "Возраст",
        type: "number",
        min: 0,
        unit: "лет",
      },
      {
        name: "gender",
        label: "Пол",
        type: "select",
        options: [
          "Самец",
          "Самка",
          "Неизвестно",
        ],
      },
      {
        name: "color",
        label: "Окрас",
        type: "text",
      },
    ],
  },

  rodents: {
    title: "Характеристики грызуна",
    fields: [
      {
        name: "species",
        label: "Вид",
        type: "text",
        placeholder: "Хомяк",
        required: true,
      },
      {
        name: "breed",
        label: "Порода",
        type: "text",
      },
      {
        name: "age",
        label: "Возраст",
        type: "number",
        min: 0,
        unit: "месяцев",
      },
      {
        name: "gender",
        label: "Пол",
        type: "select",
        options: [
          "Самец",
          "Самка",
        ],
      },
      {
        name: "color",
        label: "Окрас",
        type: "text",
      },
    ],
  },

  aquarium: {
    title: "Характеристики аквариумного животного",
    fields: [
      {
        name: "species",
        label: "Вид",
        type: "text",
        placeholder: "Золотая рыбка",
        required: true,
      },
      {
        name: "quantity",
        label: "Количество",
        type: "number",
        min: 1,
      },
      {
        name: "age",
        label: "Возраст",
        type: "number",
        min: 0,
        unit: "лет",
      },
      {
        name: "size",
        label: "Размер",
        type: "number",
        min: 0,
        unit: "см",
      },
      {
        name: "waterType",
        label: "Тип воды",
        type: "select",
        options: [
          "Пресная",
          "Морская",
        ],
      },
    ],
  },

  // =========================================================
  // ДОМ И САД
  // =========================================================

  furniture: {
    title: "Характеристики мебели",
    fields: [
      {
        name: "type",
        label: "Тип мебели",
        type: "text",
        placeholder: "Диван, шкаф, стол...",
        required: true,
      },
      {
        name: "brand",
        label: "Бренд",
        type: "text",
      },
      {
        name: "material",
        label: "Материал",
        type: "text",
      },
      {
        name: "color",
        label: "Цвет",
        type: "text",
      },
      {
        name: "width",
        label: "Ширина",
        type: "number",
        min: 0,
        unit: "см",
      },
      {
        name: "height",
        label: "Высота",
        type: "number",
        min: 0,
        unit: "см",
      },
      {
        name: "depth",
        label: "Глубина",
        type: "number",
        min: 0,
        unit: "см",
      },
    ],
  },

  "home-appliances": {
    title: "Характеристики бытовой техники",
    fields: [
      {
        name: "type",
        label: "Тип техники",
        type: "text",
        placeholder: "Холодильник, стиральная машина...",
        required: true,
      },
      {
        name: "brand",
        label: "Бренд",
        type: "text",
      },
      {
        name: "model",
        label: "Модель",
        type: "text",
      },
      {
        name: "energyClass",
        label: "Класс энергопотребления",
        type: "select",
        options: [
          "A+++",
          "A++",
          "A+",
          "A",
          "B",
          "C",
          "D",
        ],
      },
      {
        name: "capacity",
        label: "Объём / вместимость",
        type: "number",
        min: 0,
      },
      {
        name: "color",
        label: "Цвет",
        type: "text",
      },
    ],
  },

  dishes: {
    title: "Характеристики посуды",
    fields: [
      {
        name: "type",
        label: "Тип",
        type: "text",
        placeholder: "Набор посуды, кастрюля...",
        required: true,
      },
      {
        name: "material",
        label: "Материал",
        type: "select",
        options: [
          "Стекло",
          "Керамика",
          "Фарфор",
          "Нержавеющая сталь",
          "Алюминий",
          "Чугун",
          "Пластик",
          "Другое",
        ],
      },
      {
        name: "quantity",
        label: "Количество предметов",
        type: "number",
        min: 1,
      },
      {
        name: "brand",
        label: "Бренд",
        type: "text",
      },
      {
        name: "color",
        label: "Цвет",
        type: "text",
      },
    ],
  },

  tools: {
    title: "Характеристики инструмента",
    fields: [
      {
        name: "type",
        label: "Тип инструмента",
        type: "text",
        placeholder: "Дрель, шуруповёрт...",
        required: true,
      },
      {
        name: "brand",
        label: "Бренд",
        type: "text",
      },
      {
        name: "model",
        label: "Модель",
        type: "text",
      },
      {
        name: "power",
        label: "Мощность",
        type: "number",
        min: 0,
        unit: "Вт",
      },
      {
        name: "voltage",
        label: "Напряжение",
        type: "number",
        min: 0,
        unit: "В",
      },
      {
        name: "battery",
        label: "Питание",
        type: "select",
        options: [
          "Сеть",
          "Аккумулятор",
          "Бензин",
          "Пневматика",
        ],
      },
    ],
  },

  garden: {
    title: "Характеристики товара для сада",
    fields: [
      {
        name: "type",
        label: "Тип товара",
        type: "text",
        placeholder: "Газонокосилка, теплица...",
        required: true,
      },
      {
        name: "brand",
        label: "Бренд",
        type: "text",
      },
      {
        name: "power",
        label: "Мощность",
        type: "number",
        min: 0,
        unit: "Вт",
      },
      {
        name: "area",
        label: "Рабочая площадь",
        type: "number",
        min: 0,
        unit: "м²",
      },
      {
        name: "material",
        label: "Материал",
        type: "text",
      },
      {
        name: "condition",
        label: "Состояние",
        type: "select",
        options: [
          "Новое",
          "Б/у",
        ],
      },
    ],
  },

  decor: {
    title: "Характеристики декора",
    fields: [
      {
        name: "type",
        label: "Тип декора",
        type: "text",
        placeholder: "Картина, ваза, статуэтка...",
        required: true,
      },
      {
        name: "material",
        label: "Материал",
        type: "text",
      },
      {
        name: "brand",
        label: "Бренд",
        type: "text",
      },
      {
        name: "color",
        label: "Цвет",
        type: "text",
      },
      {
        name: "style",
        label: "Стиль",
        type: "select",
        options: [
          "Современный",
          "Классический",
          "Лофт",
          "Скандинавский",
          "Винтаж",
          "Минимализм",
          "Другой",
        ],
      },
      {
        name: "height",
        label: "Высота",
        type: "number",
        min: 0,
        unit: "см",
      },
    ],
  },
};
