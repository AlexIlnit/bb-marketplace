import fs from "fs";

const cities = [
  ["Минск", "Минская область"],
  ["Гомель", "Гомельская область"],
  ["Брест", "Брестская область"],
  ["Витебск", "Витебская область"],
  ["Гродно", "Гродненская область"],
  ["Могилев", "Могилевская область"],
];

const categories = [
  "electronics",
  "cars",
  "real-estate",
  "services",
  "furniture",
  "clothes",
];

const conditions = ["new", "used"];
const sellers = ["private", "dealer", "agency"];

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const listings = [];

for (let i = 1; i <= 100; i++) {
  const city = random(cities);

  listings.push({
    title: `Товар ${i}`,
    description: `Описание товара ${i}`,
    price: Math.floor(Math.random() * 50000) + 100,
    images: [`https://picsum.photos/600/400?random=${i}`],
    city: city[0],
    region: city[1],
    category: random(categories),
    condition: random(conditions),
    sellerType: random(sellers),
    status: "approved"
  });
}

fs.writeFileSync(
  "seed-listings.json",
  JSON.stringify(listings, null, 2)
);

console.log("✅ 100 объявлений создано");