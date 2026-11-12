
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

export async function iniciarSesionAdmin(correo, password) {
  const respuesta = await fetch(`${API_URL}/api/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ correo, password })
  });

  const datos = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    throw new Error(datos.mensaje || "No se pudo iniciar sesión");
  }

  if (!datos.token) {
    throw new Error("No se recibió el token de acceso");
  }

  return datos;
}

export async function obtenerPerfilAdmin(token) {
  const respuesta = await fetch(`${API_URL}/api/admin/perfil`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const datos = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    throw new Error(datos.mensaje || "Acceso no autorizado");
  }

  return datos;
}

export async function obtenerSolicitudesAdmin(token) {
  const respuesta = await fetch(
    `${API_URL}/api/admin/solicitudes`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const datos = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    throw new Error(
      datos.mensaje || "No se pudieron cargar las solicitudes"
    );
  }

  return datos;
}
