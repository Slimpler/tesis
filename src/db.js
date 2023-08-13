import mongoose from "mongoose";
import { MONGODB_URI } from "./config.js";

// Función para conectar a la base de datos MongoDB
export const connectDB = async () => {
  try {
    // Configura strictQuery a true para habilitar la validación estricta de consultas en MongoDB.
    // Esto es opcional y depende de tus necesidades específicas.
    mongoose.set('strictQuery', true);

    // Realiza la conexión a la base de datos utilizando la URI de MongoDB especificada en la variable de entorno.
    await mongoose.connect(MONGODB_URI);

    // Si la conexión es exitosa, imprime un mensaje indicando que MongoDB está conectado.
    console.log("MongoDB is connected");
  } catch (error) {
    // Si ocurre un error al conectarse a la base de datos, muestra el error en la consola.
    console.error("Error connecting to MongoDB:", error);
  }
};
