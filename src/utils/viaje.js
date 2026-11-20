// Cálculos del plan de viaje (funciones puras, probadas en tests/unit).
export const LIMITES = Object.freeze({ pasajeros: [1, 9], noches: [1, 30] });

// Se asumen habitaciones dobles: 2 pasajeros por habitación.
export function habitacionesNecesarias(pasajeros) {
  return Math.ceil(pasajeros / 2);
}

export function calcularTotal({ vuelo, hotel, pasajeros, noches }) {
  const totalVuelo = vuelo ? vuelo.precio * pasajeros : 0;
  const habitaciones = habitacionesNecesarias(pasajeros);
  const totalHotel = hotel ? hotel.precioNoche * noches * habitaciones : 0;
  return { totalVuelo, totalHotel, habitaciones, total: totalVuelo + totalHotel };
}

// Valida que el plan pueda reservarse con los cupos informados por el backend.
export function validarPlan({ vuelo, hotel, pasajeros }) {
  const problemas = [];
  if (!vuelo && !hotel) problemas.push('Elige al menos un vuelo o un hotel.');
  if (vuelo && vuelo.asientosDisponibles < pasajeros) {
    problemas.push(`El vuelo ${vuelo.numero} tiene ${vuelo.asientosDisponibles} asientos disponibles.`);
  }
  if (hotel && hotel.habitacionesDisponibles < habitacionesNecesarias(pasajeros)) {
    problemas.push(`${hotel.nombre} tiene ${hotel.habitacionesDisponibles} habitaciones disponibles.`);
  }
  return problemas;
}
