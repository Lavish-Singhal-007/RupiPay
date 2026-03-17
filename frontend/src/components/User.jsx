import { useNavigate } from "react-router-dom";

export const User = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate(
          "/chatWindow?id=" +
            user._id +
            "&name=" +
            user.firstName +
            " " +
            user.lastName +
            "&username=" +
            user.username,
        );
      }}
      className="flex justify-between items-center p-3 rounded-lg hover:bg-green-50 transition cursor-pointer"
    >
      {/* Left: Avatar + Name */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold text-lg">
          {user.firstName[0]}
        </div>

        <div className="flex flex-col">
          <span className="font-medium text-gray-800">
            {user.firstName} {user.lastName}
          </span>
          <span className="text-sm text-gray-500">@{user.username}</span>
        </div>
      </div>

      {/* Right: Send Money Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(
            "/sendMoney?id=" +
              user._id +
              "&name=" +
              user.firstName +
              " " +
              user.lastName +
              "&username=" +
              user.username,
          );
        }}
        className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg transition"
      >
        Send Money
      </button>
    </div>
  );
};
