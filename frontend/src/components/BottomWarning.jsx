import { Link } from "react-router-dom";

export function BottomWarning({
  label,
  buttonText,
  to,
  className = "",
  linkClass = "",
}) {
  return (
    <p className={`text-center text-sm text-slate-500 mt-6 ${className}`}>
      {label}{" "}
      <Link to={to} className={`text-green-600 font-medium ${linkClass}`}>
        {buttonText}
      </Link>
    </p>
  );
}
