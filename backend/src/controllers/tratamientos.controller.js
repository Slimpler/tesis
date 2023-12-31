import Tratamiento from "../models/tratamiento.model.js";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import { transporter } from "../libs/mailer.js";
import { format } from 'date-fns';
import esLocale from 'date-fns/locale/es/index.js'


export const createTratamiento = async (req, res) => {
  try {
    const { nombre, descripcion, fechaTratamiento, userId, url } = req.body;
 
    // Verificar si el usuario existe en la base de datos
    const userFound = await User.findById(userId);
    if (!userFound) {
      return res.status(400).json({
        message: "El usuario no existe",
      });
    }

    const pacienteRole = await Role.findOne({ name: "paciente" });

    // Verificar si el usuario tiene el rol "paciente"
    if (!userFound.roles.includes(pacienteRole._id)) {
      return res.status(403).json({
        message: "Solo los usuarios con el rol 'paciente' pueden tener tratamientos.",
      });
    }
    // Crear un nuevo tratamiento con la información proporcionada
    const newTratamiento = new Tratamiento({
      nombre,
      descripcion,
      fechaTratamiento,
      personalSalud: {
        nombre: req.user.name,
        especialidad: req.user.especialidad,
      },
      url,
      user: userFound._id,
    });

    // Guardar el tratamiento en la base de datos
    await newTratamiento.save();

    // Realizar la populación de la información del usuario asociado al tratamiento
    const tratamientoPopulated = await Tratamiento.findById(newTratamiento._id).populate("user");
    const formattedDate = format(new Date(tratamientoPopulated.fechaTratamiento), 'dd/MM/yyyy HH:mm', {
      locale: esLocale, // Establece el locale en español
    });
    try {
      await transporter.sendMail({
        from: 'nicolasde.oyarce@gmail.com',
        to: tratamientoPopulated.user.email,
        subject:`Hola, ${tratamientoPopulated.user.name}`,
        html: `<b>Se ha indicado el tratamiento "${tratamientoPopulated.nombre}" para el día ${formattedDate} horas</b>
              <b>Para mayor información entra a tu perfil del sistema... </b>`,
      });
      console.log('Correo electrónico enviado con éxito.');
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
    }

    // Verificar si se pudo realizar la populación correctamente
    if (!tratamientoPopulated) {
      return res.status(500).json({
        message: "Error al obtener la información del tratamiento creado.",
      });
    }

    res.json(tratamientoPopulated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTratamiento = async (req, res) => {
  try {
    const { nombre, descripcion, url } = req.body;
    const { id } = req.params;

    // Verificar si el tratamiento existe en la base de datos
    const tratamiento = await Tratamiento.findById(id);
    if (!tratamiento) {
      return res.status(404).json({
        message: "Tratamiento no encontrado",
      });
    }

    // Actualizar la información del tratamiento
    tratamiento.nombre = nombre;
    tratamiento.descripcion = descripcion;
    tratamiento.url = url;

    // Guardar los cambios en la base de datos
    const updatedTratamiento = await tratamiento.save();

    // Realizar la populación de la información del usuario asociado al tratamiento actualizado
    const tratamientoPopulated = await Tratamiento.findById(updatedTratamiento._id).populate("user");
    const formattedDate = format(new Date(tratamientoPopulated.fechaTratamiento), 'dd/MM/yyyy HH:mm', {
      locale: esLocale, // Establece el locale en español
    });
    try {
      await transporter.sendMail({
        from: 'nicolasde.oyarce@gmail.com',
        to: tratamientoPopulated.user.email,
        subject:`Hola, ${tratamientoPopulated.user.name}`,
        html: `<b>Se ha modificado el tratamiento "${tratamientoPopulated.nombre}" para el día ${formattedDate} horas</b>
              <b>Para mayor información entra a tu perfil del sistema... </b>`,
      });
      console.log('Correo electrónico enviado con éxito.');
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
    }
    // Verificar si se pudo realizar la populación correctamente
    if (!tratamientoPopulated) {
      return res.status(500).json({
        message: "Error al obtener la información del tratamiento actualizado.",
      });
    }

    res.json(tratamientoPopulated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTratamiento = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el tratamiento existe en la base de datos
    const tratamiento = await Tratamiento.findById(id);
    if (!tratamiento) {
      return res.status(404).json({
        message: "Tratamiento no encontrado",
      });
    }
    // Eliminar el tratamiento de la base de datos
    await Tratamiento.findByIdAndDelete(id);

    res.json({ message: "Tratamiento eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//NO USADAS
export const getTratamientos = async (req, res) => {
  try {
    // Obtener todos los tratamientos y realizar la población para obtener la información del usuario paciente asociado
    const tratamientos = await Tratamiento.find().populate({
      path: "user",
      select: "name rut",
    });

    if (tratamientos.length === 0) {
      return res.status(200).json({ message: "No se encontraron tratamientos" });
    } else {
      res.json(tratamientos);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTratamiento = async (req, res) => {
  try {
    const { pacienteId } = req.params;

    // Verificar si el tratamiento existe en la base de datos y realizar la población para obtener el nombre y RUT del usuario paciente asociado
    const tratamiento = await Tratamiento.find({ user: pacienteId }).populate({
      path: "user",
      select: "name rut", 
    });

    if (!tratamiento) {
      return res.status(404).json({
        message: "Tratamiento no encontrado",
      });
    }

    res.json(tratamiento);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
