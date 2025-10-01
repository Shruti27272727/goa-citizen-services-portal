import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FF8042"];

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [applications, setApplications] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await axios.get("http://localhost:5000/admin/stats", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setStats(statsRes.data);

        // Convert for charts
        const statusArray = Object.entries(statsRes.data.statusCount || {}).map(
          ([key, value]) => ({ name: key, value })
        );
        setStatusData(statusArray);

        const revenueArray = Object.entries(statsRes.data.revenue || {}).map(
          ([dept, value]) => ({ department: dept, revenue: value })
        );
        setRevenueData(revenueArray);

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

      <h2>Applications by Status</h2>
      {statusData.length > 0 && (
        <PieChart width={400} height={300}>
          <Pie
            data={statusData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {statusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      )}

      <h2>Revenue per Department</h2>
      {revenueData.length > 0 && (
        <BarChart width={500} height={300} data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="department" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="revenue" fill="#82ca9d" />
        </BarChart>
      )}

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
