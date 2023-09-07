import mongoose from "mongoose";

const diagnosticoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      require: true,
    },
    descripcion: {
      type: String,
      require: true,
    },
    estadio:{
      type: String,
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
export default mongoose.model("Diagnostico", diagnosticoSchema);
