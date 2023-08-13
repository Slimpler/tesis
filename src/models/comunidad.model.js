import mongoose from "mongoose";

const comunidadchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
    },
    aporte: {
      type: String,
    },
    url: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    state: {
      type: Boolean,
      required: true,
      default: false,
    },
    user: {
      nombre: {
        type: String,
        require: true,
      },
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Comunidad", comunidadchema);
