import React, { useState, useContext } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const [name, setName] = useState("");
  const [aadhaar, setAadhaar] = useState(""); // Aadhaar or phone
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState(""); // Address field
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password || !aadhaar) {
      return alert("Please fill in all required fields.");
    }

    try {
      const res = await axios.post("http://localhost:5000/auth/register", {
        name,
        email,
        phone: aadhaar, // backend expects phone or aadhaar in contact
        password,
        address, // send address to backend
        aadhaar, // optional field in backend
      });

      const userData = res.data.user; // backend response

      // Save user data in context and localStorage
      login(userData);
      localStorage.setItem("token", userData.token || "");

      alert("Registration successful!");

      // Redirect based on role
      if (userData.role === "citizen") navigate("/apply-service");
      else if (userData.role === "officer") navigate("/officer-dashboard");
      else if (userData.role === "admin") navigate("/admin-dashboard");
    } catch (err) {
      alert("Registration failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <Navbar />
      <h2>Citizen Registration</h2>
      <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input label="Aadhaar/Phone" value={aadhaar} onChange={(e) => setAadhaar(e.target.value)} />
      <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input label="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button text="Register" onClick={handleRegister} />
    </div>
  );
};

export default Register;
