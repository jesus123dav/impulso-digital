
/*
  IMPULSO DIGITAL
  Backend desarrollado con Node.js, Express y MongoDB
*/

// 1. IMPORTAR LIBRERÍAS
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Administrador = require("./models/Admin");
const verificarToken = require("./middleware/auth");

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

// MODELO DE SOLICITUDES DE CONTACTO
const solicitudSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  negocio: {
    type: String,
    trim: true
  },
  correo: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  telefono: {
    type: String,
    trim: true
  },
  servicio: {
    type: String,
    required: true
  },
  mensaje: {
    type: String,
    required: true,
    trim: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
}, {
  collection: "solicitudes"
});

const Solicitud = mongoose.model(
  "Solicitud",
  solicitudSchema
);


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

// RECIBIR SOLICITUDES DE LOS CLIENTES
app.post("/api/contacto", async (req, res) => {
  try {
    const {
      nombre,
      negocio,
      correo,
      telefono,
      servicio,
      mensaje
    } = req.body;

    if (!nombre || !correo || !servicio || !mensaje) {
      return res.status(400).json({
        mensaje: "Completa los campos obligatorios"
      });
    }

    const nuevaSolicitud = await Solicitud.create({
      nombre,
      negocio,
      correo,
      telefono,
      servicio,
      mensaje
    });

    res.status(201).json({
      mensaje: "Solicitud recibida correctamente",
      id: nuevaSolicitud._id
    });

  } catch (error) {
    console.error("Error al guardar solicitud:", error.message);

    res.status(500).json({
      mensaje: "No se pudo guardar la solicitud"
    });
  }
});


// INICIO DE SESIÓN DEL ADMINISTRADOR
app.post("/api/admin/login", async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({
        mensaje: "Debes ingresar correo y contraseña"
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("Falta configurar JWT_SECRET");
    }

    // Buscar administrador por correo
    const administrador = await Administrador.findOne({
      correo: correo.trim().toLowerCase()
    }).select("+password");

    if (!administrador || !administrador.activo) {
      return res.status(401).json({
        mensaje: "Credenciales incorrectas"
      });
    }

    // Comparar contraseña con el hash guardado
    const passwordCorrecta = await bcrypt.compare(
      password,
      administrador.password
    );

    if (!passwordCorrecta) {
      return res.status(401).json({
        mensaje: "Credenciales incorrectas"
      });
    }

    // Generar token de acceso
    const token = jwt.sign(
      {
        id: administrador._id.toString(),
        correo: administrador.correo,
        rol: administrador.rol
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h"
      }
    );

    res.status(200).json({
      mensaje: "Inicio de sesión correcto",
      token,
      administrador: {
        nombre: administrador.nombre,
        correo: administrador.correo,
        rol: administrador.rol
      }
    });

  } catch (error) {
    console.error("Error en inicio de sesión:", error.message);

    res.status(500).json({
      mensaje: "Error al iniciar sesión"
    });
  }
});

// RUTA PRIVADA PARA COMPROBAR LA AUTENTICACIÓN
app.get("/api/admin/perfil", verificarToken, (req, res) => {
  res.status(200).json({
    mensaje: "Acceso autorizado",
    administrador: {
      id: req.admin.id,
      correo: req.admin.correo,
      rol: req.admin.rol
    }
  });
});

 // CONSULTAR SOLICITUDES - SOLO ADMINISTRADOR
app.get("/api/admin/solicitudes", verificarToken, async (req, res) => {
  try {
    // Buscar las solicitudes registradas en MongoDB
    const solicitudes = await Solicitud.find()
      .sort({ fecha: -1 })
      .lean();

    // Enviar las solicitudes al administrador
    res.status(200).json(solicitudes);

  } catch (error) {
    console.error(
      "Error al consultar solicitudes:",
      error.message
    );

    res.status(500).json({
      mensaje: "No se pudieron consultar las solicitudes"
    });
  }
});

// CONSULTAR TODOS LOS SERVICIOS - ADMINISTRADOR
app.get("/api/admin/servicios", verificarToken, async (req, res) => {
  try {
    const servicios = await Servicio.find()
      .sort({ nombre: 1 })
      .lean();

    res.status(200).json(servicios);

  } catch (error) {
    console.error("Error al consultar servicios:", error.message);

    res.status(500).json({
      mensaje: "No se pudieron consultar los servicios"
    });
  }
});

// AGREGAR UN SERVICIO - ADMINISTRADOR
app.post("/api/admin/servicios", verificarToken, async (req, res) => {
  try {
    const { nombre, categoria, descripcion } = req.body || {};

    if (
      typeof nombre !== "string" ||
      typeof categoria !== "string" ||
      typeof descripcion !== "string"
    ) {
      return res.status(400).json({
        mensaje: "Todos los campos deben contener texto"
      });
    }

    const datos = {
      nombre: nombre.trim(),
      categoria: categoria.trim(),
      descripcion: descripcion.trim()
    };

    if (
      !datos.nombre ||
      !datos.categoria ||
      !datos.descripcion ||
      datos.nombre.length > 100 ||
      datos.categoria.length > 80 ||
      datos.descripcion.length > 1000
    ) {
      return res.status(400).json({
        mensaje: "Revisa los campos y sus longitudes"
      });
    }

    const nuevoServicio = await Servicio.create({
      ...datos,
      activo: true
    });

    res.status(201).json({
      mensaje: "Servicio creado correctamente",
      servicio: nuevoServicio
    });

  } catch (error) {
    console.error("Error al crear servicio:", error.message);

    res.status(500).json({
      mensaje: "No se pudo crear el servicio"
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
