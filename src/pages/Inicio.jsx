import { Link } from 'react-router-dom';

const PASOS = [
  { n: 1, titulo: 'Elige un destino', texto: 'Explora ciudades con su país y sus actividades más populares.' },
  { n: 2, titulo: 'Compara vuelos y hoteles', texto: 'Revisa precios, fechas y disponibilidad para ese destino.' },
  { n: 3, titulo: 'Arma tu viaje', texto: 'Ajusta pasajeros y noches, revisa el total y reserva.' },
];

export default function Inicio() {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-oceano-800 via-oceano-700 to-oceano-500 px-6 py-12 text-white sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-atardecer-400">Agencia de viajes</p>
        <h1 className="mt-2 max-w-2xl font-titulo text-4xl font-bold leading-tight sm:text-5xl">Planifica tu próximo viaje desde Santiago</h1>
        <p className="mt-4 max-w-xl text-oceano-50">
          Destinos, vuelos y hoteles en un solo lugar. Los datos vienen de un backend simulado: los destinos por REST y la disponibilidad por GraphQL.
        </p>
        <Link to="/destinos" className="mt-6 inline-flex rounded-lg bg-atardecer-500 px-5 py-3 font-semibold text-white hover:bg-atardecer-600">
          Explorar destinos
        </Link>
      </section>
      <section aria-labelledby="como-funciona">
        <h2 id="como-funciona" className="font-titulo text-2xl font-bold text-oceano-800">
          ¿Cómo funciona?
        </h2>
        <ol className="mt-4 grid gap-4 md:grid-cols-3">
          {PASOS.map((p) => (
            <li key={p.n} className="tarjeta p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-atardecer-500 font-bold text-white">{p.n}</span>
              <h3 className="mt-3 font-semibold">{p.titulo}</h3>
              <p className="mt-1 text-sm text-slate-600">{p.texto}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
