import { useState, useEffect } from "react";
import axios from "axios";
import SearchSelect from "../SearchSelect/SearchSelect";
import "./ComplianceReferenceSection.css";
import { FaEdit } from "react-icons/fa";

const ComplianceReferenceSection = ({
  id ,
  complianceReferences,
  newPlus,
  onAdd,
  onRemove,
  onChange
}) => {
  const [complianceOptions, setComplianceOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCompliance, setEditCompliance] = useState(-1);
  const [controlsMap, setControlsMap] = useState({});

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

  const fetchControlsForCompliance = async (complianceName) => {
    try {
      const response = await axios.get(`/api/compliances/${complianceName}/controls`);
      setControlsMap(prev => ({
        ...prev,
        [complianceName]: response.data
      }));
    } catch (error) {
      console.error(`Error fetching controls for ${complianceName}:`, error);
      setControlsMap(prev => ({
        ...prev,
        [complianceName]: []
      }));
    }
  };

  const handleEditClick = (idx, complianceName) => {
    setEditCompliance(idx);
    if (complianceName && !controlsMap[complianceName]) {
      fetchControlsForCompliance(complianceName);
    }
  };

  const handleComplianceChange = (idx, value) => {
    // Update the compliance value
    onChange(idx, "compliance", value);
    
    // Fetch controls for the selected compliance if not already fetched
    if (value && !controlsMap[value]) {
      fetchControlsForCompliance(value);
    }
    
    // Clear the previously selected control when compliance changes
    onChange(idx, "control", null);
  };

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
                    handleComplianceChange(idx, e.target.value);
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
                      controlsMap[pair.compliance]?.map((control) => ({
                        label: control.controlName,
                        value: control,
                      })) || []
                    }
                    value={pair.control ? { label: pair.control.controlName, value: pair.control } : null}
                    placeholder={
                      pair.compliance 
                        ? controlsMap[pair.compliance] 
                          ? "Select Control" 
                          : "Loading controls..."
                        : "Select Compliance First"
                    }
                    isDisabled={!pair.compliance || !controlsMap[pair.compliance]}
                    onChange={(selectedOption) => {
                      onChange(idx, "control", selectedOption?.value || null);
                    }}
                  />
                ) : (
                  <p className="fake-input">{pair.control?.controlName || pair.controlName}</p>
                )}
              </td>

              <td>
                <div className="compliance-actions">
                  {(editCompliance === idx || (idx !== newPlus && id)) && (
                    <button
                      className="compliance-edit-btn"
                      onClick={() => {
                        handleEditClick(idx, pair.compliance);
                      }}
                    >
                      <FaEdit size={16} />
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