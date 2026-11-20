import { Link } from 'react-router-dom';

export default function NoEncontrada() {
  return (
    <section className="tarjeta mx-auto max-w-xl p-8 text-center">
      <h1 className="font-titulo text-2xl font-bold text-oceano-800">Página no encontrada</h1>
      <p className="mt-2 text-slate-600">La dirección que abriste no existe en este sitio.</p>
      <Link to="/destinos" className="boton-primario mt-4">
        Ir a los destinos
      </Link>
    </section>
  );
}
