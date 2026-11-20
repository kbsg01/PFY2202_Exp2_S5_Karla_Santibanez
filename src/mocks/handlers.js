import { delay, graphql, http, HttpResponse } from 'msw';
import { DESTINOS } from './datos.js';
import { getEscenario } from './escenario.js';
import { crearBaseDatos, ejecutarGraphql } from './esquemaGraphql.js';

const db = crearBaseDatos();

// Aplica el escenario activo antes de responder. Devuelve una respuesta de error o null para continuar.
async function aplicarEscenario({ esGraphql = false } = {}) {
  const escenario = getEscenario();
  await delay(escenario === 'lento' ? 3000 : 600); // retraso simulado del servidor

  if (escenario === 'sin-conexion') return HttpResponse.error(); // falla de red: fetch rechaza la promesa
  if (escenario === 'error-servidor') {
    return HttpResponse.json({ mensaje: 'Error interno del servidor' }, { status: 500 });
  }
  if (escenario === 'error-graphql' && esGraphql) {
    // GraphQL informa los errores en el cuerpo, con HTTP 200.
    return HttpResponse.json({ data: null, errors: [{ message: 'El servicio de disponibilidad no respondió.' }] });
  }
  return null;
}

// Vista resumida de un destino para el listado (sin descripción larga).
const resumen = ({ id, ciudad, pais, region, actividades }) => ({ id, ciudad, pais, region, actividades });

export const handlers = [
  // REST: GET /api/destinos?region=<región opcional>
  http.get('/api/destinos', async ({ request }) => {
    const fallo = await aplicarEscenario();
    if (fallo) return fallo;

    const region = new URL(request.url).searchParams.get('region');
    const lista = region ? DESTINOS.filter((d) => d.region === region) : DESTINOS;
    return HttpResponse.json(lista.map(resumen));
  }),

  // REST: GET /api/destinos/:id -> detalle de un destino
  http.get('/api/destinos/:id', async ({ params }) => {
    const fallo = await aplicarEscenario();
    if (fallo) return fallo;

    const destino = DESTINOS.find((d) => d.id === params.id);
    if (!destino) {
      return HttpResponse.json({ mensaje: `El destino "${params.id}" no existe` }, { status: 404 });
    }
    return HttpResponse.json(destino);
  }),

  // GraphQL: cualquier query o mutation se resuelve contra el esquema simulado.
  graphql.operation(async ({ query, variables, operationName }) => {
    const fallo = await aplicarEscenario({ esGraphql: true });
    if (fallo) return fallo;

    const resultado = await ejecutarGraphql(db, { query, variables, operationName });
    return HttpResponse.json(resultado);
  }),
];
