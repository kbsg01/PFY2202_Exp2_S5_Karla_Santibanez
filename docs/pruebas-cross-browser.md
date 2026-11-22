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

## Resultados (21-11-2026)

Ejecución en Windows 11 con Chromium 153.0.8010.12, Firefox 155.0 y WebKit 26.6 (`npx playwright test`).

| Proyecto | Resultado | Observación |
|---|---|---|
| chromium (Chrome / Edge) | ✅ 5 / 5 | |
| firefox | ✅ 5 / 5 | Motor Gecko |
| webkit (Safari) | ✅ 5 / 5 | Motor de Safari |
| movil-chromium (Pixel 7) | ✅ 5 / 5 | El enlace «Mi viaje» queda dentro del menú hamburguesa; la prueba navega por URL |

Total: **20 pruebas, 20 aprobadas, 0 fallas** (1,2 min).

```
20 passed (1.2m)
  chromium         5/5
  firefox          5/5
  webkit           5/5
  movil-chromium   5/5
```

### Evidencia

- Salida completa de la ejecución: [`resultado-e2e.txt`](resultado-e2e.txt)
- Reporte HTML de Playwright: [`capturas/14-reporte-playwright.png`](capturas/14-reporte-playwright.png)
- Misma pantalla (vuelos por GraphQL) en cada motor:
  [Chromium](capturas/13-chromium-vuelos.png) · [Firefox](capturas/13-firefox-vuelos.png) · [WebKit](capturas/13-webkit-vuelos.png)
- Pruebas unitarias (15 aprobadas): [`resultado-unitarias.txt`](resultado-unitarias.txt)

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
