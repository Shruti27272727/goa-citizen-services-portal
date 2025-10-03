// AdminDashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer
} from "recharts";

const STATUS_COLORS = ["#FFBB28", "#0088FE", "#00C49F"];
const DEPT_COLORS = {
  Revenue: "#8884d8",
  Panchayat: "#82ca9d",
  Transport: "#ffc658",
};

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [status, setStatus] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [statusData, setStatusData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [userCounts, setUserCounts] = useState({ citizens: 0, officers: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      setError("");

      try {
        // Fetch dashboard stats
        const res = await axios.get("http://localhost:5000/applications/getDashboardStatus");
        const data = res.data;

        setStatus(data?.stats || { total: 0, pending: 0, approved: 0, rejected: 0 });
        setStatusData([
          { name: "Pending", value: data?.stats?.pending || 0 },
          { name: "Approved", value: data?.stats?.approved || 0 },
          { name: "Rejected", value: data?.stats?.rejected || 0 },
        ]);

        // Revenue per Department
        const departments = ["Revenue", "Panchayat", "Transport"];
        const revenueArr = departments.map((dept) => ({
          department: dept,
          revenue: Number(data?.revenueData?.[dept] || 0),
        }));
        setRevenueData(revenueArr);

        // Fetch user counts
        try {
          const userRes = await axios.get("http://localhost:5000/admin/getUserCounts");
          setUserCounts(userRes.data || { citizens: 0, officers: 0 });
        } catch (err) {
          console.error("Failed to fetch user counts:", err);
        }

      } catch (err) {
        console.error("Failed to fetch admin dashboard data:", err);
        setError("Failed to fetch admin dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      {/* --- Admin Management Section --- */}
      <section style={{ marginBottom: "30px" }}>
        <h2>Admin Management</h2>
        <ul>
          <li><button onClick={() => alert("Manage Services & Departments")}>Manage Services & Departments</button></li>
          <li><button onClick={() => alert("Assign Officers")}>Assign Officers</button></li>
          <li><button onClick={() => alert("Manage Roles (Citizen, Officer, Admin)")}>Manage Roles</button></li>
        </ul>
      </section>

      {/* --- Statistics Section --- */}
      <section style={{ marginBottom: "30px" }}>
        <h2>Statistics</h2>
        <ul>
          <li>Total Applications: {status.total}</li>
          <li>Pending: {status.pending}</li>
          <li>Approved: {status.approved}</li>
          <li>Rejected: {status.rejected}</li>
        </ul>
      </section>

      {/* --- User Counts --- */}
      <section style={{ marginBottom: "30px" }}>
        <h2>User Counts</h2>
        <ul>
          <li>Total Citizens: {userCounts.citizens}</li>
          <li>Total Officers: {userCounts.officers}</li>
        </ul>
      </section>

      {/* --- Application Status PieChart --- */}
      {statusData.length > 0 && (
        <section style={{ marginBottom: "30px" }}>
          <h2>Application Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </section>
      )}

      {/* --- Revenue per Department BarChart --- */}
      {revenueData.length > 0 && (
        <section style={{ marginBottom: "30px" }}>
          <h2>Revenue per Department</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" label={{ position: "top" }}>
                {revenueData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={DEPT_COLORS[entry.department] || "#8884d8"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </section>
      )}

      {/* --- Applications Quick Access --- */}
      <section style={{ marginBottom: "30px" }}>
        <h2>Applications</h2>
        <button onClick={() => alert("View all applications")}>View All Applications</button>
        <button onClick={() => alert("Filter: Pending")}>Pending Applications</button>
        <button onClick={() => alert("Filter: Approved")}>Approved Applications</button>
        <button onClick={() => alert("Export Applications Report")}>Export Report</button>
      </section>
    </div>
  );
};

export default AdminDashboard;
