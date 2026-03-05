import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export const SendMoney = () => {
  const [searchParams] = useSearchParams();
  const [amount, setAmount] = useState("");

  const id = searchParams.get("id");
  const name = searchParams.get("name");

  async function transferMoney() {
    await axios.post(
      "http://localhost:3000/api/v1/account/transfer",
      {
        to: id,
        amount: Number(amount),
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      },
    );

    alert("Transfer successful");
  }

  return (
    <div className="flex justify-center h-screen bg-slate-300">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-4 h-max px-4">
          <div className="text-2xl font-bold pt-2">Send Money</div>

          <div className="flex justify-center mt-6">
            <div className="rounded-full h-12 w-12 bg-green-500 flex justify-center">
              <div className="flex flex-col justify-center h-full text-xl text-white">
                {name[0]}
              </div>
            </div>

            <div className="flex flex-col justify-center ml-2 text-xl">
              {name}
            </div>
          </div>

          <div className="pt-4 text-left">Amount (in Rs)</div>

          <input
            onChange={(e) => {
              setAmount(e.target.value);
            }}
            type="number"
            className="w-full px-2 py-1 border rounded border-slate-200"
            placeholder="Enter amount"
          />

          <button
            onClick={transferMoney}
            className="w-full bg-green-500 text-white py-2 rounded-lg mt-4"
          >
            Initiate Transfer
          </button>
        </div>
      </div>
    </div>
  );
};
