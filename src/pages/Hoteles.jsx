import { useOutletContext } from 'react-router-dom';
import TarjetaHotel from '../components/TarjetaHotel.jsx';
import { useViaje } from '../context/ViajeContext.jsx';

export default function Hoteles() {
  const { destino, datos, actualizando, estrellasMinimas, setEstrellasMinimas } = useOutletContext();
  const { plan, elegirHotel } = useViaje();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">Hoteles en {destino.ciudad}</h2>
        <label className="flex items-center gap-2 text-sm">
          <span>Categoría mínima</span>
          <select className="campo w-auto" value={estrellasMinimas} onChange={(e) => setEstrellasMinimas(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n === 1 ? 'Todas' : `${n} estrellas o más`}
              </option>
            ))}
          </select>
        </label>
      </div>
      {datos.hoteles.length === 0 ? (
        <p className="tarjeta mt-4 p-6 text-center text-slate-600">
          {estrellasMinimas > 1 ? 'No hay hoteles con esa categoría. Prueba con una categoría menor.' : 'Aún no hay hoteles disponibles en este destino.'}
        </p>
      ) : (
        <ul className={`mt-4 grid gap-4 lg:grid-cols-2 ${actualizando ? 'opacity-60' : ''}`}>
          {datos.hoteles.map((h) => (
            <TarjetaHotel key={h.id} hotel={h} elegido={plan.hotel?.id === h.id} onElegir={(hotel) => elegirHotel(destino, hotel)} />
          ))}
        </ul>
      )}
    </div>
  );
}
