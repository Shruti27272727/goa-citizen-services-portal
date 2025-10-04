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
      if (!user?.id) {
        setError("Please log in to view your application history.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const res = await axios.get(
          `http://localhost:5000/applications/history/${user.id}`,
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

  if (loading) return <p>Loading application history...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (applications.length === 0) return <p>No applications found.</p>;

  return (
    <div style={{ maxWidth: "900px", margin: "auto" }}>
      <h1>Application History</h1>
      <table
        border="1"
        cellPadding="8"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th>Service</th>
            <th>Department</th>
            <th>Status</th>
            <th>Documents</th>
            <th>Applied On</th>
            <th>Completed On</th>
            <th>Officer</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id}>
              <td>{app.service?.name ?? "N/A"}</td>
              <td>{app.service?.department?.name ?? "-"}</td>
              <td>{app.status ?? "-"}</td>
              <td>
                {app.documents?.length > 0
                  ? app.documents.map((doc) => (
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
                  : "-"}
              </td>
              <td>{new Date(app.appliedOn).toLocaleString()}</td>
              <td>
                {app.completedOn
                  ? new Date(app.completedOn).toLocaleString()
                  : "-"}
              </td>
              <td>{app.officer?.name ?? "-"}</td>
              <td>{app.remarks ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationHistory;
