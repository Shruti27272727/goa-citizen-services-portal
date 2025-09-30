import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ApplicationHistory = ({ refreshTrigger }) => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user || !user.id) {
        setError("Please login to view your application history.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const res = await axios.get(
          `http://localhost:5000/applications/history?citizenId=${user.id}`
        );

        if (res.data && Array.isArray(res.data.applications)) {
          setApplications(res.data.applications);
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Application History</h1>
      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>Service</th>
              <th>Status</th>
              <th>Remarks</th>
              <th>Documents</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.service?.name ?? "N/A"}</td>
                <td>{app.status ?? "-"}</td>
                <td>{Array.isArray(app.remarks) ? app.remarks.join(", ") : "-"}</td>
                <td>
                  {app.documents && app.documents.length > 0 ? (
                    app.documents.map((doc) => (
                      <div key={doc.id}>
                        <a
                          href={`http://localhost:5000/${doc.filePath}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {doc.fileName}
                        </a>
                      </div>
                    ))
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApplicationHistory;
