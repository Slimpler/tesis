import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import User from "../models/user.model.js";

export const auth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    console.log(req.cookies);

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    //Funcion de jsonwebtoken
    jwt.verify(token, TOKEN_SECRET, async (error, payload) => {
      if (error) {
        return res.status(401).json({ message: "Token is not valid" });
      }

      // Verificar que el ID del usuario en el payload sea válido
      if (!payload.id || typeof payload.id !== "string") {
        return res.status(401).json({ message: "Invalid user ID in token" });
      }

      const user = await User.findById(payload.id).populate("roles");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Agregar el usuario autenticado a la solicitud
      req.user = user;

      // Continuar con la ejecución de las rutas
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
