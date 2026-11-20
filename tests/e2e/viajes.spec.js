import { expect, test } from '@playwright/test';

// Flujo principal y manejo de errores, ejecutado en cada navegador definido en playwright.config.js.

test.beforeEach(async ({ page }) => {
  await page.goto('./');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

test('lista destinos por REST y filtra por región', async ({ page }) => {
  await page.goto('./#/destinos');
  await expect(page.getByRole('heading', { name: 'Destinos', level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Cusco' })).toBeVisible();
  await page.getByLabel('Región').selectOption('Europa');
  await expect(page.getByRole('heading', { name: 'Madrid' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Cusco' })).toHaveCount(0);
});

test('detalle con rutas anidadas: vuelos y hoteles por GraphQL', async ({ page }) => {
  await page.goto('./#/destinos/buenos-aires');
  await expect(page).toHaveURL(/#\/destinos\/buenos-aires\/vuelos$/);
  await expect(page.getByText('AR1281')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sin asientos' })).toBeDisabled();

  await page.getByRole('link', { name: /Hoteles/ }).click();
  await expect(page).toHaveURL(/\/hoteles$/);
  await expect(page.getByRole('button', { name: 'Elegir hotel' }).first()).toBeVisible();
});

test('arma un viaje, calcula el total y confirma la reserva (mutación)', async ({ page }) => {
  await page.goto('./#/destinos/buenos-aires/vuelos');
  await page.getByRole('button', { name: 'Elegir vuelo' }).first().click();
  await page.getByRole('link', { name: /Hoteles/ }).click();
  await page.getByRole('button', { name: 'Elegir hotel' }).first().click();

  // En móvil el enlace está dentro del menú hamburguesa; se navega por la URL para cubrir ambos casos.
  await page.goto('./#/mi-viaje');
  await expect(page.getByRole('heading', { name: /Mi viaje a Buenos Aires/ })).toBeVisible();
  const totalInicial = await page.getByTestId('total-viaje').textContent();
  await page.getByRole('button', { name: 'Sumar pasajeros' }).click();
  await expect(page.getByTestId('total-viaje')).not.toHaveText(totalInicial);

  await page.getByRole('button', { name: 'Confirmar reserva' }).click();
  await expect(page.getByText('Reserva confirmada')).toBeVisible();
  await expect(page.getByTestId('codigo-reserva')).toHaveText(/^RS-[0-9A-F]{8}$/);
});

test('muestra error y permite reintentar cuando falla el servidor', async ({ page }) => {
  // El escenario se cambia desde el panel «Simulador del servidor», como lo haría un usuario.
  const simulador = page.getByLabel('Simulador del servidor (mock)');
  await simulador.selectOption('error-servidor');
  await page.getByRole('link', { name: 'Explorar destinos' }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reintentar' })).toBeVisible();

  await simulador.selectOption('normal');
  await page.getByRole('button', { name: 'Reintentar' }).click();
  await expect(page.getByRole('heading', { name: 'Cusco' })).toBeVisible();
});

test('ruta inexistente muestra la página 404', async ({ page }) => {
  await page.goto('./#/no-existe');
  await expect(page.getByRole('heading', { name: 'Página no encontrada' })).toBeVisible();
});
