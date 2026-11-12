
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Administrador = require("../models/Admin");

async function crearAdministrador() {
  try {
    const {
      MONGODB_URI,
      ADMIN_NAME,
      ADMIN_EMAIL,
      ADMIN_PASSWORD
    } = process.env;

    // Comprobar que existan las variables necesarias
    if (!MONGODB_URI || !ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error("Faltan variables de configuración en .env");
    }

    // Conectar con MongoDB
    await mongoose.connect(MONGODB_URI);

    console.log("Conexión con MongoDB establecida");

    const correo = ADMIN_EMAIL.trim().toLowerCase();

    // Comprobar si el administrador ya existe
    const administradorExistente =
      await Administrador.findOne({ correo });

    if (administradorExistente) {
      console.log("El administrador ya está registrado");
      return;
    }

    // Proteger la contraseña
    const passwordHash = await bcrypt.hash(
      ADMIN_PASSWORD,
      12
    );

    // Crear el administrador
    await Administrador.create({
      nombre: ADMIN_NAME.trim(),
      correo,
      password: passwordHash,
      rol: "admin",
      activo: true
    });

    console.log("Administrador creado correctamente");
    console.log("Correo:", correo);

  } catch (error) {
    console.error("Error:", error.message);

  } finally {
    await mongoose.disconnect();
    console.log("Conexión con MongoDB cerrada");
  }
}

crearAdministrador();
