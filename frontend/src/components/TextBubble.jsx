export const TextBubble = ({ content, isSender, date }) => {
  const t = new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div
      className={`
        px-3 py-1.5 
        text-sm shadow-sm
        ${
          isSender
            ? "bg-green-700 text-white rounded-2xl rounded-tr-none ml-auto"
            : "bg-white text-slate-800 rounded-2xl rounded-tl-none mr-auto border border-gray-100"
        }
      `}
      style={{
        width: "fit-content",
        maxWidth: "70%",
        minWidth: "fit-content",
      }}
    >
      {/* This container allows text and time to sit side-by-side if there's room */}
      <div className="flex flex-row items-end gap-3">
        {/* 1. Message Text */}
        <p className="leading-relaxed whitespace-pre-wrap">{content}</p>

        {/* 2. Timestamp - Pushed to the bottom right of the flex row */}
        <span
          className={`
            text-[10px] leading-none mb-0.5 whitespace-nowrap
            ${isSender ? "text-green-200/80" : "text-slate-400"}
          `}
        >
          {t}
        </span>
      </div>
    </div>
  );
};
