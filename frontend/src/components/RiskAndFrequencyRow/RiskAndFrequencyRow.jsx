import "./RiskAndFrequencyRow.css";

const riskLevels = ["low", "medium", "high", "critical"];
const auditFrequencies = ["Quarterly", "Half-Yearly", "Yearly"];

const RiskAndFrequencyRow = ({ form, onChange }) => {
  return (
    <div className="risk-frequency-row">
      <div className="risk-level-field">
        <label>Risk Level</label>
        <select
          name="riskLevel"
          value={form.riskLevel}
          onChange={onChange}
          required
        >
          <option value="">Select</option>
          {riskLevels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>
      <div className="frequency-field">
        <label>Audit Frequency</label>
        <select
          name="auditFrequency"
          value={form.auditFrequency}
          onChange={onChange}
          required
        >
          <option value="">Select</option>
          {auditFrequencies.map((freq) => (
            <option key={freq} value={freq}>
              {freq}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default RiskAndFrequencyRow;