
import { useEffect, useState } from "react";
import { obtenerServicios, enviarSolicitud } from "./api";
import "./App.css";
import LoginAdmin from "./components/LoginAdmin";


function Catalogo() {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Consultar la API cuando se carga el componente
  useEffect(() => {
    async function cargarServicios() {
      try {
        const datos = await obtenerServicios();
        setServicios(datos);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    }

    cargarServicios();
  }, []);

  return (
    <section id="servicios" className="seccion">

      <p className="etiqueta">NUESTRO CATÁLOGO</p>

      <h2>Servicios para impulsar tu negocio</h2>

      <p className="texto-seccion">
        Conoce las soluciones que ofrecemos para ayudar
        a tu emprendimiento a crecer en el entorno digital.
      </p>

      {cargando && <p>Cargando nuestros servicios...</p>}

      {error && <p>{error}</p>}

      {!cargando && !error && servicios.length === 0 && (
        <p>Actualmente no hay servicios disponibles.</p>
      )}

      <div className="catalogo">
        {servicios.map((servicio) => (
          <article className="tarjeta" key={servicio._id}>

            <h3>{servicio.nombre}</h3>

            <p>{servicio.descripcion}</p>

            <a href="#contacto">
              Solicitar información →
            </a>

          </article>
        ))}
      </div>

    </section>
  );
}

function Encabezado() {
  return (
    <header className="encabezado">
      <a className="marca" href="#inicio">
        Impulso <span>Digital</span>
      </a>

      <nav aria-label="Navegación principal">
        <a href="#inicio">Inicio</a>
        <a href="#nosotros">Nosotros</a>
        <a href="#servicios">Servicios</a>
        <a href="#contacto">Contacto</a>
      </nav>
    </header>
  );
}

function Portada() {
  return (
    <section id="inicio" className="portada">
      <Encabezado />

      <div className="portada-contenido">
        <p className="etiqueta">IMPULSO DIGITAL</p>

        <h1>
          Haz crecer tu negocio
          <span> en el mundo digital.</span>
        </h1>

        <p>
          Ayudamos a pequeños negocios y emprendedores
          a construir su presencia en internet y
          conectar con nuevos clientes.
        </p>

        <div className="botones">
          <a className="boton boton-rojo" href="#servicios">
            Explorar servicios
          </a>

          <a className="boton boton-borde" href="#contacto">
            Solicitar asesoría
          </a>
        </div>
      </div>
    </section>
  );
}

function Nosotros() {
  return (
    <section id="nosotros" className="seccion">
      <p className="etiqueta">QUIÉNES SOMOS</p>

      <h2>La transformación digital también es para los pequeños negocios.</h2>

      <p className="texto-seccion">
        En Impulso Digital creemos que un emprendimiento
        no necesita ser una gran empresa para tener
        presencia en internet. Nuestro propósito es
        acercar las herramientas digitales a negocios
        que desean crecer y ser encontrados por más personas.
      </p>
    </section>
  );
}


function Proceso() {
  return (
    <section className="seccion">
      <p className="etiqueta">CÓMO TRABAJAMOS</p>

      <h2>Tu crecimiento comienza con tres pasos</h2>

      <div className="pasos">
        <article>
          <span>01</span>
          <h3>Conocemos tu negocio</h3>
          <p>
            Escuchamos tus necesidades y conocemos
            los objetivos de tu emprendimiento.
          </p>
        </article>

        <article>
          <span>02</span>
          <h3>Proponemos una solución</h3>
          <p>
            Identificamos las herramientas digitales
            que mejor se adaptan a tu negocio.
          </p>
        </article>

        <article>
          <span>03</span>
          <h3>Impulsamos tu presencia</h3>
          <p>
            Te acompañamos en la implementación
            de los servicios seleccionados.
          </p>
        </article>
      </div>
    </section>
  );
}

function Contacto() {
  const [formulario, setFormulario] = useState({
    nombre: "",
    negocio: "",
    correo: "",
    telefono: "",
    servicio: "",
    mensaje: ""
  });

  const [enviando, setEnviando] = useState(false);
  const [respuesta, setRespuesta] = useState({
    tipo: "",
    texto: ""
  });

  // Actualizar los datos del formulario
  const manejarCambio = (event) => {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value
    }));
  };

  // Enviar los datos al backend
  const manejarEnvio = async (event) => {
    event.preventDefault();

    setEnviando(true);
    setRespuesta({ tipo: "", texto: "" });

    try {
      const resultado = await enviarSolicitud(formulario);

      setRespuesta({
        tipo: "exito",
        texto: resultado.mensaje
      });

      setFormulario({
        nombre: "",
        negocio: "",
        correo: "",
        telefono: "",
        servicio: "",
        mensaje: ""
      });

    } catch (error) {
      setRespuesta({
        tipo: "error",
        texto: error.message
      });

    } finally {
      setEnviando(false);
    }
  };

  return (
    <section id="contacto" className="seccion contacto">

      <p className="etiqueta">HABLEMOS DE TU NEGOCIO</p>

      <h2>
        ¿Listo para comenzar tu transformación digital?
      </h2>

      <p>
        Cuéntanos sobre tu emprendimiento y descubre
        cómo podemos ayudarte a mejorar su presencia
        en internet.
      </p>

      <form
        className="formulario-contacto"
        onSubmit={manejarEnvio}
      >

        <div className="campo">
          <label htmlFor="nombre">Nombre completo *</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={formulario.nombre}
            onChange={manejarCambio}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="negocio">Nombre del negocio</label>
          <input
            id="negocio"
            name="negocio"
            type="text"
            value={formulario.negocio}
            onChange={manejarCambio}
          />
        </div>

        <div className="campo">
          <label htmlFor="correo">Correo electrónico *</label>
          <input
            id="correo"
            name="correo"
            type="email"
            value={formulario.correo}
            onChange={manejarCambio}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="telefono">Teléfono</label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            value={formulario.telefono}
            onChange={manejarCambio}
          />
        </div>

        <div className="campo campo-completo">
          <label htmlFor="servicio">Servicio de interés *</label>

          <select
            id="servicio"
            name="servicio"
            value={formulario.servicio}
            onChange={manejarCambio}
            required
          >
            <option value="">Selecciona un servicio</option>
            <option value="Gestión de redes sociales">
              Gestión de redes sociales
            </option>
            <option value="Presencia digital">
              Presencia digital
            </option>
            <option value="Google Maps">
              Google Maps
            </option>
            <option value="Diseño de páginas web">
              Diseño de páginas web
            </option>
            <option value="Asesoría digital">
              Asesoría digital
            </option>
          </select>
        </div>

        <div className="campo campo-completo">
          <label htmlFor="mensaje">¿Cómo podemos ayudarte? *</label>

          <textarea
            id="mensaje"
            name="mensaje"
            rows="5"
            value={formulario.mensaje}
            onChange={manejarCambio}
            required
          />
        </div>

        <button
          className="boton boton-rojo"
          type="submit"
          disabled={enviando}
        >
          {enviando ? "Enviando..." : "Enviar solicitud"}
        </button>

        {respuesta.texto && (
          <p
            className={`mensaje-formulario ${respuesta.tipo}`}
            role="status"
          >
            {respuesta.texto}
          </p>
        )}

      </form>

    </section>
  );
}


function App() {
  const [verAdministrador, setVerAdministrador] = useState(false);

  if (verAdministrador) {
    return (
      <LoginAdmin
        onVolver={() => setVerAdministrador(false)}
      />
    );
  }

  return (
    <>
      <Portada />

      <main>
        <Nosotros />
        <Catalogo />
        <Proceso />
        <Contacto />
      </main>

      <footer>
        <p>
          © 2026 Impulso Digital.
          Todos los derechos reservados.
        </p>

        <p>Proyecto de Jóvenes Creativos.</p>

        <button
          type="button"
          className="enlace-admin"
          onClick={() => setVerAdministrador(true)}
        >
          Acceso administrador
        </button>
      </footer>
    </>
  );
}

export default App;
