import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import bcrypt from "bcryptjs";

// Función para crear el modelo inicial
export const createInitialRoles = async () => {
  try {
    // Verificar si ya existen roles en la base de datos
    const existingRoles = await Role.find();

    if (existingRoles.length === 0) {
      // Si no existen roles, crea algunos roles iniciales
      const initialRoles = [
        { name: "admin" },
        { name: "moderator" },
        { name: "paciente"},
        // Agrega aquí más roles iniciales si lo deseas
      ];

      // Inserta los roles iniciales en la base de datos
      await Role.insertMany(initialRoles);

      console.log("Roles iniciales creados correctamente.");
    } else {
      console.log("Ya existen roles en la base de datos.");
    }
  } catch (error) {
    console.error("Error al crear roles iniciales:", error);
  }
};

export const createUser = async () => {
  const passwordHash = await bcrypt.hash("password", 10);
  // Datos del administrador a crear
  const userData = {
    name: "Nico",
    lastname: "Delgado",
    rut: "19329196-1",
    email: "nicolas@gmail.com",
    especialidad: "Médico Oncológico",
    state: true,
    password: passwordHash,
  };

  try {
    // Verificar si ya existe un usuario con el mismo correo electrónico
    const existingUser = await User.findOne({ email: userData.email });

    if (existingUser) {
      console.log("Ya existe un usuario con este correo electrónico.");
      return;
    }

    // Comprobando roles
    const adminRole = await Role.findOne({ name: "admin" });
    const moderatorRole = await Role.findOne({ name: "moderator" });
    const pacienteRole = await Role.findOne({ name: "paciente" });

    if (!adminRole || !moderatorRole || !pacienteRole) {
      return;
    }

    userData.roles = [adminRole._id, moderatorRole._id];

    // Si no existe un usuario con el mismo correo, crear uno nuevo
    const newUser = new User(userData);
    await newUser.save();

    console.log("Usuario creado exitosamente con el rol de 'admin'.");
  } catch (error) {
    console.error("Error al crear el usuario:", error.message);
  }
};
