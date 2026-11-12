
const jwt = require("jsonwebtoken");

// Verificar si el usuario tiene un token válido
function verificarToken(req, res, next) {

  const encabezado = req.headers.authorization;

  // Comprobar que exista el token
  if (!encabezado || !encabezado.startsWith("Bearer ")) {
    return res.status(401).json({
      mensaje: "No tienes autorización para acceder"
    });
  }

  const token = encabezado.split(" ")[1];

  try {
    // Verificar el token con nuestro secreto privado
    const datos = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Comprobar el rol
    if (datos.rol !== "admin") {
      return res.status(403).json({
        mensaje: "No tienes permisos de administrador"
      });
    }

    req.admin = datos;

    next();

  } catch (error) {
    return res.status(401).json({
      mensaje: "Token inválido o expirado"
    });
  }
}

module.exports = verificarToken;
