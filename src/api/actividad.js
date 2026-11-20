// Contador de peticiones en curso. Alimenta la barra de progreso global: responde a cada petición.
let enCurso = 0;
const suscriptores = new Set();

function notificar() {
  suscriptores.forEach((fn) => fn());
}

export function iniciarPeticion() {
  enCurso += 1;
  notificar();
}

export function terminarPeticion() {
  enCurso = Math.max(0, enCurso - 1);
  notificar();
}

// API compatible con useSyncExternalStore
export function suscribir(fn) {
  suscriptores.add(fn);
  return () => suscriptores.delete(fn);
}

export function getEnCurso() {
  return enCurso;
}
