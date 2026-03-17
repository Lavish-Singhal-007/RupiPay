export const TextBubble = ({ content, isSender }) => {
  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
          isSender
            ? "bg-blue-600 text-white rounded-tr-none"
            : "bg-gray-200 text-gray-800 rounded-tl-none"
        }`}
      >
        {content}
      </div>
    </div>
  );
};
