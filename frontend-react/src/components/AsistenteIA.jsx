
import { useState } from "react";
import { consultarIA } from "../api";

function AsistenteIA() {
  const [abierto, setAbierto] = useState(false);
  const [pregunta, setPregunta] = useState("");
  const [enviando, setEnviando] = useState(false);

  const [mensajes, setMensajes] = useState([
    {
      rol: "asistente",
      contenido:
        "¡Hola! Soy Asistente Impulso. Estoy aquí para ayudarte a encontrar soluciones digitales para tu negocio. ¿En qué puedo ayudarte?"
    }
  ]);

  async function enviarMensaje(event) {
    event.preventDefault();

    const texto = pregunta.trim();

    if (texto.length < 3 || enviando) {
      return;
    }

    // Mostrar el mensaje del visitante
    setMensajes((anteriores) => [
      ...anteriores,
      {
        rol: "usuario",
        contenido: texto
      }
    ]);

    setPregunta("");
    setEnviando(true);

    try {
      // Consultar la inteligencia artificial
      const resultado = await consultarIA(texto);

      setMensajes((anteriores) => [
        ...anteriores,
        {
          rol: "asistente",
          contenido: resultado.respuesta
        }
      ]);

    } catch (error) {
      setMensajes((anteriores) => [
        ...anteriores,
        {
          rol: "error",
          contenido:
            error.message ||
            "No pude responder en este momento."
        }
      ]);

    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="asistente-flotante">

      {abierto && (
        <section
          className="asistente-panel"
          aria-label="Chat de Asistente Impulso"
        >
          <header className="asistente-encabezado">
            <div>
              <h3>Asistente Impulso</h3>
              <span>Tu orientación digital</span>
            </div>

            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar chat"
            >
              ×
            </button>
          </header>

          <div
            className="asistente-mensajes"
            aria-live="polite"
          >
            {mensajes.map((mensaje, indice) => (
              <div
                key={indice}
                className={`asistente-mensaje ${mensaje.rol}`}
>
                {mensaje.contenido.replace(/\*\*/g, "")}
             </div>
            ))}

            {enviando && (
              <p className="asistente-escribiendo">
                Asistente Impulso está respondiendo...
              </p>
            )}
          </div>

          <form
            className="asistente-formulario"
            onSubmit={enviarMensaje}
          >
            <label htmlFor="pregunta-ia">
              Escribe tu pregunta
            </label>

            <textarea
              id="pregunta-ia"
              value={pregunta}
              onChange={(event) =>
                setPregunta(event.target.value)
              }
              placeholder="¿Cómo puedo mejorar mi negocio?"
              rows="2"
              minLength={3}
              maxLength={500}
              required
            />

            <button
              type="submit"
              disabled={enviando || pregunta.trim().length < 3}
            >
              {enviando ? "Consultando..." : "Enviar"}
            </button>
          </form>

          <small className="asistente-aviso">
            No compartas contraseñas ni datos privados.
          </small>
        </section>
      )}

      <button
        type="button"
        className="asistente-abrir"
        onClick={() => setAbierto((actual) => !actual)}
        aria-expanded={abierto}
      >
        {abierto ? "Cerrar chat ×" : "💬 Asistente Impulso"}
      </button>

    </div>
  );
}

export default AsistenteIA;
