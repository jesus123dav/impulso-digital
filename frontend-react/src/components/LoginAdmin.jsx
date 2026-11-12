
import { useState } from "react";
import {
  iniciarSesionAdmin,
  obtenerPerfilAdmin
} from "../api";

function LoginAdmin({ onVolver }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [sesion, setSesion] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function manejarEnvio(event) {
    event.preventDefault();
    setError("");
    setCargando(true);

    try {
      const inicio = await iniciarSesionAdmin(correo, password);

      // Verificar el token en la ruta privada
      const perfil = await obtenerPerfilAdmin(inicio.token);

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

  return (
    <main className="pagina-admin">
      <div className="admin-contenedor">
        <p className="etiqueta">IMPULSO DIGITAL</p>

        {sesion ? (
          <>
            <h1>Acceso autorizado</h1>

            <p>
              Bienvenido,{" "}
              {sesion.administrador.nombre ||
                sesion.administrador.correo}.
            </p>

            <p>
              Tu identidad fue verificada correctamente
              mediante nuestro servidor.
            </p>

            <button
              type="button"
              className="boton boton-rojo"
              onClick={() => setSesion(null)}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <h1>Acceso administrativo</h1>

            <p>
              Ingresa tus credenciales para acceder
              a Impulso Digital.
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
                type="submit"
                className="boton boton-rojo"
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
