import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import logo from "../assets/Logo.svg";

export default function SendMoney() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const username = searchParams.get("username");

  const quickAmounts = [100, 250, 500, 1000, 2000];

  const numAmount = Number(amount);
  const hasInvalidInput = !amount || numAmount <= 0;
  const hasInsufficientBalance = balance !== null && numAmount > balance;
  const isButtonDisabled = loading || hasInvalidInput || hasInsufficientBalance;

  async function fetchBalance() {
    try {
      const result = await axios.get(
        "http://localhost:3000/api/v1/account/balance",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        },
      );
      setBalance(result.data.balance);
    } catch (err) {
      console.error("Error fetching balance:", err);
    }
  }

  useEffect(() => {
    fetchBalance();
  }, []);

  async function transferMoney() {
    if (isButtonDisabled) return;

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post(
        "http://localhost:3000/api/v1/account/transfer",
        {
          to: id,
          amount: numAmount,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        },
      );

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Transfer failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Navbar */}
      <div className="bg-white shadow-sm h-16 flex justify-between items-center px-6">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Rupi Pay Logo"
            className="h-16 w-auto object-contain"
          />
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm border px-4 py-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Main Card */}
      <div className="flex justify-center mt-20">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-[420px]">
          <h1 className="text-2xl font-bold text-center">Send Money</h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            Transfer funds instantly & securely
          </p>

          {/* Recipient info */}
          <div className="flex items-center gap-4 bg-green-50 p-4 rounded-xl mb-6">
            <div className="h-12 w-12 rounded-full bg-green-600 text-white flex items-center justify-center text-lg font-semibold">
              {name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{name}</p>
              <p className="text-sm text-gray-500">@{username}</p>
            </div>
          </div>

          {/* Quick select buttons */}
          <p className="text-xs font-semibold text-gray-500 mb-2">
            QUICK SELECT
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {quickAmounts.map((val) => (
              <button
                key={val}
                onClick={() => setAmount(val)}
                className="px-3 py-1 border rounded-full text-sm hover:bg-green-100"
              >
                ₹{val}
              </button>
            ))}
          </div>

          {/* Input Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Amount (in Rs)
            </label>
            <div
              className={`flex items-center border-2 rounded-xl px-3 py-3 transition-colors ${
                hasInsufficientBalance
                  ? "border-red-400 bg-red-50"
                  : "border-gray-100 focus-within:border-green-500"
              }`}
            >
              <span className="text-green-700 font-bold text-lg mr-2">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-transparent outline-none w-full text-lg font-medium"
                placeholder="0"
              />
            </div>
          </div>

          {/* Balance Helper Text */}
          <div className="mt-2 mb-6">
            <p
              className={`text-sm ${hasInsufficientBalance ? "text-red-500 font-medium" : "text-gray-500"}`}
            >
              Available Balance: ₹
              {balance !== null
                ? balance.toLocaleString("en-IN")
                : "Loading..."}
              {hasInsufficientBalance && " (Insufficient funds)"}
            </p>
          </div>

          {/* Status Message */}
          {message && (
            <div
              className={`mb-4 p-2 rounded text-sm text-center ${
                message.toLowerCase().includes("success")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {message}
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={transferMoney}
            disabled={isButtonDisabled}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-md ${
              isButtonDisabled
                ? "bg-gray-300 cursor-not-allowed shadow-none"
                : "bg-gradient-to-r from-green-500 to-green-700 hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : hasInsufficientBalance ? (
              "Insufficient Balance"
            ) : hasInvalidInput ? (
              "Enter Valid Amount"
            ) : (
              "Initiate Transfer →"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
