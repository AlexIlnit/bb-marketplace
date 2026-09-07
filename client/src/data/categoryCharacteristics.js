export const categoryCharacteristics = {
  auto: {
    title: "Характеристики автомобиля",

    fields: [
      {
        name: "brand",
        label: "Марка",
        type: "text",
        placeholder: "Например, BMW",
        required: true,
      },
      {
        name: "model",
        label: "Модель",
        type: "text",
        placeholder: "Например, 5 Series",
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
        placeholder: "Например, 2.0 л",
      },
      {
        name: "mileage",
        label: "Пробег",
        type: "number",
        placeholder: "150000",
        min: 0,
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

  apartment: {
    title: "Характеристики квартиры",

    fields: [
      {
        name: "rooms",
        label: "Количество комнат",
        type: "select",
        options: [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6+",
        ],
        required: true,
      },
      {
        name: "totalArea",
        label: "Общая площадь",
        type: "number",
        placeholder: "60",
        min: 0,
        required: true,
      },
      {
        name: "livingArea",
        label: "Жилая площадь",
        type: "number",
        placeholder: "40",
        min: 0,
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
    ],
  },

  house: {
    title: "Характеристики дома",

    fields: [
      {
        name: "totalArea",
        label: "Площадь дома",
        type: "number",
        placeholder: "120",
        min: 0,
        required: true,
      },
      {
        name: "landArea",
        label: "Площадь участка",
        type: "number",
        placeholder: "10",
        min: 0,
      },
      {
        name: "rooms",
        label: "Количество комнат",
        type: "number",
        placeholder: "4",
        min: 1,
        required: true,
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
          "Дерево",
          "Каркас",
          "Блок",
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
          "Центральное",
        ],
      },
    ],
  },

  phone: {
    title: "Характеристики телефона",

    fields: [
      {
        name: "brand",
        label: "Бренд",
        type: "text",
        placeholder: "Например, Apple",
        required: true,
      },
      {
        name: "model",
        label: "Модель",
        type: "text",
        placeholder: "Например, iPhone 15 Pro",
        required: true,
      },
      {
        name: "storage",
        label: "Память",
        type: "select",
        options: [
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
          "4 ГБ",
          "6 ГБ",
          "8 ГБ",
          "12 ГБ",
          "16 ГБ",
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
};