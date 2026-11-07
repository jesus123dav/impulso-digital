
/*
  IMPULSO DIGITAL
  Backend desarrollado con Node.js, Express y MongoDB
*/

// 1. IMPORTAR LIBRERÍAS
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// 2. CONFIGURAR EL SERVIDOR
const app = express();
const PORT = process.env.PORT || 3001;

// Permitir recibir información en formato JSON
app.use(express.json());

// Permitir solicitudes desde nuestro frontend
app.use(cors());

// 3. CREAR EL MODELO DE SERVICIOS
const servicioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true
    },
    categoria: {
      type: String,
      required: true
    },
    descripcion: {
      type: String,
      required: true
    },
    activo: {
      type: Boolean,
      default: true
    }
  },
  {
    collection: "servicios"
  }
);

const Servicio = mongoose.model("Servicio", servicioSchema);

// 4. RUTA PRINCIPAL
app.get("/", (req, res) => {
  res.json({
    proyecto: "Impulso Digital",
    mensaje: "Backend funcionando correctamente",
    baseDeDatos:
      mongoose.connection.readyState === 1
        ? "Conectada"
        : "Desconectada"
  });
});

// 5. RUTA PARA CONSULTAR SERVICIOS
app.get("/api/servicios", async (req, res) => {
  try {
    // Buscar servicios activos en MongoDB
    const servicios = await Servicio.find({
      activo: true
    }).lean();

    // Enviar los servicios al navegador
    res.status(200).json(servicios);

  } catch (error) {
    console.error(
      "Error al obtener servicios:",
      error.message
    );

    res.status(500).json({
      mensaje: "Error al consultar los servicios"
    });
  }
});

// 6. CONECTAR A MONGODB
async function iniciarServidor() {
  try {
    // Verificar la configuración
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "Falta configurar MONGODB_URI en el archivo .env"
      );
    }

    // Conectar con MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    });

    console.log("MongoDB conectado correctamente");
    console.log(
      "Base de datos:",
      mongoose.connection.name
    );

    // 7. INICIAR EL SERVIDOR
    const servidor = app.listen(PORT, () => {
      console.log(
        `Servidor funcionando en http://localhost:${PORT}`
      );
      console.log(
        `Catálogo disponible en http://localhost:${PORT}/api/servicios`
      );
    });

    servidor.on("error", (error) => {
      console.error("Error del servidor:", error.message);
    });

  } catch (error) {
    console.error(
      "Error al iniciar el backend:",
      error.message
    );
    process.exit(1);
  }
}

// 8. EJECUTAR EL BACKEND
iniciarServidor();
