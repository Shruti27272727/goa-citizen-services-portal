import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const OfficerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [remarks, setRemarks] = useState({}); 

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
      }
    };

    fetchApplications();
  }, [user.token]);

  const handleAction = async (id, action) => {
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
    }
  };

  return (
    <div>
      <h1>Officer Dashboard</h1>
      {applications.length === 0 ? (
        <p>No pending applications.</p>
      ) : (
        <ul>
          {applications.map((app) => (
            <li key={app.id}>
              {app.applicantName} applied for {app.serviceType} | Status: {app.status}
              <br />
              <label>
                Remark:
                <input
                  type="text"
                  value={remarks[app.id] || ""}
                  onChange={(e) =>
                    setRemarks((prev) => ({ ...prev, [app.id]: e.target.value }))
                  }
                />
              </label>
              <button onClick={() => handleAction(app.id, "approve")}>Approve</button>
              <button onClick={() => handleAction(app.id, "reject")}>Reject</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OfficerDashboard;
