import logo from "../assets/Logo.svg";
import { useNavigate } from "react-router-dom";

export function Appbar({ User }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white shadow-sm h-16 flex justify-between items-center px-6">
      {/* Left Side */}
      <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="Rupi Pay Logo"
          className="h-16 w-auto object-contain"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <div className="text-gray-600 text-sm">
          Hello, <span className="font-medium text-gray-800">{User}</span>
        </div>

        <div
          onClick={() => navigate("/profile")}
          className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center cursor-pointer hover:ring-2 ring-green-500 transition-all"
        >
          <span className="text-green-700 font-bold">{User[0]}</span>
        </div>
      </div>
    </div>
  );
}
