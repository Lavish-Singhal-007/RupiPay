import { RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

export const Balance = ({ value, refreshBalance, lastUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [timeText, setTimeText] = useState("Updated just now");

  const handleRefresh = async () => {
    setLoading(true);
    await refreshBalance();
    setTimeout(() => setLoading(false), 600);
  };

  useEffect(() => {
    const updateTime = () => {
      const minutes = Math.floor((new Date() - lastUpdated) / 60000);

      if (minutes === 0) {
        setTimeText("Updated just now");
      } else if (minutes === 1) {
        setTimeText("Updated 1 min ago");
      } else {
        setTimeText(`Updated ${minutes} mins ago`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, [lastUpdated]);

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-green-800 to-green-700 text-white rounded-2xl p-6 shadow-xl flex justify-between items-center transition-transform duration-200 hover:scale-[1.02]">
      {/* Balance Info */}
      <div>
        <p className="text-xs tracking-wider opacity-80">
          TOTAL WALLET BALANCE
        </p>

        <h1 className="text-4xl font-bold mt-1">
          ₹ {value?.toLocaleString("en-IN")}
        </h1>

        <p className="text-xs opacity-70 mt-2">{timeText}</p>
      </div>
      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition"
        >
          <RefreshCw size={18} className={`${loading ? "animate-spin" : ""}`} />
          <span className="text-sm">Refresh</span>
        </button>

        <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold">
          + Add Money
        </button>

        <button className="border border-white hover:bg-white hover:text-green-800 px-4 py-2 rounded-lg">
          Withdraw
        </button>
      </div>
    </div>
  );
};
