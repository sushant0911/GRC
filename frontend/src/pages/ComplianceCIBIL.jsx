import Sidebar from "../components/Sidebar/Sidebar";
import ComplianceControl from "../components/ComplianceControl/ComplianceControl";

const ComplianceISO = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <ComplianceControl
        title="CIBIL"
        apiBasePath="/api/compliance-cibil"
        fields={[
          { name: "cibilRef", label: "CIBIL Reference" },
          { name: "controlName", label: "Control Name" },
        ]}
      />
    </div>
  );
};
export default ComplianceISO;
