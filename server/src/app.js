import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

const app = express();

app.use(cors({
    origin: ["http://localhost:4173", "http://localhost:3000"],
    credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/listings",listingRoutes);

app.use("/api/upload", uploadRoutes);

app.use("/api/users", userRoutes);

app.use("/api/favorites", favoriteRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "API working"
  });
});

export default app;