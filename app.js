// Archivo: app.js

import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./src/database.js";

import houseRoutes from "./src/routes/house.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import rolRoutes from "./src/routes/rol.routes.js";
import visitRoutes from "./src/routes/visit.routes.js";
import notificationRoutes from "./src/routes/notification.routes.js";

// Conexión a la base de datos
connectDB();

const app = express();
const PORT = 4000;

// ✅ CORS correctamente configurado
const allowedOrigins = [
  'http://localhost:5173', // ← este es el puerto de Vite
  'https://staging.d1ep2v2o8kjxai.amplifyapp.com' // elimina la barra al final
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Configuración básica
app.set("port", PORT);

// Middlewares
app.use(morgan("dev"));
app.use(express.json()); // para peticiones JSON
app.use(express.urlencoded({ extended: true })); // para formularios simples

// 🔧 Middleware para evitar respuestas cacheadas (304 Not Modified)
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// Servir imágenes o archivos estáticos
app.use("/uploads", express.static("uploads"));

// Rutas API
app.use("/api/users", userRoutes);           // JSON
app.use("/api/houses", houseRoutes);         // form-data
app.use("/api/roles", rolRoutes);            // JSON
app.use("/api/visits", visitRoutes);         // JSON
app.use("/api/notifications", notificationRoutes); // JSON

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});
