import Aporte from "../models/comunidad.model.js";
import User from "../models/user.model.js";
import { transporter } from "../libs/mailer.js";


export const createAporte = async (req, res) => {
  try {
    const { titulo, aporte, url } = req.body;
    const userId = req.user.id; // ID del usuario autenticado que creará el aporte

    // Verificar si el usuario autenticado existe en la base de datos
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Crear el nuevo aporte utilizando los datos proporcionados en el JSON
    const newAporte = new Aporte({
      titulo,
      aporte,
      url,
      user: { nombre: user.name }, // Asignar el nombre del usuario al campo "user.nombre" del aporte
    });

    //Enviar correo y Guardar el nuevo aporte en la base de datos
    await transporter.sendMail({
      from: user.email,
      to: 'nicolasde.oyarce@gmail.com',
      subject: 'Aporte enviado a la comunidad',
      html: `
        La paciente ${user.name}, ha realizado un aporte.
        Revisarlo prontamente.
      `,
    });
    await newAporte.save();
  

    res.status(201).json(newAporte);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAporte = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el aporte existe en la base de datos
    const aporte = await Aporte.findById(id);
    if (!aporte) {
      return res.status(404).json({ message: "Aporte no encontrado." });
    }
    // Eliminar el aporte de la base de datos
    await Aporte.findByIdAndDelete(id);

    res.json({ message: "Aporte eliminado exitosamente." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const showAportes = async (req, res) => {
  try {
    // Buscar todos los aportes con state igual a true
    const aportes = await Aporte.find({ state: true });

    // Si no se encuentran aportes, enviar una respuesta de éxito con un arreglo vacío
    if (!aportes || aportes.length === 0) {
      return res.json({ message: 'No se encontraron aportes' });
    }

    // Enviar los aportes encontrados como respuesta
    return res.json(aportes);
  } catch (error) {
    // Si ocurre un error, enviar una respuesta de error
    return res.status(500).json({ message: error.message });
  }
};

export const aceptarAporte = async (req, res) => {
  try {
    const { aporteId } = req.params;

    // Buscar el documento del aporte por su ID
    const aporte = await Aporte.findById(aporteId);

    // Si el aporte no existe, enviar una respuesta de error
    if (!aporte) {
      return res.status(404).json({ message: 'Aporte no encontrado.' });
    }

    // Modificar el estado, cambiando true a false y false a true
    aporte.state = !aporte.state;

    // Guardar los cambios en la base de datos
    await aporte.save();

    // Enviar una respuesta de éxito
    return res.json({ message: 'Estado del aporte cambiado exitosamente.', state: aporte.state });
  } catch (error) {
    // Si ocurre un error, enviar una respuesta de error
    return res.status(500).json({ message: error.message });
  }
};


//NO USADAS 
export const getAporte = async (req, res) => {
  try {
    const aporte = await Aporte.findById(req.params.id);
    if (!aporte) return res.status(404).json({ message: "Aporte no encontrado." });
    return res.json(aporte);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getAportes = async (req, res) => {
  try {
    // Obtener todos los aportes de la base de datos
    const aportes = await Aporte.find();

    // Si no hay aportes en la base de datos, devolver un mensaje indicando que está vacía
    if (aportes.length === 0) {
      return res.status(200).json({ message: "La base de datos de aportes está vacía." });
    }

    // Devolver la lista de aportes encontrados
    res.json(aportes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
