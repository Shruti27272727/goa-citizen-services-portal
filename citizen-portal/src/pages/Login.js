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
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Call backend login
      const res = await axios.post("/auth/login", { email, password });
      const userData = res.data;

      login(userData);

    
      localStorage.setItem("token", userData.token);

      alert("Login successful!");

     
      const role = userData.role || "citizen";
      if (role === "citizen") navigate("/apply-service");
      else if (role === "officer") navigate("/officer-dashboard");
      else if (role === "admin") navigate("/admin-dashboard");
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed: " + (err.response?.data?.message || err.message));
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
        <Button text="Login" onClick={handleLogin} />
      </div>
    </div>
  );
};

export default Login;
