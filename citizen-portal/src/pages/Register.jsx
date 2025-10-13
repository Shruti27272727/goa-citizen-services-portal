import React, { useState, useContext } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const Register = () => {
  const [name, setName] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !aadhaar) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const res = await axios.post(`${backendUrl}/auth/register`, {
        name,
        email,
        phone: aadhaar,
        password,
        address,
        aadhaar,
      });

      const userData = res.data.user;
      login(userData);
      localStorage.setItem("token", userData.token || "");

      alert("Registration successful!");

      if (userData.role === "citizen") navigate("/apply-service");
      else if (userData.role === "officer") navigate("/officer-dashboard");
      else if (userData.role === "admin") navigate("/admin-dashboard");
    } catch (err) {
      setError(
        "Registration failed: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-blue-100 to-blue-300">
      <Navbar />

      <div className="relative z-10 bg-white/70 backdrop-blur-xl border border-gray-200 p-10 rounded-3xl shadow-2xl w-full max-w-md transform hover:scale-[1.01] transition-transform duration-300 mt-16">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-2">
          Citizen Registration 📝
        </h1>
        <p className="text-center text-gray-600 mb-8 text-sm">
          Create your account to get started
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 rounded-lg p-3 text-center font-medium mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl p-3 bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Aadhaar / Phone
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl p-3 bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
              placeholder="Enter your Aadhaar or phone number"
              value={aadhaar}
              onChange={(e) => setAadhaar(e.target.value)}
              required
            />
          </div>

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
              Address
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl p-3 bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-xl p-3 bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-3 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-600 mt-8">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-indigo-600 font-semibold hover:underline cursor-pointer hover:text-purple-600"
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
