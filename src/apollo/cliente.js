import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { finalize } from 'rxjs';
import { iniciarPeticion, terminarPeticion } from '../api/actividad.js';

// Enlace que avisa a la barra de progreso global cada vez que sale una operación GraphQL.
// finalize se ejecuta al completar, fallar o cancelar la operación.
const enlaceActividad = new ApolloLink((operacion, siguiente) => {
  iniciarPeticion();
  return siguiente(operacion).pipe(finalize(terminarPeticion));
});

// Endpoint único: el Service Worker de MSW intercepta las peticiones a /graphql.
const enlaceHttp = new HttpLink({ uri: '/graphql' });

export const clienteApollo = new ApolloClient({
  link: ApolloLink.from([enlaceActividad, enlaceHttp]),
  cache: new InMemoryCache(),
  defaultOptions: {
    // Muestra primero lo que está en caché y actualiza en segundo plano.
    watchQuery: { fetchPolicy: 'cache-and-network', nextFetchPolicy: 'cache-first', errorPolicy: 'all' },
    query: { errorPolicy: 'all' },
    mutate: { errorPolicy: 'none' },
  },
});
