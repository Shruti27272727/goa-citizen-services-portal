// AdminDashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer
} from "recharts";
const backendUrl =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const STATUS_COLORS = ["#FFBB28", "#0088FE", "#FF4D4F"];
const DEPT_COLORS = { Revenue: "#6366F1", Panchayat: "#10B981", Transport: "#F59E0B" };

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  const [status, setStatus] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [statusData, setStatusData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [services, setServices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [users, setUsers] = useState([]);

  const [newService, setNewService] = useState({ name: "", fee: 0, departmentId: "" });
  const [newDepartment, setNewDepartment] = useState("");
  const [selectedOfficer, setSelectedOfficer] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [roleChange, setRoleChange] = useState({ userId: "", role: "" });

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const dashboardRes = await axios.get("http://localhost:5000/applications/getDashboardStatus");
        const data = dashboardRes.data;

        setStatus(data?.stats || { total: 0, pending: 0, approved: 0, rejected: 0 });
        setStatusData([
          { name: "Pending", value: data?.stats?.pending || 0 },
          { name: "Approved", value: data?.stats?.approved || 0 },
          { name: "Rejected", value: data?.stats?.rejected || 0 },
        ]);

        const departmentsArr = ["Revenue", "Panchayat", "Transport"];
        setRevenueData(departmentsArr.map(d => ({
          department: d,
          revenue: Number(data?.revenueData?.[d] || 0),
        })));

        const [servicesRes, departmentsRes, officersRes, usersRes] = await Promise.all([
          axios.get(`${backendUrl}/applications/services`),
          axios.get(`${backendUrl}/applications/departments`),
          axios.get(`${backendUrl}/officers`),
          axios.get(`${backendUrl}/citizen`),
        ]);

        setServices(servicesRes.data || []);
        setDepartments(departmentsRes.data || []);
        setOfficers(officersRes.data || []);
        setUsers(usersRes.data || []);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError("Failed to fetch admin dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) return <p className="text-xl font-semibold p-4">Loading dashboard...</p>;
  if (error) return <p className="text-red-600 p-4">{error}</p>;

  const handleAddService = async () => {
    if (!newService.name || !newService.fee || !newService.departmentId) return alert("Fill all fields");
    try {
      const res = await axios.post(`${backendUrl}/applications/service/create`, newService);
      setServices(prev => [...prev, res.data]);
      setNewService({ name: "", fee: 0, departmentId: "" });
      alert("Service added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add service.");
    }
  };

  const handleAddDepartment = async () => {
    if (!newDepartment) return alert("Enter department name");
    try {
      const res = await axios.post(`${backendUrl}/applications/department/create`, { name: newDepartment });
      setDepartments(prev => [...prev, res.data]);
      setNewDepartment("");
      alert("Department added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add department.");
    }
  };

  const handleAssignOfficer = async () => {
    if (!selectedOfficer || !selectedDept) return alert("Select officer and department!");
    try {
      await axios.post(`${backendUrl}/applications/officer/assign/${selectedOfficer}/${selectedDept}`);
      alert("Officer assigned successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to assign officer.");
    }
  };

  const handleChangeRole = async () => {
    if (!roleChange.userId || !roleChange.role) return alert("Select user and role!");
    try {
      await axios.post(`${backendUrl}/applications/role/assign`, { userId: Number(roleChange.userId), role: roleChange.role });
      setUsers(prev => prev.map(u => u.id === roleChange.userId ? { ...u, role: roleChange.role } : u));
    } catch (err) {
      console.error(err);
      alert("Failed to update role.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

      {/* --- Admin Management --- */}
      <section className="mb-8 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-5 text-gray-700">Admin Management</h2>

        {/* Departments */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-600 mb-2">Departments</h3>
          <ul className="list-disc ml-6 mb-3 text-gray-700">
            {departments.length ? departments.map(d => <li key={d.id}>{d.name}</li>) : <li>No departments</li>}
          </ul>
          <div className="flex gap-3 flex-wrap">
            <input
              placeholder="Department Name"
              className="border rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
              value={newDepartment}
              onChange={e => setNewDepartment(e.target.value)}
            />
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
              onClick={handleAddDepartment}
            >
              Add Department
            </button>
          </div>
        </div>

        {/* Services */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-600 mb-2">Services</h3>
          <ul className="list-disc ml-6 mb-3 text-gray-700">
            {services.length ? services.map(s => <li key={s.id}>{s.name} ({s.department?.name}) - ₹{s.fee}</li>) : <li>No services</li>}
          </ul>
          <div className="flex gap-3 flex-wrap">
            <input
              placeholder="Service Name"
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
              value={newService.name}
              onChange={e => setNewService({ ...newService, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Fee"
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
              value={newService.fee}
              onChange={e => setNewService({ ...newService, fee: Number(e.target.value) })}
            />
            <select
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
              value={newService.departmentId}
              onChange={e => setNewService({ ...newService, departmentId: e.target.value })}
            >
              <option value="">Select Department</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
              onClick={handleAddService}
            >
              Add Service
            </button>
          </div>
        </div>

        {/* Assign Officers */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-600 mb-2">Assign Officers</h3>
          <div className="flex gap-3 flex-wrap">
            <select
              className="border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={selectedOfficer}
              onChange={e => setSelectedOfficer(e.target.value)}
            >
              <option value="">Select Officer</option>
              {officers.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
            <select
              className="border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
            >
              <option value="">Select Department</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow"
              onClick={handleAssignOfficer}
            >
              Assign
            </button>
          </div>
        </div>

        {/* Manage Roles */}
        <div>
          <h3 className="font-semibold text-gray-600 mb-2">Manage Roles</h3>
          <div className="flex gap-3 flex-wrap">
            <select
              className="border rounded-lg p-2 focus:ring-2 focus:ring-purple-400 outline-none"
              value={roleChange.userId}
              onChange={e => setRoleChange({ ...roleChange, userId: e.target.value })}
            >
              <option value="">Select User</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
            </select>
            <select
              className="border rounded-lg p-2 focus:ring-2 focus:ring-purple-400 outline-none"
              value={roleChange.role}
              onChange={e => setRoleChange({ ...roleChange, role: e.target.value })}
            >
              <option value="">Select Role</option>
              {["citizen","officer","admin"].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow"
              onClick={handleChangeRole}
            >
              Update Role
            </button>
          </div>
        </div>
      </section>

      {/* --- Statistics --- */}
      <section className="mb-8 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Application Stats</h2>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Total Applications: {status.total}</li>
          <li>Pending: {status.pending}</li>
          <li>Approved: {status.approved}</li>
          <li>Rejected: {status.rejected}</li>
        </ul>
      </section>

      {/* --- Charts --- */}
      {statusData.length > 0 && (
        <section className="mb-8 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Application Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {statusData.map((entry, index) => <Cell key={index} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </section>
      )}

      {revenueData.length > 0 && (
        <section className="mb-8 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Revenue per Department</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" label={{ position: "top" }}>
                {revenueData.map((entry, index) => <Cell key={index} fill={DEPT_COLORS[entry.department] || "#6366F1"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </section>
      )}
    </div>
  );
};

export default AdminDashboard;
