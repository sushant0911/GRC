import ControlsTableRow from "./ControlsTableRow";

const ControlsTable = ({ controls, onDelete }) => {
  return (
    <div className="table-wrapper">
      <table className="controls-table">
        <thead>
          <tr>
            <th>ISO 27001:2022</th>
            <th>CICRA</th>
            <th>CIBIL</th>
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
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ControlsTable;
