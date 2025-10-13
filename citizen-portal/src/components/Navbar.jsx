import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext); // ✅ Assuming you have logout() in AuthContext

  // Logout handler
  const handleLogout = () => {
    logout(); // clears auth data (if you have it)
    localStorage.removeItem("token"); // optional safety
    alert("You have been logged out successfully!");
    navigate("/login");
  };

  return (
    <nav className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white py-4 px-6 shadow-lg fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo / App Name */}
        <h1 className="text-2xl font-extrabold tracking-wide">
          Goa Citizen Portal
        </h1>

        {/* Nav Links */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link
            to="/login"
            className={`hover:text-yellow-200 font-medium transition-all duration-300 ${
              location.pathname === "/login" ? "text-yellow-300 underline" : ""
            }`}
          >
            Login
          </Link>
          <Link
            to="/register"
            className={`hover:text-yellow-200 font-medium transition-all duration-300 ${
              location.pathname === "/register" ? "text-yellow-300 underline" : ""
            }`}
          >
            Register
          </Link>
          <Link
            to="/apply-service"
            className={`hover:text-yellow-200 font-medium transition-all duration-300 ${
              location.pathname === "/apply-service"
                ? "text-yellow-300 underline"
                : ""
            }`}
          >
            Apply Service
          </Link>
          <Link
            to="/application-history"
            className={`hover:text-yellow-200 font-medium transition-all duration-300 ${
              location.pathname === "/application-history"
                ? "text-yellow-300 underline"
                : ""
            }`}
          >
            History
          </Link>
          <Link
            to="/citizen-profile"
            className={`hover:text-yellow-200 font-medium transition-all duration-300 ${
              location.pathname === "/citizen-profile"
                ? "text-yellow-300 underline"
                : ""
            }`}
          >
            Profile
          </Link>

          {/* ✅ Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Placeholder (Optional Enhancement) */}
        <div className="md:hidden">
          <button className="bg-white/20 px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-all">
            ☰
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
