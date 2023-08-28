import { mongoose, Schema } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    lastname:{
      type:String,
      required:true,
      trim:true,
    },
    rut:{
      type:String,
      require:true,
    },
    
    email: {
      type: String,
      required: true,
      unique: true,
    },
    especialidad: {
      type: String,
    },
    state:{
      type: Boolean,
      required: true,
      default: true,
    },
    roles: [
      {
        ref: "Role",
        type: Schema.Types.ObjectId,
      },
    ],
    password: { 
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
