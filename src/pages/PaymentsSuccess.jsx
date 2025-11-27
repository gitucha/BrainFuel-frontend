
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../lib/api";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function PaymentsSuccess() {
  const query = useQuery();

  useEffect(() => {
    const reference = query.get("reference");
    if (!reference) return;

    (async () => {
      try {
        const res = await api.post("/premium/paystack/verify/", { reference });
        console.log("verify result:", res.data);

        if (res.data.status === "success") {
          const redirectPath =
            localStorage.getItem("last_payment_redirect") || "/dashboard";

          localStorage.removeItem("last_payment_redirect");
          localStorage.removeItem("last_paystack_reference");

          // Hard reload so useAuth refetches user with updated thalers
          window.location.href = redirectPath;
        } else {
          console.warn("Verify did not return success:", res.data);
        }
      } catch (e) {
        console.error("Verify error", e);
      }
    })();
  }, [query]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-6 bg-white rounded-xl shadow">
        <h1 className="text-xl font-semibold mb-2">Processing your payment…</h1>
        <p className="text-gray-600">
          Please wait while we verify your transaction.
        </p>
      </div>
    </div>
  );
}
