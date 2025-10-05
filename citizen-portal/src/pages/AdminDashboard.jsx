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
const DEPT_COLORS = { Revenue: "#8884d8", Panchayat: "#82ca9d", Transport: "#ffc658" };

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  // ---- Dashboard & Stats ----
  const [status, setStatus] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [statusData, setStatusData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---- Admin Management ----
  const [services, setServices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [users, setUsers] = useState([]);

  const [newService, setNewService] = useState({ name: "", fee: 0, departmentId: "" });
  const [newDepartment, setNewDepartment] = useState("");
  const [selectedOfficer, setSelectedOfficer] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [roleChange, setRoleChange] = useState({ userId: "", role: "" });

  // ---- Fetch Dashboard & Admin Data ----
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        // --- Dashboard stats & revenue ---
        const dashboardRes = await axios.get("http://localhost:5000/applications/getDashboardStatus");
        console.log("Dashboard data:", dashboardRes.data);

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

        // --- Admin management data ---
        const [servicesRes, departmentsRes, officersRes, usersRes] = await Promise.all([
          axios.get("http://localhost:5000/applications/services"),
          axios.get("http://localhost:5000/applications/departments"),
          axios.get("http://localhost:5000/officers"),
          axios.get("http://localhost:5000/citizen"),
        ]);

        console.log("Services:", servicesRes.data);
        console.log("Departments:", departmentsRes.data);
        console.log("Officers:", officersRes.data);
        console.log("Users:", usersRes.data);

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

  // ---- Handlers ----
  const handleAddService = async () => {
    if (!newService.name || !newService.fee || !newService.departmentId) return alert("Fill all fields");
    try {
      const res = await axios.post("http://localhost:5000/applications/service/create", newService);
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
      const res = await axios.post("http://localhost:5000/applications/department/create", { name: newDepartment });
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
      await axios.post(`http://localhost:5000/applications/officer/assign/${selectedOfficer}/${selectedDept}`);
      alert("Officer assigned successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to assign officer.");
    }
  };

  const handleChangeRole = async () => {
    if (!roleChange.userId || !roleChange.role) return alert("Select user and role!");
    try {
      await axios.post("http://localhost:5000/applications/role/assign", roleChange);
      alert("Role updated successfully!");
      setUsers(prev => prev.map(u => u.id === roleChange.userId ? { ...u, role: roleChange.role } : u));
    } catch (err) {
      console.error(err);
      alert("Failed to update role.");
    }
  };

  return (
    <div className="p-6 bg-blue-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* --- Admin Management --- */}
      <section className="mb-8 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-3">Admin Management</h2>

        {/* Departments */}
        <div className="mb-4">
          <h3 className="font-semibold">Departments</h3>
          <ul className="list-disc ml-5">
            {departments.length > 0 ? departments.map(d => <li key={d.id}>{d.name}</li>) : <li>No departments</li>}
          </ul>
          <div className="flex gap-2 mt-2 flex-wrap">
            <input placeholder="Department Name" className="border p-1 rounded" value={newDepartment} onChange={e => setNewDepartment(e.target.value)} />
            <button className="bg-green-600 text-white px-3 rounded" onClick={handleAddDepartment}>Add Department</button>
          </div>
        </div>

        {/* Services */}
        <div className="mb-4">
          <h3 className="font-semibold">Services</h3>
          <ul className="list-disc ml-5">
            {services.length > 0 ? services.map(s => <li key={s.id}>{s.name} ({s.department?.name}) - ₹{s.fee}</li>) : <li>No services</li>}
          </ul>
          <div className="flex gap-2 mt-2 flex-wrap">
            <input placeholder="Service Name" className="border p-1 rounded" value={newService.name} onChange={e => setNewService({ ...newService, name: e.target.value })} />
            <input type="number" placeholder="Fee" className="border p-1 rounded" value={newService.fee} onChange={e => setNewService({ ...newService, fee: Number(e.target.value) })} />
            <select className="border p-1 rounded" value={newService.departmentId} onChange={e => setNewService({ ...newService, departmentId: e.target.value })}>
              <option value="">Select Department</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <button className="bg-blue-600 text-white px-3 rounded" onClick={handleAddService}>Add Service</button>
          </div>
        </div>

        {/* Assign Officers */}
        <div className="mb-4">
          <h3 className="font-semibold">Assign Officers</h3>
          <div className="flex gap-2 mt-2 flex-wrap">
            <select className="border p-1 rounded" value={selectedOfficer} onChange={e => setSelectedOfficer(e.target.value)}>
              <option value="">Select Officer</option>
              {officers.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
            <select className="border p-1 rounded" value={selectedDept} onChange={e => setSelectedDept(e.target.value)}>
              <option value="">Select Department</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <button className="bg-blue-600 text-white px-3 rounded" onClick={handleAssignOfficer}>Assign</button>
          </div>
        </div>

        {/* Manage Roles */}
        <div className="mb-4">
          <h3 className="font-semibold">Manage Roles</h3>
          <div className="flex gap-2 mt-2 flex-wrap">
            <select className="border p-1 rounded" value={roleChange.userId} onChange={e => setRoleChange({ ...roleChange, userId: e.target.value })}>
              <option value="">Select User</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
            </select>
            <select className="border p-1 rounded" value={roleChange.role} onChange={e => setRoleChange({ ...roleChange, role: e.target.value })}>
              <option value="">Select Role</option>
              {["citizen","officer","admin"].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <button className="bg-blue-600 text-white px-3 rounded" onClick={handleChangeRole}>Update Role</button>
          </div>
        </div>
      </section>

      {/* --- Statistics & Charts --- */}
      <section className="mb-8 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-3">Application Stats</h2>
        <ul className="list-disc ml-5">
          <li>Total Applications: {status.total}</li>
          <li>Pending: {status.pending}</li>
          <li>Approved: {status.approved}</li>
          <li>Rejected: {status.rejected}</li>
        </ul>
      </section>

      {statusData.length > 0 && (
        <section className="mb-8 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold mb-3">Application Status Distribution</h2>
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
        <section className="mb-8 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold mb-3">Revenue per Department</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" label={{ position: "top" }}>
                {revenueData.map((entry, index) => <Cell key={index} fill={DEPT_COLORS[entry.department] || "#8884d8"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </section>
      )}
    </div>
  );
};

export default AdminDashboard;
