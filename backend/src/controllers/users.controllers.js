// Importar los modelos y las dependencias necesarias
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import Reporte from "../models/reporte.model.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Diagnostico from "../models/diagnostico.model.js";
import Tratamiento from "../models/tratamiento.model.js";
import { transporter } from "../libs/mailer.js";
import  jwt  from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });


// Obtener todos los usuarios con el campo 'state' igual a true
export const getUsersTrue = async (req, res) => {
  try {
    const users = await User.find({ state: true }).populate('roles');

    if (users.length === 0) {
      return res.status(200).json({ message: 'La base de datos está vacía' });
    } else {
      // Mapear los usuarios para extraer solo los campos necesarios
      const mappedUsers = users.map(user => ({
        _id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        rut: user.rut,
        especialidad: user.especialidad,
        roles: user.roles.map(role => role.name),
      }));

      return res.json(mappedUsers);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

// Cambiar el estado del usuario a false
export const changeState = async (req, res) => {
  const { userId } = req.params;

  try {
    // Buscar el usuario por su ID en la base de datos
    const user = await User.findById(userId);
    console.log(user)
    // Si el usuario no existe, responder con un mensaje de error
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar el campo state a false
    user.state = false;
    
    // Envío de correo electrónico 
    try {
      await transporter.sendMail({
        from: 'nicolasde.oyarce@gmail.com',
        to: user.email,
        subject: `Hola ${user.name},`,
        html: `Tu cuenta ha sido eliminada, para mayor información acercate al centro asistencial.
        Nos despedimos...`,
      });
      console.log('Correo electrónico enviado con éxito.');
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
    }
    // Guardar los cambios en la base de datos
    await user.save();

    // Responder con un mensaje de éxito
    res.json({ message: 'Estado del usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error al cambiar el estado del usuario:', error);
    res.status(500).json({ message: 'Error al cambiar el estado del usuario' });
  }
};

// Obtener todos los usuarios con sus roles
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate('roles');

    if (users.length === 0) {
      return res.status(200).json({ message: 'La base de datos está vacía' });
    } else {
      // Mapear los usuarios para extraer solo los campos necesarios
      const mappedUsers = users.map(user => ({
        _id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        rut: user.rut,
        especialidad: user.especialidad,
        roles: user.roles.map(role => role.name),
      }));

      return res.json(mappedUsers);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Obtener un usuario por su ID con sus roles
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('roles');

    if (!user) {
      return res.status(404).json({ message: 'El usuario no fue encontrado.' });
    } else {
      // Extraer solo los campos necesarios, incluyendo los nombres de los roles
      const userData = {
        _id: user._id,
        name: user.name,
        lastname: user.lastname,
        rut: user.rut,
        especialidad: user.especialidad,
        email: user.email,
        roles: user.roles.map(role => role.name),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return res.json(userData);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Crear un nuevo usuario
export const createUser = async (req, res) => {
  try {
    const { name, lastname, rut, email, password, roles, especialidad } = req.body;

    // Verificar si el rut o el email ya están registrados
    const existingUser = await User.findOne({ $or: [{ rut }, { email }] });

    if (existingUser) {
      return res.status(409).json({ message: 'El rut o el email ya están registrados.' });
    }

    // Verificar si los roles proporcionados existen en la tabla "roles"
    if (roles && Array.isArray(roles) && roles.length > 0) {
      const existingRoles = await Role.find({ _id: { $in: roles } });

      if (existingRoles.length !== roles.length) {
        return res.status(404).json({ message: 'Uno o más roles proporcionados no existen en la tabla "roles".' });
      }
    } else {
      const defaultRole = await Role.findOne({ name: "paciente" }).select("_id");
      roles = [defaultRole._id];
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userData = { name, lastname, rut, email, password: passwordHash, roles, especialidad };
    
    const newUser = new User(userData);
    const savedUser = await newUser.save();

    // Envío de correo electrónico 
    try {
      await transporter.sendMail({
        from: 'nicolasde.oyarce@gmail.com',
        to: savedUser.email,
        subject: `Hola ${savedUser.name}, bienvenido/a`,
        html: `Ya puedes ingresar al sistema en el siguiente link https://nicolas.up.railway.app/, para iniciar sesión pon tu 
          Rut: ${savedUser.rut} y
          contraseña: Rut sin puntos ni guiones: ejemplo si tu rut es 12345678-9 tu contraseña será: 12345678 </b>.\l
          Te recomendamos cambiar tu conseña en el siguiente link: https://nicolas.up.railway.app/forgot-password, ingresado tu correo
          electrónico y siguiendo los pasos.`,
      });
      console.log('Correo electrónico enviado con éxito.');
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
    }

    const userRoles = await Role.find({ _id: { $in: savedUser.roles } }).select("name");

    const userWithRolesNames = {
      ...savedUser._doc,
      roles: userRoles.map((role) => role.name),
    };

    res.status(201).json(userWithRolesNames);
  } catch (error) {
    if (error.name === 'CastError' && error.path === '_id') {
      return res.status(400).json({ message: 'El ID del rol proporcionado es incorrecto.' });
    }

    console.log(error);
    res.status(500).json(error);
  }
};

// Actualizar un usuario existente por su ID
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, lastname, especialidad } = req.body;

    const existingUser = await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const newData = {};

    if (name) newData.name = name;
    if (especialidad) newData.especialidad = especialidad;
    if (lastname) newData.lastname = lastname;

    const updatedUser = await User.findByIdAndUpdate(id, { $set: newData }, { new: true });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// Eliminar un usuario existente por su ID
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const existingUser = await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({ message: 'Usuario eliminado correctamente.' });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// Obtener todos los moderadores (usuarios con rol "moderator")
export const getModerators = async (req, res) => {
  try {
    // Verificar si el rol "moderator" existe en la tabla "roles"
    const moderatorRole = await Role.findOne({ name: "moderator" });

    if (!moderatorRole) {
      return res.status(404).json({ message: 'El rol "moderator" no existe en la tabla "roles".' });
    }

    const moderators = await User.find({ roles: { $in: [moderatorRole._id] } });

    if (moderators.length === 0) {
      return res.status(200).json({ message: "La base de datos está vacía" });
    } else {
      return res.json(moderators);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Obtener todos los administradores (usuarios con rol "admin")
export const getAdmins = async (req, res) => {
  try {
    // Verificar si el rol "admin" existe en la tabla "roles"
    const adminRole = await Role.findOne({ name: "admin" });

    if (!adminRole) {
      return res.status(404).json({ message: 'El rol "admin" no existe en la tabla "roles".' });
    }

    const admins = await User.find({ roles: { $in: [adminRole._id] } });

    if (admins.length === 0) {
      return res.status(200).json({ message: "La base de datos está vacía" });
    } else {
      return res.json(admins);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Obtener todos los pacientes (usuarios con rol "paciente") con sus diagnósticos y tratamientos
export const getPacientes = async (req, res) => {
  try {
    // Verificar si el rol "paciente" existe en la tabla "roles"
    const pacienteRole = await Role.findOne({ name: "paciente" });

    if (!pacienteRole) {
      return res.status(404).json({ message: 'El rol "paciente" no existe en la tabla "roles".' });
    } 

    // Obtener todos los pacientes con el rol "paciente"
    const pacientes = await User.find({
      $and: [
        { roles: { $in: [pacienteRole._id] } },
        { state: true }
      ]
    });

    if (pacientes.length === 0) {
      return res.status(200).json({ message: "La base de datos está vacía" });
    } else {
      // Para cada paciente, buscar sus diagnósticos asociados
      const pacientesConDiagnosticos = await Promise.all(
        pacientes.map(async (paciente) => {
          const diagnosticos = await Diagnostico.find({ user: paciente._id });
          
          // Buscar los tratamientos asociados al paciente
          const tratamientos = await Tratamiento.find({ user: paciente._id });
          
          const reportes = await Reporte.find({user: paciente._id });
          return {
            ...paciente.toJSON(),
            diagnosticos: diagnosticos,
            tratamientos: tratamientos, 
            reportes: reportes,
          };
        })
      );

      return res.json(pacientesConDiagnosticos);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// Obtener el perfil del paciente autenticado
export const userProfile = async (req, res) => {
  try {
    // Obtener el ID del usuario autenticado desde el token
    const userId = req.user.id;
    console.log('Obteniendo el perfil del paciente');
    // Buscar el ID del rol "paciente" en la base de datos
    const pacienteRole = await Role.findOne({ name: "paciente" });

    if (!pacienteRole) {
      return res.status(404).json({ message: 'El rol "paciente" no existe en la tabla "roles".' });
    }

    // Verificar si el usuario existe en la base de datos y tiene el rol de "paciente"
    const paciente = await User.findOne({ _id: userId, roles: pacienteRole._id });

    if (!paciente) {
      return res.status(403).json({ message: 'Acceso denegado. El usuario no tiene el rol de "paciente" o no existe.' });
    }

    // Obtener los diagnósticos asociados al paciente
    const diagnosticos = await Diagnostico.find({ user: userId });

    // Obtener los tratamientos asociados al paciente
    const tratamientos = await Tratamiento.find({ user: userId });

    // Obtener los reportes del paciente
    const reportes = await Reporte.find({ user: userId });

    // Construir el perfil del paciente con la información requerida
    const perfilPaciente = {
      name: paciente.name,
      lastname: paciente.lastname,
      diagnosticos: diagnosticos,
      tratamientos: tratamientos,
      reportes: reportes,
    };

    res.json({ data: perfilPaciente }); // Enviar la respuesta JSON con la clave 'data'
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al obtener el perfil del paciente.' });
  }
};

