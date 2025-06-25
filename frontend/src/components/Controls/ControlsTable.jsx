import ControlsTableRow from "./ControlsTableRow";
import { useEffect, useState } from "react";

const ControlsTable = ({ controls, onDelete }) => {
  const [complianceDisplayNames, setComplianceDisplayNames] = useState([]);

  useEffect(() => {
    const fetchComplianceNames = async () => {
      try {
        const response = await fetch('/api/compliances/display-names');
        const data = await response.json();
        if (data.success) {
          setComplianceDisplayNames(data.data);
        }
      } catch (error) {
        console.error('Error fetching compliance names:', error);
      }
    };

    fetchComplianceNames();
  }, []);

  return (
    <div className="table-wrapper">
      <table className="controls-table">
        <thead>
          <tr>
            {complianceDisplayNames.map((compliance) => (
              <th key={compliance.name}>{compliance.displayName}</th>
            ))}
            
            <th>Control Name</th>
            <th>Audit Objective Summary</th>
            <th>Risk Level</th>
            <th>Audit Frequency</th>
            <th>Department</th>
            <th>Key Owner</th>
            <th>Key Evidence to be Verified</th>
            <th>Evidence Attached</th>
            <th>Auditor Comment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {controls.map((control, idx) => (
            <ControlsTableRow
              key={control._id || idx}
              control={control}
              compliances={complianceDisplayNames}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ControlsTable;