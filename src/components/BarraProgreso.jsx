import { useSyncExternalStore } from 'react';
import { getEnCurso, suscribir } from '../api/actividad.js';

// Barra superior visible mientras exista al menos una petición REST o GraphQL en curso.
export default function BarraProgreso() {
  const enCurso = useSyncExternalStore(suscribir, getEnCurso);
  const activa = enCurso > 0;

  return (
    <div className="h-1 w-full overflow-hidden bg-oceano-900" aria-hidden="true" data-testid="barra-progreso" data-activa={activa}>
      <div className={`h-full w-1/3 bg-atardecer-500 ${activa ? 'animate-progreso motion-reduce:animate-none' : 'hidden'}`} />
    </div>
  );
}
