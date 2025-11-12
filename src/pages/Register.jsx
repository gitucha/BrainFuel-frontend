import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await register(form.email, form.username, form.password);
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            if (err.response?.data) {
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
        <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-blue-50 to-white px-4">
            <div className="bg-white shadow-md rounded-xl w-full max-w-md p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
                    Create Your BrainFuel Account
                </h2>
                <p className="text-sm text-gray-500 text-center mb-8">
                    Join now and start your learning adventure
                </p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-600">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            onChange={handleChange}
                            value={form.email}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-600">Username</label>
                        <input
                            type="text"
                            name="username"
                            required
                            onChange={handleChange}
                            value={form.username}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Your username"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-600">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            onChange={handleChange}
                            value={form.password}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded-md text-white font-medium transition ${loading
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
