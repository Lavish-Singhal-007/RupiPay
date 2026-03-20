import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function InputBox({
  placeholder,
  onChange,
  type = "text",
  className = "",
  value,
  maxLength = 50,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="relative w-full">
      <input
        type={isPassword && showPassword ? "text" : type}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2 rounded-lg border border-slate-300 
        focus:outline-none focus:ring-2 focus:ring-green-500 
        ${isPassword ? "pr-10" : ""} ${className}`}
        value={value}
        maxLength={maxLength}
      />

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  );
}
