
const express = require("express");

const app = express();
const PORT = 3000;

// Ruta para comprobar que el servidor funciona
app.get("/", (req, res) => {
  res.json({
    mensaje: "Backend de Impulso Digital funcionando"
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
