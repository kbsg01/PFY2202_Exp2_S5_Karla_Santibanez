# Pruebas cross-browser

## Estrategia

1. **Automatizadas con Playwright** (`playwright.config.js`): el mismo archivo `tests/e2e/viajes.spec.js`
   se ejecuta en cuatro proyectos contra el build de producción (`vite preview`):
   - `chromium` — motor de Google Chrome y Microsoft Edge.
   - `firefox` — motor Gecko de Mozilla Firefox.
   - `webkit` — motor de Apple Safari.
   - `movil-chromium` — viewport de Pixel 7 (412 × 915, táctil) para validar el diseño responsive.
2. **Build compatible**: `build.target` = `es2020`, Chrome/Edge 90+, Firefox 90+, Safari 14+.
   Tailwind se procesa con Autoprefixer.
3. **APIs del navegador usadas** y soporte: `fetch` + `AbortController` (timeout), Service Worker (MSW),
   `crypto.getRandomValues`, `localStorage`/`sessionStorage`. Todas disponibles en las versiones objetivo.

## Casos

| # | Caso | Qué valida |
|---|---|---|
| 1 | Lista destinos por REST y filtra por región | GET REST, render de tarjetas, filtro con `useState` |
| 2 | Rutas anidadas: vuelos y hoteles por GraphQL | Redirección index → `vuelos`, `<Outlet>`, query Apollo, botón deshabilitado sin cupos |
| 3 | Arma un viaje y confirma la reserva | Contexto global, cálculo del total, mutaciones GraphQL, código de confirmación |
| 4 | Error del servidor y reintento | Escenario HTTP 500, mensaje `role="alert"`, botón «Reintentar» recupera los datos |
| 5 | Ruta inexistente | Página 404 |

## Resultados (19-11-2026)

| Proyecto | Resultado | Observación |
|---|---|---|
| chromium (Chrome / Edge) | ✅ 5 / 5 | Ejecutado en el entorno de desarrollo |
| movil-chromium (Pixel 7) | ✅ 5 / 5 | El enlace «Mi viaje» queda dentro del menú hamburguesa; la prueba navega por URL |
| firefox | ⏳ Pendiente | El entorno de desarrollo no permitió descargar el navegador. Ejecutar localmente: `npx playwright install firefox && npx playwright test --project=firefox` |
| webkit (Safari) | ⏳ Pendiente | Ídem: `npx playwright install webkit && npx playwright test --project=webkit` |

Salida de la ejecución en Chromium:

```
10 passed (24.2s)
  chromium         5/5
  movil-chromium   5/5
```

## Revisión manual sugerida

| Navegador | Revisar |
|---|---|
| Chrome, Edge | Flujo completo, simulador de errores, menú móvil con DevTools (modo dispositivo) |
| Firefox | Selects y campos numéricos (estilos nativos), foco visible al navegar con Tab |
| Safari (macOS/iOS) | Registro del Service Worker (requiere HTTPS o `localhost`), barra fija y scroll en iPhone |

## Problemas encontrados y corregidos

- **Menú móvil**: en pantallas angostas el enlace «Mi viaje» no es visible hasta abrir el menú;
  la prueba navega por URL para cubrir ambos tamaños con el mismo caso.
- **CSP en desarrollo**: la política de seguridad bloquea el script inline del recargado en caliente
  de Vite; se aplica solo en el build (`apply: 'build'`).
