import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import RazorpayButton from "../components/RazorpayButton";

const ApplyService = () => {
  const { user } = useContext(AuthContext);
  const [serviceId, setServiceId] = useState("");
  const [files, setFiles] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [order, setOrder] = useState(null); // store Razorpay order

  // Example services (replace with dynamic fetch if needed)
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

    if (!serviceId || files.length === 0) {
      alert("Please select a service and upload at least one file.");
      return;
    }

    if (!user?.id) {
      alert("Please log in first!");
      return;
    }

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append("citizenId", user.id);
      formData.append("serviceId", Number(serviceId));
      formData.append("remarks", JSON.stringify([remarks]));
      files.forEach((file) => formData.append("documents", file));

      // Backend endpoint returns both application + payment info
      const res = await axios.post(
        "http://localhost:5000/applications/apply",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const paymentOrder = res.data?.payment?.order;
      if (!paymentOrder) throw new Error("Payment order not returned from backend.");

      setOrder(paymentOrder);

      alert("Application submitted successfully! Please complete the payment.");

      // Reset form
      setServiceId("");
      setFiles([]);
      setRemarks("");
    } catch (err) {
      console.error(err);
      alert("Failed to apply: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto" }}>
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
        <button type="submit" style={{ marginTop: "10px" }}>
          Apply
        </button>
      </form>

      {/* Show RazorpayButton only if payment order exists */}
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
