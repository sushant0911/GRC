// pages/CompliancePage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import ComplianceControl from "../components/ComplianceControl";
import { complianceConfigs } from "../configs/compliance.config.js";

const CompliancePage = () => {
  const { type } = useParams(); // e.g., "ISO", "CIBIL"
  const config = complianceConfigs[type];

  if (!config) return <div>Compliance type not found</div>;

  return (
    <ComplianceControl
      title={config.title}
      apiBasePath={config.apiBasePath}
      fields={config.fields}
    />
  );
};

export default CompliancePage;
