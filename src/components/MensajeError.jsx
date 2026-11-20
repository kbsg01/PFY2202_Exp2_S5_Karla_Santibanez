import { Link } from 'react-router-dom';
import { TIPO_ERROR } from '../api/errores.js';

// Qué pasó (título) y qué puede hacer el usuario (sugerencia), según el tipo de error.
const TEXTOS = {
  [TIPO_ERROR.RED]: { titulo: 'Sin conexión con el servidor', sugerencia: 'Comprueba tu conexión y vuelve a intentarlo.' },
  [TIPO_ERROR.TIEMPO]: { titulo: 'El servidor no respondió a tiempo', sugerencia: 'Puede estar con mucha carga. Inténtalo otra vez en unos segundos.' },
  [TIPO_ERROR.SERVIDOR]: { titulo: 'El servidor tuvo un problema', sugerencia: 'No es un error tuyo. Vuelve a intentarlo en unos segundos.' },
  [TIPO_ERROR.RESPUESTA]: { titulo: 'Respuesta inesperada del servidor', sugerencia: 'Vuelve a intentarlo. Si el problema sigue, avísanos.' },
  [TIPO_ERROR.GRAPHQL]: { titulo: 'No pudimos consultar la disponibilidad', sugerencia: 'El servicio de vuelos y hoteles informó un problema. Vuelve a intentarlo.' },
  [TIPO_ERROR.NO_ENCONTRADO]: { titulo: 'No encontramos este destino', sugerencia: 'Puede que el enlace esté mal escrito o que el destino ya no esté disponible.' },
  [TIPO_ERROR.SOLICITUD]: { titulo: 'No pudimos procesar la solicitud', sugerencia: 'Vuelve al listado de destinos.' },
};

const GENERICO = { titulo: 'Ocurrió un error inesperado', sugerencia: 'Vuelve a intentarlo.' };

// Mensaje de error con acciones: reintentar (si el fallo puede ser transitorio) y una ruta alternativa.
// `conRespaldo` indica que debajo se muestran datos guardados de una consulta anterior.
export default function MensajeError({ error, onReintentar, alternativa, conRespaldo = false }) {
  const { titulo, sugerencia } = TEXTOS[error?.tipo] ?? GENERICO;
  const puedeReintentar = onReintentar && (error?.reintentable ?? true);

  return (
    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
      <p className="font-semibold">
        {titulo}
        {error?.status ? <span className="font-normal"> (código {error.status})</span> : null}
      </p>
      <p className="mt-1 text-sm">{sugerencia}</p>
      {error?.detalles?.length > 0 && (
        <ul className="mt-1 list-inside list-disc text-sm">
          {error.detalles.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      )}
      {conRespaldo && <p className="mt-1 text-sm">Mientras tanto, te mostramos la última información que alcanzamos a cargar.</p>}
      <div className="mt-3 flex flex-wrap gap-3">
        {puedeReintentar && (
          <button type="button" onClick={onReintentar} className="rounded-lg bg-red-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-800">
            Reintentar
          </button>
        )}
        {alternativa && (
          <Link to={alternativa.to} className="rounded-lg border border-red-700 px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-100">
            {alternativa.etiqueta}
          </Link>
        )}
      </div>
    </div>
  );
}
