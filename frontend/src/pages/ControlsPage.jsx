import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import "./ControlsPage.css";

const ControlsPage = () => {
  const [controls, setControls] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchControls = async () => {
      setLoading(true);
      try {
        // Use proxy or full URL as per your setup
        const res = await axios.get("http://localhost:3000/api/controls");
        setControls(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setControls([]);
        console.error(err.response ? err.response.data : err.message);
      }
      setLoading(false);
    };
    fetchControls();
  }, [location.key]);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>Loading...</div>
    );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f7fa" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 24px", minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: "24px 0 16px 0", color: "#283593" }}>
            Controls List
          </h2>
          <button
            onClick={() => navigate("/controls/create")}
            style={{
              background: "linear-gradient(90deg, #3949ab 60%, #1976d2 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "10px 22px",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(25, 118, 210, 0.08)",
            }}
          >
            + Create Control
          </button>
        </div>
        <div style={{ maxWidth: "98vw", overflowX: "auto", margin: "0 auto" }}>
          <table className="controls-table">
            <thead>
              <tr>
                <th>ISO 27001:2022 Control Ref</th>
                <th>CIC Regulation Reference</th>
                <th>Control Name</th>
                <th>Audit Objective Summary</th>
                <th>Risk Level</th>
                <th>Audit Frequency</th>
                <th>Department</th>
                <th>Key Owner</th>
                <th>Key Evidence to be Verified</th>
                <th>Evidence Attached</th>
                <th>Auditor Comment</th>
              </tr>
            </thead>
            <tbody>
              {controls.map((control, idx) => (
                <tr
                  key={control._id || idx}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/controls/create/${control._id}`)}
                  title="Click to edit"
                >
                  <td>{control.isoControlRefs?.join(", ")}</td>
                  <td>{control.cicRegulationRefs?.join(", ")}</td>
                  <td>{control.controlName}</td>
                  <td>{control.auditObjectiveSummary}</td>
                  <td>
                    <span
                      className={
                        "risk-pill " +
                        (control.riskLevel === "critical"
                          ? "risk-critical"
                          :control.riskLevel === "high"
                          ? "risk-high"
                          : control.riskLevel === "medium"
                          ? "risk-medium"
                          : control.riskLevel === "low"
                          ? "risk-low"
                          : "")
                      }
                    >
                      {control.riskLevel?.toUpperCase()}
                    </span>
                  </td>
                  <td>{control.auditFrequency}</td>
                  <td>{control.department?.join(", ")}</td>
                  <td>{control.keyOwner}</td>
                  <td>{control.keyEvidenceToBeVerified?.join(", ")}</td>
                  <td>{control.evidenceAttached?.join(", ")}</td>
                  <td>{control.auditorComment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ControlsPage;
