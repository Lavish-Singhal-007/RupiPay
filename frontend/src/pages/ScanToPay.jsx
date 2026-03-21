import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ScanToPay() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    let isScanning = true; // "Lock" to prevent double triggers

    const scanner = new Html5QrcodeScanner("reader", {
      fps: 15,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
      showTorchButtonIfSupported: true,
    });

    async function findUser(decodedText) {
      const response = await axios.get(
        `http://localhost:3000/api/v1/user/info/${decodedText}`,
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        },
      );
      return response.data;
    }

    const onScanSuccess = async (decodedText) => {
      if (!isScanning) return; // Exit if we are already processing a scan
      isScanning = false;

      if (navigator.vibrate) {
        navigator.vibrate(50); // a short 50ms vibration
      }

      console.log("Found User:", decodedText);

      try {
        // 1. Stop the camera immediately
        await scanner.clear();

        // 2. Fetch the data
        const data = await findUser(decodedText);
        const { userId, name, username } = data;

        // 3. Navigate with encoded URI components
        navigate(
          `/sendMoney?id=${userId}&name=${encodeURIComponent(name)}&username=${encodeURIComponent(username)}`,
        );
      } catch (err) {
        console.error("Scan processing failed:", err);
        isScanning = true; // Unlock if there was an error so user can try again
      }
    };

    scanner.render(onScanSuccess);

    return () => {
      isScanning = false;
      scanner
        .clear()
        .catch((err) => console.error("Scanner cleanup failed:", err));
    };
  }, [navigate]);

  return (
    <div className="bg-[#EEF8F1] min-h-screen p-4 md:p-8 flex flex-col items-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 -ml-2 text-gray-400 hover:text-black transition-colors"
          >
            ← Back
          </button>
          <h1 className="flex-1 text-center text-xl font-extrabold text-gray-800 mr-8">
            Scan & Pay
          </h1>
        </div>

        {/* Viewport Container */}
        <div className="relative group">
          <div
            id="reader"
            className="rounded-2xl overflow-hidden border-4 border-gray-50 shadow-inner"
          ></div>

          {/* Decorative Corner Overlays for UI feel */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-green-500 rounded-tl-lg"></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-green-500 rounded-tr-lg"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-green-500 rounded-bl-lg"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-green-500 rounded-br-lg"></div>
        </div>

        {/* Instructions */}
        <div className="mt-10 text-center space-y-3">
          <p className="text-gray-700 font-bold">Align QR Code to Scan</p>
          <p className="text-sm text-gray-400 px-6">
            Scan any Rupi Pay QR to instantly fetch the receiver's details.
          </p>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
