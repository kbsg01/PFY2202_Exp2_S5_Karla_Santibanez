import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { LIMITES } from '../utils/viaje.js';
import { limitarEntero } from '../utils/validacion.js';

// Estado global del plan de viaje: destino, vuelo y hotel elegidos, pasajeros y noches.
// Se guarda en localStorage para no perderlo al recargar.
const ViajeContext = createContext(null);
const CLAVE = 'viajes:plan';
const PLAN_VACIO = { destino: null, vuelo: null, hotel: null, pasajeros: 1, noches: 5 };

function leerPlan() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE));
    return guardado && typeof guardado === 'object' ? { ...PLAN_VACIO, ...guardado } : PLAN_VACIO;
  } catch {
    return PLAN_VACIO; // almacenamiento no disponible o dato corrupto
  }
}

export function ViajeProvider({ children }) {
  const [plan, setPlan] = useState(leerPlan);

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(plan));
    } catch {
      /* sin persistencia: el plan dura mientras la pestaña esté abierta */
    }
  }, [plan]);

  // Al cambiar de destino se descartan el vuelo y el hotel del destino anterior.
  const elegirVuelo = useCallback((destino, vuelo) => {
    setPlan((p) => ({ ...p, destino, vuelo, hotel: p.destino?.id === destino.id ? p.hotel : null }));
  }, []);

  const elegirHotel = useCallback((destino, hotel) => {
    setPlan((p) => ({ ...p, destino, hotel, vuelo: p.destino?.id === destino.id ? p.vuelo : null }));
  }, []);

  const quitar = useCallback((campo) => setPlan((p) => ({ ...p, [campo]: null })), []);

  const ajustar = useCallback((campo, valor) => {
    const [min, max] = LIMITES[campo];
    setPlan((p) => ({ ...p, [campo]: limitarEntero(valor, min, max) }));
  }, []);

  const actualizarCupos = useCallback((cambios) => setPlan((p) => ({
    ...p,
    vuelo: p.vuelo && cambios.vuelo ? { ...p.vuelo, ...cambios.vuelo } : p.vuelo,
    hotel: p.hotel && cambios.hotel ? { ...p.hotel, ...cambios.hotel } : p.hotel,
  })), []);

  const reiniciar = useCallback(() => setPlan(PLAN_VACIO), []);

  const valor = useMemo(
    () => ({ plan, elegirVuelo, elegirHotel, quitar, ajustar, actualizarCupos, reiniciar }),
    [plan, elegirVuelo, elegirHotel, quitar, ajustar, actualizarCupos, reiniciar],
  );

  return <ViajeContext.Provider value={valor}>{children}</ViajeContext.Provider>;
}

export function useViaje() {
  const contexto = useContext(ViajeContext);
  if (!contexto) throw new Error('useViaje debe usarse dentro de <ViajeProvider>');
  return contexto;
}
