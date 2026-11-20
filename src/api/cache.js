// Caché en memoria para respuestas de la API.
// - Evita repetir consultas: un dato vigente se entrega sin ir a la red.
// - Deduplica: dos componentes que piden lo mismo a la vez comparten una sola petición.
// - Conserva el último dato aunque esté vencido, para usarlo de respaldo si el servidor falla.
export function crearCache({ vigenciaMs = 60_000, ahora = Date.now } = {}) {
  const entradas = new Map(); // clave -> { datos, guardadoEn }
  const enVuelo = new Map(); // clave -> promesa en curso

  function leer(clave) {
    const entrada = entradas.get(clave);
    if (!entrada) return null;
    return { datos: entrada.datos, vigente: ahora() - entrada.guardadoEn < vigenciaMs };
  }

  // Devuelve el dato vigente de la caché o ejecuta `consultar` (una sola vez por clave a la vez).
  function obtener(clave, consultar, { forzar = false } = {}) {
    const guardado = leer(clave);
    if (!forzar && guardado?.vigente) return Promise.resolve(guardado.datos);

    if (enVuelo.has(clave)) return enVuelo.get(clave);

    const promesa = Promise.resolve()
      .then(consultar)
      .then((datos) => {
        entradas.set(clave, { datos, guardadoEn: ahora() });
        return datos;
      })
      .finally(() => enVuelo.delete(clave));

    enVuelo.set(clave, promesa);
    return promesa;
  }

  return { leer, obtener, limpiar: () => entradas.clear() };
}
