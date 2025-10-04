import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ padding: '10px', background: '#eee' }}>
      <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
      <Link to="/register" style={{ marginRight: '10px' }}>Register</Link>
      <Link to="/apply-service" style={{ marginRight: '10px' }}>Apply Service</Link>
      <Link to="/application-history" style={{ marginRight: '10px' }}>History</Link>
      <Link to="/citizen-profile">Profile</Link> 
    </nav>
  );
};

export default Navbar;
