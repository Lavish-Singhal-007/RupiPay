import { CheckIcon, ChevronRight } from "lucide-react";

export function PaymentCard({ amount, date, isSender }) {
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    let currYear = now.getFullYear();
    let currMonth = now.getMonth();
    let currDate = now.getDate();

    const storedYear = date.getFullYear();
    const storedMonth = date.getMonth();
    const storedDate = date.getDate();

    const t = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    if (
      currYear === storedYear &&
      currMonth === storedMonth &&
      currDate === storedDate
    ) {
      return `Today, ${t}`;
    }
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    currDate = yesterday.getDate();
    currMonth = yesterday.getMonth();
    currYear = yesterday.getFullYear();

    if (
      currYear === storedYear &&
      currMonth === storedMonth &&
      currDate === storedDate
    ) {
      return `Yesterday, ${t}`;
    }
    const d = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${d} at ${t}`;
  };

  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm w-72 transition-transform active:scale-95 cursor-pointer">
        <p className="text-gray-500 text-sm">
          {isSender ? "Payment to Friend" : "Payment to You"}
        </p>
        <h2 className="text-4xl font-bold my-3 text-gray-800">
          ₹{amount.toLocaleString("en-IN")}
        </h2>

        <div className="flex items-center justify-between border-t pt-3 mt-2">
          <div className="flex items-center text-green-600 font-medium text-sm">
            <span className="bg-green-600 text-white rounded-full p-0.5 mr-2">
              <CheckIcon size={12} /> {/* Using Lucide React icons */}
            </span>
            Paid • {formatDateTime(date)}
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}
