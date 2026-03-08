import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";

import axios from "axios";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [balance, setBalance] = useState("Loading...");
  const [name, setName] = useState("");
  const [lastUpdated, setLastUpdated] = useState(new Date());

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
            <p className="text-xl font-semibold">₹12,850</p>
            <p className="text-sm text-gray-500">Total Sent</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-xl font-semibold">₹8,200</p>
            <p className="text-sm text-gray-500">Total Received</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-xl font-semibold">24</p>
            <p className="text-sm text-gray-500">Transactions</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Users */}
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Users</h2>
              <span className="text-green-600 text-sm cursor-pointer">
                View all
              </span>
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
                <span className="text-green-600 text-sm cursor-pointer">
                  See all
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Shalvi Singhal</span>
                  <span className="text-green-600">+₹500</span>
                </div>

                <div className="flex justify-between">
                  <span>Lavish Singhal</span>
                  <span className="text-red-500">-₹1,200</span>
                </div>

                <div className="flex justify-between">
                  <span>Amit Singhal</span>
                  <span className="text-green-600">+₹2,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
