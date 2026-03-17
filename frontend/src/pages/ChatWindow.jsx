import { useEffect, useState } from "react";
import { PaymentCard } from "../components/PaymentCard";
import { TextBubble } from "../components/TextBubble";
import { useSearchParams } from "react-router-dom";
import { Send } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.svg";

export default function ChatWindow() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [searchParams] = useSearchParams();
  const otherUserId = searchParams.get("id");
  const otherName = searchParams.get("name");
  const otherUsername = searchParams.get("username");

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/v1/chat/history/${otherUserId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setMessages(res.data);
      });
  }, [otherUserId]);

  const handleSendMessage = (e) => {
    e.preventDefault(); // Prevents the page from reloading
    if (!input.trim()) return; // Don't send empty messages

    // Call your API or Socket logic here
    console.log("Sending message:", input);

    // Clear the input after sending
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen bg-[#EEF8F1]">
      <div className="bg-white shadow-sm h-16 flex justify-between items-center px-6 shrink-0">
        <div className="flex items-center gap-4 h-full">
          {/* 1. Logo */}
          <img
            src={logo}
            alt="Rupi Pay Logo"
            className="h-8 w-auto object-contain"
          />

          {/* 2. Vertical Divider */}
          <div className="h-8 w-[1px] bg-gray-500"></div>

          {/* 3. Receiver Info Section (Simplified to fit h-16) */}
          <div className="flex items-center gap-3">
            {/* Avatar - Sized to fit comfortably in 64px height */}
            <div className="h-10 w-10 rounded-full bg-[#529E58] text-white flex items-center justify-center text-base font-bold shrink-0">
              {otherName?.[0]?.toUpperCase() || "U"}
            </div>

            {/* Text - Stacked tightly */}
            <div className="flex flex-col justify-center">
              <p className="font-bold text-slate-800 text-sm md:text-base leading-tight">
                {otherName}
              </p>
              <p className="text-xs text-slate-500 leading-tight">
                @{otherUsername}
              </p>
            </div>
          </div>
        </div>

        {/* 4. Navigation Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm border px-4 py-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>
      {/* 1. SCROLLABLE CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32 scrollbar-hide">
        {messages.map((msg, index) => {
          const isSender = msg.receiverId === otherUserId;

          // Logic for Date Separator (Only show if date changes)
          const currentDate = new Date(msg.timestamp).toDateString();
          const prevDate =
            index > 0
              ? new Date(messages[index - 1].timestamp).toDateString()
              : null;
          const showSeparator = currentDate !== prevDate;

          return (
            <div key={msg._id} className="flex flex-col">
              {/* Date Separator Line */}
              {showSeparator && (
                <div className="flex items-center my-6 opacity-40">
                  <div className="flex-grow border-t border-gray-400"></div>
                  <span className="mx-4 text-xs font-medium text-gray-1000 uppercase">
                    {new Date(msg.timestamp).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <div className="flex-grow border-t border-gray-400"></div>
                </div>
              )}

              {/* Message Content */}
              <div
                className={`flex w-full ${isSender ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-[85%]">
                  {msg.type === "TEXT" ? (
                    <TextBubble content={msg.content} isSender={isSender} />
                  ) : (
                    <PaymentCard
                      amount={msg.transactionId?.amount / 100}
                      date={msg.timestamp}
                      isSender={isSender}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. FIXED BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-sm border-t border-gray-100 flex items-center space-x-3">
        {/* Pay Button */}
        <form
          onSubmit={handleSendMessage}
          className="flex items-center w-full gap-3"
        >
          <button
            type="button"
            className="bg-green-700 text-white px-10 py-3 rounded-full font-semibold hover:bg-green-800 transition-all shadow-md active:scale-95"
            onClick={() => {
              navigate(
                "/sendMoney?id=" +
                  otherUserId +
                  "&name=" +
                  otherName +
                  "&username=" +
                  otherUsername,
              );
            }}
          >
            Pay
          </button>

          {/* Input Field Area */}
          <div className="flex-1 flex items-center bg-[#f0f4f9] rounded-full px-5 py-2.5 focus-within:bg-white focus-within:ring-1 focus-within:ring-green-200 transition-all">
            <input
              type="text"
              placeholder="Message..."
              className="bg-transparent flex-1 outline-none text-gray-800 text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="ml-2 text-gray-500 hover:text-green-800 transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
