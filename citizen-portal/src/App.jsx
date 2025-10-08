import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

import Login from './pages/Login';
import Register from './pages/Register';
import ApplyService from './pages/ApplyService';
import ApplicationHistory from './pages/ApplicationHistory';
import OfficerDashboard from './pages/OfficerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CitizenProfile from './pages/CitizenProfile';
import TestTailwind from './pages/TestTailwind'; // <-- added for testing Tailwind

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect the root route to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Citizen Pages */}
        <Route path="/apply-service" element={<ApplyService />} />
        <Route path="/application-history" element={<ApplicationHistory />} />
        <Route path="/citizen-profile" element={<CitizenProfile />} />

        {/* Officer Dashboard */}
        <Route path="/officer-dashboard" element={<OfficerDashboard />} />

        {/* Admin Dashboard */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* Tailwind Test Page */}
        <Route path="/test-tailwind" element={<TestTailwind />} />
      </Routes>
    </Router>
  );
}

export default App;
