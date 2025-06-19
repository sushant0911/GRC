import Sidebar from "../components/Sidebar/Sidebar";
import ISO from "../components/ISO/ISO";

const ComplianceISO = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f7fa" }}>
      <Sidebar />
      <ISO />
    </div>
  );
};
export default ComplianceISO;
