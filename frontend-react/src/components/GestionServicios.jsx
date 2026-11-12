
import { useEffect, useState } from "react";
import {
  obtenerServiciosAdmin,
  crearServicioAdmin,
  editarServicioAdmin,
  cambiarEstadoServicioAdmin
} from "../api";

const formularioVacio = {
  nombre: "",
  categoria: "",
  descripcion: ""
};

function GestionServicios({ token }) {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [procesandoId, setProcesandoId] = useState(null);

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [formulario, setFormulario] = useState(formularioVacio);
  const [editandoId, setEditandoId] = useState(null);
  const [edicion, setEdicion] = useState(formularioVacio);

  // Consultar los servicios de MongoDB
  useEffect(() => {
    let activo = true;

    async function cargarServicios() {
      try {
        const datos = await obtenerServiciosAdmin(token);

        if (activo) {
          setServicios(datos);
        }
      } catch (error) {
        if (activo) setError(error.message);
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargarServicios();

    return () => {
      activo = false;
    };
  }, [token]);

  // Actualizar los campos del formulario nuevo
  function manejarCambio(event) {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value
    }));
  }

  // Agregar un servicio
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

      setServicios((anteriores) =>
        [...anteriores, resultado.servicio].sort(
          (a, b) => a.nombre.localeCompare(b.nombre)
        )
      );

      setFormulario(formularioVacio);
      setMensaje("Servicio creado correctamente");
    } catch (error) {
      setError(error.message);
    } finally {
      setGuardando(false);
    }
  }

  // Seleccionar un servicio para editar
  function iniciarEdicion(servicio) {
    setError("");
    setMensaje("");
    setEditandoId(servicio._id);

    setEdicion({
      nombre: servicio.nombre,
      categoria: servicio.categoria,
      descripcion: servicio.descripcion
    });
  }

  // Guardar los cambios en MongoDB
  async function guardarEdicion(event, id) {
    event.preventDefault();

    setProcesandoId(id);
    setError("");
    setMensaje("");

    try {
      const resultado = await editarServicioAdmin(
        token,
        id,
        edicion
      );

      setServicios((anteriores) =>
        anteriores.map((servicio) =>
          servicio._id === id
            ? resultado.servicio
            : servicio
        )
      );

      setEditandoId(null);
      setMensaje("Servicio actualizado correctamente");
    } catch (error) {
      setError(error.message);
    } finally {
      setProcesandoId(null);
    }
  }

  // Activar o desactivar un servicio
  async function cambiarEstado(servicio) {
    setProcesandoId(servicio._id);
    setError("");
    setMensaje("");

    try {
      const nuevoEstado = !servicio.activo;

      const resultado = await cambiarEstadoServicioAdmin(
        token,
        servicio._id,
        nuevoEstado
      );

      setServicios((anteriores) =>
        anteriores.map((item) =>
          item._id === servicio._id
            ? resultado.servicio
            : item
        )
      );

      setMensaje(resultado.mensaje);
    } catch (error) {
      setError(error.message);
    } finally {
      setProcesandoId(null);
    }
  }

  return (
    <section className="gestion-servicios">
      <h2>Administrar servicios</h2>

      <p>
        Consulta, agrega, edita y administra
        los servicios de Impulso Digital.
      </p>

      {error && <p role="alert">{error}</p>}
      {mensaje && <p role="status">{mensaje}</p>}

      <h3>Servicios registrados</h3>

      {cargando && <p>Cargando servicios...</p>}

      {!cargando && servicios.length === 0 && (
        <p>No hay servicios registrados.</p>
      )}

      <div className="gestion-lista">
        {servicios.map((servicio) => (
          <article
            className="gestion-tarjeta"
            key={servicio._id}
          >
            {editandoId === servicio._id ? (
              <form
                className="gestion-edicion"
                onSubmit={(event) =>
                  guardarEdicion(event, servicio._id)
                }
              >
                <h4>Editar servicio</h4>

                <label>Nombre</label>
                <input
                  name="nombre"
                  value={edicion.nombre}
                  maxLength={100}
                  onChange={(e) =>
                    setEdicion({
                      ...edicion,
                      nombre: e.target.value
                    })
                  }
                  required
                />

                <label>Categoría</label>
                <input
                  name="categoria"
                  value={edicion.categoria}
                  maxLength={80}
                  onChange={(e) =>
                    setEdicion({
                      ...edicion,
                      categoria: e.target.value
                    })
                  }
                  required
                />

                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  value={edicion.descripcion}
                  maxLength={1000}
                  rows="4"
                  onChange={(e) =>
                    setEdicion({
                      ...edicion,
                      descripcion: e.target.value
                    })
                  }
                  required
                />

                <div className="gestion-acciones">
                  <button
                    type="submit"
                    disabled={procesandoId === servicio._id}
                  >
                    Guardar cambios
                  </button>

                  <button
                    type="button"
                    disabled={procesandoId === servicio._id}
                    onClick={() => setEditandoId(null)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h4>{servicio.nombre}</h4>

                <p>{servicio.categoria}</p>

                <span
                  className={
                    servicio.activo
                      ? "estado-activo"
                      : "estado-inactivo"
                  }
                >
                  {servicio.activo ? "Activo" : "Inactivo"}
                </span>

                <div className="gestion-acciones">
                  <button
                    type="button"
                    disabled={procesandoId !== null}
                    onClick={() => iniciarEdicion(servicio)}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    disabled={procesandoId !== null}
                    onClick={() => cambiarEstado(servicio)}
                  >
                    {servicio.activo
                      ? "Desactivar"
                      : "Activar"}
                  </button>
                </div>
              </>
            )}
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
          {guardando
            ? "Guardando..."
            : "Agregar servicio"}
        </button>
      </form>
    </section>
  );
}

export default GestionServicios;
