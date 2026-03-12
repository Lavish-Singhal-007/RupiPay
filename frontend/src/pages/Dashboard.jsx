import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";

import axios from "axios";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [balance, setBalance] = useState("Loading...");
  const [totalSent, setTotalSent] = useState("Loading...");
  const [totalReceived, setTotalReceived] = useState("Loading...");
  const [totalTransactions, setTotalTransactions] = useState("Loading...");
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [history, setHistory] = useState([]);
  const [name, setName] = useState("");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [unlockHistory, setUnlockHistory] = useState(false);

  async function fetchBalance() {
    const response = await axios.get(
      "http://localhost:3000/api/v1/account/balance",
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      },
    );

    setBalance(response.data.balance);
    setName(response.data.firstName);
    setLastUpdated(new Date());
  }

  useEffect(() => {
    fetchBalance();
  }, []);

  async function fetchTotal() {
    const response = await axios.get(
      "http://localhost:3000/api/v1/transaction/total",
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      },
    );

    setTotalSent(response.data.moneySent);
    setTotalReceived(response.data.moneyReceived);
    setTotalTransactions(response.data.transactions);
  }

  useEffect(() => {
    fetchTotal();
  }, []);

  async function fetchRecentTransactions() {
    const response = await axios.get(
      "http://localhost:3000/api/v1/transaction/recent",
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      },
    );
    setRecentTransactions(response.data.formattedTransactions);
  }

  useEffect(() => {
    fetchRecentTransactions();
  }, []);

  async function fetchHistory() {
    const response = await axios.get(
      "http://localhost:3000/api/v1/transaction/history",
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      },
    );
    setHistory(response.data.formattedTransactions);
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="bg-[#EEF8F1] min-h-screen">
      <Appbar User={name} />
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Balance Card */}
        <Balance
          value={balance}
          refreshBalance={fetchBalance}
          lastUpdated={lastUpdated}
        />

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-xl font-semibold">
              ₹{totalSent?.toLocaleString("en-IN")}
            </p>
            <p className="text-sm text-gray-500">Total Sent</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-xl font-semibold">
              ₹{totalReceived?.toLocaleString("en-IN")}
            </p>
            <p className="text-sm text-gray-500">Total Received</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-xl font-semibold">{totalTransactions}</p>
            <p className="text-sm text-gray-500">Transactions</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Users */}
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Users</h2>
            </div>

            <Users />
          </div>

          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

              <div className="grid grid-cols-4 gap-4 text-center">
                <button className="p-3 bg-green-100 rounded-lg">
                  💸
                  <p className="text-xs mt-1">Send</p>
                </button>

                <button className="p-3 bg-blue-100 rounded-lg">
                  🔄
                  <p className="text-xs mt-1">Request</p>
                </button>

                <button className="p-3 bg-yellow-100 rounded-lg">
                  📱
                  <p className="text-xs mt-1">Recharge</p>
                </button>

                <button className="p-3 bg-purple-100 rounded-lg">
                  🧾
                  <p className="text-xs mt-1">Bills</p>
                </button>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-semibold">Recent Transactions</h2>
                <button
                  className="text-green-600 text-sm cursor-pointer"
                  onClick={() => {
                    setUnlockHistory(!unlockHistory);
                  }}
                >
                  {unlockHistory ? "Show less" : "See all"}
                </button>
              </div>

              {(unlockHistory ? history : recentTransactions).map((t) => (
                <div
                  key={t.id}
                  className="flex justify-between items-center py-2"
                >
                  <div>
                    <p className="font-medium text-slate-800">{t.name}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(t.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={
                      t.type === "sent" ? "text-red-500" : "text-green-500"
                    }
                  >
                    {t.type === "sent" ? "-" : "+"}₹{t.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
