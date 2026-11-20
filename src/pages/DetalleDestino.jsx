import { useCallback, useState } from 'react';
import { Link, NavLink, Outlet, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { claveDestino, obtenerDestino } from '../api/destinos.js';
import { OPCIONES_DE_VIAJE } from '../apollo/operaciones.js';
import { errorDesdeApollo } from '../apollo/errores.js';
import Cargando from '../components/Cargando.jsx';
import MensajeError from '../components/MensajeError.jsx';
import { useConsulta } from '../hooks/useConsulta.js';

// Detalle de un destino: la ficha viene por REST y los vuelos/hoteles por GraphQL.
// Las pestañas Vuelos y Hoteles son rutas hijas que reciben los datos por el contexto del Outlet.
export default function DetalleDestino() {
  const { id } = useParams();
  const consultar = useCallback((opciones) => obtenerDestino(id, opciones), [id]);
  const rest = useConsulta(claveDestino(id), consultar);
  const destino = rest.datos;

  const [orden, setOrden] = useState('PRECIO_ASC');
  const [estrellasMinimas, setEstrellasMinimas] = useState(1);

  // Una sola query GraphQL para vuelos y hoteles; se omite hasta tener la ficha REST válida.
  const gql = useQuery(OPCIONES_DE_VIAJE, {
    variables: { destinoId: id, orden, estrellasMinimas },
    skip: !destino,
    notifyOnNetworkStatusChange: true,
  });
  const errorGql = errorDesdeApollo(gql.error);

  const pestana = ({ isActive }) =>
    `rounded-t-lg border-b-2 px-4 py-2 text-sm font-semibold ${isActive ? 'border-atardecer-500 text-oceano-800' : 'border-transparent text-slate-500 hover:text-oceano-700'}`;

  return (
    <section aria-busy={rest.cargando || gql.loading}>
      <Link to="/destinos" className="text-sm font-medium text-oceano-700 hover:underline">
        ← Volver a destinos
      </Link>

      {rest.error && (
        <div className="mt-4">
          <MensajeError error={rest.error} onReintentar={rest.recargar} conRespaldo={rest.desactualizado} alternativa={{ to: '/destinos', etiqueta: 'Ver todos los destinos' }} />
        </div>
      )}

      {rest.cargando && !destino && <Cargando mensaje="Cargando destino…" />}

      {destino && (
        <>
          <header className="tarjeta mt-4 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-atardecer-600">
              {destino.region} · {destino.pais}
            </p>
            <h1 className="font-titulo text-3xl font-bold text-oceano-800">{destino.ciudad}</h1>
            <p className="mt-2 text-slate-700">{destino.descripcion}</p>
            <h2 className="mt-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Actividades populares</h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {destino.actividades.map((a) => (
                <li key={a} className="rounded-full bg-arena-100 px-3 py-1 text-sm">
                  {a}
                </li>
              ))}
            </ul>
          </header>

          <nav aria-label="Opciones del destino" className="mt-6 flex gap-2 border-b border-arena-200">
            <NavLink to="vuelos" className={pestana}>
              Vuelos{gql.data ? ` (${gql.data.vuelos.length})` : ''}
            </NavLink>
            <NavLink to="hoteles" className={pestana}>
              Hoteles{gql.data ? ` (${gql.data.hoteles.length})` : ''}
            </NavLink>
          </nav>

          <div className="mt-4">
            {errorGql && (
              <div className="mb-4">
                <MensajeError error={errorGql} onReintentar={() => gql.refetch()} conRespaldo={Boolean(gql.data)} />
              </div>
            )}
            {gql.loading && !gql.data && <Cargando mensaje="Consultando vuelos y hoteles…" />}
            {gql.data && (
              <Outlet context={{ destino, datos: gql.data, actualizando: gql.loading, orden, setOrden, estrellasMinimas, setEstrellasMinimas }} />
            )}
          </div>
        </>
      )}
    </section>
  );
}
