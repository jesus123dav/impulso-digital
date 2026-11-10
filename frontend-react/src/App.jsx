
import { useEffect, useState } from "react";
import { obtenerServicios } from "./api";
import "./App.css";


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
  return (
    <section id="contacto" className="seccion contacto">
      <p className="etiqueta">HABLEMOS DE TU NEGOCIO</p>

      <h2>¿Listo para comenzar tu transformación digital?</h2>

      <p>
        Cuéntanos sobre tu emprendimiento y descubre
        cómo podemos ayudarte a mejorar su presencia
        en internet.
      </p>

      <a
        className="boton boton-rojo"
        href="https://wa.me/3127223859"
        target="_blank"
        rel="noopener noreferrer"
      >
        Contactar por WhatsApp
      </a>
    </section>
  );
}

function App() {
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
        <p>© 2026 Impulso Digital. Todos los derechos reservados.</p>
        <p>Proyecto de Jóvenes Creativos.</p>
      </footer>
    </>
  );
}

export default App;
