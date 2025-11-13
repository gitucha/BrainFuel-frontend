import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";

function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handle = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post(`/auth/password-reset-confirm/${uid}/${token}/`, { password });
      setMsg("Password changed. Redirecting to login...");
      setTimeout(()=>navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-2">Choose a new password</h2>
        {msg && <div className="p-3 bg-green-50 text-green-700 rounded mb-3">{msg}</div>}
        {error && <div className="p-3 bg-red-50 text-red-700 rounded mb-3">{error}</div>}
        <form onSubmit={handle} className="space-y-3">
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required placeholder="New password" className="w-full border rounded px-3 py-2" />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Change password</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
