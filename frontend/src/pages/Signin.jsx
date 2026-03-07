import { Heading } from "../components/Heading";
import { SubHeading } from "../components/SubHeading";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";
import { BottomWarning } from "../components/BottomWarning";

import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function sendRequest() {
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/signin",
        {
          username,
          password,
        },
      );

      localStorage.setItem("token", response.data.token);

      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    }

    setLoading(false);
  }

  return (
    <div className="h-screen bg-[#EEF8F1] flex justify-center items-center">
      <div className="bg-white w-96 p-8 rounded-2xl shadow-xl border border-slate-200">
        <div className="flex justify-center mb-6">
          <img src="/Logo.svg" alt="Rupi Pay" className="h-16 translate-x-6" />
        </div>

        <Heading label="Sign in" />

        <SubHeading label="Enter your credentials to access your account" />

        <div className="space-y-4">
          <InputBox
            placeholder="Email"
            onChange={(e) => setUsername(e.target.value)}
          />

          <InputBox
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mt-4">{error}</p>
        )}

        <div className="mt-6">
          <Button
            label={loading ? "Signing in..." : "Sign in"}
            onClick={sendRequest}
            disabled={!username || !password || loading}
          />
        </div>

        <BottomWarning
          label="Don't have an account?"
          buttonText="Sign up"
          to="/signup"
        />
      </div>
    </div>
  );
}
