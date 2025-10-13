import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const ApplicationHistory = ({ refreshTrigger }) => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user?.id) {
        setError("Please log in to view your application history.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const res = await axios.get(
          `${backendUrl}/applications/history/${user.id}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        if (Array.isArray(res.data)) {
          const sortedApps = res.data.sort(
            (a, b) => new Date(b.appliedOn) - new Date(a.appliedOn)
          );
          setApplications(sortedApps);
        } else {
          setApplications([]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch applications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user, refreshTrigger]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col">
      <Navbar />

      {/* Content wrapper with top padding to avoid overlap with Navbar */}
      <div className="flex-grow flex flex-col items-center p-6 pt-24">
        <div className="w-full max-w-6xl bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl p-6">
          <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
            Application History
          </h1>

          {loading && (
            <p className="text-center text-gray-600">
              Loading application history...
            </p>
          )}

          {error && (
            <p className="text-center text-red-700 font-semibold mb-4">{error}</p>
          )}

          {!loading && !error && applications.length === 0 && (
            <p className="text-center text-gray-600">No applications found.</p>
          )}

          {!loading && !error && applications.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 rounded-xl overflow-hidden">
                <thead className="bg-blue-200 text-blue-800 font-semibold">
                  <tr>
                    <th className="px-4 py-2 text-left">Service</th>
                    <th className="px-4 py-2 text-left">Department</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Documents</th>
                    <th className="px-4 py-2 text-left">Applied On</th>
                    <th className="px-4 py-2 text-left">Completed On</th>
                    <th className="px-4 py-2 text-left">Officer</th>
                    <th className="px-4 py-2 text-left">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app, idx) => (
                    <tr
                      key={app.id}
                      className={idx % 2 === 0 ? "bg-white" : "bg-blue-50"}
                    >
                      <td className="px-4 py-2">{app.service?.name ?? "N/A"}</td>
                      <td className="px-4 py-2">{app.service?.department?.name ?? "-"}</td>
                      <td className="px-4 py-2 font-medium text-blue-700">{app.status ?? "-"}</td>
                      <td className="px-4 py-2">
                        {app.documents?.length > 0
                          ? app.documents.map((doc) => (
                              <div key={doc.id}>
                                <a
                                  href={`${backendUrl}/${doc.filePath}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-indigo-600 hover:underline"
                                >
                                  {doc.fileName}
                                </a>
                              </div>
                            ))
                          : "-"}
                      </td>
                      <td className="px-4 py-2">{new Date(app.appliedOn).toLocaleString()}</td>
                      <td className="px-4 py-2">
                        {app.completedOn ? new Date(app.completedOn).toLocaleString() : "-"}
                      </td>
                      <td className="px-4 py-2">{app.officer?.name ?? "-"}</td>
                      <td className="px-4 py-2">{app.remarks ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationHistory;
