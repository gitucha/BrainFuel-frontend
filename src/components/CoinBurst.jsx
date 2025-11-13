import React, { useEffect } from "react";

function CoinBurst({ amount, onDone }) {
  useEffect(() => {
    if (!amount) return;
    const t = setTimeout(onDone, 1600);
    return () => clearTimeout(t);
  }, [amount, onDone]);

  if (!amount) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pointer-events-none">
      <div className="mt-24 animate-burst">
        <div className="text-yellow-500 text-4xl font-bold drop-shadow">+{amount} 🪙</div>
      </div>

      <style>{`
        @keyframes burst {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-80px) scale(1.4); opacity: 0; }
        }
        .animate-burst { animation: burst 1.6s ease-out forwards; }
      `}</style>
    </div>
  );
}

export default CoinBurst;
