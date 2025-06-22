import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

const ControlsTableRow = ({ control, onDelete }) => {
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
      <td>
        {
          control?.complianceReferences?.find(
            (ref) => ref.compliance === "ISO"
          )?.controlNo
        }
      </td>
      <td>
        {control.complianceReferences
          ?.filter((ref) => ref.compliance === "CICRA")
          .map((ref) => ref.referenceNumber)
          .join(", ") || "-"}
      </td>
      <td>
        {control.complianceReferences
          ?.filter((ref) => ref.compliance === "CIBIL")
          .map((ref) => ref.referenceNumber)
          .join(", ") || "-"}
      </td>
      <td>{control.controlName}</td>
      <td>{control.auditObjectiveSummary}</td>
      <td>
        <span
          className={
            "risk-pill " +
            (control.riskLevel === "critical"
              ? "risk-critical"
              : control.riskLevel === "high"
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
