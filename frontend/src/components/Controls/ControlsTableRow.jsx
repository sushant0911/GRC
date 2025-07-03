import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";

const ControlsTableRow = ({ control, onDelete }) => {
  const [compliances, setCompliances] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this control?")) {
      onDelete(control._id);
    }
  };

  useEffect(() => {
    const fetchCompliances = async () => {
      try {
        const response = await axios.get(`/api/compliances`);
        setCompliances(response.data);
      } catch (error) {
        console.error("Error fetching compliances:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompliances();
  }, []);

  // Function to get controlNo for a specific compliance
  const getControlNo = (complianceName) => {
    if (!control?.complianceReferences) return "-";
    const matchingRef = control.complianceReferences.find(
      ref => ref.compliance === complianceName
    );
    return matchingRef ? matchingRef.controlNo : "-";
  };

  if (loading) {
    return (
      <tr>
        <td colSpan="12">Loading...</td>
      </tr>
    );
  }

  return (
    <tr
      onClick={() => navigate(`/controls/create/${control._id}`)}
      title="Click to edit"
      style={{ cursor: "pointer" }}
    >
      {/* Render a column for each compliance */}
      {compliances.map(compliance => (
        <td key={compliance._id}>{getControlNo(compliance.name)}</td>
      ))}
      
      <td>{control.controlName}</td>
      <td>{control.auditObjectiveSummary}</td>
      <td>
        <span
          className={
            "risk-pill " +
            (control.riskLevel === "Critical"
              ? "risk-critical"
              : control.riskLevel === "High"
              ? "risk-high"
              : control.riskLevel === "Medium"
              ? "risk-medium"
              : control.riskLevel === "Low"
              ? "risk-low"
              : "")
          }
        >
          {control.riskLevel?.toUpperCase()}
        </span>
      </td>
      <td>{control.auditFrequency}</td>
      <td>
        {Array.isArray(control.departments)
          ? control.departments.map((d) => d.department).join(", ")
          : "-"}
      </td>
      <td>
        {Array.isArray(control.departments)
          ? control.departments.map((d) => d.keyOwner).join(", ")
          : "-"}
      </td>
      <td>{control.keyEvidenceToBeVerified?.join(", ")}</td>
      <td>{control.evidenceAttached?.join(", ")}</td>
      <td>{control.auditorComment}</td>
      <td>
        <button className="icon-btn" title="Delete" onClick={handleDelete}>
          <FaTrash size={16} />
        </button>
      </td>
    </tr>
  );
};

export default ControlsTableRow;