import { setupWorker } from 'msw/browser';
import { handlers } from './handlers.js';

// Service Worker que intercepta las peticiones REST y GraphQL del navegador.
export const worker = setupWorker(...handlers);
