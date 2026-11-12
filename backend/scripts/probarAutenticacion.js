
require("dotenv").config();

async function probarAutenticacion() {
  try {
    // 1. Intentar iniciar sesión
    const respuesta = await fetch(
      "http://localhost:3002/api/admin/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          correo: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD
        })
      }
    );

    const datos = await respuesta.json().catch(() => ({}));

    console.log("Estado del inicio de sesión:", respuesta.status);
    console.log("Mensaje:", datos.mensaje);

    if (!respuesta.ok || !datos.token) {
      return;
    }

    console.log("Administrador:", datos.administrador.nombre);
    console.log("Token generado correctamente");

    // 2. Probar acceso a una ruta protegida
    const perfil = await fetch(
      "http://localhost:3002/api/admin/perfil",
      {
        headers: {
          Authorization: `Bearer ${datos.token}`
        }
      }
    );

    const resultado = await perfil.json();

    console.log("Estado de la ruta privada:", perfil.status);
    console.log("Respuesta:", resultado.mensaje);

  } catch (error) {
    console.error("Error en la prueba:", error.message);
  }
}

probarAutenticacion();
