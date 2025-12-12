import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!acceptedTerms) {
      setError("You must accept the Terms & Conditions to continue.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // keep existing signature: register(email, username, password)
      await register(form.email, form.username, form.password);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      if (err?.response?.data) {
        const serverMsg = Object.values(err.response.data).flat()[0];
        setError(serverMsg);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl bg-white/80 backdrop-blur shadow-xl rounded-2xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        {/* Left panel */}
        <div className="hidden md:flex md:w-1/2 bg-linear-to-br from-blue-600 to-indigo-700 text-white flex-col justify-between p-8">
          <div>
            <h1 className="text-3xl font-extrabold mb-2">Welcome to BrainFuel</h1>
            <p className="text-sm text-blue-100">
              Turn your daily practice into a game. Earn thalers, level up, and unlock achievements as you learn.
            </p>
          </div>

          <div className="mt-8 space-y-3 text-sm text-blue-100">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚡</span>
              <span>Gamified quizzes that keep you engaged.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🏆</span>
              <span>Unlock achievements as you hit your goals.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">💎</span>
              <span>Earn thalers and spend them in the shop.</span>
            </div>
          </div>

          <p className="text-xs text-blue-100/80 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="underline font-semibold text-white">
              Log in
            </Link>
          </p>
        </div>

        {/* Right panel – form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center md:text-left">
            Create your account
          </h2>
          <p className="text-sm text-gray-500 mb-6 text-center md:text-left">
            Sign up to start quizzes, earn thalers, and track your progress.
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 border border-red-100 p-3 rounded-md text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                required
                onChange={handleChange}
                value={form.email}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                required
                onChange={handleChange}
                value={form.username}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your username"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  onChange={handleChange}
                  value={form.password}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  onChange={handleChange}
                  value={form.confirmPassword}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Repeat password"
                />
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-2 mt-2">
              <input
                id="terms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={() => setAcceptedTerms((v) => !v)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="terms" className="text-xs text-gray-600">
                I have read and accept the{" "}
                <Link
                  to="/terms"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Terms & Conditions
                </Link>{" "}
                {" "}
                <Link
                  to="/help"
                  className="text-blue-600 font-medium hover:underline"
                >
                
                </Link>
                .
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !acceptedTerms}
              className={`w-full mt-2 py-2.5 rounded-md text-white text-sm font-semibold shadow-sm transition ${
                loading || !acceptedTerms
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Creating your account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6 md:text-left">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
