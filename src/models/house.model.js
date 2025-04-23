import mongoose from "mongoose";
const { Schema, model } = mongoose;

const houseSchema = new Schema(
  {
    description: String,
    photo: {
      type: String, // solo nombre o ruta de la imagen
      default: ""
    },    
    address: {
      street: String,
      city: String,
      zip: String
    },
    status: {
      type: String,
      enum: ["activo", "inactivo"],
      default: "activo"
    }
  },
  { timestamps: true }
);

export const HouseModel = model("House", houseSchema);
