import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
       
        const statsRes = await axios.get("http://localhost:5000/admin/stats", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setStats(statsRes.data);

        
        const appsRes = await axios.get("http://localhost:5000/admin/applications", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setApplications(appsRes.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch admin data");
      }
    };

    fetchData();
  }, [user.token]);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Statistics</h2>
      <ul>
        <li>Total Applications: {stats.total}</li>
        <li>Pending: {stats.pending}</li>
        <li>Approved: {stats.approved}</li>
        <li>Rejected: {stats.rejected}</li>
      </ul>

      <h2>All Applications</h2>
      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Service Type</th>
              <th>Status</th>
              <th>Document</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.applicantName}</td>
                <td>{app.serviceType}</td>
                <td>{app.status}</td>
                <td>
                  <a href={app.fileUrl} target="_blank" rel="noreferrer">
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
