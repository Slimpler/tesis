import mongoose from "mongoose";

const examenSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      require: true,
    },
    descripcion: {
      type: String,
      require: true,
    },
    fechaExamen: {
      type: Date,
      require: true,
    },
    personalSalud: {
      nombre: String,
      especialidad: String,
    },
    
    fechaInicio: {
      type: Date,
      default: Date.now,
    },
    url: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Examen", examenSchema);
