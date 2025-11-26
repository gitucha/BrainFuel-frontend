import React from "react";
import api from "../lib/api"; // your axios instance that includes auth header
import { useAuth } from "../hooks/useAuth";


export default function PaystackButton({ planKey, amountMajor, purpose = "purchase" }) {
  // amountMajor: number in major units (e.g., 19.99)
  const { user } = useAuth();

  const handleClick = async () => {
    try {
      // send amount in major units (backend will convert to minor)
      const payload = { amount: amountMajor, purpose };
      const res = await api.post("/premium/paystack/create-session/", payload);
      const { authorization_url, reference } = res.data;

      // Save reference locally so you can verify after redirect (optional)
      localStorage.setItem("last_paystack_reference", reference);

      // Redirect user to Paystack checkout
      window.location.href = authorization_url;
    } catch (err) {
      console.error("Create session failed", err);
      alert("Failed to start payment. Try again.");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-green-600 text-white rounded-lg w-full text-sm"
    >
      Pay {amountMajor} USD
    </button>
  );
}
