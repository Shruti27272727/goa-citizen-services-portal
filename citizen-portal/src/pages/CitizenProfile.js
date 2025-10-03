import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function CitizenProfile() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    email: "",
    phone: "",
    aadhaarNumber: "",
    dob: "",
    gender: "",
    addresses: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      setLoading(true);
      setError("");

      try {
        const res = await axios.get(`http://localhost:5000/citizen/profile/${user.id}`);
        setProfile(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      await axios.put(`http://localhost:5000/citizen/profile/${user.id}`, profile);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  const handleAddressChange = (index, field, value) => {
    const updatedAddresses = [...profile.addresses];
    updatedAddresses[index][field] = value;
    setProfile({ ...profile, addresses: updatedAddresses });
  };

  const addNewAddress = () => {
    setProfile({
      ...profile,
      addresses: [...profile.addresses, { line1: "", city: "", pincode: "", is_primary: false }],
    });
  };

  if (loading) return React.createElement("p", null, "Loading profile...");
  if (error) return React.createElement("p", { style: { color: "red" } }, error);

  return React.createElement(
    "div",
    { style: { padding: "20px" } },
    React.createElement("h1", null, "My Profile"),

    // Profile fields
    React.createElement(
      "div",
      { style: { marginBottom: "20px" } },
      React.createElement("label", null, "Email:"),
      React.createElement("input", {
        type: "email",
        value: profile.email,
        onChange: e => setProfile({ ...profile, email: e.target.value }),
      }),
      React.createElement("br"),
      React.createElement("label", null, "Phone:"),
      React.createElement("input", {
        type: "text",
        value: profile.phone,
        onChange: e => setProfile({ ...profile, phone: e.target.value }),
      }),
      React.createElement("br"),
      React.createElement("label", null, "Aadhaar Number:"),
      React.createElement("input", { type: "text", value: profile.aadhaarNumber, readOnly: true }),
      React.createElement("br"),
      React.createElement("label", null, "DOB:"),
      React.createElement("input", { type: "date", value: profile.dob, readOnly: true }),
      React.createElement("br"),
      React.createElement("label", null, "Gender:"),
      React.createElement("input", { type: "text", value: profile.gender, readOnly: true })
    ),

    // Addresses
    React.createElement("h2", null, "Addresses"),
    profile.addresses.map((addr, idx) =>
      React.createElement(
        "div",
        { key: idx, style: { border: "1px solid #ccc", padding: "10px", marginBottom: "10px" } },
        React.createElement("label", null, "Line 1:"),
        React.createElement("input", {
          type: "text",
          value: addr.line1,
          onChange: e => handleAddressChange(idx, "line1", e.target.value),
        }),
        React.createElement("br"),
        React.createElement("label", null, "City:"),
        React.createElement("input", {
          type: "text",
          value: addr.city,
          onChange: e => handleAddressChange(idx, "city", e.target.value),
        }),
        React.createElement("br"),
        React.createElement("label", null, "Pincode:"),
        React.createElement("input", {
          type: "text",
          value: addr.pincode,
          onChange: e => handleAddressChange(idx, "pincode", e.target.value),
        }),
        React.createElement("br"),
        React.createElement(
          "label",
          null,
          "Primary Address:",
          React.createElement("input", {
            type: "checkbox",
            checked: addr.is_primary,
            onChange: e => handleAddressChange(idx, "is_primary", e.target.checked),
          })
        )
      )
    ),

    React.createElement(
      "button",
      { onClick: addNewAddress, style: { marginTop: "10px" } },
      "Add New Address"
    ),
    React.createElement(
      "button",
      { onClick: handleUpdateProfile, style: { marginTop: "20px" } },
      "Update Profile"
    )
  );
}

export default CitizenProfile;
