import { CombinedGraphQLErrors, ServerError, ServerParseError } from '@apollo/client';
import { ErrorApi, TIPO_ERROR, tipoPorStatus } from '../api/errores.js';

// Traduce los errores de Apollo Client al mismo ErrorApi que usa la parte REST,
// para que la interfaz muestre mensajes coherentes en ambos casos.
export function errorDesdeApollo(error) {
  if (!error) return null;
  if (CombinedGraphQLErrors.is(error)) {
    return new ErrorApi(TIPO_ERROR.GRAPHQL, null, error.errors.map((e) => e.message));
  }
  if (ServerError.is(error)) return new ErrorApi(tipoPorStatus(error.statusCode), error.statusCode);
  if (ServerParseError.is(error)) return new ErrorApi(TIPO_ERROR.RESPUESTA, error.statusCode);
  return new ErrorApi(TIPO_ERROR.RED); // fetch rechazado: sin conexión
}
