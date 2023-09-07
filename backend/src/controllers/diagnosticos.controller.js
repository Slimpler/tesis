import Diagnostico from "../models/diagnostico.model.js";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import { transporter } from "../libs/mailer.js";


export const createDiagnostico = async (req, res) => {
  try {
    const { nombre, descripcion, estadio, userId, url } = req.body;

    // Verificar si el usuario existe en la base de datos
    const userFound = await User.findById(userId);
    if (!userFound) {
      return res.status(400).json({
        message: "El usuario no existe.",
      });
    }

    const pacienteRole = await Role.findOne({ name: "paciente" });

    // Verificar si el usuario tiene el rol "paciente"
    if (!userFound.roles.includes(pacienteRole._id)) {
      return res.status(403).json({
        message: "Solo los usuarios con el rol 'paciente' pueden tener diagnósticos.",
      });
    }

    // Crear un nuevo diagnóstico con la información proporcionada
    const newDiagnostico = new Diagnostico({
      nombre,
      descripcion,
      estadio,
      medico: { 
        nombre: req.user.name,
        especialidad: req.user.especialidad,
      },
      url,
      user: userFound._id,
    });
  
    // Guardar el diagnóstico en la base de datos
    await newDiagnostico.save();
    // Realizar la populación de la información del usuario asociado al diagnóstico
    const diagnosticoPopulated = await Diagnostico.findById(newDiagnostico._id).populate("user");
    // Enviar correo electrónico a la cuenta registrada por el usuario que crea el diagnóstico
    try {
      await transporter.sendMail({
        from: 'nicolasde.oyarce@gmail.com',
        to: diagnosticoPopulated.user.email,
        subject:`Hola, ${diagnosticoPopulated.user.name}`,
        html: `<b>Se ha indicado el diagnóstico "${diagnosticoPopulated.nombre}" el día ${diagnosticoPopulated.fechaInicio}</b>`,
      });
      console.log('Correo electrónico enviado con éxito.');
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
    }
    // Verificar si se pudo realizar la populación correctamente
    if (!diagnosticoPopulated) {
      return res.status(500).json({
        message: "Error al obtener la información del diagnóstico creado.",
      });
    }
    res.json(diagnosticoPopulated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDiagnostico = async (req, res) => {
  try {
    const { nombre, descripcion, estadio, url } = req.body;
    const { id } = req.params;
    console.log(id)
    // Verificar si el diagnóstico existe en la base de datos
    const diagnostico = await Diagnostico.findById(id);
    if (!diagnostico) {
      return res.status(404).json({
        message: "Diagnóstico no encontrado.",
      });
    }

    // Actualizar la información del diagnóstico
    diagnostico.nombre = nombre;
    diagnostico.descripcion = descripcion;
    diagnostico.url = url;
    diagnostico.estadio = estadio;
    diagnostico.medico = {
      nombre: req.user.name,
      especialidad: req.user.especialidad,
    };
    
    // Guardar los cambios en la base de datos
    const updatedDiagnostico = await diagnostico.save();

    // Realizar la populación de la información del usuario asociado al diagnóstico actualizado
    const diagnosticoPopulated = await Diagnostico.findById(updatedDiagnostico._id).populate("user");

    // Verificar si se pudo realizar la populación correctamente
    if (!diagnosticoPopulated) {
      return res.status(500).json({
        message: "Error al obtener la información del diagnóstico actualizado.",
      });
    }

    res.json(diagnosticoPopulated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDiagnostico = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el diagnóstico existe en la base de datos
    const diagnostico = await Diagnostico.findById(id);
    if (!diagnostico) {
      return res.status(404).json({
        message: "Diagnóstico no encontrado.",
      });
    }

    // Eliminar el diagnóstico de la base de datos
    await Diagnostico.findByIdAndDelete(id);

    res.json({ message: "Diagnóstico eliminado exitosamente." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDiagnosticos = async (req, res) => {
  try {
    // Obtener todos los diagnósticos y realizar la población para obtener la información del usuario paciente asociado
    const diagnosticos = await Diagnostico.find().populate({
      path: "user",
      select: "name rut",
    });

    if (diagnosticos.length === 0) {
      return res.status(200).json({ message: "No se encontraron diagnósticos." });
    } else {
      // res.json(diagnosticos);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 
export const getDiagnostico = async (req, res) => {
  try {
    const { pacienteId } = req.params;

    // Verificar si el diagnóstico existe en la base de datos y realizar la población para obtener el nombre y RUT del usuario paciente asociado
    const diagnostico = await Diagnostico.find({ user: pacienteId }).populate({
      path: "user",
      select: "name rut",
    });

    if (!diagnostico) {
      return res.status(404).json({
        message: "Diagnóstico no encontrado.",
      });
    }

    res.json(diagnostico);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
