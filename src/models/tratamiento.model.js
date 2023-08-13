import mongoose from "mongoose";

const tratamientoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      require: true,
    },
    descripcion: {
      type: String,
      require: true,
    },
    medico: {
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
export default mongoose.model("Tratamiento", tratamientoSchema);
