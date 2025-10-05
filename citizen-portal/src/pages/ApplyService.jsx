import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import RazorpayButton from "../components/RazorpayButton";

const ApplyService = () => {
  const { user } = useContext(AuthContext);
  const [serviceId, setServiceId] = useState(null);
  const [files, setFiles] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const services = [
    { id: 1, name: "Residence Certificate", fee: 200, department: "Revenue" },
    { id: 2, name: "Birth Certificate", fee: 50, department: "Panchayat" },
    { id: 3, name: "Aadhaar Card", fee: 100, department: "Panchayat" },
    { id: 4, name: "Driving License", fee: 300, department: "Transport" },
  ];

  const handleFileChange = (e) => setFiles(Array.from(e.target.files));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!serviceId) return alert("Please select a service.");
    if (!files.length) return alert("Please upload at least one document.");
    if (!user?.id) return alert("Please log in first!");

    try {
      setLoading(true);
      const selectedService = services.find((s) => s.id === Number(serviceId));
      if (!selectedService) return alert("Invalid service selected.");

      const formData = new FormData();
      formData.append("citizenId", user.id);
      formData.append("serviceId", selectedService.id);
      files.forEach((file) => formData.append("documents", file));

      const res = await axios.post("http://localhost:5000/applications/apply", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const paymentOrder = res.data?.payment?.order;
      if (!paymentOrder) throw new Error("Payment order not returned from backend.");

      setOrder(paymentOrder);
      alert(
        `Application for "${selectedService.name}" (${selectedService.department} Department) submitted successfully! Please complete the payment.`
      );
    } catch (err) {
      console.error(err);
      alert("Failed to apply: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center p-4">
  <div className="w-full max-w-lg bg-blue-50 p-8 rounded-2xl shadow-lg">
  

        <h1 className="text-2xl font-bold text-blue-700 text-center mb-6">Apply for a Service</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Select Service:</label>
            <select
              value={serviceId ?? ""}
              onChange={(e) => setServiceId(e.target.value ? Number(e.target.value) : null)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">--Select a service--</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.department}) - ₹{s.fee}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Upload Document(s):</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Submitting..." : "Apply"}
          </button>
        </form>

        {order?.id && (
          <div className="mt-6 p-4 bg-blue-100 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold text-blue-700 mb-3">Complete your Payment</h3>
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
    </div>
  );
};

export default ApplyService;
