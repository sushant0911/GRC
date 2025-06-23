import "./DepartmentSection.css";

const DepartmentSection = ({ 
  departments, 
  allDepartments, 
  onAdd, 
  onRemove, 
  onChange 
}) => {
  // Icons as components for better reusability
  const PlusIcon = () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="icon"
    >
      <path
        d="M12 8v8M8 12h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );

  const MinusIcon = () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="icon"
    >
      <path 
        d="M8 12h8" 
        stroke="currentColor"
        strokeWidth="2" 
        strokeLinecap="round" 
      />
    </svg>
  );

  return (
    <div className="department-section">
      <label className="section-title">Department and Key Owner</label>
      
      {departments.map((dept, idx) => (
        <div key={`dept-${idx}`} className="department-row">
          <div className="form-group">
            <label htmlFor={`department-${idx}`} className="sr-only">
              Department {idx + 1}
            </label>
            <select
              id={`department-${idx}`}
              name="department"
              value={dept.department}
              onChange={(e) => onChange(e, idx)}
              required
              className="form-select"
            >
              <option value="">-- Select Department --</option>
              {allDepartments?.length > 0 ? (
                allDepartments.map((d) => (
                  <option
                    key={d.DepartmentID || d.DeptId || `dept-${d.DepartmentName}`}
                    value={d.DepartmentName || ""}
                  >
                    {d.name || d.DepartmentName || "Unnamed Department"}
                    {d.controlCount ? ` (${d.controlCount} controls)` : ""}
                  </option>
                ))
              ) : (
                <option disabled>Loading departments...</option>
              )}
            </select>
          </div>

          <div className="form-group">
            <input
              id={`keyOwner-${idx}`}
              type="text"
              name="keyOwner"
              placeholder="Key Owner"
              value={dept.keyOwner}
              onChange={(e) => onChange(e, idx)}
              required
              className="form-input"
            />
          </div>

          <div className="action-buttons">
            {idx === departments.length - 1 && (
              <button
                className="icon-button add-button"
                onClick={onAdd}
                aria-label="Add department"
              >
                <PlusIcon />
              </button>
            )}
            {departments.length > 1 && (
              <button
                className="icon-button remove-button"
                onClick={() => onRemove(idx)}
                aria-label={`Remove department ${idx + 1}`}
              >
                <MinusIcon />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DepartmentSection;