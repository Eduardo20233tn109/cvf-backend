import mongoose from "mongoose";
import { config } from "./config.js";

export const connectDB = async () => {
  try {
    const db = await mongoose.connect(config.mongodbUri);
    console.log(`✅ Base de datos conectada: ${db.connection.name}`);
  } catch (error) {
    console.error(`❌ Error al conectar a la base de datos: ${error.message}`);
    process.exit(1);
  }
};
