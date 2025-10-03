import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../components/Input";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) return alert("Please fill in both fields.");
    
    setLoading(true);
    try {
      const res = await axios.post("/auth/login", { email, password });
      const userData = res.data;

      login(userData);
      localStorage.setItem("token", userData.token);

      alert("Login successful!");

      // Navigate based on role
      const role = userData.role?.toLowerCase() || "citizen";
      if (role === "citizen") navigate("/apply-service");
      else if (role === "officer") navigate("/officer-dashboard");
      else if (role === "admin") navigate("/admin-dashboard");
      else navigate("/"); // fallback

    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Navbar />
      <div className="login-form">
        <h2>Login</h2>
        <Input
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button 
          text={loading ? "Logging in..." : "Login"} 
          onClick={handleLogin} 
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default Login;
