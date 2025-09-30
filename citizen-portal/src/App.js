import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import pages
import Login from './pages/Login';
import Register from './pages/Register';
import ApplyService from './pages/ApplyService';
import ApplicationHistory from './pages/ApplicationHistory';
import OfficerDashboard from './pages/OfficerDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
       
        <Route path="/" element={<h1>Hello World 🚀 Frontend is Working</h1>} />

       
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/apply-service" element={<ApplyService />} />
        <Route path="/application-history" element={<ApplicationHistory />} />
        
        
        <Route path="/officer-dashboard" element={<OfficerDashboard />} />
        
       
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
