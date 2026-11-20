import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import { RESERVAR_HOTEL, RESERVAR_VUELO } from '../apollo/operaciones.js';
import { errorDesdeApollo } from '../apollo/errores.js';
import MensajeError from '../components/MensajeError.jsx';
import { useViaje } from '../context/ViajeContext.jsx';
import { formatearPrecio, formatearFecha } from '../utils/formato.js';
import { calcularTotal, LIMITES, validarPlan } from '../utils/viaje.js';

// Código de confirmación local (simulado): no es un identificador de seguridad.
function generarCodigo() {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  return `RS-${Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
}

function Contador({ etiqueta, campo, valor, onCambio }) {
  const [min, max] = LIMITES[campo];
  return (
    <label className="block">
      <span className="text-sm font-medium">{etiqueta}</span>
      <div className="mt-1 flex items-center gap-2">
        <button type="button" className="boton-secundario px-3" onClick={() => onCambio(campo, valor - 1)} disabled={valor <= min} aria-label={`Restar ${etiqueta.toLowerCase()}`}>
          −
        </button>
        <input type="number" inputMode="numeric" min={min} max={max} className="campo w-20 text-center" value={valor} onChange={(e) => onCambio(campo, e.target.value)} />
        <button type="button" className="boton-secundario px-3" onClick={() => onCambio(campo, valor + 1)} disabled={valor >= max} aria-label={`Sumar ${etiqueta.toLowerCase()}`}>
          +
        </button>
      </div>
    </label>
  );
}

export default function MiViaje() {
  const { plan, quitar, ajustar, actualizarCupos, reiniciar } = useViaje();
  const [reservarVuelo] = useMutation(RESERVAR_VUELO);
  const [reservarHotel] = useMutation(RESERVAR_HOTEL);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const [confirmacion, setConfirmacion] = useState(null);

  const { vuelo, hotel, destino, pasajeros, noches } = plan;
  const totales = calcularTotal(plan);
  const problemas = validarPlan(plan);

  async function confirmar() {
    setEnviando(true);
    setError(null);
    const cambios = {};
    try {
      // Las mutaciones devuelven id + cupos: Apollo actualiza la caché normalizada sola.
      if (vuelo) {
        const { data } = await reservarVuelo({ variables: { id: vuelo.id, pasajeros } });
        cambios.vuelo = data.reservarVuelo;
      }
      if (hotel) {
        const { data } = await reservarHotel({ variables: { id: hotel.id, habitaciones: totales.habitaciones } });
        cambios.hotel = data.reservarHotel;
      }
      setConfirmacion({ codigo: generarCodigo(), destino, vuelo, hotel, pasajeros, noches, total: totales.total });
      reiniciar();
    } catch (e) {
      // Si una reserva ya se hizo, se reflejan sus cupos antes de mostrar el error.
      actualizarCupos(cambios);
      setError(errorDesdeApollo(e));
    } finally {
      setEnviando(false);
    }
  }

  if (confirmacion) {
    return (
      <section className="tarjeta mx-auto max-w-xl p-6 text-center" role="status">
        <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">Reserva confirmada</p>
        <h1 className="mt-1 font-titulo text-3xl font-bold text-oceano-800">¡Buen viaje a {confirmacion.destino.ciudad}!</h1>
        <p className="mt-3">
          Código de reserva: <strong data-testid="codigo-reserva">{confirmacion.codigo}</strong>
        </p>
        <ul className="mt-3 space-y-1 text-sm text-slate-700">
          {confirmacion.vuelo && <li>Vuelo {confirmacion.vuelo.numero} · {formatearFecha(confirmacion.vuelo.fechaSalida)}</li>}
          {confirmacion.hotel && <li>{confirmacion.hotel.nombre} · {confirmacion.noches} noches</li>}
          <li>{confirmacion.pasajeros} pasajero(s) · Total {formatearPrecio(confirmacion.total)}</li>
        </ul>
        <p className="mt-3 text-xs text-slate-500">Reserva simulada: no se realizó ningún cobro.</p>
        <Link to="/destinos" className="boton-primario mt-5">
          Planificar otro viaje
        </Link>
      </section>
    );
  }

  if (!vuelo && !hotel) {
    return (
      <section className="tarjeta mx-auto max-w-xl p-8 text-center">
        <h1 className="font-titulo text-2xl font-bold text-oceano-800">Tu viaje está vacío</h1>
        <p className="mt-2 text-slate-600">Elige un destino y agrega un vuelo o un hotel para armar tu viaje.</p>
        <Link to="/destinos" className="boton-primario mt-4">
          Ver destinos
        </Link>
      </section>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <div className="space-y-4">
        <h1 className="font-titulo text-3xl font-bold text-oceano-800">Mi viaje a {destino.ciudad}</h1>

        <article className="tarjeta p-4">
          <h2 className="font-semibold">Vuelo</h2>
          {vuelo ? (
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm">
              <p>
                {vuelo.aerolinea} {vuelo.numero} · {formatearFecha(vuelo.fechaSalida)} {vuelo.horaSalida} · {formatearPrecio(vuelo.precio)} c/u
              </p>
              <button type="button" className="text-sm font-medium text-red-700 hover:underline" onClick={() => quitar('vuelo')}>
                Quitar
              </button>
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-600">
              Sin vuelo. <Link className="text-oceano-700 underline" to={`/destinos/${destino.id}/vuelos`}>Elegir un vuelo</Link>
            </p>
          )}
        </article>

        <article className="tarjeta p-4">
          <h2 className="font-semibold">Hotel</h2>
          {hotel ? (
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm">
              <p>
                {hotel.nombre} · {hotel.barrio} · {formatearPrecio(hotel.precioNoche)} por noche
              </p>
              <button type="button" className="text-sm font-medium text-red-700 hover:underline" onClick={() => quitar('hotel')}>
                Quitar
              </button>
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-600">
              Sin hotel. <Link className="text-oceano-700 underline" to={`/destinos/${destino.id}/hoteles`}>Elegir un hotel</Link>
            </p>
          )}
        </article>

        <div className="tarjeta grid gap-4 p-4 sm:grid-cols-2">
          <Contador etiqueta="Pasajeros" campo="pasajeros" valor={pasajeros} onCambio={ajustar} />
          <Contador etiqueta="Noches" campo="noches" valor={noches} onCambio={ajustar} />
        </div>
      </div>

      <aside className="tarjeta h-fit p-5 lg:sticky lg:top-24" aria-labelledby="resumen">
        <h2 id="resumen" className="text-lg font-semibold">
          Resumen
        </h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>Vuelos ({pasajeros} × pasajero)</dt>
            <dd>{formatearPrecio(totales.totalVuelo)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>
              Hotel ({totales.habitaciones} hab. × {noches} noches)
            </dt>
            <dd>{formatearPrecio(totales.totalHotel)}</dd>
          </div>
          <div className="flex justify-between border-t border-arena-200 pt-2 text-base font-bold">
            <dt>Total</dt>
            <dd data-testid="total-viaje">{formatearPrecio(totales.total)}</dd>
          </div>
        </dl>

        {problemas.length > 0 && (
          <ul className="mt-3 space-y-1 rounded-lg bg-amber-50 p-3 text-sm text-amber-900" role="alert">
            {problemas.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        )}

        {error && (
          <div className="mt-3">
            <MensajeError error={error} onReintentar={confirmar} />
          </div>
        )}

        <button type="button" className="boton-primario mt-4 w-full" disabled={enviando || problemas.length > 0} onClick={confirmar}>
          {enviando ? 'Reservando…' : 'Confirmar reserva'}
        </button>
        <p className="mt-2 text-xs text-slate-500">Reserva simulada con una mutación GraphQL; no se realizan cobros.</p>
      </aside>
    </section>
  );
}
