import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const CitizenProfile = () => {
  const { user } = useContext(AuthContext); // logged-in user from context
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        // Use stored email or token to fetch profile
        const res = await axios.get(`${backendUrl}/auth/citizen?email=${user.email}`, {
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

  if (!profile)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-700 text-lg">Loading profile...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col">
      <Navbar />

      <div className="flex-grow flex items-center justify-center p-6 pt-24">
        <div className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
            Citizen Profile
          </h1>

          <div className="space-y-4 text-gray-800">
            <p><span className="font-semibold">Name:</span> {profile.name}</p>
            <p><span className="font-semibold">ID:</span> {profile.id}</p>
            <p><span className="font-semibold">Address:</span> {profile.address}</p>
            <p><span className="font-semibold">Email:</span> {profile.email}</p>
            <p><span className="font-semibold">Phone:</span> {profile.phone}</p>
            <p><span className="font-semibold">Role:</span> {profile.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenProfile;
