import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const CitizenProfile = () => {
  const { user } = useContext(AuthContext); // logged-in user from context
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        // Use stored email or token to fetch profile
        const res = await axios.get(`/auth/citizen?email=${user.email}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, [user]);

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div className="citizen-profile">
      <h1>Citizen Profile</h1>
      <p><strong>Name</strong> {profile.name}</p>
      <p><strong>ID:</strong> {profile.id}</p>
      <p><strong>Address</strong> {profile.address}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Phone:</strong> {profile.phone}</p>
      <p><strong>Role:</strong> {profile.role}</p>
    </div>
  );
};

export default CitizenProfile;
