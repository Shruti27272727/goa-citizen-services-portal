import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import RazorpayButton from "../components/RazorpayButton";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const ApplyService = () => {
  const { user } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState(null);
  const [fileUploads, setFileUploads] = useState({});
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requiredDocs, setRequiredDocs] = useState([]);
  const navigate = useNavigate();

  // ---- Fetch services from backend ----
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${backendUrl}/applications/services`);
        setServices(res.data || []);
      } catch (err) {
        console.error("Failed to fetch services:", err);
      }
    };
    fetchServices();
  }, []);

  // ---- Update required documents based on department ----
  useEffect(() => {
    if (!serviceId) {
      setRequiredDocs([]);
      setFileUploads({});
      return;
    }

    const selectedService = services.find((s) => s.id === Number(serviceId));
    const departmentName = selectedService?.department?.name?.toLowerCase();

    let docs = [];
    if (departmentName?.includes("revenue")) {
      docs = ["Passport Size Photo", "Signature", "Electricity Bill"];
    } else if (departmentName?.includes("panchayat")) {
      docs = ["Photo", "Signature", "Address Proof"];
    } else if (departmentName?.includes("transport")) {
      docs = ["Photo", "Signature", "Aadhaar Card", "License"];
    }

    setRequiredDocs(docs);

    // Initialize upload fields
    const initialUploads = {};
    docs.forEach((doc) => (initialUploads[doc] = null));
    setFileUploads(initialUploads);
  }, [serviceId, services]);

  const handleFileChange = (docName, file) => {
    setFileUploads((prev) => ({
      ...prev,
      [docName]: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!serviceId) return alert("Please select a service.");
    if (!user?.id) return alert("Please log in first!");

    // Ensure all required files are uploaded
    const missingDocs = requiredDocs.filter((doc) => !fileUploads[doc]);
    if (missingDocs.length > 0)
      return alert(
        `Please upload all required documents before applying. Missing: ${missingDocs.join(
          ", "
        )}`
      );

    try {
      setLoading(true);
      const selectedService = services.find((s) => s.id === Number(serviceId));
      if (!selectedService) return alert("Invalid service selected.");

      const formData = new FormData();
      formData.append("citizenId", user.id);
      formData.append("serviceId", selectedService.id);

      // Append each uploaded file
      Object.entries(fileUploads).forEach(([docName, file]) => {
        formData.append("documents", file);
      });

      const res = await axios.post(`${backendUrl}/applications/apply`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const paymentOrder = res.data?.payment?.order;
      if (!paymentOrder)
        throw new Error("Payment order not returned from backend.");

      setOrder(paymentOrder);
      alert(
        `Application for "${selectedService.name}" submitted successfully! Please complete the payment.`
      );
    } catch (err) {
      console.error(err);
      alert("Failed to apply: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    alert("Payment successful! Redirecting to your history...");
    setTimeout(() => navigate("/application-history"), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
            Apply for a Government Service
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Selection */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Select Service:
              </label>
              <select
                value={serviceId ?? ""}
                onChange={(e) =>
                  setServiceId(e.target.value ? Number(e.target.value) : null)
                }
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">-- Select a service --</option>
                {services.length > 0 ? (
                  services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.department?.name}) - ₹{s.fee}
                    </option>
                  ))
                ) : (
                  <option disabled>Loading services...</option>
                )}
              </select>
            </div>

            {/* File Uploads */}
            {requiredDocs.length > 0 && (
              <div>
                <label className="block font-semibold text-gray-700 mb-2">
                  Upload Required Document(s):
                </label>
                <div className="space-y-4">
                  {requiredDocs.map((doc, index) => (
                    <div key={index}>
                      <label className="block text-gray-700 font-medium mb-1">
                        {doc}:
                      </label>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) =>
                          handleFileChange(doc, e.target.files[0] || null)
                        }
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
            >
              {loading ? "Submitting..." : "Apply for Service"}
            </button>
          </form>

          {/* Razorpay Payment Section */}
          {order?.id && (
            <div className="mt-8 p-5 bg-blue-50 border border-blue-200 rounded-xl shadow-inner">
              <h3 className="text-lg font-semibold text-blue-700 mb-3">
                Complete Your Payment
              </h3>
              <RazorpayButton
                order={order}
                user={user}
                onPaymentSuccess={handlePaymentSuccess}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg w-full text-center"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyService;
