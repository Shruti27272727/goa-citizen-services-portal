import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    login(null);
    localStorage.removeItem("token");

    try {
      const res = await axios.post(`${backendUrl}/auth/login`, {
        email,
        password,
      });
      const user = res.data.user;

      login(user);
      localStorage.setItem("token", res.data.token);

      switch (user.role) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "officer":
          navigate("/officer-dashboard");
          break;
        case "citizen":
          navigate("/apply-service");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-blue-100 to-blue-300">
      <Navbar />

      <div className="relative z-10 bg-white/60 backdrop-blur-xl border border-gray-200 p-10 rounded-3xl shadow-2xl w-full max-w-md transform hover:scale-[1.01] transition-transform duration-300">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-2">
          Welcome Back 👋
        </h1>
        <p className="text-center text-gray-600 mb-8 text-sm">
          Log in to continue to your account
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 rounded-lg p-3 text-center font-medium mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-xl p-3 bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-xl p-3 bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-3 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-gray-600 mt-8">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-indigo-600 font-semibold hover:underline cursor-pointer hover:text-purple-600"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
