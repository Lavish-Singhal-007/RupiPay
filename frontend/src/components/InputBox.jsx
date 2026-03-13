export function InputBox({
  placeholder,
  onChange,
  type = "text",
  className = "",
  value,
}) {
  return (
    <input
      type={type}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-2 rounded-lg border border-slate-300 
      focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
      value={value}
    />
  );
}
