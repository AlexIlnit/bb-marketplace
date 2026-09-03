import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Filter,
  MapPin,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import MainLayout from "../../layouts/MainLayout";
import ListingCard from "../../components/listing/ListingCard";
import { useListingStore } from "../../store/listingStore";


const categoryData = {
  avto: {
    title: "Авто",
    shortTitle: "Автомобили и транспорт на BB",
    description:
      "Автомобили, мотоциклы, запчасти и аксессуары. Найдите транспорт рядом с вами.",
    seoText:
      "На BB вы можете купить или продать автомобиль, мотоцикл, грузовой транспорт, запчасти и автомобильные аксессуары. Сравнивайте предложения продавцов, выбирайте подходящую цену и связывайтесь с владельцами напрямую через удобный чат.",
    seoTitle: "Авто — купить и продать автомобиль на BB",
    seoDescription:
    "Купить или продать автомобиль, мотоцикл, запчасти и аксессуары. Объявления о продаже авто на BB.",


      icon: "🚗",
    gradient: "from-blue-600 via-indigo-600 to-violet-600",

    subcategories: [
      "Легковые автомобили",
      "Мотоциклы",
      "Грузовики",
      "Запчасти",
      "Аксессуары",
    ],

    tips: [
      "Проверяйте документы и историю автомобиля перед покупкой.",
      "Осматривайте транспорт лично перед передачей денег.",
      "Сверяйте VIN и техническое состояние автомобиля.",
      "Не отправляйте предоплату непроверенному продавцу.",
    ],

    sellerTips: [
      "Добавьте качественные фотографии автомобиля.",
      "Укажите реальный пробег, состояние и комплектацию.",
      "Подробно опишите характеристики и особенности транспорта.",
      "Отвечайте на сообщения покупателей как можно быстрее.",
    ],

    faq: [
      {
        question: "Как безопасно купить автомобиль?",
        answer:
          "Проверьте документы, VIN, техническое состояние автомобиля и по возможности проведите диагностику перед покупкой.",
      },
      {
        question: "Можно ли связаться с продавцом напрямую?",
        answer:
          "Да. После открытия объявления можно связаться с продавцом через встроенный чат BB.",
      },
      {
        question: "Как разместить объявление об автомобиле?",
        answer:
          "Нажмите «Разместить» или «Создать объявление», заполните характеристики транспорта и добавьте фотографии.",
      },
      {
        question: "Можно ли продавать запчасти?",
        answer:
          "Да. В категории «Авто» можно размещать объявления о запчастях, аксессуарах и других товарах для автомобилей.",
      },
    ],
  },

  nedvizhimost: {
    title: "Недвижимость",
    shortTitle: "Недвижимость на BB",
    description:
      "Квартиры, дома, комнаты, участки и коммерческая недвижимость.",
    seoText:
      "В разделе недвижимости BB собраны объявления о продаже и аренде квартир, домов, комнат, земельных участков и коммерческих объектов. Выбирайте подходящий вариант по цене и расположению, изучайте фотографии и связывайтесь с собственниками или представителями напрямую.",
    seoTitle: "Недвижимость — купить и продать на BB",
    seoDescription:
    "Квартиры, дома, комнаты, участки и коммерческая недвижимость. Объявления о продаже и аренде на BB.",


      icon: "🏠",
    gradient: "from-emerald-600 via-teal-600 to-cyan-600",

    subcategories: [
      "Квартиры",
      "Дома",
      "Комнаты",
      "Участки",
      "Коммерческая недвижимость",
    ],

    tips: [
      "Проверяйте документы на недвижимость перед сделкой.",
      "Сверяйте информацию об объекте с документами собственника.",
      "Осматривайте помещение лично перед подписанием договора.",
      "Не переводите крупную предоплату без проверки продавца.",
    ],

    sellerTips: [
      "Добавьте фотографии всех основных помещений.",
      "Укажите точную площадь, расположение и состояние объекта.",
      "Опишите преимущества района и инфраструктуры.",
      "Указывайте актуальную стоимость и условия сделки.",
    ],

    faq: [
      {
        question: "Какие объекты можно найти в разделе?",
        answer:
          "На BB можно размещать объявления о квартирах, домах, комнатах, земельных участках и коммерческой недвижимости.",
      },
      {
        question: "Можно ли разместить объявление об аренде?",
        answer:
          "Да. В разделе недвижимости можно публиковать предложения, связанные с продажей и арендой объектов.",
      },
      {
        question: "Как связаться с владельцем недвижимости?",
        answer:
          "Откройте интересующее объявление и используйте встроенный чат для связи с продавцом.",
      },
      {
        question: "На что обратить внимание при покупке недвижимости?",
        answer:
          "Проверьте документы, право собственности, состояние объекта и соответствие информации в объявлении действительности.",
      },
    ],
  },

  elektronika: {
    title: "Электроника",
    shortTitle: "Электроника и техника на BB",
    description:
      "Смартфоны, компьютеры, бытовая техника, гаджеты и электроника.",
    seoText:
      "На BB можно найти смартфоны, ноутбуки, компьютеры, телевизоры, бытовую технику и различные гаджеты. Сравнивайте цены, состояние устройств и комплектацию, а затем напрямую связывайтесь с продавцами.",
       seoTitle: "Электроника — купить и продать на BB",
    seoDescription:
    "Телефоны, ноутбуки, компьютеры, телевизоры и бытовая техника. Купить и продать электронику на BB.",


    
      icon: "📱",
    gradient: "from-violet-600 via-purple-600 to-fuchsia-600",

    subcategories: [
      "Телефоны",
      "Ноутбуки",
      "Компьютеры",
      "Телевизоры",
      "Бытовая техника",
    ],

    tips: [
      "Проверяйте устройство перед покупкой.",
      "Уточняйте состояние аккумулятора и основных компонентов.",
      "Проверяйте серийный номер и комплектацию.",
      "Не переводите деньги до проверки товара.",
    ],

    sellerTips: [
      "Добавьте фотографии устройства со всех сторон.",
      "Укажите модель, характеристики и состояние.",
      "Честно опишите царапины, дефекты и другие недостатки.",
      "Укажите комплектацию и наличие документов или гарантии.",
    ],

    faq: [
      {
        question: "Можно ли продавать б/у электронику?",
        answer:
          "Да. На BB можно размещать объявления как о новых, так и о бывших в употреблении устройствах.",
      },
      {
        question: "Как проверить телефон перед покупкой?",
        answer:
          "Проверьте экран, камеры, динамики, разъёмы, аккумулятор, связь и состояние корпуса. Также убедитесь, что устройство не заблокировано.",
      },
      {
        question: "Что указать в объявлении о ноутбуке?",
        answer:
          "Желательно указать процессор, объём оперативной памяти, накопитель, видеокарту, диагональ экрана и состояние устройства.",
      },
      {
        question: "Можно ли договориться о цене?",
        answer:
          "Условия сделки определяются продавцом и покупателем. Вы можете обсудить цену напрямую через чат.",
      },
    ],
  },

  rabota: {
    title: "Работа",
    shortTitle: "Вакансии и работа на BB",
    description:
      "Вакансии и предложения работы от компаний и частных работодателей.",
    seoText:
      "В разделе «Работа» на BB можно найти вакансии, подработку, удалённую работу и предложения для начинающих специалистов. Работодатели могут размещать актуальные вакансии и напрямую общаться с заинтересованными кандидатами.",
      seoTitle: "Работа и вакансии — найти работу на BB",
    seoDescription:
    "Вакансии, подработка, удалённая работа и предложения для специалистов. Найдите работу или сотрудника на BB.",


    
      icon: "💼",
    gradient: "from-amber-500 via-orange-600 to-red-500",

    subcategories: [
      "Вакансии",
      "Подработка",
      "Удалённая работа",
      "Для студентов",
      "Без опыта",
    ],

    tips: [
      "Изучайте описание вакансии и требования работодателя.",
      "Уточняйте условия оплаты до начала работы.",
      "Не передавайте работодателю лишние персональные данные.",
      "Осторожно относитесь к предложениям с обязательной предоплатой.",
    ],

    sellerTips: [
      "Подробно опишите обязанности будущего сотрудника.",
      "Укажите график работы и формат занятости.",
      "Обязательно укажите условия и порядок оплаты.",
      "Отвечайте кандидатам и своевременно обновляйте вакансию.",
    ],

    faq: [
      {
        question: "Можно ли найти работу без опыта?",
        answer:
          "Да. На BB можно размещать и искать предложения для начинающих специалистов и людей без опыта.",
      },
      {
        question: "Есть ли предложения удалённой работы?",
        answer:
          "Да. Для удалённых вакансий предусмотрен отдельный раздел.",
      },
      {
        question: "Как связаться с работодателем?",
        answer:
          "Связаться с автором объявления можно через встроенный чат BB.",
      },
      {
        question: "Нужно ли платить за трудоустройство?",
        answer:
          "Будьте осторожны с предложениями, где требуют оплату за получение работы. Условия сотрудничества всегда следует проверять заранее.",
      },
    ],
  },

  zhivotnye: {
    title: "Животные",
    shortTitle: "Животные и товары для питомцев на BB",
    description:
      "Домашние животные, питомцы, товары и услуги для животных.",
    seoText:
      "На BB можно найти домашних животных, питомцев, товары и услуги для ухода за ними. В разделе представлены объявления о собаках, кошках, птицах, грызунах и различных товарах для домашних животных.",
      seoTitle: "Животные — купить и найти питомца на BB",
  seoDescription:
    "Собаки, кошки, птицы, грызуны и товары для животных. Объявления о животных и питомцах на BB.",


    
      icon: "🐾",
    gradient: "from-pink-500 via-rose-600 to-red-500",

    subcategories: [
      "Собаки",
      "Кошки",
      "Птицы",
      "Грызуны",
      "Товары для животных",
    ],

    tips: [
      "Уточняйте состояние здоровья животного и необходимые документы.",
      "По возможности знакомьтесь с животным лично.",
      "Не приобретайте животное без выяснения условий его содержания.",
      "Проверяйте информацию о продавце или владельце.",
    ],

    sellerTips: [
      "Добавьте актуальные фотографии животного.",
      "Укажите возраст, породу и особенности характера.",
      "Расскажите о состоянии здоровья и прививках.",
      "Честно указывайте условия передачи животного.",
    ],

    faq: [
      {
        question: "Каких животных можно размещать?",
        answer:
          "В разделе можно размещать объявления о домашних животных, питомцах и товарах для животных.",
      },
      {
        question: "Можно ли размещать объявления о товарах для животных?",
        answer:
          "Да. Для этого предусмотрен отдельный подраздел «Товары для животных».",
      },
      {
        question: "Что нужно узнать перед покупкой животного?",
        answer:
          "Уточните возраст, состояние здоровья, особенности содержания, происхождение и необходимые документы.",
      },
      {
        question: "Можно ли связаться с владельцем напрямую?",
        answer:
          "Да. Связаться с автором объявления можно через чат BB.",
      },
    ],
  },

  odezhda: {
    title: "Одежда",
    shortTitle: "Одежда, обувь и аксессуары на BB",
    description:
      "Одежда, обувь, аксессуары и стильные вещи для всей семьи.",
    seoText:
      "На BB можно купить и продать женскую, мужскую и детскую одежду, обувь и аксессуары. Выбирайте вещи по категории и состоянию, сравнивайте предложения и связывайтесь с продавцами напрямую.",
      seoTitle: "Одежда и обувь — купить и продать на BB",
  seoDescription:
    "Женская, мужская и детская одежда, обувь и аксессуары. Купить и продать вещи на BB.",


    icon: "👕",
    gradient: "from-rose-500 via-pink-600 to-fuchsia-600",

    subcategories: [
      "Женская одежда",
      "Мужская одежда",
      "Детская одежда",
      "Обувь",
      "Аксессуары",
    ],

    tips: [
      "Уточняйте точный размер перед покупкой.",
      "Попросите дополнительные фотографии при необходимости.",
      "Проверяйте состояние вещи и наличие дефектов.",
      "Договаривайтесь о способе передачи товара заранее.",
    ],

    sellerTips: [
      "Добавляйте фотографии вещи при хорошем освещении.",
      "Указывайте размер, материал и состояние.",
      "Честно описывайте любые дефекты.",
      "Указывайте актуальную цену и условия передачи.",
    ],

    faq: [
      {
        question: "Можно ли продавать б/у одежду?",
        answer:
          "Да. На BB можно размещать объявления о новых и бывших в употреблении вещах.",
      },
      {
        question: "Что обязательно указать в объявлении?",
        answer:
          "Рекомендуется указать размер, состояние, бренд или производителя, материал и основные особенности вещи.",
      },
      {
        question: "Можно ли попросить дополнительные фотографии?",
        answer:
          "Да. Вы можете связаться с продавцом через чат и попросить дополнительные фотографии или информацию.",
      },
      {
        question: "Можно ли договориться о цене?",
        answer:
          "Да. Цена и условия сделки обсуждаются между покупателем и продавцом напрямую.",
      },
    ],
  },

  "dom-i-sad": {
    title: "Дом и сад",
    shortTitle: "Товары для дома, ремонта и сада на BB",
    description:
      "Мебель, инструменты, товары для дома, ремонта, дачи и сада.",
    seoText:
      "В категории «Дом и сад» на BB собраны мебель, инструменты, товары для ремонта, дачи, сада и повседневного использования. Здесь можно найти нужные вещи для дома или продать то, чем вы больше не пользуетесь.",
      seoTitle: "Дом и сад — мебель, инструменты и товары на BB",
  seoDescription:
    "Мебель, инструменты, товары для дома, ремонта, дачи и сада. Купить и продать товары на BB.",


    icon: "🛋️",
    gradient: "from-orange-500 via-amber-600 to-yellow-500",

    subcategories: [
      "Мебель",
      "Инструменты",
      "Ремонт",
      "Сад и огород",
      "Товары для дома",
    ],

    tips: [
      "Проверяйте состояние мебели и техники перед покупкой.",
      "Уточняйте размеры товара заранее.",
      "Для инструментов проверяйте работоспособность.",
      "Согласуйте способ доставки или самовывоза.",
    ],

    sellerTips: [
      "Указывайте точные размеры и характеристики товара.",
      "Добавляйте фотографии со всех важных сторон.",
      "Опишите состояние и возможные недостатки.",
      "Указывайте способ передачи или доставки.",
    ],

    faq: [
      {
        question: "Какие товары можно найти в разделе?",
        answer:
          "В разделе представлены мебель, инструменты, товары для ремонта, сада, огорода и дома.",
      },
      {
        question: "Можно ли продавать мебель?",
        answer:
          "Да. На BB можно размещать объявления о продаже мебели различных видов.",
      },
      {
        question: "Можно ли договориться о доставке?",
        answer:
          "Условия доставки или самовывоза можно обсудить непосредственно с продавцом через чат.",
      },
      {
        question: "Как правильно описать состояние товара?",
        answer:
          "Укажите возраст товара, степень использования, наличие дефектов и его текущее состояние.",
      },
    ],
  },

  uslugi: {
    title: "Услуги",
    shortTitle: "Услуги специалистов на BB",
    description:
      "Найдите специалистов для ремонта, перевозок, обучения и других задач.",
    seoText:
      "На BB можно найти специалистов и исполнителей для ремонта, перевозок, красоты, обучения, IT и других задач. Выбирайте подходящего исполнителя, изучайте описание услуги и связывайтесь напрямую для обсуждения стоимости и условий работы.",
      seoTitle: "Услуги — найти специалиста на BB",
  seoDescription:
    "Ремонт, перевозки, красота, обучение, IT и другие услуги. Найдите специалиста или разместите своё предложение на BB.",


    icon: "🔧",
    gradient: "from-cyan-600 via-blue-600 to-indigo-600",

    subcategories: [
      "Ремонт",
      "Перевозки",
      "Красота",
      "Обучение",
      "IT-услуги",
    ],

    tips: [
      "Уточняйте стоимость и сроки выполнения работы заранее.",
      "Обсуждайте все важные условия до начала работы.",
      "Проверяйте опыт специалиста и примеры выполненных работ.",
      "Не переводите крупную предоплату без понимания условий.",
    ],

    sellerTips: [
      "Подробно опишите перечень предоставляемых услуг.",
      "Укажите ориентировочную стоимость или способ расчёта.",
      "Добавьте фотографии примеров выполненных работ.",
      "Укажите город и доступный формат работы.",
    ],

    faq: [
      {
        question: "Какие услуги можно найти на BB?",
        answer:
          "На BB можно найти специалистов по ремонту, перевозкам, красоте, обучению, IT и другим направлениям.",
      },
      {
        question: "Можно ли разместить собственную услугу?",
        answer:
          "Да. Создайте объявление и подробно опишите услугу, стоимость и условия работы.",
      },
      {
        question: "Как узнать стоимость услуги?",
        answer:
          "Стоимость можно посмотреть в объявлении или уточнить у исполнителя через встроенный чат.",
      },
      {
        question: "Можно ли обсудить условия напрямую?",
        answer:
          "Да. Покупатель услуги и исполнитель могут напрямую обсудить детали, сроки и стоимость работы.",
      },
    ],
  },
};

export default function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [sort, setSort] = useState("new");
  const [categorySearch, setCategorySearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const {
    listings,
    fetchListings,
    totalPages,
    setCategory,
  } = useListingStore();

  const currentCategory = categoryData[slug] || null;

  /*
   * Загружаем объявления при смене категории.
   *
   * Важно:
   * не используем currentCategory в dependencies,
   * потому что объект категории может создаваться заново.
   */
  useEffect(() => {
    if (!currentCategory) return;

    setCategory(slug);
    fetchListings(1);
  }, [slug]);

  /*
   * Фильтрация и сортировка объявлений
   */
  const filteredListings = useMemo(() => {
    let result = [...listings];

    if (categorySearch.trim()) {
      const query = categorySearch.trim().toLowerCase();

      result = result.filter((listing) =>
        listing.title?.toLowerCase().includes(query)
      );
    }

    if (sort === "priceAsc") {
      result.sort(
        (a, b) => Number(a.price || 0) - Number(b.price || 0)
      );
    }

    if (sort === "priceDesc") {
      result.sort(
        (a, b) => Number(b.price || 0) - Number(a.price || 0)
      );
    }

    return result;
  }, [listings, categorySearch, sort]);

  /*
   * ==========================================
   * КАТЕГОРИЯ НЕ НАЙДЕНА
   * ==========================================
   */

  if (!currentCategory) {
    const canonicalUrl = `https://bb.by/category/${slug}`;

    return (
      <>
        <Helmet>
          <title>Категория не найдена — BB</title>

          <meta
            name="description"
            content="Запрашиваемая категория не найдена. Перейдите на главную страницу BB и найдите нужные объявления."
          />

          <meta name="robots" content="noindex, follow" />

          <link
            rel="canonical"
            href={canonicalUrl}
          />

          <meta
            property="og:type"
            content="website"
          />

          <meta
            property="og:title"
            content="Категория не найдена — BB"
          />

          <meta
            property="og:description"
            content="Запрашиваемая категория не найдена. Перейдите на главную страницу BB."
          />

          <meta
            property="og:url"
            content={canonicalUrl}
          />

          <meta
            property="og:site_name"
            content="BB доска объявлений"
          />

          <meta
            property="og:locale"
            content="ru_RU"
          />

          <meta
            name="twitter:card"
            content="summary"
          />

          <meta
            name="twitter:title"
            content="Категория не найдена — BB"
          />

          <meta
            name="twitter:description"
            content="Запрашиваемая категория не найдена. Перейдите на главную страницу BB."
          />
        </Helmet>

        <MainLayout>
          <div className="py-20 text-center">
            <div className="text-6xl">
              🔎
            </div>

            <h1 className="mt-5 text-3xl font-bold text-slate-800">
              Категория не найдена
            </h1>

            <p className="mt-2 text-slate-500">
              Возможно, ссылка устарела или такой категории больше нет.
            </p>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-blue-600
                px-5
                py-3
                font-semibold
                text-white
                hover:bg-blue-700
                transition
              "
            >
              <ArrowLeft size={18} />
              Вернуться на главную
            </button>
          </div>
        </MainLayout>
      </>
    );
  }

  /*
   * ==========================================
   * SEO КАТЕГОРИИ
   * ==========================================
   */

  const canonicalUrl = `https://bb.by/category/${slug}`;

  return (
    <>
      <Helmet>
        {/* Основной SEO title */}
        <title>{currentCategory.seoTitle}</title>

        {/* Meta description */}
        <meta
          name="description"
          content={currentCategory.seoDescription}
        />

        {/* Canonical */}
        <link
          rel="canonical"
          href={canonicalUrl}
        />

        {/* Open Graph */}
        <meta
          property="og:type"
          content="website"
        />

        <meta
          property="og:title"
          content={currentCategory.seoTitle}
        />

        <meta
          property="og:description"
          content={currentCategory.seoDescription}
        />

        <meta
          property="og:url"
          content={canonicalUrl}
        />

        <meta
          property="og:site_name"
          content="BB доска объявлений"
        />

        <meta
          property="og:locale"
          content="ru_RU"
        />

        {/* Twitter */}
        <meta
          name="twitter:card"
          content="summary"
        />

        <meta
          name="twitter:title"
          content={currentCategory.seoTitle}
        />

        <meta
          name="twitter:description"
          content={currentCategory.seoDescription}
        />
      </Helmet>

      <MainLayout>

        {/* ==========================================
            ХЛЕБНЫЕ КРОШКИ
        ========================================== */}

        <div className="flex items-center gap-2 mt-4 mb-4 text-sm">

          <button
            type="button"
            onClick={() => navigate("/")}
            className="
              text-slate-500
              hover:text-blue-600
              transition
            "
          >
            Главная
          </button>

          <span className="text-slate-300">
            /
          </span>

          <span className="font-medium text-slate-800">
            {currentCategory.title}
          </span>

        </div>


        {/* ==========================================
            HERO CATEGORY
        ========================================== */}

        <section
          className={`
            relative
            overflow-hidden
            rounded-3xl
            bg-linear-to-br
            ${currentCategory.gradient}
            px-6
            py-8
            md:px-10
            md:py-10
            text-white
          `}
        >

          <div
            className="
              absolute
              -right-20
              -top-24
              w-80
              h-80
              rounded-full
              bg-white/10
              blur-3xl
            "
          />

          <div
            className="
              absolute
              left-20
              bottom-32
              w-72
              h-72
              rounded-full
              bg-white/10
              blur-3xl
            "
          />

          <div
            className="
              relative
              z-10
              flex
              flex-col
              md:flex-row
              items-start
              md:items-center
              justify-between
              gap-8
            "
          >

            <div className="max-w-2xl">

              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-white/15
                  backdrop-blur
                  px-3
                  py-1.5
                  text-sm
                  font-medium
                "
              >
                <span>
                  {currentCategory.icon}
                </span>

                Категория
              </div>

              <h1
                className="
                  mt-4
                  text-3xl
                  md:text-5xl
                  font-extrabold
                  tracking-tight
                "
              >
                {currentCategory.title}
              </h1>

              <p
                className="
                  mt-3
                  max-w-xl
                  text-sm
                  md:text-base
                  leading-6
                  text-white/80
                "
              >
                {currentCategory.description}
              </p>

              <div
                className="
                  mt-5
                  flex
                  flex-wrap
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    rounded-xl
                    bg-white/10
                    backdrop-blur
                    px-4
                    py-2
                    text-sm
                  "
                >
                  📍 Рядом с вами
                </div>

                <div
                  className="
                    rounded-xl
                    bg-white/10
                    backdrop-blur
                    px-4
                    py-2
                    text-sm
                  "
                >
                  🔥 Новые объявления
                </div>

              </div>

            </div>

            <div
              className="
                hidden
                md:flex
                w-36
                h-36
                lg:w-44
                lg:h-44
                shrink-0
                items-center
                justify-center
                rounded-3xl
                bg-white/10
                backdrop-blur
                text-7xl
                lg:text-8xl
              "
            >
              {currentCategory.icon}
            </div>

          </div>

        </section>


        {/* ==========================================
            ПОДКАТЕГОРИИ
        ========================================== */}

        <section className="mt-6">

          <div
            className="
              flex
              items-center
              justify-between
              mb-4
            "
          >

            <div>

              <h2
                className="
                  text-xl
                  md:text-2xl
                  font-bold
                  text-slate-800
                "
              >
                Популярные разделы
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Быстро найдите нужный раздел
              </p>

            </div>

          </div>


          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-3
              lg:grid-cols-5
              gap-3
            "
          >

            {currentCategory.subcategories.map(
              (subcategory, index) => (
                <button
                  key={subcategory}
                  type="button"
                  className="
                    group
                    flex
                    items-center
                    justify-between
                    gap-2
                    rounded-2xl
                    border
                    border-slate-100
                    bg-white
                    px-4
                    py-4
                    text-left
                    shadow-sm
                    hover:-translate-y-1
                    hover:border-blue-200
                    hover:shadow-md
                    transition-all
                  "
                >

                  <div>

                    <div
                      className="
                        text-xs
                        text-slate-400
                        mb-1
                      "
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div
                      className="
                        text-sm
                        font-semibold
                        text-slate-700
                        group-hover:text-blue-600
                        transition
                      "
                    >
                      {subcategory}
                    </div>

                  </div>

                  <ArrowRight
                    size={17}
                    className="
                      shrink-0
                      text-slate-300
                      group-hover:text-blue-500
                      group-hover:translate-x-1
                      transition
                    "
                  />

                </button>
              )
            )}

          </div>

        </section>


        {/* ==========================================
            ПОЛЕЗНАЯ ИНФОРМАЦИЯ
        ========================================== */}

        <section className="mt-8">

          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-2
              gap-5
            "
          >

            {/* Покупателю */}

            <div
              className="
                rounded-3xl
                bg-white
                border
                border-slate-100
                p-6
                shadow-sm
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    w-11
                    h-11
                    rounded-xl
                    bg-blue-50
                    text-blue-600
                    flex
                    items-center
                    justify-center
                    text-xl
                  "
                >
                  🛡️
                </div>

                <div>

                  <h2
                    className="
                      font-bold
                      text-lg
                      text-slate-800
                    "
                  >
                    Советы покупателю
                  </h2>

                  <p
                    className="
                      text-xs
                      text-slate-500
                      mt-0.5
                    "
                  >
                    Как сделать покупку безопаснее
                  </p>

                </div>

              </div>


              <div className="mt-5 space-y-3">

                {currentCategory.tips.map(
                  (tip, index) => (
                    <div
                      key={tip}
                      className="
                        flex
                        items-start
                        gap-3
                        text-sm
                        text-slate-600
                      "
                    >

                      <span
                        className="
                          mt-0.5
                          shrink-0
                          w-6
                          h-6
                          rounded-full
                          bg-blue-50
                          text-blue-600
                          flex
                          items-center
                          justify-center
                          text-xs
                          font-bold
                        "
                      >
                        {index + 1}
                      </span>

                      <span>
                        {tip}
                      </span>

                    </div>
                  )
                )}

              </div>

            </div>


            {/* Продавцу */}

            <div
              className="
                rounded-3xl
                bg-slate-900
                p-6
                text-white
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    w-11
                    h-11
                    rounded-xl
                    bg-white/10
                    flex
                    items-center
                    justify-center
                    text-xl
                  "
                >
                  🚀
                </div>

                <div>

                  <h2 className="font-bold text-lg">
                    Советы продавцу
                  </h2>

                  <p
                    className="
                      text-xs
                      text-slate-400
                      mt-0.5
                    "
                  >
                    Как получить больше откликов
                  </p>

                </div>

              </div>


              <div className="mt-5 space-y-3">

                {currentCategory.sellerTips.map(
                  (tip, index) => (
                    <div
                      key={tip}
                      className="
                        flex
                        items-start
                        gap-3
                        text-sm
                        text-slate-300
                      "
                    >

                      <span
                        className="
                          mt-0.5
                          shrink-0
                          w-6
                          h-6
                          rounded-full
                          bg-white/10
                          flex
                          items-center
                          justify-center
                          text-xs
                          font-bold
                        "
                      >
                        {index + 1}
                      </span>

                      <span>
                        {tip}
                      </span>

                    </div>
                  )
                )}

              </div>

            </div>

          </div>

        </section>


        {/* ==========================================
            ПОИСК В КАТЕГОРИИ
        ========================================== */}

        <section
          className="
            mt-6
            rounded-2xl
            border
            border-slate-100
            bg-white
            p-3
            shadow-sm
          "
        >

          <div
            className="
              flex
              flex-col
              lg:flex-row
              gap-3
            "
          >

            <div className="relative flex-1">

              <Search
                size={20}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                id="category-search"
                name="categorySearch"
                type="search"
                autoComplete="off"
                value={categorySearch}
                onChange={(e) =>
                  setCategorySearch(e.target.value)
                }
                placeholder={`Поиск в категории «${currentCategory.title}»`}
                className="
                  w-full
                  h-12
                  rounded-xl
                  bg-slate-50
                  border
                  border-slate-200
                  pl-11
                  pr-4
                  outline-none
                  focus:bg-white
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-500/10
                "
              />

            </div>


            <button
              type="button"
              onClick={() =>
                setShowFilters(!showFilters)
              }
              className="
                lg:hidden
                h-12
                px-4
                rounded-xl
                border
                border-slate-200
                bg-white
                flex
                items-center
                justify-center
                gap-2
                font-semibold
                text-slate-700
              "
            >
              <SlidersHorizontal size={18} />
              Фильтры
            </button>


            <button
              type="button"
              onClick={() =>
                navigate("/create-listing")
              }
              className="
                h-12
                px-5
                rounded-xl
                bg-blue-600
                text-white
                font-bold
                flex
                items-center
                justify-center
                gap-2
                hover:bg-blue-700
                hover:-translate-y-0.5
                transition
              "
            >
              <Plus size={19} />
              Разместить
            </button>

          </div>

        </section>


        {/* ==========================================
            ОБЪЯВЛЕНИЯ
        ========================================== */}

        <section className="mt-8">

          <div
            className="
              flex
              flex-col
              sm:flex-row
              sm:items-end
              justify-between
              gap-4
              mb-5
            "
          >

            <div>

              <div className="flex items-center gap-2">

                <h2
                  className="
                    text-2xl
                    md:text-3xl
                    font-bold
                    text-slate-800
                  "
                >
                  Объявления
                </h2>

                <span
                  className="
                    rounded-full
                    bg-blue-50
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    text-blue-600
                  "
                >
                  {listings.length}
                </span>

              </div>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Свежие предложения в категории
              </p>

            </div>


            <div className="relative">

              <select
                id="category-sort"
                name="categorySort"
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value)
                }
                className="
                  h-11
                  appearance-none
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  pl-4
                  pr-10
                  text-sm
                  font-medium
                  text-slate-700
                  outline-none
                  focus:border-blue-500
                "
              >

                <option value="new">
                  Сначала новые
                </option>

                <option value="priceAsc">
                  Сначала дешёвые
                </option>

                <option value="priceDesc">
                  Сначала дорогие
                </option>

              </select>

              <ChevronDown
                size={17}
                className="
                  pointer-events-none
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

            </div>

          </div>


          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              gap-5
            "
          >

            {filteredListings.map(
              (listing, index) => (
                <ListingCard
                  key={listing._id}
                  listing={listing}
                  priority={index === 0}
                />
              )
            )}

          </div>


          {filteredListings.length === 0 && (

            <div
              className="
                mt-6
                rounded-3xl
                border
                border-dashed
                border-slate-200
                bg-white
                py-16
                px-6
                text-center
              "
            >

              <div className="text-6xl">
                🔎
              </div>

              <h3
                className="
                  mt-5
                  text-xl
                  font-bold
                  text-slate-800
                "
              >
                Объявлений пока нет
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  text-slate-500
                "
              >
                Попробуйте изменить параметры поиска
                или станьте первым продавцом.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/create-listing")
                }
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-blue-600
                  px-5
                  py-3
                  font-semibold
                  text-white
                  hover:bg-blue-700
                "
              >
                <Plus size={18} />
                Разместить объявление
              </button>

            </div>

          )}

        </section>


        {/* ==========================================
            ПОЧЕМУ BB
        ========================================== */}

        <section className="mt-10">

          <div className="text-center mb-6">

            <span
              className="
                text-sm
                font-semibold
                text-blue-600
              "
            >
              ПОЧЕМУ BB
            </span>

            <h2
              className="
                mt-1
                text-2xl
                md:text-3xl
                font-bold
                text-slate-800
              "
            >
              Покупать и продавать проще
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-slate-500
              "
            >
              Всё необходимое для удобных сделок в одном месте
            </p>

          </div>


          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-4
            "
          >

            {[
              {
                icon: "📍",
                title: "Рядом с вами",
                text: "Находите товары и услуги в своём городе",
              },
              {
                icon: "💬",
                title: "Прямой контакт",
                text: "Общайтесь с продавцами напрямую",
              },
              {
                icon: "🔎",
                title: "Удобный поиск",
                text: "Фильтры помогают быстро найти нужное",
              },
              {
                icon: "⚡",
                title: "Быстрые сделки",
                text: "Договаривайтесь о покупке напрямую",
              },
            ].map((item) => (

              <div
                key={item.title}
                className="
                  rounded-2xl
                  bg-white
                  border
                  border-slate-100
                  p-5
                  text-center
                "
              >

                <div className="text-3xl">
                  {item.icon}
                </div>

                <h3
                  className="
                    mt-3
                    font-bold
                    text-slate-800
                  "
                >
                  {item.title}
                </h3>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-5
                    text-slate-500
                  "
                >
                  {item.text}
                </p>

              </div>

            ))}

          </div>

        </section>


        {/* ==========================================
            CTA
        ========================================== */}

        <section
          className="
            mt-10
            mb-6
            overflow-hidden
            rounded-3xl
            bg-slate-900
            px-6
            py-7
            md:px-8
          "
        >

          <div
            className="
              flex
              flex-col
              md:flex-row
              md:items-center
              justify-between
              gap-5
            "
          >

            <div>

              <div
                className="
                  text-blue-400
                  text-sm
                  font-semibold
                "
              >
                BB доска объявлений
              </div>

              <h2
                className="
                  mt-1
                  text-xl
                  md:text-2xl
                  font-bold
                  text-white
                "
              >
                Не нашли то, что искали?
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-400
                "
              >
                Разместите объявление и найдите покупателя.
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                navigate("/create-listing")
              }
              className="
                shrink-0
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-white
                px-5
                py-3
                font-bold
                text-slate-900
                hover:bg-blue-50
                transition
              "
            >
              <Plus size={18} />
              Создать объявление
            </button>

          </div>

        </section>


        {/* ==========================================
            SEO-КОНТЕНТ
        ========================================== */}

        <section
          className="
            mt-10
            rounded-3xl
            bg-slate-50
            border
            border-slate-100
            p-6
            md:p-8
          "
        >

          <div className="max-w-4xl">

            <h2
              className="
                text-xl
                md:text-2xl
                font-bold
                text-slate-800
              "
            >
              {currentCategory.shortTitle}
            </h2>

            <p
              className="
                mt-4
                text-sm
                leading-7
                text-slate-600
              "
            >
              {currentCategory.seoText}
            </p>

          </div>


          {/* ==========================================
              FAQ
          ========================================== */}

          {currentCategory.faq?.length > 0 && (

            <div className="mt-8">

              <h2
                className="
                  text-xl
                  font-bold
                  text-slate-800
                "
              >
                Частые вопросы
              </h2>


              <div
                className="
                  mt-4
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-3
                "
              >

                {currentCategory.faq.map(
                  (item) => (

                    <details
                      key={item.question}
                      className="
                        group
                        rounded-2xl
                        bg-white
                        border
                        border-slate-100
                        overflow-hidden
                      "
                    >

                      <summary
                        className="
                          cursor-pointer
                          list-none
                          p-5
                          font-semibold
                          text-sm
                          text-slate-800
                          flex
                          items-center
                          justify-between
                          gap-4
                        "
                      >

                        <span>
                          {item.question}
                        </span>

                        <ChevronDown
                          size={18}
                          className="
                            shrink-0
                            text-slate-400
                            group-open:rotate-180
                            transition
                          "
                        />

                      </summary>


                      <div
                        className="
                          px-5
                          pb-5
                          text-sm
                          leading-6
                          text-slate-500
                        "
                      >
                        {item.answer}
                      </div>

                    </details>

                  )
                )}

              </div>

            </div>

          )}

        </section>

      </MainLayout>
    </>
  );
}
