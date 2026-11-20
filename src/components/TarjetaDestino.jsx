import { Link } from 'react-router-dom';
import { precargarDestino } from '../api/destinos.js';

// Color de cabecera por región, para distinguir los destinos de un vistazo.
const COLOR_REGION = {
  Sudamérica: 'from-oceano-700 to-oceano-500',
  Norteamérica: 'from-atardecer-600 to-atardecer-400',
  Europa: 'from-indigo-700 to-indigo-500',
  Asia: 'from-rose-700 to-rose-500',
};

export default function TarjetaDestino({ destino }) {
  const { id, ciudad, pais, region, actividades } = destino;
  return (
    <li className="tarjeta flex flex-col overflow-hidden">
      <div className={`bg-gradient-to-r ${COLOR_REGION[region] ?? 'from-slate-700 to-slate-500'} px-4 py-5 text-white`}>
        <p className="text-xs font-semibold uppercase tracking-wider opacity-90">{region}</p>
        <h2 className="font-titulo text-2xl font-bold">{ciudad}</h2>
        <p className="text-sm opacity-90">{pais}</p>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Actividades populares</h3>
          <ul className="mt-1 space-y-1 text-sm">
            {actividades.slice(0, 3).map((a) => (
              <li key={a} className="flex gap-2">
                <span aria-hidden="true" className="text-atardecer-500">•</span>
                {a}
              </li>
            ))}
          </ul>
          {actividades.length > 3 && <p className="mt-1 text-xs text-slate-500">y {actividades.length - 3} más</p>}
        </div>
        <Link
          to={`/destinos/${id}`}
          // Precarga el detalle al pasar el cursor o enfocar: al entrar, ya está en caché.
          onMouseEnter={() => precargarDestino(id)}
          onFocus={() => precargarDestino(id)}
          className="boton-primario mt-auto"
          aria-label={`Ver vuelos y hoteles para ${ciudad}`}
        >
          Ver vuelos y hoteles
        </Link>
      </div>
    </li>
  );
}
