import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendRequest() {
    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    if (username.length > 30) {
      setError("Email cannot exceed 30 characters");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (firstName.length > 50) {
      setError("First Name cannot exceed 50 characters");
      return;
    }

    if (lastName.length > 50) {
      setError("Last Name cannot exceed 50 characters");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/signup",
        {
          firstName,
          lastName,
          username,
          password,
        },
      );

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }

    setLoading(false);
  }

  return (
    <div className="h-screen bg-[#EEF8F1] flex justify-center items-center">
      <div className="bg-white w-96 p-8 rounded-2xl shadow-xl border border-slate-200">
        <div className="flex justify-center mb-6">
          <img src="/Logo.svg" alt="Rupi Pay" className="h-16 translate-x-6" />
        </div>

        <h1 className="text-3xl font-bold text-center text-slate-800">
          Create Account
        </h1>

        <p className="text-center text-slate-500 mt-2 mb-6">
          Start sending money instantly
        </p>

        <div className="space-y-4">
          <input
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mt-4">{error}</p>
        )}

        <button
          onClick={sendRequest}
          disabled={
            !firstName || !lastName || !username || !password || loading
          }
          className="w-full mt-6 bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <Link to="/signin" className="text-green-600 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
