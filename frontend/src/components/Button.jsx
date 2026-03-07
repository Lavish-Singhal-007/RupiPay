export function Button({ label, onClick, disabled = false, className = "" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-green-600 text-white py-2.5 rounded-lg font-medium
      hover:bg-green-700 transition disabled:bg-slate-400
      disabled:cursor-not-allowed ${className}`}
    >
      {label}
    </button>
  );
}
