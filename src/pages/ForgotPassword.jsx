import React, { useState } from "react";
import api from "../lib/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/auth/password-reset/", { email });
      setSent(true);
    } catch {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-8">

        <h2 className="text-2xl font-bold text-center mb-4">
          Reset Your Password
        </h2>

        {sent ? (
          <p className="text-center text-green-600">
            If this email exists, a password reset link has been sent.
          </p>
        ) : (
          <>
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-3 rounded mb-4"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Send Reset Link
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}

export default ForgotPassword;
