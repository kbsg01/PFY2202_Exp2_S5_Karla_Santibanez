import { useOutletContext } from 'react-router-dom';
import TarjetaVuelo from '../components/TarjetaVuelo.jsx';
import { useViaje } from '../context/ViajeContext.jsx';

export default function Vuelos() {
  const { destino, datos, actualizando, orden, setOrden } = useOutletContext();
  const { plan, elegirVuelo } = useViaje();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">Vuelos desde Santiago a {destino.ciudad}</h2>
        <label className="flex items-center gap-2 text-sm">
          <span>Ordenar por</span>
          <select className="campo w-auto" value={orden} onChange={(e) => setOrden(e.target.value)}>
            <option value="PRECIO_ASC">Menor precio</option>
            <option value="PRECIO_DESC">Mayor precio</option>
          </select>
        </label>
      </div>
      {datos.vuelos.length === 0 ? (
        <p className="tarjeta mt-4 p-6 text-center text-slate-600">No hay vuelos programados para este destino.</p>
      ) : (
        <ul className={`mt-4 grid gap-4 lg:grid-cols-2 ${actualizando ? 'opacity-60' : ''}`}>
          {datos.vuelos.map((v) => (
            <TarjetaVuelo key={v.id} vuelo={v} elegido={plan.vuelo?.id === v.id} onElegir={(vuelo) => elegirVuelo(destino, vuelo)} />
          ))}
        </ul>
      )}
    </div>
  );
}
