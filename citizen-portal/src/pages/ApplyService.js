import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import RazorpayButton from "../components/RazorpayButton";

const ApplyService = () => {
  const { user } = useContext(AuthContext);
  const [serviceId, setServiceId] = useState(null);
  const [files, setFiles] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  
  const services = [
    { id: 1, name: "Birth Certificate", fee: 10000 },
    { id: 2, name: "Aadhaar Service", fee: 5000 },
    { id: 3, name: "Residence Certificate", fee: 20000 },
  ];

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!serviceId) return alert("Please select a service.");
    if (!files.length) return alert("Please upload at least one document.");
    if (!user?.id) return alert("Please log in first!");

    try {
      setLoading(true);

      const selectedServiceId = Number(serviceId);
      const selectedService = services.find((s) => s.id === selectedServiceId);
      if (!selectedService) return alert("Invalid service selected.");

      const formData = new FormData();
      formData.append("citizenId", user.id);
      formData.append("serviceId", selectedServiceId);
      formData.append("remarks", JSON.stringify([remarks]));
      files.forEach((file) => formData.append("documents", file));

      const res = await axios.post(
        "http://localhost:5000/applications/apply",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const paymentOrder = res.data?.payment?.order;
      if (!paymentOrder) throw new Error("Payment order not returned from backend.");

      setOrder(paymentOrder);
      alert(`Application for "${selectedService.name}" submitted successfully! Please complete the payment.`);

      // Reset form
      setServiceId(null);
      setFiles([]);
      setRemarks("");
    } catch (err) {
      console.error(err);
      alert("Failed to apply: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto" }}>
      <h1>Apply for a Service</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Select Service:
          <select
            value={serviceId ?? ""}
            onChange={(e) => setServiceId(e.target.value ? Number(e.target.value) : null)}
            required
          >
            <option value="">--Select a service--</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} (₹{s.fee / 100})
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
          Upload Document(s):
          <input type="file" multiple onChange={handleFileChange} required />
        </label>
        <br />
        <button type="submit" style={{ marginTop: "10px" }} disabled={loading}>
          {loading ? "Submitting..." : "Apply"}
        </button>
      </form>

      {order?.id && (
        <div style={{ marginTop: "20px" }}>
          <h3>Complete your Payment</h3>
          <RazorpayButton
            order={order}
            user={user}
            onPaymentSuccess={() => {
              alert("Payment successful!");
              setOrder(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ApplyService;
