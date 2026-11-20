import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useViaje } from '../context/ViajeContext.jsx';

const ENLACES = [
  { to: '/', etiqueta: 'Inicio', end: true },
  { to: '/destinos', etiqueta: 'Destinos' },
  { to: '/mi-viaje', etiqueta: 'Mi viaje' },
];

export default function Navbar() {
  const [abierto, setAbierto] = useState(false);
  const { plan } = useViaje();
  const elegidos = Number(Boolean(plan.vuelo)) + Number(Boolean(plan.hotel));

  const clase = ({ isActive }) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive ? 'bg-white text-oceano-800' : 'text-oceano-50 hover:bg-oceano-600'
    }`;

  return (
    <header className="bg-oceano-700 shadow">
      <nav aria-label="Menú principal" className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between py-3">
          <Link to="/" className="font-titulo text-xl font-bold text-white" onClick={() => setAbierto(false)}>
            Rumbo <span className="text-atardecer-400">Sur</span>
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-white hover:bg-oceano-600 md:hidden"
            aria-expanded={abierto}
            aria-controls="menu-principal"
            onClick={() => setAbierto((a) => !a)}
          >
            <span className="sr-only">{abierto ? 'Cerrar menú' : 'Abrir menú'}</span>
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
              {abierto ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
          <ul id="menu-principal" className="hidden gap-1 md:flex">
            {ENLACES.map((e) => (
              <li key={e.to}>
                <NavLink to={e.to} end={e.end} className={clase}>
                  {e.etiqueta}
                  {e.to === '/mi-viaje' && elegidos > 0 && <Insignia n={elegidos} />}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        {abierto && (
          <ul className="flex flex-col gap-1 pb-3 md:hidden">
            {ENLACES.map((e) => (
              <li key={e.to}>
                <NavLink to={e.to} end={e.end} className={clase} onClick={() => setAbierto(false)}>
                  {e.etiqueta}
                  {e.to === '/mi-viaje' && elegidos > 0 && <Insignia n={elegidos} />}
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
}

function Insignia({ n }) {
  return (
    <span className="rounded-full bg-atardecer-500 px-2 text-xs font-bold text-white" aria-label={`${n} elegidos`}>
      {n}
    </span>
  );
}
