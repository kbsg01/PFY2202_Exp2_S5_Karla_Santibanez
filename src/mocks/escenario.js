// Escenario que simula el backend mock. Permite demostrar el manejo de errores y de carga
// sin modificar código: se cambia desde el panel «Simulador del servidor» de la interfaz.
export const ESCENARIOS = [
  { id: 'normal', etiqueta: 'Normal (respuesta en 0,6 s)' },
  { id: 'lento', etiqueta: 'Servidor lento (3 s)' },
  { id: 'error-servidor', etiqueta: 'Error del servidor (HTTP 500)' },
  { id: 'error-graphql', etiqueta: 'Error en la respuesta GraphQL' },
  { id: 'sin-conexion', etiqueta: 'Sin conexión (falla de red)' },
];

const CLAVE = 'viajes:escenario';
const IDS_VALIDOS = new Set(ESCENARIOS.map((e) => e.id));

function leerGuardado() {
  try {
    const valor = sessionStorage.getItem(CLAVE);
    return IDS_VALIDOS.has(valor) ? valor : 'normal';
  } catch {
    return 'normal'; // sessionStorage puede no estar disponible (modo privado estricto)
  }
}

let actual = leerGuardado();

export function getEscenario() {
  return actual;
}

export function setEscenario(id) {
  if (!IDS_VALIDOS.has(id)) return; // solo valores del catálogo cerrado
  actual = id;
  try {
    sessionStorage.setItem(CLAVE, id);
  } catch {
    /* sin persistencia: el escenario dura hasta recargar */
  }
}
