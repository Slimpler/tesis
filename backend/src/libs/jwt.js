import { TOKEN_SECRET } from "../config.js";
import jwt from "jsonwebtoken";

export async function createAccessToken(payload) {
  try {
    // Verificar que el payload no esté vacío
    if (!payload || Object.keys(payload).length === 0) {
      throw new Error("Payload no puede estar vacío.");
    }

    // Crear el token JWT con el payload proporcionado y una duración de 1 hora
    const token = jwt.sign(payload, TOKEN_SECRET, { expiresIn: "1h" });
    return token;
  } catch (error) {
    // Capturar cualquier error que ocurra durante la creación del token
    console.error("Error al crear el token de acceso:", error);
    throw new Error("Hubo un error al crear el token de acceso.");
  }
}
