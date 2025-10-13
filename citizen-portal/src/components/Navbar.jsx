import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white py-4 px-6 shadow-lg fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo / App Name */}
        <h1 className="text-2xl font-extrabold tracking-wide">
          Goa Citizen Portal
        </h1>

        {/* Nav Links */}
        <div className="hidden md:flex space-x-6">
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
