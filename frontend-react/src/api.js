
const API_URL = import.meta.env.VITE_API_URL;

// Consultar los servicios de Impulso Digital
export async function obtenerServicios() {
  const respuesta = await fetch(`${API_URL}/api/servicios`);

  if (!respuesta.ok) {
    throw new Error("No se pudieron cargar los servicios");
  }

  return await respuesta.json();
}

// Enviar una solicitud de contacto
export async function enviarSolicitud(solicitud) {
  const respuesta = await fetch(`${API_URL}/api/contacto`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(solicitud)
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.mensaje || "No se pudo enviar la solicitud");
  }

  return datos;
}
