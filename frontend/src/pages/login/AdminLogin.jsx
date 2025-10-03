import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api"; // <-- CORRECT: Import the shared API helper

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Use the imported api helper for the request
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        // Store the JWT token from the response
        localStorage.setItem("admin-token", response.data.token);
        
        // No longer need these old items
        localStorage.removeItem("isAuthenticated");
        sessionStorage.removeItem("admin-password");
        
        navigate("/admin/dashboard");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Administrator Login</h2>
          <p className="text-gray-600 mt-2">Access your admin panel.</p>
        </div>

        {error && <div className="mb-4 text-red-600 text-sm font-medium text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@college.com"
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl transition hover:bg-blue-700 disabled:opacity-70">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Forgot your password? <Link to="/forgot-password" className="text-blue-600 hover:underline">Reset here</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;