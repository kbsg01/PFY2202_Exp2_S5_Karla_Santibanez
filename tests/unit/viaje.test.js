import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calcularTotal, habitacionesNecesarias, validarPlan } from '../../src/utils/viaje.js';
import { esIdValido, limitarEntero } from '../../src/utils/validacion.js';

const vuelo = { numero: 'LA2401', precio: 100000, asientosDisponibles: 3 };
const hotel = { nombre: 'Hotel Prueba', precioNoche: 50000, habitacionesDisponibles: 1 };

test('se necesita una habitación doble por cada dos pasajeros', () => {
  assert.equal(habitacionesNecesarias(1), 1);
  assert.equal(habitacionesNecesarias(2), 1);
  assert.equal(habitacionesNecesarias(3), 2);
});

test('el total suma vuelo por pasajero y hotel por noche y habitación', () => {
  const r = calcularTotal({ vuelo, hotel, pasajeros: 3, noches: 4 });
  assert.equal(r.totalVuelo, 300000);
  assert.equal(r.habitaciones, 2);
  assert.equal(r.totalHotel, 400000);
  assert.equal(r.total, 700000);
});

test('un plan sin vuelo ni hotel no es válido', () => {
  assert.deepEqual(validarPlan({ vuelo: null, hotel: null, pasajeros: 1 }), ['Elige al menos un vuelo o un hotel.']);
});

test('se informan cupos insuficientes de vuelo y hotel', () => {
  const problemas = validarPlan({ vuelo, hotel, pasajeros: 4 });
  assert.equal(problemas.length, 2);
  assert.match(problemas[0], /3 asientos/);
  assert.match(problemas[1], /1 habitaciones/);
});

test('limitarEntero acota valores y descarta texto', () => {
  assert.equal(limitarEntero('12', 1, 9), 9);
  assert.equal(limitarEntero(0, 1, 9), 1);
  assert.equal(limitarEntero('abc', 1, 9), 1);
});

test('esIdValido rechaza ids con caracteres peligrosos', () => {
  assert.equal(esIdValido('buenos-aires'), true);
  assert.equal(esIdValido('../admin'), false);
  assert.equal(esIdValido('<script>'), false);
  assert.equal(esIdValido('a'.repeat(41)), false);
});
