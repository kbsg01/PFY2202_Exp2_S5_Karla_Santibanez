import EstadoDisponibilidad from './EstadoDisponibilidad.jsx';
import { formatearFecha, formatearPrecio, textoEscalas } from '../utils/formato.js';

export default function TarjetaVuelo({ vuelo, elegido, onElegir }) {
  return (
    <li className={`tarjeta p-4 ${elegido ? 'ring-2 ring-atardecer-500' : ''}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-semibold">
            {vuelo.aerolinea} <span className="font-normal text-slate-500">· {vuelo.numero}</span>
          </p>
          <p className="text-sm text-slate-600">
            Sale {formatearFecha(vuelo.fechaSalida)} desde {vuelo.origen}
          </p>
        </div>
        <EstadoDisponibilidad cupos={vuelo.asientosDisponibles} unidad="asientos" />
      </div>
      <div className="mt-3 grid grid-cols-3 items-center gap-2 text-center">
        <div>
          <p className="text-lg font-bold">{vuelo.horaSalida}</p>
          <p className="text-xs text-slate-500">Salida</p>
        </div>
        <div className="text-xs text-slate-500">
          <p>{vuelo.duracion}</p>
          <p className="border-t border-dashed border-slate-300 pt-1">{textoEscalas(vuelo.escalas)}</p>
        </div>
        <div>
          <p className="text-lg font-bold">{vuelo.horaLlegada}</p>
          <p className="text-xs text-slate-500">Llegada (hora local)</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <p>
          <span className="text-xl font-bold text-oceano-700">{formatearPrecio(vuelo.precio)}</span>
          <span className="text-sm text-slate-500"> por persona</span>
        </p>
        <button type="button" className={elegido ? 'boton-secundario' : 'boton-primario'} disabled={!vuelo.disponible} onClick={() => onElegir(vuelo)}>
          {!vuelo.disponible ? 'Sin asientos' : elegido ? 'Elegido ✓' : 'Elegir vuelo'}
        </button>
      </div>
    </li>
  );
}
