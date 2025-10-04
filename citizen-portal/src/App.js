import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import ApplyService from './pages/ApplyService';
import ApplicationHistory from './pages/ApplicationHistory';
import OfficerDashboard from './pages/OfficerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CitizenProfile from './pages/CitizenProfile'; // <-- new import

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Home */}
        <Route path="/" element={<h1>Hello World 🚀 Frontend is Working</h1>} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Citizen Pages */}
        <Route path="/apply-service" element={<ApplyService />} />
        <Route path="/application-history" element={<ApplicationHistory />} />
        <Route path="/profile" element={<CitizenProfile />} /> {/* <-- new route */}

        {/* Officer Dashboard */}
        <Route path="/officer-dashboard" element={<OfficerDashboard />} />

        {/* Admin Dashboard */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
