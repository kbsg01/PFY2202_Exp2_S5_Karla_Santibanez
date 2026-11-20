export default function Estrellas({ cantidad }) {
  return (
    <span className="text-atardecer-500" aria-label={`${cantidad} estrellas`} title={`${cantidad} estrellas`}>
      {'★'.repeat(cantidad)}
      <span className="text-slate-300">{'★'.repeat(5 - cantidad)}</span>
    </span>
  );
}
