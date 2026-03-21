import { Routes, Route } from "react-router-dom";

import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import SendMoney from "./pages/SendMoney";
import Profile from "./pages/Profile";
import ChatWindow from "./pages/ChatWindow";
import ScanToPay from "./pages/ScanToPay";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/sendMoney" element={<SendMoney />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/chatWindow" element={<ChatWindow />} />
      <Route path="/scanToPay" element={<ScanToPay />} />
    </Routes>
  );
}

export default App;
