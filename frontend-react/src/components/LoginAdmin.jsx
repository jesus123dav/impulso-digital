
import { useEffect, useState } from "react";
import {
  iniciarSesionAdmin,
  obtenerPerfilAdmin,
  obtenerSolicitudesAdmin
} from "../api";
import GestionServicios from "./GestionServicios";

function LoginAdmin({ onVolver }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [sesion, setSesion] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const [solicitudes, setSolicitudes] = useState([]);
  const [cargandoSolicitudes, setCargandoSolicitudes] =
    useState(false);
  const [errorSolicitudes, setErrorSolicitudes] = useState("");

  // Consultar solicitudes cuando el administrador ingresa
  useEffect(() => {
    if (!sesion) return;

    let activo = true;

    async function cargarSolicitudes() {
      setCargandoSolicitudes(true);
      setErrorSolicitudes("");

      try {
        const datos = await obtenerSolicitudesAdmin(
          sesion.token
        );

        if (activo) {
          setSolicitudes(Array.isArray(datos) ? datos : []);
        }
      } catch (error) {
        if (activo) {
          setErrorSolicitudes(error.message);
        }
      } finally {
        if (activo) {
          setCargandoSolicitudes(false);
        }
      }
    }

    cargarSolicitudes();

    return () => {
      activo = false;
    };
  }, [sesion]);

  // Iniciar sesión
  async function manejarEnvio(event) {
    event.preventDefault();
    setError("");
    setCargando(true);

    try {
      const inicio = await iniciarSesionAdmin(
        correo,
        password
      );

      const perfil = await obtenerPerfilAdmin(
        inicio.token
      );

      setSesion({
        token: inicio.token,
        administrador: {
          ...perfil.administrador,
          nombre: inicio.administrador?.nombre
        }
      });

      setPassword("");
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

  function cerrarSesion() {
    setSesion(null);
    setSolicitudes([]);
    setErrorSolicitudes("");
  }

  function mostrarFecha(valor) {
    if (!valor) return "Sin fecha";

    const fecha = new Date(valor);

    return Number.isNaN(fecha.getTime())
      ? "Sin fecha"
      : fecha.toLocaleString("es-CO");
  }

  return (
    <main className="pagina-admin">
      <div
        className={`admin-contenedor ${
          sesion ? "admin-panel" : ""
        }`}
      >
        <p className="etiqueta">IMPULSO DIGITAL</p>

        {sesion ? (
          <>
            <h1>Panel de administración</h1>

            <p>
              Bienvenido,{" "}
              {sesion.administrador.nombre ||
                sesion.administrador.correo}
            </p>

            <div className="admin-resumen">
              <div>
                <span>Solicitudes recibidas</span>
                <strong>
                  {cargandoSolicitudes
                    ? "..."
                    : errorSolicitudes
                      ? "--"
                      : solicitudes.length}
                </strong>
              </div>
            </div>

            <h2>Solicitudes de clientes</h2>

            {cargandoSolicitudes && (
              <p>Cargando solicitudes...</p>
            )}

            {errorSolicitudes && (
              <p role="alert">{errorSolicitudes}</p>
            )}

            {!cargandoSolicitudes &&
              !errorSolicitudes &&
              solicitudes.length === 0 && (
                <p>No hay solicitudes registradas.</p>
              )}

            <div className="lista-solicitudes">
              {solicitudes.map((solicitud) => (
                <article
                  className="solicitud-tarjeta"
                  key={solicitud._id}
                >
                  <h3>{solicitud.nombre}</h3>

                  <p>
                    <strong>Negocio:</strong>{" "}
                    {solicitud.negocio || "No especificado"}
                  </p>

                  <p>
                    <strong>Servicio:</strong>{" "}
                    {solicitud.servicio}
                  </p>

                  <p>
                    <strong>Correo:</strong>{" "}
                    {solicitud.correo}
                  </p>

                  <p>
                    <strong>Teléfono:</strong>{" "}
                    {solicitud.telefono || "No registrado"}
                  </p>

                  <p>
                    <strong>Mensaje:</strong>{" "}
                    {solicitud.mensaje}
                  </p>

                  <small>
                    {mostrarFecha(solicitud.fecha)}
                  </small>
                </article>
              ))}
            </div>
            {/* Administración del catálogo */}
            <GestionServicios token={sesion.token} />
            <button
              className="boton boton-rojo"
              type="button"
              onClick={cerrarSesion}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <h1>Acceso administrativo</h1>

            <p>
              Ingresa tus credenciales para administrar
              Impulso Digital.
            </p>

            <form onSubmit={manejarEnvio}>
              <label htmlFor="correo-admin">
                Correo electrónico
              </label>

              <input
                id="correo-admin"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                autoComplete="username"
                required
              />

              <label htmlFor="password-admin">
                Contraseña
              </label>

              <input
                id="password-admin"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />

              {error && <p role="alert">{error}</p>}

              <button
                className="boton boton-rojo"
                type="submit"
                disabled={cargando}
              >
                {cargando
                  ? "Verificando..."
                  : "Iniciar sesión"}
              </button>
            </form>
          </>
        )}

        <button
          type="button"
          className="volver-admin"
          onClick={onVolver}
        >
          Volver a Impulso Digital
        </button>
      </div>
    </main>
  );
}

export default LoginAdmin;
