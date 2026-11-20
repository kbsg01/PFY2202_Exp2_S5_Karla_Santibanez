import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Política de seguridad de contenido (CSP) para el build publicado. GitHub Pages no permite
// configurar cabeceras HTTP, por eso se entrega como <meta>. Solo se cargan recursos del propio
// sitio: no hay scripts ni estilos de terceros (y por lo tanto no se requieren hashes SRI).
// En desarrollo no se agrega porque Vite inyecta un script inline para el recargado en caliente.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  "connect-src 'self'",
  "worker-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

function cspEnBuild() {
  return {
    name: 'csp-en-build',
    apply: 'build',
    transformIndexHtml: () => [{ tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP }, injectTo: 'head-prepend' }],
  };
}

// base relativa: los assets funcionan en GitHub Pages (https://<usuario>.github.io/<repo>/).
// build.target: navegadores modernos (Chrome, Edge, Firefox y Safari de los últimos años).
export default defineConfig({
  base: './',
  plugins: [react(), cspEnBuild()],
  build: { target: ['es2020', 'chrome90', 'edge90', 'firefox90', 'safari14'] },
});
