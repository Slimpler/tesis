import Reporte from "../models/reporte.model.js";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import { transporter } from "../libs/mailer.js";
import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const getReportes = async (req, res) => {
  try {
    // Obtener todos los reportes de la base de datos y populamos el campo "user" con el nombre del usuario
    const reportes = await Reporte.find().populate("user", "name email");

    // Si no hay reportes en la base de datos, devolver un mensaje indicando que está vacía
    if (reportes.length === 0) {
      return res
        .status(200)
        .json({ message: "La base de datos de reportes está vacía." });
    }

    // Devolver la lista de reportes encontrados con la información del usuario asociado
    res.json(reportes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createReporte = async (req, res) => {
  try {
    const { sintoma, escala } = req.body;

    const newReporte = new Reporte({
      sintoma,
      escala,
      user: req.user.id,
    });
    const userFound = await User.findById(req.user.id)

    if (req.files?.audio) {
      await req.files.audio.mv("./uploads/audios" + req.files.audio.md5 + ".webm");
      const result = await cloudinary.uploader.upload("./uploads/audios" + req.files.audio.md5 + ".webm", {
        resource_type: "auto",
      })
      // console.log(result)
      // newReporte.audio = req.files.audio.md5 + ".webm";
      newReporte.audio = result.secure_url;
    }
    if (req.files?.imagen) {
      const result = await cloudinary.uploader.upload(req.files.imagen.tempFilePath, {
        resource_type: "auto",
      });
      newReporte.imagen = result.secure_url;
      newReporte.imagenPublicId = result.public_id;
    }

    await newReporte.save();
    if(escala > 7){
      await transporter.sendMail({
        from: userFound.email,
        to: "nicolasde.oyarce@gmail.com",
        subject: `Paciente ${userFound.name}, ha ingresado un reporte con intensidad ${escala}`,
        html: `
          <p>Por favor, responder reporte a la brevedad</p>
        `,
      });
    }
    return res.json(newReporte);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const responderReporte = async (req, res) => {
  try {
    const { reporteId } = req.params;
    const userId = req.user.id; // ID del usuario autenticado (médico)

    // Buscar el reporte utilizando el ID proporcionado en el JSON
    const reporte = await Reporte.findById(reporteId).populate('user');
    console.log("hola baby si:", reporte.user.email)
    if (!reporte) {
      return res.status(404).json({ message: "Reporte no encontrado." });
    }

    // Agregar la respuesta al reporte junto con el nombre y especialidad del médico (extraídos del usuario autenticado)
    reporte.respuesta.push({
      respuesta: req.body.respuesta,
      medico: {
        nombre: req.user.name,
        especialidad: req.user.especialidad,
      },
    });
    

    // Guardar el reporte actualizado en la base de datos
    const updatedReporte = await reporte.save();

      try {
        await transporter.sendMail({
          from: 'nicolasde.oyarce@gmail.com',
          to: reporte.user.email,
          subject:`Hola, ${reporte.user.name}`,
          html: `<b>Se ha respondido a tu reporte de sintomas realizado el día ${reporte.date}</b>`,
        });
        console.log('Correo electrónico enviado con éxito.');
      } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
      }

      res.json(updatedReporte);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error al responder al reporte." });
    }
};

export const deleteReporte = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReporte = await Reporte.findByIdAndDelete(id);

    if (!deletedReporte) {
      return res.status(404).json({ message: "Reporte no encontrado." });
    }

    res.json({ message: "Reporte eliminado exitosamente." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getReporte = async (req, res) => {
  try {
    const { id } = req.params;
    const reporte = await Reporte.findById(id).populate("user", "name email");

    if (!reporte) {
      return res.status(404).json({ message: "Reporte no encontrado." });
    }

    return res.json(reporte);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
