import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";

function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post(`/auth/password-reset-confirm/${uid}/${token}/`, { password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
        console.error(err);
      setError("Invalid or expired link.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-8">

        <h2 className="text-2xl font-bold text-center mb-4">
          Choose a New Password
        </h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>
        )}

        {success ? (
          <p className="text-green-600 text-center">
            Password updated! Redirecting...
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="New password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-3 rounded mb-4"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Update Password
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

export default ResetPassword;
