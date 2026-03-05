import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function sendRequest() {
    try {
      await axios.post("http://localhost:3000/api/v1/user/signup", {
        firstName,
        lastName,
        username,
        password,
      });

      alert("Signup successful");

      navigate("/signin"); // redirect
    } catch (e) {
      alert("User already exists");
    }
  }

  return (
    <div>
      <h1>Signup</h1>

      <input
        placeholder="First Name"
        onChange={(e) => setFirstName(e.target.value)}
      />

      <input
        placeholder="Last Name"
        onChange={(e) => setLastName(e.target.value)}
      />

      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={sendRequest}>Signup</button>
    </div>
  );
}
