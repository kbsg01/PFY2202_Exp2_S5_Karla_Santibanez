import Estrellas from './Estrellas.jsx';
import EstadoDisponibilidad from './EstadoDisponibilidad.jsx';
import { formatearFecha, formatearPrecio } from '../utils/formato.js';

export default function TarjetaHotel({ hotel, elegido, onElegir }) {
  return (
    <li className={`tarjeta p-4 ${elegido ? 'ring-2 ring-atardecer-500' : ''}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-semibold">{hotel.nombre}</p>
          <p className="text-sm text-slate-600">
            <Estrellas cantidad={hotel.estrellas} /> · {hotel.barrio}
          </p>
        </div>
        <EstadoDisponibilidad cupos={hotel.habitacionesDisponibles} unidad="habitaciones" />
      </div>
      <p className="mt-2 text-sm text-slate-600">
        Disponible del {formatearFecha(hotel.disponibleDesde)} al {formatearFecha(hotel.disponibleHasta)}
      </p>
      <ul className="mt-2 flex flex-wrap gap-1" aria-label="Servicios">
        {hotel.servicios.map((s) => (
          <li key={s} className="rounded-full bg-oceano-50 px-2 py-0.5 text-xs text-oceano-800">
            {s}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <p>
          <span className="text-xl font-bold text-oceano-700">{formatearPrecio(hotel.precioNoche)}</span>
          <span className="text-sm text-slate-500"> por noche (habitación doble)</span>
        </p>
        <button type="button" className={elegido ? 'boton-secundario' : 'boton-primario'} disabled={!hotel.disponible} onClick={() => onElegir(hotel)}>
          {!hotel.disponible ? 'Sin habitaciones' : elegido ? 'Elegido ✓' : 'Elegir hotel'}
        </button>
      </div>
    </li>
  );
}
