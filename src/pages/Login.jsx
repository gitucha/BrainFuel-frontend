import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Invalid email or password";
      setError(msg);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-lg shadow overflow-hidden">
        
        <div className="p-10 bg-blue-50 flex items-center justify-center">
          <div>
            <h2 className="text-2xl font-bold text-blue-700">
              Level Up Your Mind with BrainFuel
            </h2>
            <p className="mt-3 text-gray-600">
              Join thousands of learners and start boosting your knowledge.
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="p-10 flex flex-col justify-center">
          <h3 className="text-lg font-semibold mb-6">Welcome Back, Learner!</h3>

          {error && (
            <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 border rounded p-3"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 border rounded p-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="flex justify-between mt-4 text-sm text-gray-500">
           <Link to="/forgot-password">Forgot Password?</Link>

            <Link to="/register" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
