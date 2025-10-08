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
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 flex flex-col items-center justify-center">
      <Navbar />

      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center text-white mb-6">
          Welcome Back 👋
        </h1>
        <p className="text-center text-blue-100 mb-6">
          Please log in to your account
        </p>

        {error && (
          <p className="text-red-400 text-center font-semibold mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-blue-100 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-blue-200/40 rounded-lg p-3 bg-white/20 text-white placeholder-blue-200 focus:ring-2 focus:ring-white focus:outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-100 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-blue-200/40 rounded-lg p-3 bg-white/20 text-white placeholder-blue-200 focus:ring-2 focus:ring-white focus:outline-none"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white text-blue-700 font-bold py-3 rounded-lg hover:bg-blue-100 transition-all duration-300 shadow-lg hover:shadow-white/30"
          >
            Login
          </button>
        </form>

        <p className="text-center text-blue-100 mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-white font-semibold hover:underline cursor-pointer"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
