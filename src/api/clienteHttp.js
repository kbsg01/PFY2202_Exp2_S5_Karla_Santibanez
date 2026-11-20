import { iniciarPeticion, terminarPeticion } from './actividad.js';
import { ErrorApi, TIPO_ERROR, tipoPorStatus } from './errores.js';

const TIEMPO_MAXIMO_MS = 8000;

// GET que devuelve JSON. Convierte toda falla (red, tiempo de espera, HTTP, JSON inválido) en ErrorApi.
export async function obtenerJson(url, { tiempoMaximoMs = TIEMPO_MAXIMO_MS } = {}) {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), tiempoMaximoMs);
  iniciarPeticion();

  try {
    const respuesta = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: controlador.signal,
    });
    if (!respuesta.ok) throw new ErrorApi(tipoPorStatus(respuesta.status), respuesta.status);

    try {
      return await respuesta.json();
    } catch {
      throw new ErrorApi(TIPO_ERROR.RESPUESTA, respuesta.status);
    }
  } catch (error) {
    if (error instanceof ErrorApi) throw error;
    if (error?.name === 'AbortError') throw new ErrorApi(TIPO_ERROR.TIEMPO);
    throw new ErrorApi(TIPO_ERROR.RED); // fetch rechaza con TypeError cuando no hay conexión
  } finally {
    clearTimeout(temporizador);
    terminarPeticion();
  }
}
