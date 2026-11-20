import { useMemo, useState } from 'react';
import { CLAVE_DESTINOS, obtenerDestinos } from '../api/destinos.js';
import Cargando from '../components/Cargando.jsx';
import MensajeError from '../components/MensajeError.jsx';
import TarjetaDestino from '../components/TarjetaDestino.jsx';
import { useConsulta } from '../hooks/useConsulta.js';

// Listado de destinos: datos por REST (GET /api/destinos), filtros en el cliente sin nuevas peticiones.
export default function Destinos() {
  const { datos: destinos, cargando, error, desactualizado, recargar } = useConsulta(CLAVE_DESTINOS, obtenerDestinos);
  const [region, setRegion] = useState('todas');
  const [busqueda, setBusqueda] = useState('');

  const regiones = useMemo(() => [...new Set((destinos ?? []).map((d) => d.region))].sort(), [destinos]);

  const visibles = useMemo(() => {
    const texto = busqueda.trim().toLocaleLowerCase('es');
    return (destinos ?? []).filter(
      (d) =>
        (region === 'todas' || d.region === region) &&
        (!texto || `${d.ciudad} ${d.pais}`.toLocaleLowerCase('es').includes(texto)),
    );
  }, [destinos, region, busqueda]);

  return (
    <section aria-busy={cargando}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-titulo text-3xl font-bold text-oceano-800">Destinos</h1>
          <p className="text-slate-600">Elige un destino para ver sus vuelos y hoteles.</p>
        </div>
        {destinos && (
          <button type="button" onClick={recargar} disabled={cargando} className="boton-secundario">
            {cargando ? 'Actualizando…' : 'Actualizar'}
          </button>
        )}
      </div>

      {destinos && (
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <label className="block">
            <span className="sr-only">Buscar destino</span>
            <input type="search" className="campo" placeholder="Buscar por ciudad o país" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <span className="font-medium">Región</span>
            <select className="campo w-auto" value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="todas">Todas</option>
              {regiones.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {error && (
        <div className="mt-4">
          <MensajeError error={error} onReintentar={recargar} conRespaldo={desactualizado} alternativa={{ to: '/', etiqueta: 'Volver al inicio' }} />
        </div>
      )}

      {cargando && !destinos && <Cargando mensaje="Cargando destinos…" />}

      {destinos && visibles.length === 0 && (
        <p className="tarjeta mt-6 p-6 text-center text-slate-600">No hay destinos que coincidan con tu búsqueda.</p>
      )}

      {visibles.length > 0 && (
        <ul className={`mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${cargando ? 'opacity-60' : ''}`}>
          {visibles.map((d) => (
            <TarjetaDestino key={d.id} destino={d} />
          ))}
        </ul>
      )}
    </section>
  );
}
