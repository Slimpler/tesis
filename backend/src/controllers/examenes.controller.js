import Examen from "../models/examen.model.js";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import { transporter } from "../libs/mailer.js";
import { format } from 'date-fns';
import esLocale from 'date-fns/locale/es/index.js'


export const createExamen = async (req, res) => {
  try {
    const { nombre, descripcion, fechaExamen, userId, url } = req.body;
 
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
        message: "Solo los usuarios con el rol 'paciente' pueden tener examenes.",
      });
    }
    // Crear un nuevo examen con la información proporcionada
    const newExamen = new Examen({
      nombre,
      descripcion,
      fechaExamen,
      personalSalud: {
        nombre: req.user.name,
        especialidad: req.user.especialidad,
      },
      url,
      user: userFound._id,
    });

    // Guardar el examen en la base de datos
    await newExamen.save();

    // Realizar la populación de la información del usuario asociado al examen
    const examenPopulated = await Examen.findById(newExamen._id).populate("user");
    const formattedDate = format(new Date(examenPopulated.fechaExamen), 'dd/MM/yyyy HH:mm', {
      locale: esLocale, // Establece el locale en español
    });
    try {
      await transporter.sendMail({
        from: 'nicolasde.oyarce@gmail.com',
        to: examenPopulated.user.email,
        subject:`Hola, ${examenPopulated.user.name}`,
        html: `<b>Se ha indicado el examen "${examenPopulated.nombre}" para el día ${formattedDate} horas</b><br>
              <b>Para mayor información entra a tu perfil del sistema... </b>`,
      });
      console.log('Correo electrónico enviado con éxito.');
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
    }

    // Verificar si se pudo realizar la populación correctamente
    if (!examenPopulated) {
      return res.status(500).json({
        message: "Error al obtener la información del examen creado.",
      });
    }

    res.json(examenPopulated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateExamen = async (req, res) => {
  try {
    const { nombre, descripcion, fechaExamen, url } = req.body;
    const { id } = req.params;

    // Verificar si el examen existe en la base de datos
    const examen = await Examen.findById(id);
    if (!examen) {
      return res.status(404).json({
        message: "Examen no encontrado",
      });
    }

    // Actualizar la información del examen
    examen.nombre = nombre;
    examen.descripcion = descripcion;
    examen.fechaExamen = fechaExamen;
    examen.url = url;

    // Guardar los cambios en la base de datos
    const updatedExamen = await examen.save();
     // Realizar la populación de la información del usuario asociado al examen actualizado
     const examenPopulated = await Examen.findById(updatedExamen._id).populate("user");
     const formattedDate = format(new Date(examenPopulated.fechaExamen), 'dd/MM/yyyy HH:mm', {
      locale: esLocale, // Establece el locale en español
    });
    try {
      await transporter.sendMail({
        from: 'nicolasde.oyarce@gmail.com',
        to: examenPopulated.user.email,
        subject:`Hola, ${examenPopulated.user.name}`,
        html: `<b>Se ha modificado el examen "${examenPopulated.nombre}" la nueva fecha es: ${formattedDate} horas. </b><br>
              <b>Para mayor información entra a tu perfil del sistema... </b>`,
      });
      console.log('Correo electrónico enviado con éxito.');
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
    }
   

    // Verificar si se pudo realizar la populación correctamente
    if (!examenPopulated) {
      return res.status(500).json({
        message: "Error al obtener la información del examen actualizado.",
      });
    }

    res.json(examenPopulated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteExamen = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el examen existe en la base de datos
    const examen = await Examen.findById(id);
    if (!examen) {
      return res.status(404).json({
        message: "Examen no encontrado",
      });
    }
    console.log(examen)
    const examenPopulated = await Examen.findById(id).populate("user");
    // Eliminar el examen de la base de datos
    await Examen.findByIdAndDelete(id);
   
    try {
      await transporter.sendMail({
        from: 'nicolasde.oyarce@gmail.com',
        to: examenPopulated.user.email,
        subject:`Hola, ${examenPopulated.user.name}`,
        html: `<b>Se ha eliminado tu examen ${examen.nombre}... </b><br>
              <b>Para mayor información entra a tu perfil del sistema... </b>`,
      });
      console.log('Correo electrónico enviado con éxito.');
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
    }
   
    res.json({ message: "Examen eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//NO USADAS 
export const getExamenes = async (req, res) => {
  try {
    // Obtener todos los examenes y realizar la población para obtener la información del usuario paciente asociado
    const examenes = await Examen.find().populate({
      path: "user",
      select: "name rut",
    });

    if (examenes.length === 0) {
      return res.status(200).json({ message: "No se encontraron examenes" });
    } else {
      res.json(examenes);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExamen = async (req, res) => {
  try {
    const { pacienteId } = req.params;

    // Verificar si el examen existe en la base de datos y realizar la población para obtener el nombre y RUT del usuario paciente asociado
    const examen = await Examen.find({ user: pacienteId }).populate({
      path: "user",
      select: "name rut", 
    });

    if (!examen) {
      return res.status(404).json({
        message: "Examen no encontrado",
      });
    }

    res.json(examen);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
