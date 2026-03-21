import { QRCodeSVG } from "qrcode.react";

export const MyPaymentQR = ({ username }) => {
  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 w-full gap-4">
      <p className="mt-6 text-xs text-gray-400 uppercase tracking-widest">
        Scan to pay
      </p>
      <div className="p-3 border-4 border-green-500 rounded-xl">
        <QRCodeSVG
          value={username}
          size={200}
          level="H" // High error correction
          marginSize={4}
        />
      </div>

      <div className="flex flex-col items-center">
        <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">
          Powered by
        </span>
        <span className="text-green-600 font-extrabold text-sm tracking-tight">
          RUPI PAY
        </span>
      </div>
    </div>
  );
};
