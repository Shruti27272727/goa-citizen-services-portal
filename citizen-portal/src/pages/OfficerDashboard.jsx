import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const OfficerDashboard = ({ refreshTrigger }) => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/applications/pending-applications`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        if (user.departmentId == null) {
          setApplications(res.data);
          return;
        }

        const filtered = res.data.filter(
          (app) => app.service?.department?.id === user.departmentId
        );
        setApplications(filtered);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user, refreshTrigger]);

  const handleAction = async (id, action) => {
    setProcessing((prev) => ({ ...prev, [id]: true }));
    try {
      await axios.post(
        `${backendUrl}/applications/${action}/${id}/${user.id}`,
        { remarks: remarks[id] || "" },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      alert(`Application ${action}d successfully!`);
      setApplications(applications.filter((app) => app.id !== id));
      setRemarks((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch (err) {
      console.error(err);
      alert("Action failed: " + (err.response?.data?.message || err.message));
    } finally {
      setProcessing((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleSaveRemark = async (id) => {
    if (!remarks[id] || remarks[id].trim() === "")
      return alert("Remark cannot be empty");

    setProcessing((prev) => ({ ...prev, [id]: true }));
    try {
      await axios.post(
        `${backendUrl}/applications/add-remark/${id}/${user.id}`,
        { remark: remarks[id] },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert("Remark saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Saving remark failed: " + (err.response?.data?.message || err.message));
    } finally {
      setProcessing((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col">
      <Navbar />

      <div className="flex-grow flex flex-col items-center p-6 pt-24">
        <h1 className="text-3xl font-bold text-blue-700 mb-4 text-center">
          Officer Dashboard
        </h1>
        <p className="text-gray-700 mb-6">Total Pending Applications: {applications.length}</p>

        {loading ? (
          <p className="text-gray-600 text-center">Loading applications...</p>
        ) : applications.length === 0 ? (
          <p className="text-gray-600 text-center">No pending applications for your department.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl p-6 hover:scale-[1.02] transition-transform duration-200"
              >
                <h3 className="text-xl font-bold text-blue-700 mb-2">
                  {app.service?.name}
                </h3>
                <p className="font-medium">
                  Status:{" "}
                  <span
                    className={
                      app.status === "approved"
                        ? "text-green-600"
                        : app.status === "rejected"
                        ? "text-red-600"
                        : "text-orange-500"
                    }
                  >
                    {app.status}
                  </span>
                </p>

                <label className="font-medium mt-2 block">
                  Remark:
                  <input
                    type="text"
                    value={remarks[app.id] || ""}
                    onChange={(e) =>
                      setRemarks((prev) => ({
                        ...prev,
                        [app.id]: e.target.value,
                      }))
                    }
                    className="w-full mt-1 mb-4 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </label>

                <div className="flex justify-between gap-2">
                  <button
                    onClick={() => handleAction(app.id, "approve")}
                    disabled={processing[app.id]}
                    className="flex-1 bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(app.id, "reject")}
                    disabled={processing[app.id]}
                    className="flex-1 bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleSaveRemark(app.id)}
                    disabled={processing[app.id]}
                    className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Save Remark
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficerDashboard;
