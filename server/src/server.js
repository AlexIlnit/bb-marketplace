import "./config/env.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";

import http from "http";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { seedCategories } from "./seeds/categorySeed.js";
import adminRoutes from "./routes/adminRoutes.js";

const PORT = process.env.PORT;

connectDB();
connectDB().then(() => {
  seedCategories();
});

app.use("/api/admin", adminRoutes);

// ✅ ВАЖНО: подключаем ДО запуска сервера
app.use("/api/favorites", favoriteRoutes);

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server started ${PORT}`);
});