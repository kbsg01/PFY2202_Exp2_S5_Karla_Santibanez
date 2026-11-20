const FORMATO_CLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
const FORMATO_FECHA = new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

export function formatearPrecio(monto) {
  return FORMATO_CLP.format(monto);
}

// Recibe 'AAAA-MM-DD' y lo muestra como '12 dic 2026'. Se usa UTC para que la fecha no cambie según la zona horaria.
export function formatearFecha(iso) {
  const [a, m, d] = iso.split('-').map(Number);
  return FORMATO_FECHA.format(new Date(Date.UTC(a, m - 1, d)));
}

export function textoEscalas(escalas) {
  if (escalas === 0) return 'Directo';
  return escalas === 1 ? '1 escala' : `${escalas} escalas`;
}
