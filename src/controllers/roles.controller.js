import Role from "../models/role.model.js";

export const createRole = async (req, res) => {
  const { name } = req.body;

  try {
    // Verificar si ya existe un rol con el mismo nombre en la base de datos
    const existingRole = await Role.findOne({ name: name });

    if (existingRole) {
      // Si ya existe un rol con el mismo nombre, enviar un mensaje de error
      return res.status(409).json({ message: 'Ya existe un rol con este nombre.' });
    }

    // Si el rol no existe, crear un nuevo rol
    const newRole = await Role.create(req.body);
    return res.status(201).json(newRole);
  } catch (error) {
    // Manejar cualquier error que ocurra durante la creación del rol
    console.error("Error al crear el rol:", error);
    return res.status(500).json({ message: 'Hubo un error al crear el rol.' });
  }
};

export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    return res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: 'Rol no encontrado.' });
    }
    return res.json(role);
  } catch (error) {
    console.error('Error fetching role:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!role) {
      return res.status(404).json({ message: 'Rol no encontrado.' });
    }
    return res.json(role);
  } catch (error) {
    console.error('Error updating role:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) {
      return res.status(404).json({ message: 'Rol no encontrado.' });
    }
    return res.json({
      message: "Rol eliminado exitosamente",
    });
  } catch (error) {
    console.error('Error deleting role:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getAdminRole = async (req, res) => {
  try {
    const adminRole = await Role.findOne({ name: "admin" });
    if (!adminRole) {
      return res.status(404).json({ message: 'Rol de administrador no encontrado.' });
    }
    return res.json(adminRole);
  } catch (error) {
    console.error("Error fetching admin role:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
