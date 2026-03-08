import logo from "../assets/Logo.svg";

export function Appbar({ User }) {
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

        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold">
          {User[0]}
        </div>
      </div>
    </div>
  );
}
