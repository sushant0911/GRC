import { useState, useEffect } from "react";
import axios from "axios";
import SearchSelect from "../SearchSelect/SearchSelect";
import "./ComplianceReferenceSection.css";

const ComplianceReferenceSection = ({
  id = null,
  complianceReferences,
  controlOptions,
  compliance,
  editCompliance,
  newPlus,
  onAdd,
  onRemove,
  onChange,
  onEdit,
}) => {
  const [complianceOptions, setComplianceOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompliance, setSelelectedCompliance] = useState("");

  useEffect(() => {
    const fetchComplianceOptions = async () => {
      try {
        const response = await axios.get("/api/compliances");
        setComplianceOptions(response.data);
      } catch (error) {
        console.error("Error fetching compliance options:", error);
        setComplianceOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComplianceOptions();
  }, []);

  if (loading) {
    return <div>Loading compliance options...</div>;
  }


  return (
    <div className="compliance-reference-container">
      <label>Compliance & Reference Number</label>
      <table>
        <tbody>
          {complianceReferences.map((pair, idx) => (
            <tr className="compliance-input" key={idx}>
              <td>
                <select
                  name="compliance"
                  value={pair.compliance}
                  onChange={(e) => {
                    onChange(idx, "compliance", e.target.value);
                    setSelelectedCompliance(e.target.value);
                  }}
                  required
                >
                  <option value="" disabled>
                    -- Compliance --
                  </option>
                  {complianceOptions.map((opt) => (
                    <option key={opt.name} value={opt.name}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </td>

              <td>
                {!id || editCompliance === idx || idx === newPlus ? (
                  <SearchSelect
                    className="search-select"
                    name="control"
                    options={
                      complianceOptions
                        .find((f) => f.name === selectedCompliance)
                        ?.controls.map((f) => {
                          return { label: f.controlName, value: f };
                        }) || []
                    }
                    onChange={(selectedOption) => {
                      onChange(
                        idx,
                        "compliance",
                        complianceReferences[idx].compliance,
                        selectedOption
                      );
                    }}
                  />
                ) : (
                  <p className="fake-input">{pair.controlName}</p>
                )}
              </td>

              <td>
                <div className="compliance-actions">
                  {(editCompliance === idx || (idx !== newPlus && id)) && (
                    <button
                      className="compliance-edit-btn"
                      onClick={() => {
                        onEdit(idx);
                        onChange(idx, "compliance", pair.compliance);
                      }}
                    >
                      Edit
                    </button>
                  )}

                  {complianceReferences.length > 1 && (
                    <button
                      className="minus-icon"
                      onClick={() => onRemove(idx)}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        style={{ verticalAlign: "middle" }}
                      >
                        <path
                          d="M8 12h8"
                          stroke="#d32f2f"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="compliancePlusIcon">
        <button className="plus-icon" onClick={onAdd}>
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            style={{ verticalAlign: "middle" }}
          >
            <path
              d="M12 8v8M8 12h8"
              stroke="#7c6fd1"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ComplianceReferenceSection;
