import React, { useEffect } from "react";

function ThalerToast({ amount, onClose }) {
  useEffect(() => {
    if (!amount) return;
    const id = setTimeout(onClose, 3000);
    return () => clearTimeout(id);
  }, [amount, onClose]);

  if (!amount) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="px-4 py-3 bg-yellow-100 border border-yellow-300 rounded shadow text-yellow-800">
        +{amount} Thalers
      </div>
    </div>
  );
}

export default ThalerToast;
