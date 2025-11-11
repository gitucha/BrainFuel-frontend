import React from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("access", "demo-token");
    navigate("/dashboard");
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
          <input type="email" placeholder="Email" required className="w-full mb-4 border rounded p-3" />
          <input type="password" placeholder="Password" required className="w-full mb-6 border rounded p-3" />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
            Login
          </button>
          <div className="flex justify-between mt-4 text-sm text-gray-500">
            <a href="#">Forgot Password?</a>
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
