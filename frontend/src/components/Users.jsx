import axios from "axios";
import { useEffect, useState } from "react";
import { User } from "./User";
import { Search } from "lucide-react";

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/user/bulk?filter=" + filter, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setUsers(response.data.users);
      });
  }, [filter]);

  return (
    <div>
      <div className="my-2 relative">
        {/* The Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>

        {/* The Input */}
        <input
          onChange={(e) => {
            setFilter(e.target.value);
          }}
          type="text"
          placeholder="Search for people"
          className="w-full pl-10 pr-3 py-2 border rounded border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-400"
        />
      </div>

      <div>
        {users.map((user) => (
          <User key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
};
