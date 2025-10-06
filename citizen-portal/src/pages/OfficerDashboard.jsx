import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
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
        "http://localhost:5000/applications/pending-applications",
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      console.log("applications:", res.data);

      // If officer has no department, show all applications
      if (user.departmentId == null) {
        setApplications(res.data);
        return;
      }

      // Filter applications by department using the nested service object
      const filtered = res.data.filter(
        (app) => app.service?.department?.id === user.departmentId
      );

      console.log("filtered applications:", filtered);
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
        `http://localhost:5000/applications/${action}/${id}/${user.id}`,
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
        `http://localhost:5000/applications/add-remark/${id}/${user.id}`,
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
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "#0d47a1" }}>Officer Dashboard</h1>
      <p>Total Pending Applications: {applications.length}</p>

      {loading ? (
        <p>Loading applications...</p>
      ) : applications.length === 0 ? (
        <p>No pending applications for your department.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "25px",
            marginTop: "20px",
          }}
        >
          {applications.map((app) => (
            <div
              key={app.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "12px",
                padding: "20px",
                backgroundColor: "#f9f9ff",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <h3 style={{ color: "#0d47a1", fontSize: "1.2rem" }}>
                Service: {app.service?.name}
              </h3>
              <p style={{ fontWeight: "bold" }}>
                Status:{" "}
                <span
                  style={{
                    color:
                      app.status === "approved"
                        ? "green"
                        : app.status === "rejected"
                          ? "red"
                          : "orange",
                  }}
                >
                  {app.status}
                </span>
              </p>

              <label style={{ fontWeight: "500" }}>
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
                  style={{
                    width: "100%",
                    marginTop: "5px",
                    marginBottom: "15px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    padding: "6px",
                  }}
                />
              </label>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  onClick={() => handleAction(app.id, "approve")}
                  disabled={processing[app.id]}
                  style={{
                    backgroundColor: "#4caf50",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    padding: "6px 12px",
                    cursor: "pointer",
                  }}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(app.id, "reject")}
                  disabled={processing[app.id]}
                  style={{
                    backgroundColor: "#f44336",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    padding: "6px 12px",
                    cursor: "pointer",
                  }}
                >
                  Reject
                </button>
                <button
                  onClick={() => handleSaveRemark(app.id)}
                  disabled={processing[app.id]}
                  style={{
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    padding: "6px 12px",
                    cursor: "pointer",
                  }}
                >
                  Save Remark
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OfficerDashboard;
