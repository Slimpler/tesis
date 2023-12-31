
import app from "./app.js";
import { PORT } from "./config.js";
import { connectDB } from "./db.js";

async function main() {
  try {
    // Conecta la aplicación a la base de datos MongoDB
    await connectDB();

    // Inicia el servidor Express en el puerto especificado
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });

    // Muestra el entorno en el que se está ejecutando la aplicación (development, production, etc.)
    console.log(`Environment: ${process.env.NODE_ENV}`);
  } catch (error) {
    // Si ocurre algún error durante la conexión a la base de datos o al iniciar el servidor,
    // se mostrará en la consola para facilitar la depuración.
    console.error("Error starting the server:", error);
  }
}

// Ejecuta la función main para iniciar la aplicación
main();
 