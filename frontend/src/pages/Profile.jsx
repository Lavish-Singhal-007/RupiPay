import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/user/profile", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        setUser(response.data);
        setFirstName(response.data.firstName);
        setLastName(response.data.lastName);
      })
      .catch(() => navigate("/signin"));
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/v1/user/logout",
        {},
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        },
      );
    } catch (e) {
      console.error("Backend logout failed, clearing local state anyway.");
    }
    localStorage.removeItem("token");
    navigate("/signin");
  };

  if (!user) return <div className="flex justify-center mt-10">Loading...</div>;

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        "http://localhost:3000/api/v1/user/update",
        {
          firstName,
          lastName,
          password,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        },
      );
      setMessage(response.data.message);
      setPassword("");
    } catch (e) {
      setMessage(
        e.response?.data?.message || "Server unreachable. Try again later.",
      );
    } finally {
      setLoading(false);
    }

    const updatedUser = await axios.get(
      "http://localhost:3000/api/v1/user/profile",
      {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      },
    );
    setUser(updatedUser.data);
  };

  const isDisabled =
    (firstName === user.firstName &&
      lastName === user.lastName &&
      password.length === 0) ||
    (password.length < 6 && password.length !== 0) ||
    firstName.length === 0 ||
    lastName.length === 0 ||
    loading;

  return (
    <div className="bg-[#EEF8F1] min-h-screen p-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-600 hover:text-black"
          >
            ← Back
          </button>

          <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>

          <div className="w-8"></div>
        </div>
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="h-24 w-24 bg-green-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4">
            {user.firstName?.[0]}
          </div>

          <h2 className="text-xl font-semibold">
            {user.firstName} {user.lastName}
          </h2>

          <p className="text-gray-500">{user.username}</p>
        </div>
        {/* Update Profile */}
        <div className="space-y-4 border-t pt-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700">
            Update Profile
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputBox
              label="First Name"
              placeholder="Enter first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <InputBox
              label="Last Name"
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <InputBox
            label="New Password (optional)"
            type="password"
            placeholder="Min 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="pt-2">
            <Button
              onClick={handleUpdate}
              label={loading ? "Updating..." : "Save Changes"}
              disabled={
                isDisabled || (password.length > 0 && password.length < 6)
              }
            />

            {message && (
              <p
                className={`text-sm mt-2 text-center ${
                  message.includes("success")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
        {/* Wallet Balance */}
        <div className="space-y-4 border-t pt-6">
          <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Wallet Balance</span>

            <span className="font-bold text-green-600 text-lg">
              ₹ {user.balance?.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full mt-12 py-3 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-colors border border-red-200"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
