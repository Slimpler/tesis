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
      // httpOnly: false,
      // signed: true,
      // secure: true,
      sameSite: "none",
      domain: "https://nicolas-tesis.netlify.app",
      // path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 week
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
  console.log(req.cookies);
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

//Change Password
export const sendMailChangePassword = async (req, res) => {
  const tokenSecret = process.env.TOKEN_SECRET;
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Debes proporcionar un correo electrónico' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const token = jwt.sign({ userId: user._id }, tokenSecret, { expiresIn: '5m' });

    const encodedToken = encodeURIComponent(token);

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/`;

    await transporter.sendMail({
      from: 'nicolasde.oyarce@gmail.com',
      to: user.email,
      subject: 'Restablecimiento de Contraseña',
      html: `
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <p><a href="${resetPasswordUrl}">Restablecer Contraseña</a></p>
        <p>Copia y pega el siguiente token:</p>
        <textarea style="width: 100%; height: 100px;" readonly>${encodedToken}</textarea>
        <p>No lo compartas con nadie. Tienes 5 minutos para usarlo.</p>
      `,
    });

    return res.status(200).json({ message: 'Correo electrónico enviado con éxito' });
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
    return res.status(500).json({ message: 'Error al enviar el correo electrónico' });
  }
};

export const resetPassword = async (req, res) => {
  const tokenSecret = process.env.TOKEN_SECRET;
  try {
    const { token } = req.body;
    const { newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token y nueva contraseña son requeridos' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, tokenSecret);
    } catch (verificationError) {
      return res.status(401).json({ message: 'El token proporcionado no es válido' });
    }

    const userId = decodedToken.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.password = passwordHash;
    await user.save();
    await transporter.sendMail({
      from: 'nicolasde.oyarce@gmail.com',
      to: user.email,
      subject: 'Contraseña restablecida con EXITO',
      html: `
        <p>Contraseña modificada exitosamente...</p>
      `,
    });
    return res.status(200).json({ message: 'Contraseña restablecida con éxito' });
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    return res.status(500).json({ message: 'Error al restablecer la contraseña' });
  }
};
