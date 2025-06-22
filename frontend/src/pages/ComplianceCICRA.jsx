import Sidebar from "../components/Sidebar/Sidebar";
import ComplianceControl from "../components/ComplianceControl/ComplianceControl";

const ComplianceISO = () => {
  return (
    <div style={{ display: "flex"}}>
      <Sidebar />
      <ComplianceControl
        title="ISO"
        apiBasePath="/api/compliance-iso"
        fields={[
          { name: "isoControlRef", label: "ISO Reference" },
          { name: "controlName", label: "Control Name" },
        ]}
      />
    </div>
  );
};
export default ComplianceISO;
