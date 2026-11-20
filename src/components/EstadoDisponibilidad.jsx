// Etiqueta de disponibilidad: agotado, pocos cupos o disponible.
export default function EstadoDisponibilidad({ cupos, unidad }) {
  if (cupos === 0) return <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-600">Agotado</span>;
  if (cupos <= 3) {
    return (
      <span className="rounded-full bg-atardecer-400/20 px-2 py-0.5 text-xs font-semibold text-atardecer-600">
        Últimos {cupos} {unidad}
      </span>
    );
  }
  return (
    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
      {cupos} {unidad} disponibles
    </span>
  );
}
