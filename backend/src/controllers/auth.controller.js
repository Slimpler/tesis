import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { TOKEN_SECRET } from "../config.js";
import { createAccessToken } from "../libs/jwt.js";


export const login = async (req, res) => {
  try {
    const { email, rut, password } = req.body;
    const userFound = await User.findOne({
      $or: [{ rut }, { email }],
    }).populate("roles");
    // console.log(
    //   {userFound}
    // )
    if (!userFound || !userFound.state) {
      return res.status(400).json({
        message: ["The email and rut does not exist or the user is inactive"],
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
      httpOnly: process.env.NODE_ENV !== "development",
      secure: true,
      sameSite: "none",
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
  const { token } = req.cookies;
  if (!token) return res.send(false);

  jwt.verify(token, TOKEN_SECRET, async (error, user) => {
    if (error) return res.sendStatus(401);

    const userFound = await User.findById(user.id).populate("roles");
    const roles = userFound.roles.map((role) => role.name);
    if (!userFound) return res.sendStatus(401);

    return res.json({
      id: userFound._id, 
      name: userFound.name,
      email: userFound.email,
      roles,
    });
  });
};

export const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
  });
  return res.sendStatus(200);
};
