import { useEffect, useState, useRef } from "react";
import { PaymentCard } from "../components/PaymentCard";
import { TextBubble } from "../components/TextBubble";
import { useSearchParams } from "react-router-dom";
import { Send } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.svg";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  auth: {
    token: localStorage.getItem("token"),
  },
});

export default function ChatWindow() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [searchParams] = useSearchParams();
  const otherUserId = searchParams.get("id");
  const otherName = searchParams.get("name");
  const otherUsername = searchParams.get("username");
  const scrollRef = useRef(null);

  useEffect(() => {
    // Listen for incoming messages
    socket.on("receive-message", (newMessage) => {
      // Only add if it's from the person we are currently chatting with
      if (newMessage.senderId === otherUserId) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => {
      socket.off("receive-message"); // Cleanup on unmount
    };
  }, [otherUserId]);

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
    const messageData = {
      receiverId: otherUserId,
      content: input,
      type: "TEXT",
      timestamp: new Date(),
    };

    // 1. Send to Server via WebSocket
    socket.emit("send-message", messageData);

    // 2. Optimistic Update: Add to your own screen immediately
    setMessages((prev) => [...prev, { ...messageData, _id: Date.now() }]);

    // Clear the input after sending
    setInput("");
  };

  useEffect(() => {
    // behavior: "smooth" makes it slide, "auto" makes it instant
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // This runs every time the messages array updates

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
                className={`flex w-full mb-2 ${isSender ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex flex-col ${isSender ? "items-end" : "items-start"} max-w-[70%]`}
                >
                  {msg.type === "TEXT" ? (
                    <TextBubble
                      content={msg.content}
                      isSender={isSender}
                      date={msg.timestamp}
                    />
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
        <div ref={scrollRef} />
      </div>

      {/* 2. FIXED BOTTOM ACTION BAR */}
      <footer className="bg-white border-t border-gray-100 p-4 pb-6">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
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

          <form
            onSubmit={handleSendMessage}
            className="flex-1 flex items-center bg-gray-100 rounded-2xl px-4 py-1 focus-within:bg-white focus-within:ring-2 focus-within:ring-green-100 transition-all border border-transparent focus-within:border-green-200"
          >
            <input
              type="text"
              placeholder="Write a message..."
              className="bg-transparent flex-1 outline-none text-gray-800 text-sm py-3"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="h-4 w-[1px] bg-gray-300 mx-2"></div>
            <button
              type="submit"
              className="text-green-600 disabled:text-gray-400 transition-colors shrink-0"
              disabled={!input.trim()}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}
