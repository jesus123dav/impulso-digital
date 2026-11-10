
const API_URL = import.meta.env.VITE_API_URL;

// Consultar los servicios de Impulso Digital
export async function obtenerServicios() {
  const respuesta = await fetch(`${API_URL}/api/servicios`);

  if (!respuesta.ok) {
    throw new Error("No se pudieron cargar los servicios");
  }

  const datos = await respuesta.json();

  return datos;
}
