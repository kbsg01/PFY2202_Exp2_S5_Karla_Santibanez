import assert from 'node:assert/strict';
import { test } from 'node:test';
import { crearCache } from '../../src/api/cache.js';

test('un dato vigente no vuelve a consultarse', async () => {
  const cache = crearCache({ vigenciaMs: 1000, ahora: () => 0 });
  let llamadas = 0;
  const consultar = async () => ++llamadas;

  assert.equal(await cache.obtener('k', consultar), 1);
  assert.equal(await cache.obtener('k', consultar), 1);
  assert.equal(llamadas, 1);
});

test('peticiones simultáneas a la misma clave comparten una sola consulta', async () => {
  const cache = crearCache();
  let llamadas = 0;
  const consultar = () => new Promise((resolver) => setTimeout(() => resolver(++llamadas), 10));

  const [a, b] = await Promise.all([cache.obtener('k', consultar), cache.obtener('k', consultar)]);
  assert.equal(a, 1);
  assert.equal(b, 1);
  assert.equal(llamadas, 1);
});

test('un dato vencido se vuelve a consultar', async () => {
  let reloj = 0;
  const cache = crearCache({ vigenciaMs: 1000, ahora: () => reloj });
  let llamadas = 0;
  const consultar = async () => ++llamadas;

  await cache.obtener('k', consultar);
  reloj = 1500;
  assert.equal(cache.leer('k').vigente, false);
  assert.equal(await cache.obtener('k', consultar), 2);
});

test('forzar ignora la caché vigente', async () => {
  const cache = crearCache({ ahora: () => 0 });
  let llamadas = 0;
  const consultar = async () => ++llamadas;

  await cache.obtener('k', consultar);
  assert.equal(await cache.obtener('k', consultar, { forzar: true }), 2);
});

test('si la consulta falla, se conserva el dato anterior como respaldo', async () => {
  let reloj = 0;
  const cache = crearCache({ vigenciaMs: 1000, ahora: () => reloj });
  await cache.obtener('k', async () => 'anterior');
  reloj = 5000;

  await assert.rejects(cache.obtener('k', async () => { throw new Error('falla'); }));
  assert.deepEqual(cache.leer('k'), { datos: 'anterior', vigente: false });
  // El error no queda en caché: el siguiente intento vuelve a consultar.
  assert.equal(await cache.obtener('k', async () => 'nuevo'), 'nuevo');
});
