import mongoose from "mongoose";
// cloudinary

const reporteSchema = new mongoose.Schema(
  { 
    sintoma: {
      type: String,
      required: true,
    },
    audio: {
      type: String,
    },
    imagen: {
      type: String, 
    },
    imagenPublicId: {
      type: String, 
    },
    escala: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    respuesta: [{
      respuesta: {
        type: String, 
      },
      personalSalud: {
        nombre: {
          type: String,
          require: true,
        },
        especialidad: {
          type: String,
          require: true,
        },
      },
    }],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Reporte", reporteSchema);
