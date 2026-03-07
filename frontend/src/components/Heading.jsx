export function Heading({ label, className = "" }) {
  return (
    <h1
      className={`text-3xl font-bold text-center text-slate-800 ${className}`}
    >
      {label}
    </h1>
  );
}
