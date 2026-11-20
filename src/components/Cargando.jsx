// Indicador de carga accesible: role="status" lo anuncia a los lectores de pantalla.
export default function Cargando({ mensaje = 'Cargando…' }) {
  return (
    <div role="status" aria-live="polite" className="flex items-center justify-center gap-3 py-12 text-slate-600">
      <span
        className="h-6 w-6 animate-spin rounded-full border-4 border-oceano-100 border-t-oceano-600 motion-reduce:animate-none"
        aria-hidden="true"
      />
      <span>{mensaje}</span>
    </div>
  );
}
