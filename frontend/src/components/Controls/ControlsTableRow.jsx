import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

const ControlsTableRow = ({ control, onDelete }) => {
  console.log(control?.complianceReferences);

  const navigate = useNavigate();

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this control?")) {
      onDelete(control._id);
    }
  };

  return (
    <tr
      onClick={() => navigate(`/controls/create/${control._id}`)}
      title="Click to edit"
      style={{ cursor: "pointer" }}
    >
      {control?.complianceReferences?.map((f) => {
        return (
          <td>{f.controlNo}</td>
        )
      })}
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
