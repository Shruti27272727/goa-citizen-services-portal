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

const COLORS = ["#0088FE", "#00C49F", "#FF8042", "#FFBB28"];

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  const [status, setStatus] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [revenueData, setRevenueData] = useState([]);
  const [statusData, setStatusData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/applications/dashboard");
        const data = res.data;
console.log('data',data )
        // Set stats safely
        setStatus(data?.stats || {
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
        });

        // Prepare data for PieChart
        const pieData = [
          { name: "Pending", value: data?.stats?.pending || 0 },
          { name: "Approved", value: data?.stats?.approved || 0 },
          { name: "Rejected", value: data?.stats?.rejected || 0 },
        ];
        setStatusData(pieData);

  
        const revenueArr = Object.entries(data?.revenueData || {}).map(
          ([dept, value]) => ({ department: dept, revenue: value })
        );
        setRevenueData(revenueArr);

      } catch (err) {
        console.error(err);
        alert("Failed to fetch admin data");
      }
    };

    fetchData();
  }, [user]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      <h2>Statistics</h2>
      <ul>
        <li>Total Applications: {status?.total || 0}</li>
        <li>Pending: {status?.pending || 0}</li>
        <li>Approved: {status?.approved || 0}</li>
        <li>Rejected: {status?.rejected || 0}</li>
      </ul>

      {statusData.length > 0 && (
        <>
          <h2>Application Status Distribution</h2>
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
        </>
      )}

      {revenueData.length > 0 && (
        <>
          <h2>Revenue per Department</h2>
          <BarChart width={600} height={300} data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="department" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#82ca9d" />
          </BarChart>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
