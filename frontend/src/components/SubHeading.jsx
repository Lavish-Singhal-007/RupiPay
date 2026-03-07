export function SubHeading({ label, className = "" }) {
  return (
    <p className={`text-center text-slate-500 mt-2 mb-6 ${className}`}>
      {label}
    </p>
  );
}
