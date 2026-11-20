// Un id válido solo tiene minúsculas, números y guiones (máx. 40 caracteres).
const REGEX_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function esIdValido(id) {
  return typeof id === 'string' && id.length <= 40 && REGEX_ID.test(id);
}

// Restringe un número entero a un rango; devuelve el mínimo si el valor no es numérico.
export function limitarEntero(valor, minimo, maximo) {
  const n = Number.parseInt(valor, 10);
  if (Number.isNaN(n)) return minimo;
  return Math.min(maximo, Math.max(minimo, n));
}
