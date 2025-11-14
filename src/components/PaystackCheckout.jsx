import React from "react";
import { usePaystackPayment } from "react-paystack";
import api from "../lib/api";

const PaystackCheckout = ({ amount, email, planName, onSuccess }) => {
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC;

  const initialize = usePaystackPayment({
    reference: `${Date.now()}`,
    email,
    amount: amount * 100,
    publicKey,
    metadata: { planName },
  });

  const handlePayment = () => {
    initialize({
      onSuccess: async (ref) => {
        try {
          await api.post("/premium/verify/", {
            reference: ref.reference,
            plan: planName,
          });
          onSuccess();
        } catch {
          alert("Payment verification failed.");
        }
      },
      onClose: () => {},
    });
  };

  return (
    <button
      onClick={handlePayment}
      className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      Buy {planName}
    </button>
  );
};

export default PaystackCheckout;
