import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import BarraProgreso from './components/BarraProgreso.jsx';
import Navbar from './components/Navbar.jsx';
import SimuladorServidor from './components/SimuladorServidor.jsx';
import DetalleDestino from './pages/DetalleDestino.jsx';
import Destinos from './pages/Destinos.jsx';
import Hoteles from './pages/Hoteles.jsx';
import Inicio from './pages/Inicio.jsx';
import MiViaje from './pages/MiViaje.jsx';
import NoEncontrada from './pages/NoEncontrada.jsx';
import Vuelos from './pages/Vuelos.jsx';

export default function App() {
  return (
    // HashRouter: las rutas funcionan en GitHub Pages sin configurar el servidor.
    <HashRouter>
      <div className="flex min-h-screen flex-col">
        <BarraProgreso />
        <Navbar />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/destinos" element={<Destinos />} />
            <Route path="/destinos/:id" element={<DetalleDestino />}>
              <Route index element={<Navigate to="vuelos" replace />} />
              <Route path="vuelos" element={<Vuelos />} />
              <Route path="hoteles" element={<Hoteles />} />
            </Route>
            <Route path="/mi-viaje" element={<MiViaje />} />
            <Route path="*" element={<NoEncontrada />} />
          </Routes>
        </main>
        <SimuladorServidor />
      </div>
    </HashRouter>
  );
}
