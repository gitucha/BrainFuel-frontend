import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../hooks/useAuth";

export default function PaystackCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth(); // must exist: function to re-fetch /api/auth/me
  const [status, setStatus] = useState("Verifying payment...");

  useEffect(() => {
    const verify = async () => {
      // Paystack typically returns reference in query string (e.g., ?reference=...)
      const referenceQuery = searchParams.get("reference") || localStorage.getItem("last_paystack_reference");
      if (!referenceQuery) {
        setStatus("No payment reference found.");
        return;
      }

      try {
        const res = await api.post("/premium/paystack/verify/", { reference: referenceQuery });
        // response contains thalers awarded or status
        setStatus("Payment verified. Updating account...");
        // refresh user data
        await refreshUser();
        // cleanup
        localStorage.removeItem("last_paystack_reference");
        // redirect to dashboard or success page
        setTimeout(() => navigate("/dashboard"), 1200);
      } catch (err) {
        console.error("Verification error", err);
        setStatus("Verification failed. Check the console.");
      }
    };

    verify();
  }, [searchParams, navigate, refreshUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow">
        <h3 className="font-semibold mb-2">Payment Status</h3>
        <p>{status}</p>
      </div>
    </div>
  );
}
