import React, { useEffect, useState } from "react";

export default function ThalerReward({ amount }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!amount || !visible) return null;

  return (
    <div className="fixed bottom-10 right-10 bg-yellow-300 text-black px-6 py-3 rounded-xl shadow-lg text-lg font-bold animate-pulse z-50">
      +{amount} Thalers!
    </div>
  );
}
