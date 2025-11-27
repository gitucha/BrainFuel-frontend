import React from "react";
import api from "../lib/api";

/**
 * Generic Paystack button.
 *
 * - Subscription: pass { planKey, amountMajor, purpose, redirectTo }.
 * - Shop: pass { amountMajor, purpose, shopThalers, redirectTo } and omit planKey.
 */
export default function PaystackButton({
  planKey,        // for subscriptions, e.g. "warrior"; leave undefined for shop
  amountMajor,    // numeric KES amount, e.g. 200, 600, 1200
  purpose,        // "subscription_warrior" or "shop_small"
  shopThalers,    // e.g. 500, 2000, 10000
  label,
  redirectTo = "/dashboard",
}) {
  const handleClick = async () => {
    try {
      const amt = Number(amountMajor);
      if (isNaN(amt) || amt <= 0) {
        throw new Error("Invalid amount");
      }

      const payload = {
        amount: amt,
        purpose,
      };

      if (planKey) {
        payload.plan_key = planKey;
      }

      if (shopThalers != null) {
        payload.shop_thalers = shopThalers;
      }

      console.debug("Paystack create-session payload:", payload);

      const res = await api.post("/premium/paystack/create-session/", payload);
      const { authorization_url, reference } = res.data || {};

      if (!authorization_url) {
        console.error("create-session missing authorization_url:", res.data);
        alert("Payment init failed.");
        return;
      }

      if (reference) {
        localStorage.setItem("last_paystack_reference", reference);
      }

      if (redirectTo) {
        localStorage.setItem("last_payment_redirect", redirectTo);
      }

      window.location.href = authorization_url;
    } catch (err) {
      console.error("create-session error full:", err);
      console.error("create-session error data:", err?.response?.data);
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.raw?.message ||
        err.message ||
        "Failed to start payment";
      alert(msg);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-green-600 text-white rounded-lg w-full"
    >
      {label || (planKey ? `Buy ${planKey} plan` : "Pay with Paystack")}
    </button>
  );
}
