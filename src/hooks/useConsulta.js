import { useCallback, useEffect, useRef, useState } from 'react';
import { cache } from '../api/destinos.js';

// Hook de consulta REST con useState y useEffect.
// - `clave` identifica el dato en la caché; `consultar(opciones)` devuelve la promesa con los datos.
// - Si hay un dato vigente en caché, se muestra al instante y no se consulta la red.
// - Si la consulta falla y existe un dato anterior, se entrega como respaldo (`desactualizado: true`).
export function useConsulta(clave, consultar) {
  const [estado, setEstado] = useState(() => estadoInicial(clave));
  const consultarRef = useRef(consultar);
  consultarRef.current = consultar;
  const turno = useRef(0); // solo la consulta más reciente puede actualizar el estado

  const ejecutar = useCallback(
    (opciones) => {
      const miTurno = ++turno.current;
      const vigente = () => miTurno === turno.current; // falso si cambió la clave, hubo otra consulta o se desmontó
      setEstado((previo) => ({ ...previo, cargando: true, error: null }));

      consultarRef.current(opciones)
        .then((datos) => {
          if (vigente()) setEstado({ datos, cargando: false, error: null, desactualizado: false });
        })
        .catch((error) => {
          if (!vigente()) return;
          const respaldo = cache.leer(clave)?.datos ?? null;
          setEstado({ datos: respaldo, cargando: false, error, desactualizado: respaldo !== null });
        });
    },
    [clave],
  );

  useEffect(() => {
    const guardado = cache.leer(clave);
    if (guardado?.vigente) {
      // Dato vigente en caché: se muestra directo, sin petición ni indicador de carga.
      turno.current += 1;
      setEstado({ datos: guardado.datos, cargando: false, error: null, desactualizado: false });
    } else {
      setEstado({ datos: null, cargando: true, error: null, desactualizado: false });
      ejecutar();
    }
    return () => {
      turno.current += 1; // al desmontar o cambiar de clave, se ignoran las respuestas pendientes
    };
  }, [clave, ejecutar]);

  // Reintento o actualización manual: ignora la caché y vuelve a consultar al servidor.
  const recargar = useCallback(() => ejecutar({ forzar: true }), [ejecutar]);

  return { ...estado, recargar };
}

function estadoInicial(clave) {
  const guardado = cache.leer(clave);
  return guardado?.vigente
    ? { datos: guardado.datos, cargando: false, error: null, desactualizado: false }
    : { datos: null, cargando: true, error: null, desactualizado: false };
}
