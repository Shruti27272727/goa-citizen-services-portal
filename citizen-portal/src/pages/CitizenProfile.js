// src/pages/CitizenProfile.js
import React, { useState } from 'react';
import axios from 'axios';

const CitizenProfile = () => {
  const [email, setEmail] = useState('');
  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/auth/citizen?email=${email}`);
      setProfile(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Error fetching profile');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Citizen Profile</h1>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button onClick={fetchProfile}>Get Profile</button>

      {profile && (
        <div style={{ marginTop: '20px' }}>
          <p><strong>ID:</strong> {profile.id}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>
          <p><strong>Role:</strong> {profile.role}</p>
        </div>
      )}
    </div>
  );
};

export default CitizenProfile;
