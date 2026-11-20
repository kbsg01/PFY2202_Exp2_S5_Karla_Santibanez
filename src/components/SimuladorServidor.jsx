import { useState } from 'react';
import { useApolloClient } from '@apollo/client/react';
import { cache } from '../api/destinos.js';
import { ESCENARIOS, getEscenario, setEscenario } from '../mocks/escenario.js';

// Panel de pruebas del backend mock: fuerza demoras y errores para verificar
// los indicadores de carga y el manejo de errores de REST y GraphQL.
export default function SimuladorServidor() {
  const [escenario, setValor] = useState(getEscenario);
  const [aviso, setAviso] = useState('');
  const apollo = useApolloClient();

  const cambiar = (evento) => {
    setEscenario(evento.target.value);
    setValor(getEscenario());
    setAviso('');
  };

  const vaciarCache = async () => {
    cache.limpiar();
    await apollo.clearStore(); // borra la caché de GraphQL sin volver a consultar
    setAviso('Cachés vaciadas: la próxima visita a cada página consultará al servidor.');
  };

  return (
    <footer className="border-t border-arena-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 text-sm text-slate-700 sm:px-6">
        <label htmlFor="escenario" className="font-semibold">
          Simulador del servidor (mock)
        </label>
        <select id="escenario" value={escenario} onChange={cambiar} className="campo w-auto py-1">
          {ESCENARIOS.map(({ id, etiqueta }) => (
            <option key={id} value={id}>
              {etiqueta}
            </option>
          ))}
        </select>
        <button type="button" onClick={vaciarCache} className="rounded-lg border border-slate-400 px-2 py-1 font-medium hover:bg-slate-100">
          Vaciar caché
        </button>
        <span role="status" className="text-slate-600">
          {aviso}
        </span>
      </div>
    </footer>
  );
}
