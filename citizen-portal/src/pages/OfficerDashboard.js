import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const OfficerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/officer/pending-applications",
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setApplications(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [user.token]);

  const handleAction = async (id, action) => {
    setProcessing((prev) => ({ ...prev, [id]: true }));
    try {
      await axios.post(
        `http://localhost:5000/officer/application/${id}/${action}`,
        { remark: remarks[id] || "" },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert(`Application ${action}ed successfully!`);
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

  return (
    <div style={{ padding: "20px" }}>
      <h1>Officer Dashboard</h1>
      <p>Total Pending Applications: {applications.length}</p>

      {loading ? (
        <p>Loading applications...</p>
      ) : applications.length === 0 ? (
        <p>No pending applications.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {applications.map((app) => (
            <div
              key={app.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "15px",
                width: "300px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <h3>{app.applicantName}</h3>
              <p>Service: {app.serviceType}</p>
              <p>
                Status:{" "}
                <span
                  style={{
                    color:
                      app.status === "approved"
                        ? "green"
                        : app.status === "rejected"
                        ? "red"
                        : "orange",
                    fontWeight: "bold",
                  }}
                >
                  {app.status}
                </span>
              </p>

              <label>
                Remark:
                <input
                  type="text"
                  value={remarks[app.id] || ""}
                  onChange={(e) =>
                    setRemarks((prev) => ({ ...prev, [app.id]: e.target.value }))
                  }
                  style={{ width: "100%", marginTop: "5px", marginBottom: "10px" }}
                />
              </label>

              <button
                onClick={() => handleAction(app.id, "approve")}
                disabled={processing[app.id]}
                style={{ marginRight: "10px" }}
              >
                Approve
              </button>
              <button
                onClick={() => handleAction(app.id, "reject")}
                disabled={processing[app.id]}
              >
                Reject
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OfficerDashboard;
