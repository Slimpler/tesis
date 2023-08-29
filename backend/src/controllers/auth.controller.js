import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { TOKEN_SECRET } from "../config.js";
import { createAccessToken } from "../libs/jwt.js";


export const login = async (req, res) => {
  try {
    const { rut, password } = req.body;
    const userFound = await User.findOne({
      $or: [{ rut }],
    }).populate("roles");
    // console.log(
    //   {userFound}
    // )
    if (!userFound || !userFound.state) {
      return res.status(400).json({
        message: ["El rut no es válido"],
      });
    }

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json({
        message: ["The password is incorrect"],
      });
    }

    const token = await createAccessToken({
      id: userFound._id,
      name: userFound.name,
    });

    res.cookie("token", token, {
      httpOnly: false, // Siempre usar httpOnly para mayor seguridad
      secure: process.env.NODE_ENV === "production", // Configurar según el entorno
      sameSite: "none", // Configurar según tus necesidades y requisitos
    });
    
    // Obtener los nombres de los roles del usuario
    const roleNames = userFound.roles.map((role) => role.name);

    res.json({
      name: userFound.name,  
      email: userFound.email,
      roles: roleNames,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const verifyToken = async (req, res) => {
  try {
    const { token } = req.cookies;
    
    if (!token) {
      return res.json(false); // Devolver falso si no hay token
    }

    // Verificar el token
    const user = jwt.verify(token, TOKEN_SECRET);

    // Buscar al usuario por ID y obtener los roles
    const userFound = await User.findById(user.id).populate("roles");
    if (!userFound) {
      return res.sendStatus(401); // Usuario no encontrado
    }

    // Mapear los nombres de los roles
    const roles = userFound.roles.map((role) => role.name);

    // Devolver información del usuario autenticado
    return res.json({
      id: userFound._id,
      name: userFound.name,
      email: userFound.email,
      roles,
    });
  } catch (error) {
    // Manejar errores de verificación o consulta a la base de datos
    console.error(error);
    return res.sendStatus(500); // Error interno del servidor
  }
};


export const logout = async (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    expires: new Date(0),
  });

  return res.sendStatus(200);
};
