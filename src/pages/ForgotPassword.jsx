import React, { useState } from "react";
import api from "../lib/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    try {
      const { data } = await api.post("/auth/password-reset/", { email });
      setInfo(data.message || "If this email exists, a reset link has been sent.");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send reset link");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-2">Reset your password</h2>
        <p className="text-sm text-gray-500 mb-4">We will send a link to your email if it exists.</p>

        {info && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded">{info}</div>}
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Your email" required className="w-full border rounded px-3 py-2" />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Send reset link</button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
