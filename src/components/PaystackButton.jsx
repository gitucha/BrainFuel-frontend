import React from "react";
import { useAuth } from "../hooks/useAuth";

export default function PaystackButton({ planKey, amount }) {
  const { user } = useAuth();

  const createSession = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/premium/paystack/create-session/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
      body: JSON.stringify({
        email: user.email,
        amount,
        plan: planKey,
      }),
    });

    const data = await res.json();

    if (data.authorization_url) {
      window.location.href = data.authorization_url; // redirect user
    } else {
      alert("Payment session failed");
    }
  };

  return (
    <button
      onClick={createSession}
      className="px-4 py-2 bg-green-600 text-white rounded-lg w-full text-sm"
    >
      Buy this plan
    </button>
  );
}
