
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Permitir que el servidor reciba datos JSON
app.use(express.json());

// Ruta principal para comprobar el funcionamiento
app.get("/", (req, res) => {
  res.json({
    proyecto: "Impulso Digital",
    mensaje: "Backend funcionando correctamente",
    baseDeDatos: mongoose.connection.readyState === 1
      ? "Conectada"
      : "Desconectada"
  });
});

// Conectar MongoDB e iniciar el servidor
async function iniciarServidor() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("Falta configurar MONGODB_URI en .env");
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    });

    console.log("MongoDB conectado correctamente");
    console.log("Base de datos:", mongoose.connection.name);

    app.listen(PORT, () => {
      console.log(`Servidor funcionando en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Error de conexión:", error.message);
    process.exit(1);
  }
}

iniciarServidor();
