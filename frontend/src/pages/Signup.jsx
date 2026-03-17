import { Heading } from "../components/Heading";
import { SubHeading } from "../components/SubHeading";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";
import { BottomWarning } from "../components/BottomWarning";

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");

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

    if (pin.length !== 4) {
      setError("PIN must be 4 digits");
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
          pin,
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
    // <div className="h-screen bg-[#EEF8F1] flex justify-center items-center">
    //   <div className="bg-white w-full max-w-lg p-10 rounded-3xl shadow-xl border border-slate-200"></div>
    <div className="bg-[#EEF8F1] min-h-screen p-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <img src="/Logo.svg" alt="Rupi Pay" className="h-16 translate-x-6" />
        </div>

        <Heading label="Create Account" />

        <SubHeading label="Start sending money instantly" />

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <p className="text-slate-700 font-medium mb-1 text-left">
                First Name
              </p>
              <InputBox
                placeholder="e.g. Rahul"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
              />
            </div>
            <div className="flex-1">
              <p className="text-slate-700 font-medium mb-1 text-left">
                Last Name
              </p>
              <InputBox
                placeholder="e.g. Sharma"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
              />
            </div>
          </div>

          <div>
            <p className="text-slate-700 font-medium mb-1 text-left">Email</p>
            <InputBox
              placeholder="e.g. rahul@gmail.com"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
          </div>

          <div>
            <p className="text-slate-700 font-medium mb-1 text-left">
              Password
            </p>
            <InputBox
              type="password"
              placeholder="Min. 6 characters"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

          <div>
            <p className="text-slate-700 font-medium mb-1 text-left">T-PIN</p>
            <InputBox
              type="password"
              placeholder="4 digit secret PIN"
              onChange={(e) => setPin(e.target.value)}
              value={pin}
              maxLength={4}
            />
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mt-4">{error}</p>
        )}

        <div className="mt-6">
          <Button
            label={loading ? "Creating account..." : "Sign Up"}
            onClick={sendRequest}
            disabled={
              !firstName ||
              !lastName ||
              !username ||
              !password ||
              !pin ||
              loading ||
              pin.length !== 4
            }
          />
        </div>

        <BottomWarning
          label="Already have an account?"
          buttonText="Sign in"
          to="/signin"
        />
      </div>
    </div>
  );
}
