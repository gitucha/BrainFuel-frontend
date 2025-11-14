import React from "react";
import api from "../lib/api";

const PaystackCheckout = ({ amount, purpose = "thalers", onSuccess }) => {
  const initPayment = async () => {
    try {
      const { data } = await api.post("/premium/create/", {
        amount,
        purpose,
      });

      const { authorization_url, reference } = data;

      // Open Paystack payment page
      window.open(authorization_url, "_blank");

      // Return reference so frontend can verify later
      if (onSuccess) onSuccess(reference);
    } catch (err) {
      console.error(err);
      alert("Payment initialization failed.");
    }
  };

  return (
    <button
      onClick={initPayment}
      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
    >
      Pay {amount}
    </button>
  );
};

export default PaystackCheckout;
