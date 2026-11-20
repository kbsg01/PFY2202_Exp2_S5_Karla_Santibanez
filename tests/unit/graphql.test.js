import assert from 'node:assert/strict';
import { test } from 'node:test';
import { crearBaseDatos, ejecutarGraphql } from '../../src/mocks/esquemaGraphql.js';

const CONSULTA = `query ($destinoId: ID!, $orden: Orden, $estrellasMinimas: Int) {
  vuelos(destinoId: $destinoId, orden: $orden) { id precio disponible origen }
  hoteles(destinoId: $destinoId, estrellasMinimas: $estrellasMinimas) { id estrellas }
}`;

test('la consulta devuelve vuelos ordenados por precio y hoteles filtrados', async () => {
  const db = crearBaseDatos();
  const asc = await ejecutarGraphql(db, { query: CONSULTA, variables: { destinoId: 'buenos-aires', orden: 'PRECIO_ASC', estrellasMinimas: 4 } });
  assert.equal(asc.errors, undefined);
  const precios = asc.data.vuelos.map((v) => v.precio);
  assert.deepEqual(precios, [...precios].sort((a, b) => a - b));
  assert.ok(asc.data.hoteles.every((h) => h.estrellas >= 4));
  assert.equal(asc.data.vuelos[0].origen, 'Santiago (SCL)');

  const desc = await ejecutarGraphql(db, { query: CONSULTA, variables: { destinoId: 'buenos-aires', orden: 'PRECIO_DESC' } });
  assert.deepEqual(desc.data.vuelos.map((v) => v.precio), [...precios].sort((a, b) => b - a));
});

test('un vuelo sin asientos se informa como no disponible', async () => {
  const r = await ejecutarGraphql(crearBaseDatos(), { query: CONSULTA, variables: { destinoId: 'buenos-aires' } });
  assert.equal(r.data.vuelos.find((v) => v.id === 'v-bue-2').disponible, false);
});

test('un destino inexistente produce un error GraphQL', async () => {
  const r = await ejecutarGraphql(crearBaseDatos(), { query: CONSULTA, variables: { destinoId: 'atlantida' } });
  assert.match(r.errors[0].message, /no existe/);
});

test('reservar descuenta cupos y rechaza más asientos de los disponibles', async () => {
  const db = crearBaseDatos();
  const mutacion = 'mutation ($id: ID!, $p: Int!) { reservarVuelo(id: $id, pasajeros: $p) { asientosDisponibles } }';
  const ok = await ejecutarGraphql(db, { query: mutacion, variables: { id: 'v-cus-2', p: 2 } });
  assert.equal(ok.data.reservarVuelo.asientosDisponibles, 1);
  const falla = await ejecutarGraphql(db, { query: mutacion, variables: { id: 'v-cus-2', p: 2 } });
  assert.match(falla.errors[0].message, /Solo quedan 1 asientos/);
});
