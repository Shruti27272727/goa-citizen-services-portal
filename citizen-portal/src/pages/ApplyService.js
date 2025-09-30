import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const ApplyService = () => {
  const { user } = useContext(AuthContext);
  const [serviceId, setServiceId] = useState("");
  const [file, setFile] = useState(null);
  const [remarks, setRemarks] = useState("");

  const services = [
    { id: 1, name: "Birth Certificate" },
    { id: 2, name: "Aadhaar Service" },
    { id: 3, name: "Residence Certificate" },
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!serviceId || !file) {
      alert("Please select a service and upload a file");
      return;
    }

    if (!user?.id) {
      alert("Please log in first!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("citizenId", 1); 
      formData.append("serviceId", Number(serviceId));
      formData.append("remarks", JSON.stringify([remarks]));
      formData.append("documents", file);

      const res = await axios.post(
        "http://localhost:5000/applications/apply",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert(res.data.message || "Application submitted successfully!");
      setServiceId("");
      setFile(null);
      setRemarks("");
    } catch (err) {
      console.error(err);
      alert("Failed to apply: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h1>Apply for a Service</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Select Service:
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            required
          >
            <option value="">--Select a service--</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Remarks:
          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </label>
        <br />
        <label>
          Upload Document:
          <input type="file" onChange={handleFileChange} required />
        </label>
        <br />
        <button type="submit" style={{ marginTop: "10px" }}>
          Apply
        </button>
      </form>
    </div>
  );
};

export default ApplyService;
