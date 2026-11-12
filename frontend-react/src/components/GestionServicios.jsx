
import { useEffect, useState } from "react";
import {
  obtenerServiciosAdmin,
  crearServicioAdmin
} from "../api";

function GestionServicios({ token }) {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [formulario, setFormulario] = useState({
    nombre: "",
    categoria: "",
    descripcion: ""
  });

  // Consultar los servicios guardados en MongoDB
  useEffect(() => {
    let activo = true;

    async function cargarServicios() {
      try {
        const datos = await obtenerServiciosAdmin(token);

        if (activo) {
          setServicios(datos);
        }
      } catch (error) {
        if (activo) {
          setError(error.message);
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    cargarServicios();

    return () => {
      activo = false;
    };
  }, [token]);

  // Actualizar los campos del formulario
  function manejarCambio(event) {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value
    }));
  }

  // Guardar el nuevo servicio
  async function manejarEnvio(event) {
    event.preventDefault();

    setGuardando(true);
    setError("");
    setMensaje("");

    try {
      const resultado = await crearServicioAdmin(
        token,
        formulario
      );

      // Actualizar la lista del administrador
      setServicios((anteriores) =>
        [...anteriores, resultado.servicio].sort(
          (a, b) => a.nombre.localeCompare(b.nombre)
        )
      );

      setMensaje("Servicio creado correctamente");

      // Limpiar el formulario
      setFormulario({
        nombre: "",
        categoria: "",
        descripcion: ""
      });

    } catch (error) {
      setError(error.message);

    } finally {
      setGuardando(false);
    }
  }

  return (
    <section className="gestion-servicios">
      <h2>Administrar servicios</h2>

      <p>
        Consulta los servicios registrados y agrega
        nuevas soluciones para tus clientes.
      </p>

      <h3>Servicios registrados</h3>

      {cargando && <p>Cargando servicios...</p>}

      {error && <p role="alert">{error}</p>}

      {!cargando && servicios.length === 0 && (
        <p>No hay servicios disponibles.</p>
      )}

      <div className="gestion-lista">
        {servicios.map((servicio) => (
          <article
            className="gestion-tarjeta"
            key={servicio._id}
          >
            <h4>{servicio.nombre}</h4>

            <p>{servicio.categoria}</p>

            <span>
              {servicio.activo ? "Activo" : "Inactivo"}
            </span>
          </article>
        ))}
      </div>

      <h3>Agregar nuevo servicio</h3>

      <form
        className="gestion-formulario"
        onSubmit={manejarEnvio}
      >
        <label htmlFor="nuevo-nombre">
          Nombre del servicio
        </label>

        <input
          id="nuevo-nombre"
          name="nombre"
          type="text"
          maxLength={100}
          value={formulario.nombre}
          onChange={manejarCambio}
          required
        />

        <label htmlFor="nueva-categoria">
          Categoría
        </label>

        <input
          id="nueva-categoria"
          name="categoria"
          type="text"
          maxLength={80}
          value={formulario.categoria}
          onChange={manejarCambio}
          required
        />

        <label htmlFor="nueva-descripcion">
          Descripción
        </label>

        <textarea
          id="nueva-descripcion"
          name="descripcion"
          rows="4"
          maxLength={1000}
          value={formulario.descripcion}
          onChange={manejarCambio}
          required
        />

        <button
          className="boton boton-rojo"
          type="submit"
          disabled={guardando}
        >
          {guardando ? "Guardando..." : "Agregar servicio"}
        </button>

        {mensaje && <p role="status">{mensaje}</p>}
      </form>
    </section>
  );
}

export default GestionServicios;
