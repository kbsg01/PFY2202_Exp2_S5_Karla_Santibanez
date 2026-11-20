import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProvider } from '@apollo/client/react';
import { clienteApollo } from './apollo/cliente.js';
import { ViajeProvider } from './context/ViajeContext.jsx';
import App from './App.jsx';
import './index.css';

// El backend de esta actividad es un mock: MSW intercepta /api/* (REST) y /graphql (GraphQL).
// Se mantiene activo también en el build para que el sitio publicado en GitHub Pages funcione.
// Se desactiva con VITE_USAR_MOCK=false cuando exista un backend real.
async function habilitarMock() {
  if (import.meta.env.VITE_USAR_MOCK === 'false') return;
  const { worker } = await import('./mocks/browser.js'); // import dinámico: fuera del bundle principal
  await worker.start({
    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
    onUnhandledRequest: 'bypass',
    quiet: true,
  });
}

function renderizar() {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ApolloProvider client={clienteApollo}>
        <ViajeProvider>
          <App />
        </ViajeProvider>
      </ApolloProvider>
    </StrictMode>,
  );
}

// La app se monta cuando el Service Worker está listo; así ninguna petición se escapa al mock.
// Si el mock no puede iniciar, la app se monta igual y cada pantalla muestra el error de su petición.
habilitarMock()
  .catch((error) => console.error('[mock] No se pudo iniciar el Service Worker:', error))
  .finally(renderizar);
