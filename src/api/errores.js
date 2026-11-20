// Error de API con un tipo conocido, para que la interfaz muestre un mensaje específico y una salida.
export const TIPO_ERROR = Object.freeze({
  RED: 'red',
  TIEMPO: 'tiempo',
  NO_ENCONTRADO: 'no-encontrado',
  SOLICITUD: 'solicitud',
  SERVIDOR: 'servidor',
  RESPUESTA: 'respuesta',
  GRAPHQL: 'graphql',
});

const MENSAJES = {
  [TIPO_ERROR.RED]: 'No pudimos conectar con el servidor. Revisa tu conexión a internet.',
  [TIPO_ERROR.TIEMPO]: 'El servidor tardó demasiado en responder.',
  [TIPO_ERROR.NO_ENCONTRADO]: 'No encontramos lo que buscabas.',
  [TIPO_ERROR.SOLICITUD]: 'La solicitud no es válida.',
  [TIPO_ERROR.SERVIDOR]: 'El servidor tuvo un problema al procesar la solicitud.',
  [TIPO_ERROR.RESPUESTA]: 'El servidor respondió con datos que no pudimos leer.',
  [TIPO_ERROR.GRAPHQL]: 'El servicio GraphQL informó un error.',
};

export class ErrorApi extends Error {
  constructor(tipo, status = null, detalles = []) {
    super(MENSAJES[tipo] ?? 'Ocurrió un error inesperado.');
    this.name = 'ErrorApi';
    this.tipo = tipo;
    this.status = status;
    this.detalles = detalles; // mensajes del servidor (por ejemplo, los `errors` de GraphQL)
  }

  // Reintentar tiene sentido solo si el problema puede ser transitorio.
  get reintentable() {
    return [TIPO_ERROR.RED, TIPO_ERROR.TIEMPO, TIPO_ERROR.SERVIDOR, TIPO_ERROR.RESPUESTA, TIPO_ERROR.GRAPHQL].includes(this.tipo);
  }
}

// Traduce un código HTTP de error al tipo que entiende la interfaz.
export function tipoPorStatus(status) {
  if (status === 404) return TIPO_ERROR.NO_ENCONTRADO;
  if (status >= 500) return TIPO_ERROR.SERVIDOR;
  return TIPO_ERROR.SOLICITUD;
}
