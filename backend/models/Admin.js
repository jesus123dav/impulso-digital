
const mongoose = require("mongoose");

// Estructura de los administradores
const adminSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },

    correo: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    rol: {
      type: String,
      default: "admin"
    },

    activo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    collection: "administradores"
  }
);

// Crear el modelo
const Administrador = mongoose.model(
  "Administrador",
  adminSchema
);

module.exports = Administrador;
