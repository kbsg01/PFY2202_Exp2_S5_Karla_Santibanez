import { crearCache } from './cache.js';
import { obtenerJson } from './clienteHttp.js';
import { ErrorApi, TIPO_ERROR } from './errores.js';
import { esIdValido } from '../utils/validacion.js';

// Caché compartida de las respuestas REST (vigencia: 2 minutos).
export const cache = crearCache({ vigenciaMs: 120_000 });

export const CLAVE_DESTINOS = 'destinos';
export const claveDestino = (id) => `destino:${id}`;

export function obtenerDestinos(opciones) {
  return cache.obtener(CLAVE_DESTINOS, () => obtenerJson('/api/destinos'), opciones);
}

export function obtenerDestino(id, opciones) {
  // El id viene de la URL: se valida antes de usarlo y se codifica al armar la ruta.
  if (!esIdValido(id)) return Promise.reject(new ErrorApi(TIPO_ERROR.NO_ENCONTRADO, 404));
  return cache.obtener(claveDestino(id), () => obtenerJson(`/api/destinos/${encodeURIComponent(id)}`), opciones);
}

// Precarga silenciosa del detalle; si falla, el error se mostrará al entrar a la página.
export function precargarDestino(id) {
  obtenerDestino(id).catch(() => {});
}
